import prisma from '../../../../../prisma/prisma'

export default async function getCollection(req, res) {
    const collection_data = await prisma.collections.findUnique({
        where: { id: req.query.id },
    })

    res.json(collection_data)
}
