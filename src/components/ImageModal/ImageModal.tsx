import ModalContent from './ModalContent/ModalContent'
import styles from './ImageModal.module.css'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Image } from '~/lib/types'

interface ImageModalProps {
    data: Image
}

export default function ImageModal({ data }: ImageModalProps) {
    const [modalOpen, setModalOpen] = useState(false)

    function assignHoverColors() {
        const imageContainers = document.getElementsByClassName(
            styles.imageContainer,
        )
        const colors = [
            '#d95d5d',
            '#db8525',
            '#e8c43c',
            '#bed649',
            '#9ecbdb',
            '#c771a1',
        ]

        Array.from(imageContainers).forEach((container) => {
            const randomColor =
                colors[Math.floor(Math.random() * colors.length)]
            ;(container as HTMLElement).style.backgroundColor = randomColor
            ;(container as HTMLElement).style.color = randomColor
        })
    }

    useEffect(() => {
        assignHoverColors()
    }, [])

    return (
        <article className={styles.imageContainer}>
            <a className={styles.mobileLink} href={`/images/${data.image_id}`}>
                <img
                    src={data.url}
                    alt={data.alt_text ?? ''}
                    width={data.width}
                    height={data.height}
                    className={styles.image}
                />
                <h5 className={styles.thumbnailTitle}>{data.title}</h5>
            </a>
            <button
                className={styles.modalButton}
                onClick={() => setModalOpen(true)}
            >
                <img
                    src={data.url}
                    alt={data.alt_text ?? ''}
                    width={data.width}
                    height={data.height}
                    className={styles.image}
                />
                <h5 className={styles.thumbnailTitle}>{data.title}</h5>
            </button>
            {modalOpen &&
                createPortal(
                    <ModalContent
                        onClose={() => setModalOpen(false)}
                        data={data}
                    />,
                    document.getElementById('modal-root')!,
                )}
        </article>
    )
}
