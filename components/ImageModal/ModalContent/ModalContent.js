import Image from 'next/image'
import styles from '../ImageModal.module.css'

export default function ModalContent({ onClose, data}) {

    return (
        <>
            <div className={styles.overlay} onClick={() => onClose()}/>
            <div className={styles.modalContent} id={data.url}>
                    <div className={styles.modalHeader}>
                        <p className={styles.imageTitle}>{data.title}, {data.location}</p>
                        <button className={styles.closeButton} type="button" onClick={() => onClose()}>X</button>
                    </div>

                    <a href={`/images/${data.id}`} className={styles.modalImageLink}>
                        <Image
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${data.url}`}
                            alt={data.alt_text}
                            width="1386"
                            height="919"
                            sizes="50vw"
                            className={styles.modalImage}
                        />
                    </a>

                    <>
                        <p className={styles.imageCamera}>
                            Camera: {data.camera}
                        </p>
                        {data.film != 'null' ? (
                            <p className={styles.imageFilm}>
                                Film: {data.film}
                            </p>
                        ) : null}
                    </>
                </div>
        </>

    )
}

