import { SortBy } from './SortBy'

export function FilterBy(activeTags, photos, setPhotos) {
    var filteredPhotos = []

    if (activeTags.digital && activeTags.film) {
        SortBy(activeTags.sort, photos, setPhotos)
        return
    }
    if (activeTags.digital) {
        filteredPhotos = photos.filter((photo) => {
            return photo.digital === true
        })
    }
    if (activeTags.film) {
        filteredPhotos = photos.filter((photo) => {
            return photo.digital === false
        })
    }
    SortBy(activeTags.sort, filteredPhotos, setPhotos)
}
