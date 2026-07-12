import * as Sentry from '@sentry/cloudflare'

/**
 * Reports a caught error to the console and, when configured, to Sentry.
 *
 * Every server function in `src/lib/server/*.ts` catches its own errors and
 * previously only logged them with `console.error`, which is only visible by
 * reading Cloudflare Workers logs by hand. This funnels those same catch
 * blocks through one place so they also reach Sentry when it's set up.
 *
 * Sentry is only active when a `SENTRY_DSN` value is present at runtime (see
 * the `withSentry` wrapper in `src/server.ts`). Without a DSN configured,
 * `Sentry.captureException` is a safe no-op, so this behaves exactly like a
 * plain `console.error` call with zero configuration — see CLAUDE.md for the
 * one-time setup (`wrangler secret put SENTRY_DSN`) needed to activate it.
 */
export function reportError(message: string, error: unknown): void {
    console.error(message, error)

    if (process.env.SENTRY_DSN) {
        Sentry.captureException(error, { extra: { message } })
    }
}
