import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/lib/auth'
import { getDb } from '~/lib/db'
import { uploadToR2, deleteFromR2 } from '~/lib/r2'
import type { Image } from '~/lib/types'

async function requireAuth() {
    const request = getRequest()
    const session = await getSession(request, authConfig)
    if (!session?.user) throw new Error('Unauthorized')
    return session
}

export const getAdminImages = createServerFn().handler(async () => {
    await requireAuth()
    try {
        const sql = getDb()
        const images = await sql`SELECT * FROM images`
        return (images as Image[]).filter((img) => img.url !== null)
    } catch (error) {
        console.error('Failed to fetch admin images:', error)
        throw new Error('Failed to load images')
    }
})

export const getAdminImage = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: id }) => {
        await requireAuth()
        try {
            const sql = getDb()
            const images =
                await sql`SELECT * FROM images WHERE image_id = ${id}`
            return (images as Image[])[0] ?? null
        } catch (error) {
            console.error(`Failed to fetch admin image ${id}:`, error)
            throw new Error('Failed to load image')
        }
    })

interface CreateImageInput {
    image: string
    title: string
    width: number
    height: number
    description: string
    alt_text: string
    date: string
    location: string
    featured: boolean
    digital: boolean
    visible: boolean
    gps_lat: number | null
    gps_long: number | null
    camera: number | null
    film: number | null
}

export const createImage = createServerFn({ method: 'POST' })
    .inputValidator((d: CreateImageInput) => d)
    .handler(async ({ data }) => {
        await requireAuth()
        try {
            const sql = getDb()
            const { url } = await uploadToR2(data.image)
            const result = await sql`
                INSERT INTO images
                (url, title, width, height, description, alt_text, date_taken, location, featured, digital, visible, latitude, longitude, camera, film)
                VALUES
                (${url}, ${data.title}, ${data.width}, ${data.height}, ${data.description}, ${data.alt_text}, ${data.date}, ${data.location}, ${data.featured}, ${data.digital}, ${data.visible}, ${data.gps_lat}, ${data.gps_long}, ${data.camera}, ${data.film})
                RETURNING *;
            `
            return result[0] as Image
        } catch (error) {
            console.error('Failed to create image:', error)
            throw new Error('Failed to create image')
        }
    })

interface UpdateImageInput {
    image?: string
    url?: string
    title: string
    width?: number
    height?: number
    description: string
    alt_text: string
    date: string
    location: string
    featured: boolean
    digital: boolean
    visible: boolean
    gps_lat: number | null
    gps_long: number | null
    camera: number | null
    film: number | null
}

export const updateImage = createServerFn({ method: 'POST' })
    .inputValidator((d: { id: string; data: UpdateImageInput }) => d)
    .handler(async ({ data: { id, data } }) => {
        await requireAuth()
        try {
            const sql = getDb()

            if (data.image) {
                const { url } = await uploadToR2(data.image)
                if (data.url) await deleteFromR2(data.url)
                const result = await sql`
                    UPDATE images SET
                    url = ${url},
                    title = ${data.title},
                    width = ${data.width!},
                    height = ${data.height!},
                    description = ${data.description},
                    alt_text = ${data.alt_text},
                    date_taken = ${data.date},
                    location = ${data.location},
                    featured = ${data.featured},
                    camera = ${data.camera},
                    film = ${data.film},
                    digital = ${data.digital},
                    visible = ${data.visible},
                    latitude = ${data.gps_lat},
                    longitude = ${data.gps_long}
                    WHERE image_id = ${id}
                    RETURNING *;
                `
                return result[0] as Image
            }

            const result = await sql`
                UPDATE images SET
                title = ${data.title},
                description = ${data.description},
                alt_text = ${data.alt_text},
                date_taken = ${data.date},
                location = ${data.location},
                featured = ${data.featured},
                camera = ${data.camera},
                film = ${data.film},
                digital = ${data.digital},
                visible = ${data.visible},
                latitude = ${data.gps_lat},
                longitude = ${data.gps_long}
                WHERE image_id = ${id}
                RETURNING *;
            `
            return result[0] as Image
        } catch (error) {
            console.error(`Failed to update image ${id}:`, error)
            throw new Error('Failed to update image')
        }
    })

export const deleteImage = createServerFn({ method: 'POST' })
    .inputValidator((d: { id: string; url: string }) => d)
    .handler(async ({ data: { id, url } }) => {
        await requireAuth()
        try {
            const sql = getDb()
            await sql`DELETE FROM collections_lookup WHERE image = ${id}`
            if (url) await deleteFromR2(url)
            await sql`DELETE FROM images WHERE image_id = ${id}`
        } catch (error) {
            console.error(`Failed to delete image ${id}:`, error)
            throw new Error('Failed to delete image')
        }
    })
