import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.LOOWIS_DATABASE_URL);

export default async function getImages(req, res) {
    const response = await sql`SELECT * FROM images`;
    const filteredResponse = response.filter(image => image.url !== null);
    res.status(200).json(filteredResponse);
    
}