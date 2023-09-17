import Image from 'next/image'
import styles from './PhotoBody.module.css'

export default function PhotoBody({ data, id }) {

    return (
        <div className={styles.singleImage}>
            <div className={styles.imagecontainer}>
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
                    alt={data.title}
                    width="1386"
                    height="919"
                    layout="responsive"
                />
            </div>

            <div className={styles.imageDetails}>
                {data.photo_data.location ? (
                    <p className={styles.imageTitle}>
                        {data.title}, {data.photo_data.location}
                    </p>
                ) : null}
                <p className={styles.imageDate}>
                    {new Date(
                        data.photo_data.date_taken,
                    ).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
                {data.photo_data.camera ? (
                <p className={styles.imageCamera}>Camera: {data.photo_data.camera}</p>
                ) : null}
                {data.photo_data.film ? (
                    <p className={styles.imageFilm}>Film: {data.photo_data.film}</p>
                ) : null}
            </div>
        </div>
    )
}
