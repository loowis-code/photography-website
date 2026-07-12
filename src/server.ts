import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/react-start/server'

// Origins here must stay in sync with what image-map/ImagePage/PhotoForm
// (Leaflet), r2.ts (R2_PUBLIC_URL), and Auth.js's sign-in page actually load.
const CSP = [
    "default-src 'self'",
    // unsafe-inline: TanStack Start's hydration script and Auth.js's
    // sign-in page styles are both inline, with no nonce/hash plumbed in yet.
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.loowis.co.uk https://unpkg.com https://tile.openstreetmap.org https://authjs.dev",
    "font-src 'self'",
    "connect-src 'self'",
    // Auth.js's sign-in page submits a form to GitHub's OAuth authorize endpoint.
    "form-action 'self' https://github.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
].join('; ')

const startFetch = createStartHandler(defaultStreamHandler)

function withSecurityHeaders(response: Response): Response {
    const headers = new Headers(response.headers)
    headers.set('Content-Security-Policy', CSP)
    headers.set('X-Frame-Options', 'DENY')
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    })
}

export default {
    fetch: async (
        ...args: Parameters<typeof startFetch>
    ): Promise<Response> => {
        const response = await startFetch(...args)
        return withSecurityHeaders(response)
    },
}
