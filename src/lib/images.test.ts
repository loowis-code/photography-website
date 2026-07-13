import { describe, it, expect } from 'vitest'
import { getResizedImageUrl, IMAGE_VARIANTS } from './images'

describe('getResizedImageUrl', () => {
    it('builds a thumbnail variant URL with the expected options', () => {
        const result = getResizedImageUrl(
            'https://pub.example.com/abc-123',
            'thumbnail',
        )
        expect(result).toBe(
            `https://pub.example.com/cdn-cgi/image/width=${IMAGE_VARIANTS.thumbnail.width},quality=${IMAGE_VARIANTS.thumbnail.quality},format=auto/abc-123`,
        )
    })

    it('builds a modal variant URL with a larger width than thumbnail', () => {
        const result = getResizedImageUrl(
            'https://pub.example.com/abc-123',
            'modal',
        )
        expect(result).toContain(`width=${IMAGE_VARIANTS.modal.width}`)
        expect(IMAGE_VARIANTS.modal.width).toBeGreaterThan(
            IMAGE_VARIANTS.thumbnail.width,
        )
    })

    it('preserves the original key/filename unchanged', () => {
        const result = getResizedImageUrl(
            'https://pub.example.com/some-uuid-key-with-dashes',
            'thumbnail',
        )
        expect(result.endsWith('/some-uuid-key-with-dashes')).toBe(true)
    })

    it('preserves the origin of the source URL', () => {
        const result = getResizedImageUrl(
            'https://images.loowis.co.uk/key-1',
            'modal',
        )
        expect(
            result.startsWith('https://images.loowis.co.uk/cdn-cgi/image/'),
        ).toBe(true)
    })

    it('preserves query strings on the source URL', () => {
        const result = getResizedImageUrl(
            'https://pub.example.com/key-1?v=2',
            'thumbnail',
        )
        expect(result.endsWith('/key-1?v=2')).toBe(true)
    })

    it('does not double-wrap a URL that is already resized', () => {
        const already =
            'https://pub.example.com/cdn-cgi/image/width=400,quality=75,format=auto/key-1'
        const result = getResizedImageUrl(already, 'modal')
        expect(result).toBe(already)
    })

    it('returns the input unchanged for a non-absolute/invalid URL', () => {
        expect(getResizedImageUrl('not-a-url', 'thumbnail')).toBe('not-a-url')
    })

    it('returns an empty string for null/undefined input', () => {
        expect(getResizedImageUrl(null, 'thumbnail')).toBe('')
        expect(getResizedImageUrl(undefined, 'thumbnail')).toBe('')
    })

    it('returns the input unchanged when the URL has no path/key', () => {
        expect(getResizedImageUrl('https://pub.example.com', 'thumbnail')).toBe(
            'https://pub.example.com',
        )
        expect(
            getResizedImageUrl('https://pub.example.com/', 'thumbnail'),
        ).toBe('https://pub.example.com/')
    })

    it('produces different widths for thumbnail vs modal for the same source', () => {
        const url = 'https://pub.example.com/key-1'
        const thumb = getResizedImageUrl(url, 'thumbnail')
        const modal = getResizedImageUrl(url, 'modal')
        expect(thumb).not.toBe(modal)
    })
})
