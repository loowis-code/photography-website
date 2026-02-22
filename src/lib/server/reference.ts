import { createServerFn } from '@tanstack/react-start'
import { getDb } from '~/lib/db'
import type { Camera, Film } from '~/lib/types'

export const getCameras = createServerFn().handler(async () => {
    const sql = getDb()
    const cameras = await sql`SELECT * FROM cameras`
    return cameras as Camera[]
})

export const getFilms = createServerFn().handler(async () => {
    const sql = getDb()
    const films = await sql`SELECT * FROM films`
    return films as Film[]
})
