import {
    createStartHandler,
    defaultStreamHandler,
} from '@tanstack/react-start/server'

// Third-party origins the app actually loads, kept in sync with:
// - src/routes/image-map.tsx / src/components/ImagePage / src/components/PhotoForm
//   (Leaflet map tiles + marker icons)
// - src/lib/r2.ts (R2_PUBLIC_URL, served publicly as images.loowis.co.uk)
// - src/routes/api/auth/$.ts (Auth.js GitHub OAuth sign-in form submission)
const CSP = [
    "default-src 'self'",
    // TanStack Start injects the router hydration payload as an inline
    // <script>, and Auth.js's built-in sign-in page ships inline <style>.
    // There's no nonce/hash plumbed through yet, so allow 'unsafe-inline'
    // rather than break hydration/auth.
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    // authjs.dev serves the GitHub provider icon on Auth.js's built-in
    // sign-in page.
    "img-src 'self' data: https://images.loowis.co.uk https://unpkg.com https://tile.openstreetmap.org https://authjs.dev",
    "font-src 'self'",
    "connect-src 'self'",
    // Auth.js's sign-in page submits a form that redirects to GitHub's OAuth
    // authorize endpoint.
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
