import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

function getR2Client() {
    const required = [
        'R2_ENDPOINT',
        'R2_ACCESS_KEY_ID',
        'R2_SECRET_ACCESS_KEY',
        'R2_BUCKET_NAME',
        'R2_PUBLIC_URL',
    ] as const
    const missing = required.filter((key) => !process.env[key])
    if (missing.length > 0) {
        throw new Error(
            `Missing R2 environment variables: ${missing.join(', ')}`,
        )
    }

    return new S3Client({
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    })
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function uploadToR2(base64Data: string) {
    const matches = base64Data.match(
        /^data:(image\/jpeg|image\/png|image\/webp);base64,(.+)$/,
    )
    if (!matches) {
        throw new Error('Invalid base64 image data')
    }
    const mimeType = matches[1]
    const buffer = Buffer.from(matches[2], 'base64')

    if (buffer.byteLength > MAX_FILE_SIZE) {
        throw new Error(
            `File too large (${Math.round(buffer.byteLength / 1024 / 1024)}MB). Maximum size is 20MB.`,
        )
    }

    const key = uuidv4()

    const client = getR2Client()
    await client.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        }),
    )

    return { url: `${process.env.R2_PUBLIC_URL!}/${key}` }
}

export async function deleteFromR2(url: string) {
    const publicUrl = process.env.R2_PUBLIC_URL!
    if (!url.startsWith(publicUrl)) return

    const key = url.slice(publicUrl.length + 1)
    const client = getR2Client()
    await client.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        }),
    )
}
