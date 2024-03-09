import prisma from '../../../../../prisma/prisma'

export default async function getLookups(req, res) {
    const lookups = await prisma.collections_images_lookup.findMany()
    res.json(lookups)
}
