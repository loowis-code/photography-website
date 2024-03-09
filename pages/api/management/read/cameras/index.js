import prisma from '../../../../../prisma/prisma'

export default async function getCameras(req, res) {
    const cameras = await prisma.camera.findMany()

    res.json(cameras)
}
