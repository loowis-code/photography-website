import styles from './Pagination.module.css'
import { Button } from 'loowis-component-library'

export default function Pagination({ setCurrentPage, displayPage, maxPage }) {
    return (
        <div className={styles.pagination}>
            <Button
                buttonText="Previous Page"
                clickHandler={() => {
                    setCurrentPage((prevPage) => prevPage - 1)
                }}
                disabled={displayPage === 1}
            />
            <p className={styles.pageInfo}>
                Page {displayPage} of {maxPage}
            </p>
            <Button
                buttonText="Next Page"
                clickHandler={() => {
                    setCurrentPage((prevPage) => prevPage + 1)
                }}
                disabled={displayPage === maxPage || maxPage < 1}
            />
        </div>
    )
}
