import prisma from '../../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function editCollection(req, res) {
    const collection_data = req.body

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }

    const editedCollection = await prisma.collections.update({
        where: {
            id: req.query.id,
        },
        data: {
            name: collection_data.name,
            subtitle: collection_data.subtitle,
            description: collection_data.description,
            cover_url: collection_data.cover_url,
            digital: collection_data.digital,
        },
    })

    res.json(editedCollection)
}
