import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]"
import { neon } from '@neondatabase/serverless';
import { del } from '@vercel/blob';

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function deleteImage(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    await sql`DELETE FROM collections_lookup WHERE image = ${req.query.image}`;
    console.log(req.body); // {"url":"https://qcbkrcgtrfkj20sb.public.blob.vercel-storage.com/f38a49d5-88ae-48eb-bd8a-92e41ab65b60"}
    console.log(req.body.url); // undefined
    if (req.body.url) {
        await del(req.body.url);
    }
    const response = await sql`DELETE FROM images WHERE image_id = ${req.query.image}`;
    res.status(200).json(response[0]);

    
}