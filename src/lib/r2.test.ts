import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockPut = vi.fn().mockResolvedValue({})
const mockDelete = vi.fn().mockResolvedValue(undefined)

vi.mock('cloudflare:workers', () => ({
    env: {
        R2_BUCKET: {
            put: mockPut,
            delete: mockDelete,
        },
    },
}))

vi.mock('uuid', () => ({
    v4: () => 'test-uuid-1234',
}))

const R2_ENV = {
    R2_PUBLIC_URL: 'https://pub.example.com',
}

describe('uploadToR2', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        mockPut.mockClear()
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
        expect(mockPut).toHaveBeenCalledWith(
            'test-uuid-1234',
            expect.any(Buffer),
            { httpMetadata: { contentType: 'image/jpeg' } },
        )
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

    it('throws when R2_PUBLIC_URL is missing', async () => {
        vi.unstubAllEnvs()
        const uploadToR2 = await getUploadToR2()
        const smallData = Buffer.alloc(100).toString('base64')
        await expect(
            uploadToR2(`data:image/jpeg;base64,${smallData}`),
        ).rejects.toThrow('Missing R2 environment variable: R2_PUBLIC_URL')
    })
})

describe('deleteFromR2', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        mockDelete.mockClear()
        for (const [key, value] of Object.entries(R2_ENV)) {
            vi.stubEnv(key, value)
        }
    })

    async function getDeleteFromR2() {
        const mod = await import('./r2')
        return mod.deleteFromR2
    }

    it('skips deletion for URLs not matching R2_PUBLIC_URL', async () => {
        const deleteFromR2 = await getDeleteFromR2()
        await deleteFromR2('https://other-domain.com/some-key')
        expect(mockDelete).not.toHaveBeenCalled()
    })

    it('deletes the key extracted from a matching URL', async () => {
        const deleteFromR2 = await getDeleteFromR2()
        await deleteFromR2('https://pub.example.com/some-key')
        expect(mockDelete).toHaveBeenCalledWith('some-key')
    })
})
