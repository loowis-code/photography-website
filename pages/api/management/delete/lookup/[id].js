import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function deletePhotoToCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }
    const removedCollectionEntry =
        await prisma.collections_images_lookup.delete({
            where: {
                id: req.query.id,
            },
        })

    res.json(removedCollectionEntry)
}
