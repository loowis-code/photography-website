import { Link } from '@tanstack/react-router'
import styles from './CollectionPreview.module.css'

interface CollectionPreviewProps {
    name: string
    cover_url: string
    id: number
    width: number
    height: number
}

export default function CollectionPreview({
    name,
    cover_url,
    id,
    width,
    height,
}: CollectionPreviewProps) {
    return (
        <div className={styles.collectioncontainer}>
            <Link
                className={styles.collectionpreview}
                to="/collection/$id"
                params={{ id: String(id) }}
            >
                <img
                    src={cover_url}
                    alt={name}
                    width={width}
                    height={height}
                    loading="lazy"
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
