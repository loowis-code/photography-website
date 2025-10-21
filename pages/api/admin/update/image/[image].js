import { neon } from '@neondatabase/serverless'
import { put, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

const sql = neon(process.env.LOOWIS_DATABASE_URL)

export default async function createImage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const photo_data = req.body
    if (photo_data.image) {
        const image = photo_data.image
        let imageBuffer = null
        const matches = image.match(
            /^data:(image\/jpeg|image\/png);base64,(.+)$/,
        )
        if (matches) {
            var mimeType = matches[1]
            imageBuffer = Buffer.from(matches[2], 'base64')
        }
        const blob = await put(uuidv4(), imageBuffer, {
            access: 'public',
            addRandomSuffix: false,
            contentType: mimeType,
        })
        await del(photo_data.url)
        const editedPhoto = await sql`
            UPDATE images SET
            url = ${blob.url},
            title = ${photo_data.title},
            width = ${photo_data.width},
            height = ${photo_data.height},
            description = ${photo_data.description},
            alt_text = ${photo_data.alt_text},
            date_taken = ${photo_data.date},
            location = ${photo_data.location},
            featured = ${photo_data.featured},
            camera = ${photo_data.camera},
            film = ${photo_data.film},
            digital = ${photo_data.digital},
            visible = ${photo_data.visible},
            latitude = ${photo_data.gps_lat},
            longitude = ${photo_data.gps_long}
            WHERE image_id = ${req.query.image}
            RETURNING *;
        `
        res.json(editedPhoto)
    } else {
        console.log('No image data provided, updating other fields only.')
        const editedPhoto = await sql`
            UPDATE images SET
            title = ${photo_data.title},
            description = ${photo_data.description},
            alt_text = ${photo_data.alt_text},
            date_taken = ${photo_data.date},
            location = ${photo_data.location},
            featured = ${photo_data.featured},
            camera = ${photo_data.camera},
            film = ${photo_data.film},
            digital = ${photo_data.digital},
            visible = ${photo_data.visible},
            latitude = ${photo_data.gps_lat},
            longitude = ${photo_data.gps_long}
            WHERE image_id = ${req.query.image}
            RETURNING *;
        `
        res.json(editedPhoto)
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set desired value here
        },
    },
}
