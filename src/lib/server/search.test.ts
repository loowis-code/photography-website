import { describe, it, expect } from 'vitest'

// Test the sanitisation regex directly — the server function itself
// requires createServerFn infrastructure, but the core logic is testable
const sanitise = (query: string) => query.replace(/[^a-zA-Z0-9 ]/g, '')

describe('search query sanitisation', () => {
    it('preserves alphanumeric characters', () => {
        expect(sanitise('hello world')).toBe('hello world')
    })

    it('preserves numbers', () => {
        expect(sanitise('photo 123')).toBe('photo 123')
    })

    it('strips SQL wildcards', () => {
        expect(sanitise('%test_query%')).toBe('testquery')
    })

    it('strips quotes and semicolons', () => {
        expect(sanitise("'; DROP TABLE images;--")).toBe(' DROP TABLE images')
    })

    it('strips special characters', () => {
        expect(sanitise('hello@world#2024!')).toBe('helloworld2024')
    })

    it('handles empty string', () => {
        expect(sanitise('')).toBe('')
    })

    it('handles string with only special characters', () => {
        expect(sanitise('!@#$%^&*()')).toBe('')
    })

    it('preserves spaces between words', () => {
        expect(sanitise('new york city')).toBe('new york city')
    })
})
