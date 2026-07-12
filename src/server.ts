import * as Sentry from '@sentry/cloudflare'
import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/react-start/server'
import type { Register } from '@tanstack/react-router'
import type { RequestHandler } from '@tanstack/react-start/server'

// Providing `RequestHandler` from `@tanstack/react-start/server` mirrors the
// framework's own default entry (see @tanstack/react-start/server-entry) so
// the output types don't import it from `@tanstack/start-server-core`.
type ServerEntry = { fetch: RequestHandler<Register> }

const fetch = createStartHandler(defaultStreamHandler)

/**
 * Worker entry point. This wraps the default TanStack Start request handler
 * with Sentry's `withSentry` so unhandled errors are reported in addition to
 * whatever each server function already does with its own try/catch (see
 * `src/lib/server/monitoring.ts`).
 *
 * Sentry only turns on when a `SENTRY_DSN` value is present at runtime. With
 * no DSN configured (the default/current state), the options callback below
 * returns `undefined` and the SDK is a safe no-op passthrough — nothing
 * changes for anyone who hasn't set it up. See CLAUDE.md for setup steps.
 */
export default Sentry.withSentry(
    () => {
        const dsn = process.env.SENTRY_DSN
        if (!dsn) return undefined
        return {
            dsn,
            environment: process.env.SENTRY_ENVIRONMENT ?? 'production',
            // Errors only, no performance tracing, to keep this within a free tier.
            tracesSampleRate: 0,
        }
    },
    {
        async fetch(...args) {
            return fetch(...args)
        },
    } satisfies ServerEntry,
)
