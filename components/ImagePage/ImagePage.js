import Image from 'next/image'
import styles from './ImagePage.module.css'

export default function ImagePage({ data }) {
    return (
        <div className={styles.singleImage}>
            <div className={styles.imagecontainer}>
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${data.url}`}
                    alt={data.title}
                    width="1386"
                    height="919"
                    sizes="100vw"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </div>

            <div className={styles.imageDetails}>
                {data.location ? (
                    <p className={styles.imageTitle}>
                        {data.title}, {data.location}
                    </p>
                ) : null}
                <p className={styles.imageDate}>
                    {new Date(data.date).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
                {data.camera ? (
                    <p className={styles.imageCamera}>Camera: {data.camera}</p>
                ) : null}
                {data.film ? (
                    <p className={styles.imageFilm}>Film: {data.film}</p>
                ) : null}
            </div>
        </div>
    )
}
