import type { SortOrder, FilterType } from '~/lib/types'

const VALID_SORTS: SortOrder[] = [
    'date-desc',
    'date-asc',
    'title-asc',
    'title-desc',
]
const VALID_FILTERS: FilterType[] = ['all', 'film', 'digital']

export interface ImageSearchParams {
    page: number
    sort: SortOrder
    filter: FilterType
}

export function validateImageSearch(
    search: Record<string, unknown>,
): ImageSearchParams {
    const page = Math.max(1, Math.floor(Number(search.page)) || 1)
    const sort = VALID_SORTS.includes(search.sort as SortOrder)
        ? (search.sort as SortOrder)
        : 'date-desc'
    const filter = VALID_FILTERS.includes(search.filter as FilterType)
        ? (search.filter as FilterType)
        : 'all'
    return { page, sort, filter }
}
