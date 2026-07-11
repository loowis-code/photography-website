import { Link } from '@tanstack/react-router'
import styles from './CollectionPreview.module.css'
import { getResizedImageUrl } from '~/lib/images'

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
                search={{ page: 1, sort: 'date-desc', filter: 'all' }}
            >
                <img
                    src={getResizedImageUrl(cover_url, 'thumbnail')}
                    alt={name}
                    width={width}
                    height={height}
                    loading="lazy"
                    decoding="async"
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
