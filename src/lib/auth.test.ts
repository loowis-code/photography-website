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
        vi.stubEnv('AUTH_SECRET', '')
        vi.stubEnv('AUTH_GITHUB_ID', '')
        vi.stubEnv('AUTH_GITHUB_SECRET', '')
        vi.stubEnv('ADMIN_EMAIL', '')
        const { getAuthConfig } = await import('./auth')
        expect(() => getAuthConfig()).toThrow(
            'Missing auth environment variables',
        )
    })

    it('returns config when all env vars are set', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { getAuthConfig } = await import('./auth')
        const config = getAuthConfig()
        expect(config).toBeDefined()
        expect(config.secret).toBe('secret')
    })

    it('signIn callback allows admin email', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { getAuthConfig } = await import('./auth')
        const signIn = getAuthConfig().callbacks!.signIn!
        const result = await signIn({
            user: { email: 'admin@example.com' },
        } as Parameters<typeof signIn>[0])
        expect(result).toBe(true)
    })

    it('signIn callback rejects non-admin email', async () => {
        vi.stubEnv('AUTH_SECRET', 'secret')
        vi.stubEnv('AUTH_GITHUB_ID', 'id')
        vi.stubEnv('AUTH_GITHUB_SECRET', 'ghsecret')
        vi.stubEnv('ADMIN_EMAIL', 'admin@example.com')
        const { getAuthConfig } = await import('./auth')
        const signIn = getAuthConfig().callbacks!.signIn!
        const result = await signIn({
            user: { email: 'hacker@evil.com' },
        } as Parameters<typeof signIn>[0])
        expect(result).toBe(false)
    })
})
