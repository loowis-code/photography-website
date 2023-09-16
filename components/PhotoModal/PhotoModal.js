import Image from 'next/image'
import styles from './PhotoModal.module.css'

export default function PhotoModal({ data }) {
    return (
        <div>
            <div
                className={styles.photo}
                data-bs-toggle="modal"
                data-bs-target={'#Modal' + data.url_id}
            >
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
                    alt={data.title}
                    width="1386"
                    height="919"
                    layout="responsive"
                />
                <h5 className={styles.thumbnailTitle}>{data.title}</h5>
            </div>

            <div
                className="modal fade"
                id={'Modal' + data.url_id}
                tabindex="-1"
                aria-labelledby={'Modal' + data.title}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div
                        style={{ backgroundColor: '#f4f2de' }}
                        className="modal-content"
                    >
                        <div
                            style={{ paddingBottom: '0' }}
                            className="modal-header"
                        >
                            <p className={styles.imageTitle}>
                                {data.title}, {data.photo_data.location}
                            </p>
                            <button
                                style={{
                                    right: '2%',
                                    top: '2%',
                                    position: 'absolute',
                                }}
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div style={{ padding: '0 1%' }} className="modal-body">
                            <a href={`/photos/${data.url_id}`}>
                                <Image
                                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
                                    alt={data.title}
                                    width="1386"
                                    height="919"
                                    className={styles.image}
                                />
                            </a>
                        </div>
                        <div className="modal-footer">
                            <p className={styles.imageCamera}>
                                Camera: {data.photo_data.camera}
                            </p>
                            <p className={styles.imageFilm}>
                                Film: {data.photo_data.film}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
