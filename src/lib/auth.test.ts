import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@auth/core/providers/github', () => ({
    default: vi.fn(() => ({})),
}))

describe('auth config', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
        vi.resetModules()
    })

    it('throws when auth env vars are missing', async () => {
        await expect(import('./auth')).rejects.toThrow(
            'Missing auth environment variables',
        )
    })

    it('loads successfully when all env vars are set', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { authConfig } = await import('./auth')
        expect(authConfig).toBeDefined()
        expect(authConfig.secret).toBe('secret')
    })

    it('signIn callback allows admin email', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { authConfig } = await import('./auth')
        const result = await authConfig.callbacks!.signIn!({
            user: { email: 'admin@example.com' },
        } as Parameters<NonNullable<typeof authConfig.callbacks.signIn>>[0])
        expect(result).toBe(true)
    })

    it('signIn callback rejects non-admin email', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { authConfig } = await import('./auth')
        const result = await authConfig.callbacks!.signIn!({
            user: { email: 'hacker@evil.com' },
        } as Parameters<NonNullable<typeof authConfig.callbacks.signIn>>[0])
        expect(result).toBe(false)
    })
})
