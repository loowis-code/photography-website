import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@neondatabase/serverless', () => ({
    neon: vi.fn(() => vi.fn()),
}))

describe('getDb', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        vi.resetModules()
    })

    it('throws when DATABASE_URL is missing', async () => {
        vi.stubEnv('DATABASE_URL', '')
        const { getDb } = await import('./db')
        expect(() => getDb()).toThrow(
            'Missing DATABASE_URL environment variable',
        )
    })

    it('returns a db client when DATABASE_URL is set', async () => {
        vi.stubEnv('DATABASE_URL', 'postgres://localhost/test')
        const { getDb } = await import('./db')
        expect(() => getDb()).not.toThrow()
    })
})
