import prisma from '../../../prisma/prisma'

export default async function getPhoto(req, res) {
    const images_in_collection =
        await prisma.collections_images_lookup.findMany({
            where: { collectionsId: req.query.id },
        })
    let data = []
    const collection_data = await prisma.collections.findUnique({
        where: { id: req.query.id },
    })
    data.push(collection_data)
    for (const image of images_in_collection) {
        const image_data = await prisma.images.findUnique({
            where: { id: image.imagesId },
        })
        data.push(image_data)
    }
    res.json(data)
}
