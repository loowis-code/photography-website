export function SortBy(type, photos, setPhotos) {
    let sortedPhotos = [...photos]
    switch (type) {
        case 'OTN':
            sortedPhotos.sort((a, b) => {
                if (a.date != null && b.date != null) {
                    return a.date.localeCompare(b.date)
                } else if (a.date != null && b.date == null) {
                    return 1
                } else if (a.date == null && b.date != null) {
                    return -1
                }
            })
            break
        case 'NTO':
            sortedPhotos.sort((a, b) => {
                if (a.date != null && b.date != null) {
                    return b.date.localeCompare(a.date)
                } else if (a.date != null && b.date == null) {
                    return -1
                } else if (a.date == null && b.date != null) {
                    return 1
                }
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
