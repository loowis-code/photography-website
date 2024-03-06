export function FilterBy(checkboxState, photos, setPhotos, setKey) {
    setKey((prevKey) => prevKey + 1)
    var sortedPhotos = [...photos]
    var filteredPhotos = []

    if (checkboxState.digital && checkboxState.film) {
        setPhotos(sortedPhotos)
        return
    }
    if (checkboxState.digital) {
        filteredPhotos = sortedPhotos.filter((photo) => {
            return photo.digital === true
        })
    }
    if (checkboxState.film) {
        filteredPhotos = sortedPhotos.filter((photo) => {
            return photo.digital === false
        })
    }
    setPhotos(filteredPhotos)
}
