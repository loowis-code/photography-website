import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]"
import { neon } from '@neondatabase/serverless';
import { del } from '@vercel/blob';

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function deleteCollection(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    await sql`DELETE FROM collections_lookup WHERE collection = ${req.query.collection}`;
    if (req.body.url) {
        await del(req.body.url);
    }
    const response = await sql`DELETE FROM collections WHERE collection_id = ${req.query.collection}`;
    res.status(200).json(response[0]);

    
}