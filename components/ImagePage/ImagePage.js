import Image from 'next/image'
import styles from './ImagePage.module.css'
import { useEffect } from 'react'

export default function ImagePage({ data }) {
    function initaliseMap() {
        if (data.gps_lat != null && data.gps_long != null) {
            var map = L.map('map', { zoomControl: false }).setView(
                [data.gps_lat, data.gps_long],
                13,
            )
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
            }).addTo(map)

            var marker = L.marker([data.gps_lat, data.gps_long]).addTo(map)
            marker.bindPopup(
                '<a href=/images/' + data.id + '>' + data.title + '</a>',
            )
        } else {
            const map = document.getElementById('map')
            map.style.display = 'none'
        }
    }

    useEffect(() => {
        initaliseMap()
    }, [])

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
                {data.title && data.location ? (
                    <p className={styles.imageTitle}>
                        {data.title}, {data.location}
                    </p>
                ) : data.title ? (
                    <p className={styles.imageTitle}>{data.title}</p>
                ) : data.location ? (
                    <p className={styles.imageLocation}>{data.location}</p>
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
                <div id="map" className={styles.map}></div>
            </div>
        </div>
    )
}
