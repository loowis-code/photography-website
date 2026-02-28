import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Collection, Image } from '~/lib/types'

export const getAllCollections = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const collections =
            await sql`SELECT * FROM collections ORDER BY collection_name ASC`
        return collections as Collection[]
    } catch (error) {
        console.error('Failed to fetch collections:', error)
        throw new Error('Failed to load collections')
    }
})

export const getCollectionWithImages = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: id }) => {
        try {
            const sql = getDb()
            const collection =
                await sql`SELECT * FROM collections WHERE collection_id = ${id}`
            if (collection.length === 0) return null

            const images = await sql`
                SELECT i.image_id, i.url, i.width, i.height, i.title,
                       i.description, i.alt_text, i.date_taken, i.location,
                       i.visible, i.featured, i.digital, i.latitude, i.longitude,
                       CASE WHEN c.camera_id IS NOT NULL
                            THEN c.brand || ' ' || c.model
                            ELSE NULL END AS camera,
                       CASE WHEN f.film_id IS NOT NULL
                            THEN f.brand || ' ' || f.name
                            ELSE NULL END AS film
                FROM collections_lookup cl
                JOIN images i ON i.image_id = cl.image
                LEFT JOIN cameras c ON c.camera_id = i.camera
                LEFT JOIN films f ON f.film_id = i.film
                WHERE cl.collection = ${id}
                ORDER BY i.date_taken DESC
            `

            return {
                collection: collection[0] as Collection,
                images: images as Image[],
            }
        } catch (error) {
            console.error(`Failed to fetch collection ${id}:`, error)
            throw new Error('Failed to load collection')
        }
    })
