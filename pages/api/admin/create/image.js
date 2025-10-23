import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

const sql = neon(process.env.DATABASE_URL)

export default async function createImage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const photo_data = req.body

    const image = photo_data.image
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

    const newPhoto = await sql`
        INSERT INTO images 
        (url, title, width, height, description, alt_text, date_taken, location, featured, digital, visible, latitude, longitude, camera, film) 
        VALUES 
        (${blob.url}, ${photo_data.title}, ${photo_data.width}, ${photo_data.height}, ${photo_data.description}, ${photo_data.alt_text}, ${photo_data.date}, ${photo_data.location}, ${photo_data.featured}, ${photo_data.digital}, ${photo_data.visible}, ${photo_data.gps_lat}, ${photo_data.gps_long}, ${photo_data.camera}, ${photo_data.film})
        RETURNING *;
    `
    res.json(newPhoto)
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set desired value here
        },
    },
}
