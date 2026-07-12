import { env } from 'cloudflare:workers'
import { v4 as uuidv4 } from 'uuid'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function uploadToR2(base64Data: string) {
    if (!process.env.R2_PUBLIC_URL) {
        throw new Error('Missing R2 environment variable: R2_PUBLIC_URL')
    }

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

    await env.R2_BUCKET.put(key, buffer, {
        httpMetadata: {
            contentType: mimeType,
            cacheControl: 'public, max-age=31536000, immutable',
        },
    })

    return { url: `${process.env.R2_PUBLIC_URL}/${key}` }
}

export async function deleteFromR2(url: string) {
    const publicUrl = process.env.R2_PUBLIC_URL
    if (!publicUrl || !url.startsWith(publicUrl)) return

    const key = url.slice(publicUrl.length + 1)
    await env.R2_BUCKET.delete(key)
}
