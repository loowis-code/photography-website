import Image from 'next/image'
import styles from './PhotoModal.module.css'
import PhotoModalBody from '../PhotoModalBody'

export default function PhotoModal({id, maxID}) {

    const data = {
        title: 'Train Station',
        filename: 'train_station_19_12_2022.jpg',
        photo_data: {
            camera: 'Olympus OM40',
            film: 'Colorplus 200',
            date_taken: '2022-12-19',
            location: 'Edinburgh',
        }
    }

    function openModal() {
        for (var i = 1; i <= maxID; i++) {
            var otherModals = document.getElementById(i)
            otherModals.style.opacity = 0.4
            otherModals.style.pointerEvents = 'none'
        }
        var modal = document.getElementById(id + 'ModalContent')
        modal.style.pointerEvents = 'auto'
        modal.style.display = 'block'
        modal.style.opacity = 1
    }

    function closeModal() {
        for (var i = 1; i <= maxID; i++) {
            var otherModals = document.getElementById(i)
            otherModals.style.opacity = 1
            otherModals.style.pointerEvents = 'auto'
        }
        var modal = document.getElementById(id + 'ModalContent')
        modal.style.display = 'none'
    }

    return (
        <div className={styles.modal}>
            <div id={id} className={styles.photoPreview}>
                <div className={styles.openModal} onClick={openModal}>
                    <div className={styles.photo}>
                        <Image
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/train_station_19_12_2022.jpg`}
                            alt="Train Station"
                            width="1200"
                            height="1200"
                            layout="responsive"
                        />
                        <h5 className="card-title">Train Station</h5>
                    </div>
                </div>
            </div>
            <div id={id + 'ModalContent'} className={styles.modalContent}>
                <button className={styles.close} onClick={closeModal}>X</button>
                <PhotoModalBody data={data} id={id} key="Train Station"/>
            </div>
        </div>
    )
}
