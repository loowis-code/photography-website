import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Image } from '~/lib/types'

export const searchImages = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: query }) => {
        try {
            const safeQuery = query.replace(/[^a-zA-Z0-9 ]/g, '')
            const sql = getDb()
            const results = await sql`
                SELECT * FROM images
                WHERE title ILIKE ${'%' + safeQuery + '%'}
                OR description ILIKE ${'%' + safeQuery + '%'}
                OR location ILIKE ${'%' + safeQuery + '%'}
            `
            return results as Image[]
        } catch (error) {
            console.error('Failed to search images:', error)
            throw new Error('Failed to search images')
        }
    })
