import styles from './SortingButtons.module.css'
import type { SortOrder, FilterType } from '~/lib/types'

interface SortingButtonsProps {
    filter: FilterType
    onSortChange: (sort: SortOrder) => void
    onFilterChange: (filter: FilterType) => void
    page?: string
}

export default function SortingButtons({
    filter,
    onSortChange,
    onFilterChange,
    page,
}: SortingButtonsProps) {
    const buttonClass =
        page === 'Collections' ? styles.collButton : styles.button
    const checkboxClass =
        page === 'Collections' ? styles.collCheckbox : styles.checkbox

    const filmChecked = filter === 'all' || filter === 'film'
    const digitalChecked = filter === 'all' || filter === 'digital'

    function handleFilterToggle(type: 'film' | 'digital', checked: boolean) {
        const newFilm = type === 'film' ? checked : filmChecked
        const newDigital = type === 'digital' ? checked : digitalChecked

        if (newFilm && newDigital) onFilterChange('all')
        else if (newFilm) onFilterChange('film')
        else if (newDigital) onFilterChange('digital')
        else onFilterChange('all')
    }

    return (
        <div className={styles.sortingButtons}>
            <button
                type="button"
                className={buttonClass}
                onClick={() => onSortChange('date-asc')}
            >
                Oldest to Newest
            </button>
            <button
                type="button"
                className={buttonClass}
                onClick={() => onSortChange('date-desc')}
            >
                Newest to Oldest
            </button>
            <button
                type="button"
                className={buttonClass}
                onClick={() => onSortChange('title-asc')}
            >
                A - Z
            </button>
            <button
                type="button"
                className={buttonClass}
                onClick={() => onSortChange('title-desc')}
            >
                Z - A
            </button>
            <div className={styles.checkboxes}>
                <div className={checkboxClass}>
                    <input
                        type="checkbox"
                        id="film"
                        checked={filmChecked}
                        onChange={(e) =>
                            handleFilterToggle('film', e.target.checked)
                        }
                    />
                    <label htmlFor="film">Show Film Photos</label>
                </div>

                <div className={checkboxClass}>
                    <input
                        type="checkbox"
                        id="digital"
                        checked={digitalChecked}
                        onChange={(e) =>
                            handleFilterToggle('digital', e.target.checked)
                        }
                    />
                    <label htmlFor="digital">Show Digital Photos</label>
                </div>
            </div>
        </div>
    )
}
