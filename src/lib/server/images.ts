import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Image, Camera, Film } from '~/lib/types'

function resolveImageRefs(
    images: Image[],
    cameras: Camera[],
    films: Film[],
): Image[] {
    return images.map((image) => {
        const camera = cameras.find((c) => c.camera_id === image.camera)
        const film = films.find((f) => f.film_id === image.film)
        return {
            ...image,
            camera: camera ? `${camera.brand} ${camera.model}` : null,
            film: film ? `${film.brand} ${film.name}` : null,
        }
    })
}

export const getAllImages = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const images =
            await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images`
        const cameras = await sql`SELECT * FROM cameras`
        const films = await sql`SELECT * FROM films`

        const filtered = (images as Image[]).filter(
            (img) => img.url !== null && img.visible === true,
        )
        return resolveImageRefs(filtered, cameras as Camera[], films as Film[])
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
            const images =
                await sql`SELECT image_id, url, width, height, title, description, alt_text, date_taken, location, visible, featured, digital, latitude, longitude, film, camera FROM images WHERE image_id = ${id}`
            if (images.length === 0) return null

            const cameras = await sql`SELECT * FROM cameras`
            const films = await sql`SELECT * FROM films`
            return resolveImageRefs(
                images as Image[],
                cameras as Camera[],
                films as Film[],
            )[0]
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
