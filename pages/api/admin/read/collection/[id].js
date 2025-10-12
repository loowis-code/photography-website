import { neon } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

const sql = neon(process.env.LOOWIS_DATABASE_URL)

export default async function getCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const response =
        await sql`SELECT * FROM collections WHERE collection_id = ${req.query.id}`
    if (response.length === 0) {
        return res.status(404).json({ error: 'Collection not found' })
    }

    const imagesInCollection =
        await sql`SELECT * FROM collections_lookup WHERE collection = ${req.query.id}`
    response[0].images = imagesInCollection.map((img) => img.image)
    res.status(200).json(response[0])
}
