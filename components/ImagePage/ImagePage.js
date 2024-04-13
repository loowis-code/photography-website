import Image from 'next/image'
import styles from './ImagePage.module.css'

export default function ImagePage({ data }) {
    return (
        <div className={styles.imagecontainer}>
            <Image
                src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${data.url}`}
                alt={data.title}
                className={styles.image}
                width="1386"
                height="919"
                sizes="100vw"
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
                {data.date ? (
                    <p className={styles.imageDate}>
                        {new Date(data.date).toLocaleDateString('en-GB', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                ) : null}
                {data.camera ? (
                    <p className={styles.imageDetail}>Camera: {data.camera}</p>
                ) : null}
                {data.film ? (
                    <p className={styles.imageDetail}>Film: {data.film}</p>
                ) : null}
                {data.author != 'Lewis Inches' ? (
                    <p className={styles.imageDetail}>Author: {data.author}</p>
                ) : null}
            </div>
        </div>
    )
}
