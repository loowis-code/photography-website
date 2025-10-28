import Image from 'next/image'
import styles from '../ImageModal.module.css'

export default function ModalContent({ onClose, data }) {
    return (
        <>
            <div className={styles.overlay} onClick={() => onClose()} />
            <div className={styles.modalContent} id={data.url}>
                <div className={styles.modalHeader}>
                    <p className={styles.imageTitle}>
                        {data.title}, {data.location}
                    </p>
                    <button
                        className={styles.closeButton}
                        type="button"
                        onClick={() => onClose()}
                    >
                        X
                    </button>
                </div>

                <a
                    href={`/images/${data.image_id}`}
                    className={styles.modalImageLink}
                >
                    <Image
                        src={data.url}
                        alt={data.alt_text}
                        width={data.width}
                        height={data.height}
                        className={styles.modalImage}
                    />
                </a>

                <div className={styles.imageDetails}>
                    {data.camera != null ? (
                        <p> Camera: {data.camera}</p>
                    ) : null}
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
