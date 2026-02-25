import { createFileRoute } from '@tanstack/react-router'
import { StartAuthJS } from 'start-authjs'
import { getAuthConfig } from '~/lib/auth'

export const Route = createFileRoute('/api/auth/$')({
    server: {
        handlers: {
            GET: ({ request }) => {
                const { GET } = StartAuthJS(getAuthConfig())
                return GET({ request, response: new Response() })
            },
            POST: ({ request }) => {
                const { POST } = StartAuthJS(getAuthConfig())
                return POST({ request, response: new Response() })
            },
        },
    },
})
