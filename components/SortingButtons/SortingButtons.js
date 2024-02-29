import styles from './SortingButtons.module.css'
import { SortBy } from '../../helpers/SortBy'

export default function SortingButtons({ photos, setPhotos, setKey,  FilterBy, page }) {
    return (
        <div className={styles.sortingButtons}>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-o-n', photos, setPhotos, setKey)}
            >
                Sort By Date (Oldest to Newest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('date-n-o', photos, setPhotos, setKey) }
            >
                Sort By Date (Newest to Oldest)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-a-z', photos, setPhotos, setKey)}
            >
                Sort By Title (A-Z)
            </button>
            <button
                type="button"
                className={
                    page === 'Collections' ? styles.collButton : styles.button
                }
                onClick={() => SortBy('title-z-a', photos, setPhotos, setKey)}
            >
                Sort By Title (Z-A)
            </button>

            <div className={styles.checkbox}>
                <input type='checkbox' id='film' value='film' checked onChange={(e) => FilterBy(e.target.checked, e.value)}></input>
                <label for="film">Film</label>
            </div>
            
            <div className={styles.checkbox}>
                <input type='checkbox' id='digital' value='digital' checked onChange={(e) => FilterBy(e.target.checked, e.value)}></input>
                <label for="digital">Digital</label>
            </div>
        </div>
    )
}
