import Image from 'next/image'
import styles from './ImagePage.module.css'

export default function ImagePage({ data }) {
    return (
        <div className={styles.imagecontainer}>
            <Image
                title={data.title}
                className={styles.image}
                src={data.url}
                alt={data.alt_text}
                width={data.width}
                height={data.height}
                sizes="25vw"
                quality={100}
                style={{
                    width: '100%',
                    height: 'auto',
                }}
            />
            <div className={styles.imageDetails}>
                {data.title && data.location ? (
                    <p className={styles.imageHeader}>
                        {data.title}, {data.location}
                    </p>
                ) : data.title ? (
                    <p className={styles.imageHeader}>{data.title}</p>
                ) : data.location ? (
                    <p className={styles.imageHeader}>{data.location}</p>
                ) : null}
                {data.date_taken ? (
                    <p className={styles.imageDate}>
                        {new Date(data.date_taken).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                ) : null}
                {data.camera ? (
                    <p className={styles.imageDetail}>Camera: {data.camera}</p>
                ) : null}
                {data.film != 'null' ? (
                    <p className={styles.imageDetail}>Film: {data.film}</p>
                ) : null}
            </div>
        </div>
    )
}
