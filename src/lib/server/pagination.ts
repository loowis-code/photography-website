import type { SortOrder, FilterType } from '~/lib/types'

export const PAGE_SIZE = 9

export const ORDER_BY_MAP: Record<SortOrder, string> = {
    'date-desc': 'i.date_taken DESC NULLS LAST, i.image_id ASC',
    'date-asc': 'i.date_taken ASC NULLS FIRST, i.image_id ASC',
    'title-asc': 'i.title ASC, i.image_id ASC',
    'title-desc': 'i.title DESC, i.image_id ASC',
}

export function buildFilterClause(filter: FilterType): string {
    if (filter === 'film') return ' AND i.digital = false'
    if (filter === 'digital') return ' AND i.digital = true'
    return ''
}
