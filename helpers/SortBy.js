export function SortBy(type, photos, setPhotos, setKey) {
    setKey((prevKey) => prevKey + 1)
    const sortedPhotos = [...photos]
    switch (type) {
        case 'date-o-n':
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
        case 'date-n-o':
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
        case 'title-a-z':
            sortedPhotos.sort((a, b) => {
                return a.title.localeCompare(b.title)
            })
            break
        case 'title-z-a':
            sortedPhotos.sort((a, b) => {
                return b.title.localeCompare(a.title)
            })
            break
    }
    setPhotos(sortedPhotos)
}