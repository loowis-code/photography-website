import { describe, it, expect } from 'vitest'
import { validateImageSearch } from './search-params'

describe('validateImageSearch', () => {
    it('returns defaults for empty search', () => {
        expect(validateImageSearch({})).toEqual({
            page: 1,
            sort: 'date-desc',
            filter: 'all',
        })
    })

    it('parses valid values', () => {
        expect(
            validateImageSearch({
                page: 3,
                sort: 'title-asc',
                filter: 'film',
            }),
        ).toEqual({
            page: 3,
            sort: 'title-asc',
            filter: 'film',
        })
    })

    it('parses page from string', () => {
        expect(validateImageSearch({ page: '5' }).page).toBe(5)
    })

    it('clamps negative page to 1', () => {
        expect(validateImageSearch({ page: -3 }).page).toBe(1)
    })

    it('clamps zero page to 1', () => {
        expect(validateImageSearch({ page: 0 }).page).toBe(1)
    })

    it('floors fractional page', () => {
        expect(validateImageSearch({ page: 2.7 }).page).toBe(2)
    })

    it('defaults invalid sort to date-desc', () => {
        expect(validateImageSearch({ sort: 'garbage' }).sort).toBe('date-desc')
    })

    it('defaults invalid filter to all', () => {
        expect(validateImageSearch({ filter: 'invalid' }).filter).toBe('all')
    })
})
