import prisma from '../../../prisma/prisma'

export default async function getSearchResults(req, res) {
    const query = req.query.query
    const results = await prisma.images.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } },
                { camera: { contains: query, mode: 'insensitive' } },
                { film: { contains: query, mode: 'insensitive' } },
            ],
        },
    })

    if (results.length === 0) {
        res.json({ error: 'No results found' })
    } else {
        res.json(results)
    }

   
    
}
