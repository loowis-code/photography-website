import styles from './SortingButtons.module.css'
import { FilterBy } from '~/helpers/FilterBy'
import { useState, useEffect } from 'react'
import type { Image } from '~/lib/types'

interface SortingButtonsProps {
    photos: Image[]
    setPhotos: (photos: Image[]) => void
    page?: string
}

const FilterType = {
    FILM: 'film',
    DIGITAL: 'digital',
} as const

const SortType = {
    OTN: 'OTN',
    NTO: 'NTO',
    ATZ: 'ATZ',
    ZTA: 'ZTA',
} as const

export default function SortingButtons({
    photos,
    setPhotos,
    page,
}: SortingButtonsProps) {
    const [activeTags, setActiveTags] = useState({
        sort: SortType.NTO as string,
        [FilterType.FILM]: true,
        [FilterType.DIGITAL]: true,
    })

    function callFilterBy(value: string, checked: boolean) {
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
                            callFilterBy(
                                (e.target as HTMLInputElement).id,
                                (e.target as HTMLInputElement).checked,
                            )
                        }
                    />
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
                            callFilterBy(
                                (e.target as HTMLInputElement).id,
                                (e.target as HTMLInputElement).checked,
                            )
                        }
                    />
                    <label htmlFor="digital">Show Digital Photos</label>
                </div>
            </div>
        </div>
    )
}
