import styles from './Pagination.module.css'
import { Button } from 'loowis-component-library'

interface PaginationProps {
    setCurrentPage: (fn: (prev: number) => number) => void
    displayPage: number
    maxPage: number
}

export default function Pagination({
    setCurrentPage,
    displayPage,
    maxPage,
}: PaginationProps) {
    return (
        <div className={styles.pagination}>
            {displayPage > 1 ? (
                <Button
                    buttonText="Previous Page"
                    clickHandler={() => {
                        setCurrentPage((prevPage: number) => prevPage - 1)
                    }}
                />
            ) : (
                <button className={styles.disabledButton} disabled>
                    Previous Page
                </button>
            )}
            <p className={styles.pageInfo}>
                Page {displayPage} of {maxPage}
            </p>
            {displayPage < maxPage && maxPage >= 1 ? (
                <Button
                    buttonText="Next Page"
                    clickHandler={() => {
                        setCurrentPage((prevPage: number) => prevPage + 1)
                    }}
                />
            ) : (
                <button className={styles.disabledButton} disabled>
                    Next Page
                </button>
            )}
        </div>
    )
}
