import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import Layout from '~/components/Layout/Layout'
import { getAllImages } from '~/lib/server/images'
import styles from '~/styles/pages/image-map.module.css'

export const Route = createFileRoute('/image-map')({
    loader: () => getAllImages(),
    head: () => ({
        meta: [{ title: 'Image Map | Lewis Inches - Photography' }],
    }),
    component: ImageMap,
})

function ImageMap() {
    const data = Route.useLoaderData()

    useEffect(() => {
        let map: L.Map | null = null

        import('leaflet').then((L) => {
            const mapEl = document.getElementById('map')
            if (!mapEl) return

            const icon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })

            if (window.innerWidth < 600) {
                map = L.map('map').setView([54.12, 4.97], 4)
            } else {
                map = L.map('map').setView([54.12, 4.97], 6)
            }
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
            }).addTo(map)

            const markers: L.Marker[] = []
            for (let i = 0; i < data.length; i++) {
                if (
                    data[i].latitude != null &&
                    data[i].longitude != null
                ) {
                    const marker = L.marker([
                        data[i].latitude!,
                        data[i].longitude!,
                    ], { icon }).addTo(map!)
                    markers.push(marker)
                    marker.bindPopup(
                        `<a href="/images/${data[i].image_id}">${data[i].title}</a>`,
                    )
                }
            }
            if (markers.length > 0) {
                const group = L.featureGroup(markers)
                map!.fitBounds(group.getBounds())
            }
        })

        return () => {
            if (map) map.remove()
        }
    }, [data])

    return (
        <Layout>
            <section className={styles.container}>
                <div className={styles.mapContainer}>
                    <div id="map" className={styles.map}></div>
                </div>
            </section>
        </Layout>
    )
}
