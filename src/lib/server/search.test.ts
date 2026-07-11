import { describe, it, expect } from 'vitest'

// Test the ILIKE-wildcard escaping directly — the server function itself
// requires createServerFn infrastructure, but the core logic is testable.
// This only escapes "%"/"_"/"\" (ILIKE's wildcard and escape characters);
// it does not strip other punctuation. SQL injection is not a concern here
// because the value is still passed through the tagged `sql` template,
// which parameterizes it — this function only prevents user input from
// being interpreted as ILIKE wildcards.
const escapeLikeWildcards = (input: string) =>
    input.replace(/[\\%_]/g, (char) => `\\${char}`)

describe('search query wildcard escaping', () => {
    it('preserves alphanumeric characters', () => {
        expect(escapeLikeWildcards('hello world')).toBe('hello world')
    })

    it('preserves numbers', () => {
        expect(escapeLikeWildcards('photo 123')).toBe('photo 123')
    })

    it('preserves periods and hyphens', () => {
        expect(escapeLikeWildcards('St. Andrews')).toBe('St. Andrews')
        expect(escapeLikeWildcards('Stratford-upon-Avon')).toBe(
            'Stratford-upon-Avon',
        )
    })

    it('preserves apostrophes', () => {
        expect(escapeLikeWildcards("St Mary's Church")).toBe("St Mary's Church")
    })

    it('escapes ILIKE wildcard percent signs', () => {
        expect(escapeLikeWildcards('%test%')).toBe('\\%test\\%')
    })

    it('escapes ILIKE wildcard underscores', () => {
        expect(escapeLikeWildcards('test_query')).toBe('test\\_query')
    })

    it('escapes a literal backslash', () => {
        expect(escapeLikeWildcards('back\\slash')).toBe('back\\\\slash')
    })

    it('does not strip quotes and semicolons (parameterized query handles safety)', () => {
        expect(escapeLikeWildcards("'; DROP TABLE images;--")).toBe(
            "'; DROP TABLE images;--",
        )
    })

    it('handles empty string', () => {
        expect(escapeLikeWildcards('')).toBe('')
    })

    it('handles string with only wildcard characters', () => {
        expect(escapeLikeWildcards('%_%')).toBe('\\%\\_\\%')
    })

    it('preserves spaces between words', () => {
        expect(escapeLikeWildcards('new york city')).toBe('new york city')
    })
})
