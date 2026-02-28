import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Image } from '~/lib/types'

export const getAllImages = createServerFn().handler(async () => {
    try {
        const sql = getDb()
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
            FROM images i
            LEFT JOIN cameras c ON c.camera_id = i.camera
            LEFT JOIN films f ON f.film_id = i.film
            WHERE i.visible = true AND i.url IS NOT NULL
            ORDER BY i.date_taken DESC NULLS LAST, i.image_id ASC
        `
        return images as Image[]
    } catch (error) {
        console.error('Failed to fetch images:', error)
        throw new Error('Failed to load images')
    }
})

export const getImageById = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: id }) => {
        try {
            const sql = getDb()
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
                FROM images i
                LEFT JOIN cameras c ON c.camera_id = i.camera
                LEFT JOIN films f ON f.film_id = i.film
                WHERE i.image_id = ${id}
            `
            if (images.length === 0) return null
            return (images as Image[])[0]
        } catch (error) {
            console.error(`Failed to fetch image ${id}:`, error)
            throw new Error('Failed to load image')
        }
    })

export const getRandomVisibleImage = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const images =
            await sql`SELECT image_id, url, width, height, title, alt_text FROM images WHERE visible = true AND url IS NOT NULL ORDER BY RANDOM() LIMIT 1`
        return (images as Image[])[0] ?? null
    } catch (error) {
        console.error('Failed to fetch random image:', error)
        throw new Error('Failed to load image')
    }
})
