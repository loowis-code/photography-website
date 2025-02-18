import styles from './SortingButtons.module.css'
import { SortBy } from '../../helpers/SortBy'
import { FilterBy } from '../../helpers/FilterBy'
import { useState, useEffect } from 'react'

export default function SortingButtons({ photos, setPhotos, page }) {
    const [checkboxState, setCheckboxState] = useState({
        film: true,
        digital: true,
    })

    function callFilterBy(value, checked) {
        setCheckboxState({ ...checkboxState, [value]: checked })
    }

    useEffect(() => {
        FilterBy(checkboxState, photos, setPhotos)
    }, [checkboxState])

    return (
        <div className={styles.sortingButtons}>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-o-n', photos, setPhotos)}
            >
                Sort By Date (Oldest to Newest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-n-o', photos, setPhotos)}
            >
                Sort By Date (Newest to Oldest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-a-z', photos, setPhotos)}
            >
                Sort By Title (A-Z)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-z-a', photos, setPhotos)}
            >
                Sort By Title (Z-A)
            </button>

            <div
                className={
                    page === 'Collections'
                        ? styles.collCheckbox
                        : styles.checkbox
                }
            >
                <input
                    type="checkbox"
                    id="film"
                    defaultChecked
                    onClick={(e) => callFilterBy(e.target.id, e.target.checked)}
                ></input>
                <label for="film">Show Film Photos</label>
            </div>

            <div
                className={
                    page === 'Collections'
                        ? styles.collCheckbox
                        : styles.checkbox
                }
            >
                <input
                    type="checkbox"
                    id="digital"
                    defaultChecked
                    onClick={(e) => callFilterBy(e.target.id, e.target.checked)}
                ></input>
                <label for="digital">Show Digital Photos</label>
            </div>
        </div>
    )
}
