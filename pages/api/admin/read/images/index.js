import { neon } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

const sql = neon(process.env.LOOWIS_DATABASE_URL)

export default async function getImages(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const response = await sql`SELECT * FROM images`
    const filteredResponse = response.filter((image) => image.url !== null)
    res.status(200).json(filteredResponse)
}
