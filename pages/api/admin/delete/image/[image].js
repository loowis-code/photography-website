import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]"

export default async function deleteImage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}