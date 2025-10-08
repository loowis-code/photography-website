import { neon } from '@neondatabase/serverless';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]"

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function getImage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const response = await sql`SELECT * FROM images WHERE image_id = ${req.query.id}`;
    res.status(200).json(response[0]);
    
}