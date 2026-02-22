import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Collection, Image, Camera, Film } from '~/lib/types'

export const getAllCollections = createServerFn().handler(async () => {
    const sql = getDb()
    const collections =
        await sql`SELECT * FROM collections ORDER BY collection_name ASC`
    return collections as Collection[]
})

export const getCollectionWithImages = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: id }) => {
        const sql = getDb()
        const collection =
            await sql`SELECT * FROM collections WHERE collection_id = ${id}`
        if (collection.length === 0) return null

        const imagesInCollection =
            await sql`SELECT * FROM collections_lookup WHERE collection = ${id}`
        const imageData =
            await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images ORDER BY date_taken DESC`
        const cameras = await sql`SELECT * FROM cameras`
        const films = await sql`SELECT * FROM films`

        const imagesWithData = imagesInCollection.map((img) => {
            const imageDetails = (imageData as Image[]).find(
                (image) => image.image_id === img.image,
            )
            if (imageDetails) {
                const camera = (cameras as Camera[]).find(
                    (c) => c.camera_id === imageDetails.camera,
                )
                const film = (films as Film[]).find(
                    (f) => f.film_id === imageDetails.film,
                )
                return {
                    ...img,
                    ...imageDetails,
                    camera: camera
                        ? `${camera.brand} ${camera.model}`
                        : null,
                    film: film ? `${film.brand} ${film.name}` : null,
                }
            }
            return img
        })

        return {
            collection: collection[0] as Collection,
            images: imagesWithData as Image[],
        }
    })
