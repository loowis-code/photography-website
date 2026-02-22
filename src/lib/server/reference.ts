import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Camera, Film } from '~/lib/types'

export const getCameras = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const cameras = await sql`SELECT * FROM cameras`
        return cameras as Camera[]
    } catch (error) {
        console.error('Failed to fetch cameras:', error)
        throw new Error('Failed to load cameras')
    }
})

export const getFilms = createServerFn().handler(async () => {
    try {
        const sql = getDb()
        const films = await sql`SELECT * FROM films`
        return films as Film[]
    } catch (error) {
        console.error('Failed to fetch films:', error)
        throw new Error('Failed to load films')
    }
})
