import Image from 'next/image'
import ModalContent from './ModalContent'
import styles from './ImageModal.module.css'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';

export default function ImageModal({ data }) {
    const [modalOpen, setModalOpen] = useState(false);

    function assignHoverColors() {
        let imageContainers = document.getElementsByClassName(styles.imageContainer);
        let colors = ['#d95d5d', '#db8525', '#e8c43c', '#bed649', '#9ecbdb', '#c771a1'];

        Array.from(imageContainers).forEach(container => {
            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            container.style.backgroundColor = randomColor;
            container.style.color = randomColor;
        });
    }

    useEffect(() => {
        assignHoverColors();
    }, []);

    return (
        <article className={styles.imageContainer}>
            <a className={styles.mobileLink} href={`/images/${data.id}`}>
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${data.url}`}
                    alt={data.alt_text}
                    width="1386"
                    height="919"
                    sizes="50vw"
                    className={styles.image}
                />
                <h5 className={styles.thumbnailTitle}>{data.title}</h5>
            </a>
            <button
                className={styles.modalButton}
                onClick={() => setModalOpen(true)}
            >
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${data.url}`}
                    alt={data.alt_text}
                    width="1386"
                    height="919"
                    sizes="50vw"
                    className={styles.image}
                />
                <h5 className={styles.thumbnailTitle}>{data.title}</h5>
            </button>
            {modalOpen && createPortal(
                <ModalContent onClose={() => setModalOpen(false)} data={data}/>,
                document.getElementById('modal-root')
            )}
        </article>
    )
}
