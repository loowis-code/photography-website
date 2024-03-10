import prisma from '../../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function createImage(req, res) {
    const photo_data = req.body

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }

    const editedPhoto = await prisma.images.update({
        where: {
            id: req.query.id,
        },
        data: {
            url: photo_data.url,
            title: photo_data.title,
            subtitle: photo_data.subtitle,
            description_long: photo_data.description_long,
            description_short: photo_data.description_short,
            alt_text: photo_data.alt_text,
            camera: photo_data.camera,
            film: photo_data.film,
            date: photo_data.date,
            location: photo_data.location,
            author: photo_data.author,
            iso: photo_data.iso,
            aperture: photo_data.aperture,
            shutter_speed: photo_data.shutter_speed,
            featured: photo_data.featured,
            digital: photo_data.digital,
            hidden: photo_data.hidden,
            gps_lat: photo_data.gps_lat,
            gps_long: photo_data.gps_long,
        },
    })

    res.json(editedPhoto)
}
