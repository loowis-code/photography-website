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
                    ]).addTo(map!)
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
