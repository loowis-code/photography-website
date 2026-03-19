import styles from './Pagination.module.css'
import { Button } from 'loowis-component-library'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    return (
        <div className={styles.pagination}>
            {currentPage > 1 ? (
                <Button
                    buttonText="Previous Page"
                    clickHandler={() => onPageChange(currentPage - 1)}
                />
            ) : (
                <button className={styles.disabledButton} disabled>
                    Previous Page
                </button>
            )}
            <p className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </p>
            {currentPage < totalPages ? (
                <Button
                    buttonText="Next Page"
                    clickHandler={() => onPageChange(currentPage + 1)}
                />
            ) : (
                <button className={styles.disabledButton} disabled>
                    Next Page
                </button>
            )}
        </div>
    )
}
