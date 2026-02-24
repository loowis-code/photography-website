import { describe, it, expect, vi } from 'vitest'
import { SortBy } from './SortBy'
import type { Image } from '~/lib/types'

function makeImage(overrides: Partial<Image>): Image {
    return {
        image_id: 1,
        url: 'https://example.com/img.jpg',
        width: 800,
        height: 600,
        title: 'Untitled',
        description: null,
        alt_text: null,
        date_taken: null,
        location: null,
        visible: true,
        featured: false,
        digital: true,
        latitude: null,
        longitude: null,
        film: null,
        camera: null,
        ...overrides,
    }
}

describe('SortBy', () => {
    const photo1 = makeImage({
        image_id: 1,
        title: 'Beach',
        date_taken: '2024-01-15',
    })
    const photo2 = makeImage({
        image_id: 2,
        title: 'Alpine',
        date_taken: '2024-06-20',
    })
    const photo3 = makeImage({
        image_id: 3,
        title: 'City',
        date_taken: '2023-12-01',
    })

    it('sorts oldest to newest (OTN)', () => {
        const setPhotos = vi.fn()
        SortBy('OTN', [photo1, photo2, photo3], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.image_id)).toEqual([3, 1, 2])
    })

    it('sorts newest to oldest (NTO)', () => {
        const setPhotos = vi.fn()
        SortBy('NTO', [photo1, photo2, photo3], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.image_id)).toEqual([2, 1, 3])
    })

    it('sorts A-Z by title (ATZ)', () => {
        const setPhotos = vi.fn()
        SortBy('ATZ', [photo1, photo2, photo3], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.title)).toEqual([
            'Alpine',
            'Beach',
            'City',
        ])
    })

    it('sorts Z-A by title (ZTA)', () => {
        const setPhotos = vi.fn()
        SortBy('ZTA', [photo1, photo2, photo3], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.title)).toEqual([
            'City',
            'Beach',
            'Alpine',
        ])
    })

    it('puts null dates first when sorting OTN', () => {
        const noDate = makeImage({ image_id: 4, title: 'No Date' })
        const setPhotos = vi.fn()
        SortBy('OTN', [noDate, photo3, photo1], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.image_id)).toEqual([4, 3, 1])
    })

    it('puts null dates last when sorting NTO', () => {
        const noDate = makeImage({ image_id: 4, title: 'No Date' })
        const setPhotos = vi.fn()
        SortBy('NTO', [noDate, photo3, photo1], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.image_id)).toEqual([1, 3, 4])
    })

    it('handles empty array', () => {
        const setPhotos = vi.fn()
        SortBy('OTN', [], setPhotos)
        expect(setPhotos).toHaveBeenCalledWith([])
    })

    it('does not mutate the original array', () => {
        const photos = [photo2, photo1, photo3]
        const original = [...photos]
        const setPhotos = vi.fn()
        SortBy('ATZ', photos, setPhotos)
        expect(photos).toEqual(original)
    })

    it('passes through unchanged for unknown sort type', () => {
        const setPhotos = vi.fn()
        SortBy('UNKNOWN', [photo2, photo1], setPhotos)
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.image_id)).toEqual([2, 1])
    })
})
