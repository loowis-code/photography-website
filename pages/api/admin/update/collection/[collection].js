import { neon } from '@neondatabase/serverless';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]"

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function updateCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const collection_data = req.body
    if (collection_data.image) {
        const image = collection_data.image;
        let imageBuffer = null;
        const matches = image.match(/^data:(image\/jpeg|image\/png);base64,(.+)$/);
        if (matches) {
            var mimeType = matches[1];
            imageBuffer = Buffer.from(matches[2], 'base64');
        }
        if (collection_data.url) {
            await del(collection_data.url);
        }
        const blob = await put(uuidv4(), imageBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: mimeType,
        });
        const updatedCollection = await sql`
            UPDATE collections SET
            collection_name = ${collection_data.name},
            collection_description = ${collection_data.description},
            cover_url = ${blob.url},
            width = ${collection_data.width},
            height = ${collection_data.height}
            WHERE collection_id = ${req.query.collection}
            RETURNING *;
        `;
        res.json(updatedCollection);
    } else {
        console.log("No image data provided, updating other fields only.");
        const updatedCollection = await sql`
            UPDATE collections SET
            collection_name = ${collection_data.name},
            collection_description = ${collection_data.description}
            WHERE collection_id = ${req.query.collection}
            RETURNING *;
        `;
        res.json(updatedCollection);
    }

}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '3mb' // Set desired value here
        }
    }
}