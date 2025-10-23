import styles from './SortingButtons.module.css'
import { FilterBy } from '../../helpers/FilterBy'
import { useState, useEffect } from 'react'

export default function SortingButtons({ photos, setPhotos, page }) {
    const FilterType = {
        FILM: 'film',
        DIGITAL: 'digital',
    }

    const SortType = {
        OTN: 'OTN', // Oldest to Newest
        NTO: 'NTO', // Newest to Oldest
        ATZ: 'ATZ', // A - Z
        ZTA: 'ZTA', // Z - A
    }

    const [activeTags, setActiveTags] = useState({
        sort: SortType.NTO,
        [FilterType.FILM]: true,
        [FilterType.DIGITAL]: true,
    })

    function callFilterBy(value, checked) {
        setActiveTags({ ...activeTags, [value]: checked })
    }

    useEffect(() => {
        FilterBy(activeTags, photos, setPhotos)
    }, [activeTags, photos, setPhotos])

    return (
        <div className={styles.sortingButtons}>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() =>
                    setActiveTags({ ...activeTags, sort: SortType.OTN })
                }
            >
                Oldest to Newest
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() =>
                    setActiveTags({ ...activeTags, sort: SortType.NTO })
                }
            >
                Newest to Oldest
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() =>
                    setActiveTags({ ...activeTags, sort: SortType.ATZ })
                }
            >
                A - Z
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() =>
                    setActiveTags({ ...activeTags, sort: SortType.ZTA })
                }
            >
                Z - A
            </button>
            <div className={styles.checkboxes}>
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
                        onClick={(e) =>
                            callFilterBy(e.target.id, e.target.checked)
                        }
                    ></input>
                    <label htmlFor="film">Show Film Photos</label>
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
                        onClick={(e) =>
                            callFilterBy(e.target.id, e.target.checked)
                        }
                    ></input>
                    <label htmlFor="digital">Show Digital Photos</label>
                </div>
            </div>
        </div>
    )
}
