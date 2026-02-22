import { SortBy } from './SortBy'
import type { Image } from '~/lib/types'

interface ActiveTags {
    sort: string
    digital: boolean
    film: boolean
}

export function FilterBy(
    activeTags: ActiveTags,
    photos: Image[],
    setPhotos: (photos: Image[]) => void,
) {
    let filteredPhotos: Image[] = []

    if (activeTags.digital && activeTags.film) {
        SortBy(activeTags.sort, photos, setPhotos)
        return
    }
    if (activeTags.digital) {
        filteredPhotos = photos.filter((photo) => photo.digital === true)
    }
    if (activeTags.film) {
        filteredPhotos = photos.filter((photo) => photo.digital === false)
    }
    SortBy(activeTags.sort, filteredPhotos, setPhotos)
}
