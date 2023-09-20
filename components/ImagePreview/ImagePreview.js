import Link from 'next/link'
import Image from 'next/image'
import styles from './ImagePreview.module.css'

export default function ImagePreview({ title, filename, id }) {
    return (
        <div className={styles.photocontainer}>
            <Link className={styles.photopreview} href={`/images/${id}`}>
                <div className={styles.photo}>
                    <Image
                        src={`https://photography-website.s3.eu-west-2.amazonaws.com/images/${filename}`}
                        alt={title}
                        width="1200"
                        height="1200"
                        layout="responsive"
                    />
                    <h5 className="card-title">{title}</h5>
                </div>
            </Link>
        </div>
    )
}
