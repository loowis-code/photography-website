import prisma from '../../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function deleteCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).send('Unauthorized')
        res.end()
        return
    }
    const deleteCollection = await prisma.collections.delete({
        where: {
            id: req.query.id,
        },
    })

    res.json(deleteCollection)
}
