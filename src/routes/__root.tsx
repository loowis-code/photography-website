/// <reference types="vite/client" />
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import globalsCss from '~/styles/globals.css?url'
import componentLibCss from 'loowis-component-library/dist/index.css?url'
import leafletCss from 'leaflet/dist/leaflet.css?url'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                name: 'description',
                content:
                    'A photography portfolio website featuring images taken by Lewis Inches, mainly in Edinburgh using an Olympus OM40 and Canon EOS 550D.',
            },
            { title: 'Loowis Photography' },
        ],
        links: [
            { rel: 'stylesheet', href: globalsCss },
            { rel: 'stylesheet', href: componentLibCss },
            { rel: 'stylesheet', href: leafletCss },
            { rel: 'icon', href: '/favicon/favicon.png' },
        ],
    }),
    shellComponent: RootDocument,
    component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <div id="modal-root"></div>
                <Scripts />
            </body>
        </html>
    )
}

function RootComponent() {
    return <Outlet />
}
