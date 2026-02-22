/**
 * One-time migration script: Vercel Blob → Cloudflare R2
 *
 * Usage: npx tsx scripts/migrate-blobs-to-r2.ts
 *
 * Requires environment variables:
 *   DATABASE_URL, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *   R2_BUCKET_NAME, R2_PUBLIC_URL
 */

import { neon } from '@neondatabase/serverless'
import {
    S3Client,
    PutObjectCommand,
} from '@aws-sdk/client-s3'

const sql = neon(process.env.DATABASE_URL!)

const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
})

const BUCKET = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

async function migrateUrl(
    oldUrl: string,
): Promise<string> {
    // Skip if already migrated
    if (oldUrl.startsWith(PUBLIC_URL)) {
        return oldUrl
    }

    console.log(`  Downloading: ${oldUrl}`)
    const response = await fetch(oldUrl)
    if (!response.ok) {
        throw new Error(`Failed to fetch ${oldUrl}: ${response.status}`)
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType =
        response.headers.get('content-type') ?? 'image/jpeg'

    // Extract key from the original URL path
    const urlPath = new URL(oldUrl).pathname
    const key = urlPath.split('/').pop()!

    console.log(`  Uploading to R2: ${key} (${contentType}, ${buffer.length} bytes)`)
    await r2.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }),
    )

    return `${PUBLIC_URL}/${key}`
}

async function main() {
    console.log('=== Migrating images table ===')
    const images = await sql`SELECT image_id, url FROM images WHERE url IS NOT NULL`
    for (const image of images) {
        try {
            const newUrl = await migrateUrl(image.url)
            if (newUrl !== image.url) {
                await sql`UPDATE images SET url = ${newUrl} WHERE image_id = ${image.image_id}`
                console.log(`  Updated image ${image.image_id}: ${newUrl}`)
            } else {
                console.log(`  Skipped image ${image.image_id} (already migrated)`)
            }
        } catch (err) {
            console.error(`  ERROR migrating image ${image.image_id}:`, err)
        }
    }

    console.log('\n=== Migrating collections table ===')
    const collections =
        await sql`SELECT collection_id, cover_url FROM collections WHERE cover_url IS NOT NULL`
    for (const collection of collections) {
        try {
            const newUrl = await migrateUrl(collection.cover_url)
            if (newUrl !== collection.cover_url) {
                await sql`UPDATE collections SET cover_url = ${newUrl} WHERE collection_id = ${collection.collection_id}`
                console.log(
                    `  Updated collection ${collection.collection_id}: ${newUrl}`,
                )
            } else {
                console.log(
                    `  Skipped collection ${collection.collection_id} (already migrated)`,
                )
            }
        } catch (err) {
            console.error(
                `  ERROR migrating collection ${collection.collection_id}:`,
                err,
            )
        }
    }

    console.log('\nMigration complete!')
}

main().catch(console.error)
