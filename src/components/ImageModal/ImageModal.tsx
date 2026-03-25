import ModalContent from './ModalContent/ModalContent'
import styles from './ImageModal.module.css'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Image } from '~/lib/types'

interface ImageModalProps {
    data: Image
}

export default function ImageModal({ data }: ImageModalProps) {
    const [modalOpen, setModalOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!modalOpen) return

        const appContent = document.getElementById('app-content')
        if (appContent) appContent.inert = true
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModalOpen(false)
                triggerRef.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            if (appContent) appContent.inert = false
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [modalOpen])

    function assignHoverColors() {
        const imageContainers = document.getElementsByClassName(
            styles.imageContainer,
        )
        const root = getComputedStyle(document.documentElement)
        const colors = [
            root.getPropertyValue('--color-accent-red'),
            root.getPropertyValue('--color-accent-orange'),
            root.getPropertyValue('--color-accent-yellow'),
            root.getPropertyValue('--color-accent-lime'),
            root.getPropertyValue('--color-accent-blue'),
            root.getPropertyValue('--color-accent-pink'),
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
                ref={triggerRef}
                className={styles.modalButton}
                onClick={() => setModalOpen(true)}
                aria-label={`View ${data.title} in full size`}
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
                        onClose={() => {
                            setModalOpen(false)
                            triggerRef.current?.focus()
                        }}
                        data={data}
                    />,
                    document.getElementById('modal-root')!,
                )}
        </article>
    )
}
