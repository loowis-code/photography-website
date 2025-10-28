import Image from 'next/image'
import styles from './ImagePage.module.css'
import { useEffect } from 'react'

export default function ImagePage({ data }) {

    function initaliseMap() {
        const map = L.map('map', {minZoom: 12, maxZoom: 16}).setView([data.latitude, data.longitude], 14)
        map.dragging.disable()
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map)

        L.marker([
            data.latitude,
            data.longitude,
        ]).addTo(map)
    }
        
    useEffect(() => {
        function tryInitMap() {
            if (
                typeof window !== 'undefined' &&
                window.L !== undefined &&
                document.getElementById('map') &&
                !window._imageMapInitialized
            ) {
                initaliseMap()
                window._imageMapInitialized = true
            }
        }
        const timeout = setTimeout(tryInitMap, 100)
        return () => clearTimeout(timeout)
    }, [])
    

    return (
        <div className={styles.imagecontainer}>
            <Image
                title={data.title}
                className={styles.image}
                src={data.url}
                alt={data.alt_text}
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
                    <p className={styles.imageDetail}>Camera: {data.camera}</p>
                ) : null}
                {data.film != null ? (
                    <p className={styles.imageDetail}>Film: {data.film}</p>
                ) : null}
                            <div id="map" className={styles.map}></div>
            </div>

        </div>
    )
}
