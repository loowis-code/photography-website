import { type ErrorComponentProps } from '@tanstack/react-router'
import styles from './ErrorFallback.module.css'

export default function ErrorFallback({ error, reset }: ErrorComponentProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Something went wrong</h1>
            <p className={styles.message}>
                {error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'}
            </p>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.retryButton}
                    onClick={reset}
                >
                    Try again
                </button>
                <a href="/" className={styles.homeLink}>
                    Go home
                </a>
            </div>
        </div>
    )
}
