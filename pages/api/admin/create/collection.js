import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

const sql = neon(process.env.DATABASE_URL)

export default async function createCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const collection_data = req.body

    const image = collection_data.image
    let imageBuffer = null
    const matches = image.match(/^data:(image\/jpeg|image\/png);base64,(.+)$/)
    if (matches) {
        var mimeType = matches[1]
        imageBuffer = Buffer.from(matches[2], 'base64')
    }
    const blob = await put(uuidv4(), imageBuffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: mimeType,
    })

    const newCollection = await sql`
        INSERT INTO collections 
        (cover_url, collection_name, width, height, collection_description) 
        VALUES 
        (${blob.url}, ${collection_data.name}, ${collection_data.width}, ${collection_data.height}, ${collection_data.description})
        RETURNING *;
    `
    res.json(newCollection)
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set desired value here
        },
    },
}
