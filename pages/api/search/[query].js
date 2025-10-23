import { neon } from '@neondatabase/serverless'

export default async function getSearchResults(req, res) {
    const query = req.query.query
    // strip query of any special characters to prevent SQL injection
    const safeQuery = query.replace(/[^a-zA-Z0-9 ]/g, '')
    const sql = neon(process.env.DATABASE_URL)

    const results = await sql`
        SELECT * FROM images
        WHERE title ILIKE ${'%' + safeQuery + '%'}
        OR description ILIKE ${'%' + safeQuery + '%'}
        OR location ILIKE ${'%' + safeQuery + '%'}
    `
    if (results.length === 0) {
        res.json({ error: 'No results found' })
    } else {
        res.json(results)
    }
}
