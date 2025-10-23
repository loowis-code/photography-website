import { neon } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

const sql = neon(process.env.DATABASE_URL)

export default async function getCollections(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const response = await sql`SELECT * FROM collections`
    res.status(200).json(response)
}
