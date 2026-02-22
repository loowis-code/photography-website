import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

function getR2Client() {
    return new S3Client({
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
    })
}

export async function uploadToR2(base64Data: string) {
    const matches = base64Data.match(
        /^data:(image\/jpeg|image\/png|image\/webp);base64,(.+)$/,
    )
    if (!matches) {
        throw new Error('Invalid base64 image data')
    }
    const mimeType = matches[1]
    const buffer = Buffer.from(matches[2], 'base64')
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
