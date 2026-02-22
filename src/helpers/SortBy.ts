import type { Image } from '~/lib/types'

export function SortBy(
    type: string,
    photos: Image[],
    setPhotos: (photos: Image[]) => void,
) {
    const sortedPhotos = [...photos]
    switch (type) {
        case 'OTN':
            sortedPhotos.sort((a, b) => {
                if (a.date_taken != null && b.date_taken != null) {
                    return a.date_taken.localeCompare(b.date_taken)
                } else if (a.date_taken != null && b.date_taken == null) {
                    return 1
                } else if (a.date_taken == null && b.date_taken != null) {
                    return -1
                }
                return 0
            })
            break
        case 'NTO':
            sortedPhotos.sort((a, b) => {
                if (a.date_taken != null && b.date_taken != null) {
                    return b.date_taken.localeCompare(a.date_taken)
                } else if (a.date_taken != null && b.date_taken == null) {
                    return -1
                } else if (a.date_taken == null && b.date_taken != null) {
                    return 1
                }
                return 0
            })
            break
        case 'ATZ':
            sortedPhotos.sort((a, b) => {
                return a.title.localeCompare(b.title)
            })
            break
        case 'ZTA':
            sortedPhotos.sort((a, b) => {
                return b.title.localeCompare(a.title)
            })
            break
    }
    setPhotos(sortedPhotos)
}
