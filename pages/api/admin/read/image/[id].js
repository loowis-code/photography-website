import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function getImage(req, res) {
    const response = await sql`SELECT * FROM images WHERE image_id = ${req.query.id}`;
    res.status(200).json(response[0]);
    
}