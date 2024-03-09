import prisma from '../../../../../prisma/prisma'

export default async function getFilm(req, res) {
    const film = await prisma.film.findMany()

    res.json(film)
}
