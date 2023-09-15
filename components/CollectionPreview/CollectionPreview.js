import Link from 'next/link'
import Image from 'next/image'
import styles from './CollectionPreview.module.css'

export default function CollectionPreview({ name, cover_image, id }) {
    return (
        <div className={styles.collectioncontainer}>
            <Link
                className={styles.collectionpreview}
                href={`/collection/${id}`}
            >
                <Image
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/${cover_image}`}
                    alt={name}
                    width="1386"
                    height="919"
                    layout="responsive"
                />
                <h5 className={styles.title}>{name}</h5>
            </Link>
        </div>
    )
}
