import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSend = vi.fn().mockResolvedValue({})

vi.mock('@aws-sdk/client-s3', () => {
    return {
        S3Client: class {
            send = mockSend
        },
        PutObjectCommand: class {
            constructor(public input: Record<string, unknown>) {}
        },
        DeleteObjectCommand: class {
            constructor(public input: Record<string, unknown>) {}
        },
    }
})

vi.mock('uuid', () => ({
    v4: () => 'test-uuid-1234',
}))

const R2_ENV = {
    R2_ENDPOINT: 'https://r2.example.com',
    R2_ACCESS_KEY_ID: 'key',
    R2_SECRET_ACCESS_KEY: 'secret',
    R2_BUCKET_NAME: 'bucket',
    R2_PUBLIC_URL: 'https://pub.example.com',
}

describe('uploadToR2', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        for (const [key, value] of Object.entries(R2_ENV)) {
            vi.stubEnv(key, value)
        }
    })

    async function getUploadToR2() {
        const mod = await import('./r2')
        return mod.uploadToR2
    }

    it('rejects invalid base64 format', async () => {
        const uploadToR2 = await getUploadToR2()
        await expect(uploadToR2('not-base64')).rejects.toThrow(
            'Invalid base64 image data',
        )
    })

    it('rejects unsupported mime types', async () => {
        const uploadToR2 = await getUploadToR2()
        await expect(
            uploadToR2('data:image/gif;base64,R0lGODlh'),
        ).rejects.toThrow('Invalid base64 image data')
    })

    it('rejects files over 20MB', async () => {
        const uploadToR2 = await getUploadToR2()
        const largeData = Buffer.alloc(21 * 1024 * 1024).toString('base64')
        await expect(
            uploadToR2(`data:image/jpeg;base64,${largeData}`),
        ).rejects.toThrow('File too large')
    })

    it('accepts valid jpeg base64 and returns URL', async () => {
        const uploadToR2 = await getUploadToR2()
        const smallData = Buffer.alloc(100).toString('base64')
        const result = await uploadToR2(`data:image/jpeg;base64,${smallData}`)
        expect(result.url).toBe('https://pub.example.com/test-uuid-1234')
    })

    it('accepts valid png base64', async () => {
        const uploadToR2 = await getUploadToR2()
        const smallData = Buffer.alloc(100).toString('base64')
        const result = await uploadToR2(`data:image/png;base64,${smallData}`)
        expect(result.url).toBe('https://pub.example.com/test-uuid-1234')
    })

    it('accepts valid webp base64', async () => {
        const uploadToR2 = await getUploadToR2()
        const smallData = Buffer.alloc(100).toString('base64')
        const result = await uploadToR2(`data:image/webp;base64,${smallData}`)
        expect(result.url).toBe('https://pub.example.com/test-uuid-1234')
    })
})

describe('deleteFromR2', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        for (const [key, value] of Object.entries(R2_ENV)) {
            vi.stubEnv(key, value)
        }
    })

    async function getDeleteFromR2() {
        const mod = await import('./r2')
        return mod.deleteFromR2
    }

    it('skips deletion for URLs not matching R2_PUBLIC_URL', async () => {
        mockSend.mockClear()
        const deleteFromR2 = await getDeleteFromR2()
        await deleteFromR2('https://other-domain.com/some-key')
        expect(mockSend).not.toHaveBeenCalled()
    })
})

describe('getR2Client env validation', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
    })

    it('throws when R2 env vars are missing', async () => {
        const uploadToR2 = (await import('./r2')).uploadToR2
        const smallData = Buffer.alloc(100).toString('base64')
        await expect(
            uploadToR2(`data:image/jpeg;base64,${smallData}`),
        ).rejects.toThrow('Missing R2 environment variables')
    })
})
