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
            <Button
                className={styles.pageButton}
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous Page
            </Button>
            <p className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </p>
            <Button
                className={styles.pageButton}
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next Page
            </Button>
        </div>
    )
}
