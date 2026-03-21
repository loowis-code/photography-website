import { useEffect, useRef } from 'react'
import styles from '../ImageModal.module.css'
import type { Image } from '~/lib/types'

interface ModalContentProps {
    onClose: () => void
    data: Image
}

export default function ModalContent({ onClose, data }: ModalContentProps) {
    const closeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        closeRef.current?.focus()
    }, [])

    return (
        <>
            <div
                className={styles.overlay}
                onClick={() => onClose()}
                aria-hidden="true"
            />
            <div
                className={styles.modalContent}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${data.image_id}`}
            >
                <div className={styles.modalHeader}>
                    <p
                        className={styles.imageTitle}
                        id={`modal-title-${data.image_id}`}
                    >
                        {data.title}, {data.location}
                    </p>
                    <button
                        ref={closeRef}
                        className={styles.closeButton}
                        type="button"
                        onClick={() => onClose()}
                        aria-label="Close modal"
                    >
                        X
                    </button>
                </div>

                <a
                    href={`/images/${data.image_id}`}
                    className={styles.modalImageLink}
                >
                    <img
                        src={data.url}
                        alt={data.alt_text ?? ''}
                        width={data.width}
                        height={data.height}
                        className={styles.modalImage}
                    />
                </a>

                <div className={styles.imageDetails}>
                    {data.camera != null ? <p> Camera: {data.camera}</p> : null}
                    {data.film != null ? <p>Film: {data.film}</p> : null}
                    {data.date_taken ? (
                        <p>
                            {new Date(data.date_taken).toLocaleDateString(
                                'en-GB',
                                {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </p>
                    ) : null}
                </div>
            </div>
        </>
    )
}
