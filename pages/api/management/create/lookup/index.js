import prisma from '../../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function addPhotoToCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const data = req.body
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }
    const newCollectionEntry = await prisma.collections_images_lookup.create({
        data: {
            collectionsId: data.collectionsId,
            imagesId: data.imagesId,
        },
    })

    res.json(newCollectionEntry)
}
