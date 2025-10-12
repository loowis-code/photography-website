import { neon } from '@neondatabase/serverless'
import { put, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

const sql = neon(process.env.LOOWIS_DATABASE_URL)

export default async function updateCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const collection_data = req.body
    let updatedCollection = null
    if (collection_data.image) {
        const image = collection_data.image
        let imageBuffer = null
        const matches = image.match(
            /^data:(image\/jpeg|image\/png);base64,(.+)$/,
        )
        if (matches) {
            var mimeType = matches[1]
            imageBuffer = Buffer.from(matches[2], 'base64')
        }
        if (collection_data.url) {
            await del(collection_data.url)
        }
        const blob = await put(uuidv4(), imageBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: mimeType,
        })
        updatedCollection = await sql`
            UPDATE collections SET
            collection_name = ${collection_data.name},
            collection_description = ${collection_data.description},
            cover_url = ${blob.url},
            width = ${collection_data.width},
            height = ${collection_data.height}
            WHERE collection_id = ${req.query.collection}
            RETURNING *;
        `
    } else {
        console.log('No image data provided, updating other fields only.')
        updatedCollection = await sql`
            UPDATE collections SET
            collection_name = ${collection_data.name},
            collection_description = ${collection_data.description}
            WHERE collection_id = ${req.query.collection}
            RETURNING *;
        `
    }
    if (collection_data.images) {
        const previousSelections = await sql`
            SELECT image FROM collections_lookup
            WHERE collection = ${req.query.collection};
        `
        const previousImageIds = previousSelections.map((item) => item.image)
        const imagesToAdd = collection_data.images.filter(
            (id) => !previousImageIds.includes(id),
        )
        const imagesToRemove = previousImageIds.filter(
            (id) => !collection_data.images.includes(id),
        )
        for (const imageId of imagesToAdd) {
            await sql`
                INSERT INTO collections_lookup (collection, image)
                VALUES (${req.query.collection}, ${imageId});
            `
        }
        for (const imageId of imagesToRemove) {
            console.log('Removing image ID:', imageId)
            await sql`
                DELETE FROM collections_lookup
                WHERE collection = ${req.query.collection} AND image = ${imageId};
            `
        }
    }

    res.json(updatedCollection)
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '3mb', // Set desired value here
        },
    },
}
