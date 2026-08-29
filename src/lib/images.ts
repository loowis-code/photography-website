/**
 * Builds resized image URLs on top of Cloudflare's Image Resizing feature,
 * without introducing a separate upload/variant pipeline.
 *
 * Every image the app serves lives at `${R2_PUBLIC_URL}/<uuid-key>` (see
 * `src/lib/r2.ts`). Cloudflare Image Resizing can transform any image on a
 * zone on the fly via a special URL path: requesting
 *   `${origin}/cdn-cgi/image/<options>/<path-to-image-on-this-zone>`
 * has Cloudflare fetch the image at `<path>` on that same origin, resize it
 * per `<options>`, cache the result at the edge, and return it — no change
 * to how images are uploaded or stored.
 *
 * ASSUMPTION / RISK: this only works if Image Resizing is actually turned on
 * for the zone that `R2_PUBLIC_URL` points at (Cloudflare dashboard > that
 * zone > Speed > Optimization > Image Resizing). It's a paid feature on some
 * plans and is off by default. This cannot be verified from this repo/CI —
 * confirm it's enabled for the domain behind R2_PUBLIC_URL before relying on
 * these URLs in production. If it's off, `/cdn-cgi/image/...` requests will
 * fail (404 to visitors), so the callers below should not be the *only*
 * place an original URL is derivable in a pinch.
 */

export type ImageVariant = 'thumbnail' | 'modal'

interface VariantConfig {
    width: number
    quality: number
}

/**
 * width: target render width for the largest common layout of that context
 * (see the components that use each variant for the exact CSS sizing).
 * quality: 75-80 is a standard "visually lossless enough" JPEG/WebP quality
 * that meaningfully cuts file size vs. an uploaded original.
 */
export const IMAGE_VARIANTS: Record<ImageVariant, VariantConfig> = {
    thumbnail: { width: 700, quality: 70 },
    modal: { width: 1400, quality: 80 },
}

const RESIZE_PATH_PREFIX = '/cdn-cgi/image/'

/**
 * Returns a Cloudflare Image Resizing URL for `url` at the given variant.
 * Falls back to returning `url` unchanged if it isn't a well-formed absolute
 * URL, has no path (nothing to resize), or is already a resized URL.
 */
export function getResizedImageUrl(
    url: string | null | undefined,
    variant: ImageVariant,
): string {
    if (!url) return url ?? ''

    let parsed: URL
    try {
        parsed = new URL(url)
    } catch {
        return url
    }

    if (parsed.pathname.startsWith(RESIZE_PATH_PREFIX)) {
        return url
    }

    const key = parsed.pathname.replace(/^\/+/, '')
    if (!key) return url

    const { width, quality } = IMAGE_VARIANTS[variant]
    const options = `width=${width},quality=${quality},format=auto`

    return `${parsed.origin}${RESIZE_PATH_PREFIX}${options}/${key}${parsed.search}`
}
