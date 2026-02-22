import styles from './ImagePage.module.css'
import { useEffect } from 'react'
import type { Image } from '~/lib/types'

interface ImagePageProps {
    data: Image
}

export default function ImagePage({ data }: ImagePageProps) {
    useEffect(() => {
        if (!data.latitude || !data.longitude) return

        let map: L.Map | null = null

        import('leaflet').then((L) => {
            const mapEl = document.getElementById('map')
            if (!mapEl) return

            // Fix default marker icons broken by Vite bundling
            delete (L.Icon.Default.prototype as any)._getIconUrl
            L.Icon.Default.mergeOptions({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            })

            map = L.map('map', { minZoom: 12, maxZoom: 16 }).setView(
                [data.latitude!, data.longitude!],
                14,
            )
            map.dragging.disable()
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
            }).addTo(map)
            L.marker([data.latitude!, data.longitude!]).addTo(map)
        })

        return () => {
            if (map) map.remove()
        }
    }, [data.latitude, data.longitude])

    return (
        <div className={styles.imagecontainer}>
            <img
                title={data.title}
                className={styles.image}
                src={data.url}
                alt={data.alt_text ?? ''}
                width={data.width}
                height={data.height}
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
                    <p className={styles.imageDetail}>
                        Camera: {data.camera}
                    </p>
                ) : null}
                {data.film != null ? (
                    <p className={styles.imageDetail}>Film: {data.film}</p>
                ) : null}
                {data.latitude && data.longitude && (
                    <div id="map" className={styles.map}></div>
                )}
            </div>
        </div>
    )
}
