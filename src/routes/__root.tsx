/// <reference types="vite/client" />
import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import ErrorFallback from '~/components/ErrorFallback/ErrorFallback'
import globalsCss from '~/styles/globals.css?url'
import designSystemTokensCss from 'loowis-component-library/tokens.css?url'
import designSystemThemeCss from 'loowis-component-library/theme.css?url'
import designSystemFontsCss from 'loowis-component-library/fonts.css?url'
import designSystemComponentsCss from 'loowis-component-library/components.css?url'

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
            { rel: 'stylesheet', href: designSystemTokensCss },
            { rel: 'stylesheet', href: designSystemThemeCss },
            { rel: 'stylesheet', href: designSystemFontsCss },
            { rel: 'stylesheet', href: designSystemComponentsCss },
            { rel: 'stylesheet', href: globalsCss },
            { rel: 'icon', href: '/favicon/favicon.png' },
        ],
    }),
    shellComponent: RootDocument,
    component: RootComponent,
    errorComponent: ErrorFallback,
})

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" data-loowis-theme="default">
            <head>
                <HeadContent />
            </head>
            <body>
                <div id="app-content">{children}</div>
                <div id="modal-root"></div>
                <Scripts />
            </body>
        </html>
    )
}

function RootComponent() {
    return <Outlet />
}
