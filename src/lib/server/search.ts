import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Image } from '~/lib/types'

// Escape ILIKE wildcard characters (% and _) plus the escape character
// itself (\), so user input can't inject unintended wildcard matches.
// This is not SQL-injection protection — the tagged `sql` template already
// parameterizes values — it just keeps "%"/"_" in a search query literal.
// Postgres' LIKE/ILIKE default escape character is backslash.
function escapeLikeWildcards(input: string): string {
    return input.replace(/[\\%_]/g, (char) => `\\${char}`)
}

export const searchImages = createServerFn({ method: 'POST' })
    .inputValidator((d: string) => d)
    .handler(async ({ data: query }) => {
        try {
            const safeQuery = escapeLikeWildcards(query)
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
