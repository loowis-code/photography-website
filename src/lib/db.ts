import { neon } from '@neondatabase/serverless'

export const getDb = () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('Missing DATABASE_URL environment variable')
    }
    return neon(process.env.DATABASE_URL)
}
