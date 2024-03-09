import prisma from '../../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function createCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    const collection_data = req.body
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }
    const collection = await prisma.collections.create({
        data: {
            name: collection_data.name,
            subtitle: collection_data.subtitle,
            description: collection_data.description,
            cover_url: collection_data.cover_url,
        },
    })
    res.json(collection)
}
