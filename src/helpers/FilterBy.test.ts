import { describe, it, expect, vi } from 'vitest'
import { FilterBy } from './FilterBy'
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

describe('FilterBy', () => {
    const digitalPhoto = makeImage({
        image_id: 1,
        title: 'Digital',
        digital: true,
    })
    const filmPhoto = makeImage({
        image_id: 2,
        title: 'Film',
        digital: false,
    })
    const anotherFilm = makeImage({
        image_id: 3,
        title: 'Another Film',
        digital: false,
    })

    it('returns all photos when both digital and film are enabled', () => {
        const setPhotos = vi.fn()
        FilterBy(
            { sort: 'ATZ', digital: true, film: true },
            [digitalPhoto, filmPhoto, anotherFilm],
            setPhotos,
        )
        const result = setPhotos.mock.calls[0][0]
        expect(result).toHaveLength(3)
    })

    it('filters to digital only', () => {
        const setPhotos = vi.fn()
        FilterBy(
            { sort: 'ATZ', digital: true, film: false },
            [digitalPhoto, filmPhoto, anotherFilm],
            setPhotos,
        )
        const result = setPhotos.mock.calls[0][0]
        expect(result).toHaveLength(1)
        expect(result[0].image_id).toBe(1)
    })

    it('filters to film only', () => {
        const setPhotos = vi.fn()
        FilterBy(
            { sort: 'ATZ', digital: false, film: true },
            [digitalPhoto, filmPhoto, anotherFilm],
            setPhotos,
        )
        const result = setPhotos.mock.calls[0][0]
        expect(result).toHaveLength(2)
        expect(result.map((p: Image) => p.title)).toEqual([
            'Another Film',
            'Film',
        ])
    })

    it('respects sort order within filtered results', () => {
        const setPhotos = vi.fn()
        FilterBy(
            { sort: 'ZTA', digital: false, film: true },
            [digitalPhoto, filmPhoto, anotherFilm],
            setPhotos,
        )
        const result = setPhotos.mock.calls[0][0]
        expect(result.map((p: Image) => p.title)).toEqual([
            'Film',
            'Another Film',
        ])
    })
})
