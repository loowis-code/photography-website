import prisma from '../../../prisma/prisma'

export default async function getPhotos(req, res) {
    const images = await prisma.images.findMany()

    res.json(images)
}
