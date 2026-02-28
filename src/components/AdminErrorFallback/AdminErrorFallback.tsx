import { type ErrorComponentProps } from '@tanstack/react-router'
import styles from './AdminErrorFallback.module.css'

export default function AdminErrorFallback({
    error,
    reset,
}: ErrorComponentProps) {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Admin Error</h1>
            <p className={styles.message}>
                {error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred'}
            </p>
            {import.meta.env.DEV && error instanceof Error && error.stack && (
                <pre className={styles.stack}>{error.stack}</pre>
            )}
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.retryButton}
                    onClick={reset}
                >
                    Try again
                </button>
                <a href="/admin" className={styles.homeLink}>
                    Back to dashboard
                </a>
            </div>
        </div>
    )
}
