import GitHub from '@auth/core/providers/github'
import type { StartAuthJSConfig } from 'start-authjs'

const requiredAuthVars = [
    'AUTH_SECRET',
    'AUTH_GITHUB_ID',
    'AUTH_GITHUB_SECRET',
    'ADMIN_EMAIL',
] as const

let _authConfig: StartAuthJSConfig | null = null

export function getAuthConfig(): StartAuthJSConfig {
    if (_authConfig) return _authConfig

    const missingAuthVars = requiredAuthVars.filter((key) => !process.env[key])
    if (missingAuthVars.length > 0) {
        throw new Error(
            `Missing auth environment variables: ${missingAuthVars.join(', ')}`,
        )
    }

    _authConfig = {
        secret: process.env.AUTH_SECRET,
        providers: [
            GitHub({
                clientId: process.env.AUTH_GITHUB_ID,
                clientSecret: process.env.AUTH_GITHUB_SECRET,
            }),
        ],
        callbacks: {
            async signIn({ user }) {
                if (user.email && user.email === process.env.ADMIN_EMAIL) {
                    return true
                }
                return false
            },
        },
    }

    return _authConfig
}
