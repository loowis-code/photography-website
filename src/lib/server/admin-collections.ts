import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getSession } from 'start-authjs'
import { authConfig } from '~/lib/auth'
import { getDb } from '~/lib/db'
import { uploadToR2, deleteFromR2 } from '~/lib/r2'
import type { Collection, CollectionWithImages } from '~/lib/types'

async function requireAuth() {
    const request = getRequest()
    const session = await getSession(request, authConfig)
    if (!session?.user) throw new Error('Unauthorized')
    return session
}

export const getAdminCollections = createServerFn().handler(async () => {
    await requireAuth()
    try {
        const sql = getDb()
        const collections =
            await sql`SELECT * FROM collections ORDER BY collection_name ASC`
        return collections as Collection[]
    } catch (error) {
        console.error('Failed to fetch admin collections:', error)
        throw new Error('Failed to load collections')
    }
})

export const getAdminCollection = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: id }) => {
        await requireAuth()
        try {
            const sql = getDb()
            const collection =
                await sql`SELECT * FROM collections WHERE collection_id = ${id}`
            if (collection.length === 0) return null

            const imagesInCollection =
                await sql`SELECT * FROM collections_lookup WHERE collection = ${id}`
            const images = imagesInCollection.map((img) => img.image as number)

            return {
                ...collection[0],
                images,
            } as CollectionWithImages
        } catch (error) {
            console.error(`Failed to fetch admin collection ${id}:`, error)
            throw new Error('Failed to load collection')
        }
    })

interface CreateCollectionInput {
    image: string
    name: string
    width: number
    height: number
    description: string
}

export const createCollection = createServerFn({ method: 'POST' })
    .inputValidator((d: CreateCollectionInput) => d)
    .handler(async ({ data }) => {
        await requireAuth()
        try {
            const sql = getDb()
            const { url } = await uploadToR2(data.image)
            const result = await sql`
                INSERT INTO collections
                (cover_url, collection_name, width, height, collection_description)
                VALUES
                (${url}, ${data.name}, ${data.width}, ${data.height}, ${data.description})
                RETURNING *;
            `
            return result[0] as Collection
        } catch (error) {
            console.error('Failed to create collection:', error)
            throw new Error('Failed to create collection')
        }
    })

interface UpdateCollectionInput {
    image?: string
    url?: string
    name: string
    description: string
    width?: number
    height?: number
    images?: number[]
}

export const updateCollection = createServerFn({ method: 'POST' })
    .inputValidator((d: { id: string; data: UpdateCollectionInput }) => d)
    .handler(async ({ data: { id, data } }) => {
        await requireAuth()
        try {
            const sql = getDb()
            let updatedCollection

            if (data.image) {
                const { url } = await uploadToR2(data.image)
                if (data.url) await deleteFromR2(data.url)
                updatedCollection = await sql`
                    UPDATE collections SET
                    collection_name = ${data.name},
                    collection_description = ${data.description},
                    cover_url = ${url},
                    width = ${data.width!},
                    height = ${data.height!}
                    WHERE collection_id = ${id}
                    RETURNING *;
                `
            } else {
                updatedCollection = await sql`
                    UPDATE collections SET
                    collection_name = ${data.name},
                    collection_description = ${data.description}
                    WHERE collection_id = ${id}
                    RETURNING *;
                `
            }

            if (data.images) {
                const previousSelections = await sql`
                    SELECT image FROM collections_lookup
                    WHERE collection = ${id};
                `
                const previousImageIds = previousSelections.map(
                    (item) => item.image as number,
                )
                const imagesToAdd = data.images.filter(
                    (imgId) => !previousImageIds.includes(imgId),
                )
                const imagesToRemove = previousImageIds.filter(
                    (imgId) => !data.images!.includes(imgId),
                )

                for (const imageId of imagesToAdd) {
                    await sql`
                        INSERT INTO collections_lookup (collection, image)
                        VALUES (${id}, ${imageId});
                    `
                }
                for (const imageId of imagesToRemove) {
                    await sql`
                        DELETE FROM collections_lookup
                        WHERE collection = ${id} AND image = ${imageId};
                    `
                }
            }

            return updatedCollection[0] as Collection
        } catch (error) {
            console.error(`Failed to update collection ${id}:`, error)
            throw new Error('Failed to update collection')
        }
    })

export const deleteCollection = createServerFn({ method: 'POST' })
    .inputValidator((d: { id: string; url: string }) => d)
    .handler(async ({ data: { id, url } }) => {
        await requireAuth()
        try {
            const sql = getDb()
            await sql`DELETE FROM collections_lookup WHERE collection = ${id}`
            if (url) await deleteFromR2(url)
            await sql`DELETE FROM collections WHERE collection_id = ${id}`
        } catch (error) {
            console.error(`Failed to delete collection ${id}:`, error)
            throw new Error('Failed to delete collection')
        }
    })
