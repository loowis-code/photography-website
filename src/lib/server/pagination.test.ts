import { describe, it, expect } from 'vitest'
import { buildFilterClause, ORDER_BY_MAP, PAGE_SIZE } from './pagination'

describe('buildFilterClause', () => {
    it('returns empty string for "all" filter', () => {
        expect(buildFilterClause('all')).toBe('')
    })

    it('returns film filter clause', () => {
        expect(buildFilterClause('film')).toBe(' AND i.digital = false')
    })

    it('returns digital filter clause', () => {
        expect(buildFilterClause('digital')).toBe(' AND i.digital = true')
    })
})

describe('ORDER_BY_MAP', () => {
    it('has entries for all sort orders', () => {
        expect(ORDER_BY_MAP['date-desc']).toContain('DESC')
        expect(ORDER_BY_MAP['date-asc']).toContain('ASC')
        expect(ORDER_BY_MAP['title-asc']).toContain('i.title ASC')
        expect(ORDER_BY_MAP['title-desc']).toContain('i.title DESC')
    })

    it('includes image_id tiebreaker in all entries', () => {
        for (const clause of Object.values(ORDER_BY_MAP)) {
            expect(clause).toContain('i.image_id ASC')
        }
    })
})

describe('PAGE_SIZE', () => {
    it('is 9', () => {
        expect(PAGE_SIZE).toBe(9)
    })
})
