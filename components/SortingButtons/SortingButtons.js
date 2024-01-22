import styles from './SortingButtons.module.css'

export default function SortingButtons({ SortBy, page }) {
    return (
        <div className={styles.sortingButtons}>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-o-n')}
            >
                Sort By Date (Oldest to Newest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-n-o')}
            >
                Sort By Date (Newest to Oldest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-a-z')}
            >
                Sort By Title (A-Z)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-z-a')}
            >
                Sort By Title (Z-A)
            </button>
        </div>
    )
}
