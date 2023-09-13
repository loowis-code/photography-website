import Image from 'next/image'
import styles from './PhotoModalBody.module.css'

export default function PhotoModalBody({ data, id }) {

    return (
        <div className={styles.singleImage}>
            <div className={styles.imagecontainer}>
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
                    alt={data.title}
                    width="1386"
                    height="919"
                />
                <div className={styles.imageHeader}>
                    <p className={styles.imagetitle}>
                        {data.photo_data.location ? (
                            <p>
                                {data.title}, {data.photo_data.location}
                            </p>
                        ) : null}
                    </p>
                    <p className={styles.imagedate}>
                        {new Date(
                            data.photo_data.date_taken,
                        ).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                <div className={styles.imageDetails}>
                    <p className={styles.imageCamera}>
                        Camera: {data.photo_data.camera}
                        {data.photo_data.film ? (
                            <p>Film: {data.photo_data.film}</p>
                        ) : null}
                    </p>
                </div>
            </div>
        </div>
    )
}
