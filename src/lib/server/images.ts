import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Image, PaginatedResult, SortOrder, FilterType } from '~/lib/types'
import { PAGE_SIZE, ORDER_BY_MAP, buildFilterClause } from './pagination'

interface GetAllImagesInput {
    page: number
    sort: SortOrder
    filter: FilterType
}

export const getAllImages = createServerFn({ method: 'POST' })
    .inputValidator((d: GetAllImagesInput) => d)
    .handler(async ({ data }): Promise<PaginatedResult<Image>> => {
        try {
            const sql = getDb()
            const { page, sort, filter } = data
            const orderBy = ORDER_BY_MAP[sort] ?? ORDER_BY_MAP['date-desc']
            const filterClause = buildFilterClause(filter)

            const countResult = await sql`
                SELECT COUNT(*) as count
                FROM images i
                WHERE i.visible = true AND i.url IS NOT NULL
                ${sql.unsafe(filterClause)}`
            const totalCount = parseInt(countResult[0].count as string, 10)
            const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
            const safePage = Math.min(Math.max(1, page), totalPages)
            const offset = (safePage - 1) * PAGE_SIZE

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
                ${sql.unsafe(filterClause)}
                ORDER BY ${sql.unsafe(orderBy)}
                LIMIT ${PAGE_SIZE} OFFSET ${offset}`

            return {
                items: images as Image[],
                totalCount,
                page: safePage,
                pageSize: PAGE_SIZE,
                totalPages,
            }
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

export const getFeaturedImages = createServerFn().handler(async () => {
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
            WHERE i.visible = true AND i.url IS NOT NULL AND i.featured = true
            ORDER BY i.date_taken DESC NULLS LAST, i.image_id ASC
        `
        return images as Image[]
    } catch (error) {
        console.error('Failed to fetch featured images:', error)
        throw new Error('Failed to load featured images')
    }
})

export const getImagesForMap = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const images = await sql`
            SELECT image_id, url, width, height, title, alt_text,
                   latitude, longitude
            FROM images
            WHERE visible = true AND url IS NOT NULL
              AND latitude IS NOT NULL AND longitude IS NOT NULL
        `
        return images as Pick<
            Image,
            | 'image_id'
            | 'url'
            | 'width'
            | 'height'
            | 'title'
            | 'alt_text'
            | 'latitude'
            | 'longitude'
        >[]
    } catch (error) {
        console.error('Failed to fetch images for map:', error)
        throw new Error('Failed to load map images')
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
