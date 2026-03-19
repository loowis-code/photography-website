import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Collection, Image, SortOrder, FilterType } from '~/lib/types'
import { PAGE_SIZE, ORDER_BY_MAP, buildFilterClause } from './pagination'

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

interface GetCollectionImagesInput {
    id: string
    page: number
    sort: SortOrder
    filter: FilterType
}

export const getCollectionWithImages = createServerFn({ method: 'POST' })
    .inputValidator((d: GetCollectionImagesInput) => d)
    .handler(async ({ data }) => {
        try {
            const sql = getDb()
            const { id, page, sort, filter } = data

            const collection =
                await sql`SELECT * FROM collections WHERE collection_id = ${id}`
            if (collection.length === 0) return null

            const orderBy = ORDER_BY_MAP[sort] ?? ORDER_BY_MAP['date-desc']
            const filterClause = buildFilterClause(filter)

            const countResult = await sql`
                SELECT COUNT(*) as count
                FROM collections_lookup cl
                JOIN images i ON i.image_id = cl.image
                WHERE cl.collection = ${id}
                  AND i.url IS NOT NULL
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
                FROM collections_lookup cl
                JOIN images i ON i.image_id = cl.image
                LEFT JOIN cameras c ON c.camera_id = i.camera
                LEFT JOIN films f ON f.film_id = i.film
                WHERE cl.collection = ${id}
                  AND i.url IS NOT NULL
                  ${sql.unsafe(filterClause)}
                ORDER BY ${sql.unsafe(orderBy)}
                LIMIT ${PAGE_SIZE} OFFSET ${offset}`

            return {
                collection: collection[0] as Collection,
                images: images as Image[],
                totalCount,
                page: safePage,
                pageSize: PAGE_SIZE,
                totalPages,
            }
        } catch (error) {
            console.error(`Failed to fetch collection ${data.id}:`, error)
            throw new Error('Failed to load collection')
        }
    })
