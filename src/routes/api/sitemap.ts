import { createFileRoute } from '@tanstack/react-router'
import { getDb } from '~/lib/db'
import { BASE_URL } from '~/lib/constants'

interface SitemapRow {
    id: number
}

export const Route = createFileRoute('/api/sitemap')({
    server: {
        handlers: {
            GET: async () => {
                const sql = getDb()

                const collections =
                    (await sql`SELECT collection_id AS id FROM collections ORDER BY collection_id`) as SitemapRow[]
                const images =
                    (await sql`SELECT image_id AS id FROM images WHERE visible = true ORDER BY image_id`) as SitemapRow[]

                const today = new Date().toISOString().split('T')[0]

                const staticUrls = [
                    { path: '/', priority: '1.0' },
                    { path: '/collections', priority: '0.8' },
                    { path: '/all-images', priority: '0.8' },
                    { path: '/image-map', priority: '0.7' },
                ]

                const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
    .map(
        ({ path, priority }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')}
${collections
    .map(
        (c) => `  <url>
    <loc>${BASE_URL}/collection/${c.id}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.7</priority>
  </url>`,
    )
    .join('\n')}
${images
    .map(
        (img) => `  <url>
    <loc>${BASE_URL}/images/${img.id}</loc>
    <lastmod>${today}</lastmod>
    <priority>0.6</priority>
  </url>`,
    )
    .join('\n')}
</urlset>`

                return new Response(xml, {
                    headers: {
                        'Content-Type': 'application/xml',
                        'Cache-Control': 'public, max-age=3600',
                    },
                })
            },
        },
    },
})
