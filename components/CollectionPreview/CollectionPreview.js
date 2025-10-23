import Link from 'next/link'
import Image from 'next/image'
import styles from './CollectionPreview.module.css'

export default function CollectionPreview({
    name,
    cover_url,
    id,
    width,
    height,
}) {
    return (
        <div className={styles.collectioncontainer}>
            <Link
                className={styles.collectionpreview}
                href={`/collection/${id}`}
            >
                <Image
                    src={cover_url}
                    alt={name}
                    width={width}
                    height={height}
                    style={{
                        width: '100%',
                        height: 'auto',
                    }}
                />
                <h5 className={styles.title}>{name}</h5>
            </Link>
        </div>
    )
}
