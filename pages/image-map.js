import Layout from '../components/Layout'
import styles from './css-modules/image-map.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function ImageMap() {
    function initaliseMap(trimmedPhotoData) {
        var map = L.map('map').setView([54.775, -2.483], 6)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map)

        for (var i = 0; i < trimmedPhotoData.length; i++) {
            if (
                trimmedPhotoData[i].lat != undefined &&
                trimmedPhotoData[i].long != undefined
            ) {
                var marker = L.marker([
                    trimmedPhotoData[i].lat,
                    trimmedPhotoData[i].long,
                ]).addTo(map)
                marker.bindPopup(
                    '<a href=/photos/' +
                        trimmedPhotoData[i].id +
                        '>' +
                        trimmedPhotoData[i].title +
                        '</a>',
                )
            }
        }
    }

    async function getAllPhotos() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()

        var trimmedPhotoData = []
        for (var i = 0; i < photoData.length; i++) {
            if (photoData[i].gps_lat != null) {
                trimmedPhotoData.push({
                    lat: photoData[i].gps_lat,
                    long: photoData[i].gps_long,
                    title: photoData[i].title,
                    id: photoData[i].id,
                })
            }
        }
        initaliseMap(trimmedPhotoData)
    }

    useEffect(() => {
        getAllPhotos()
    }, [])

    return (
        <Layout>
            <Head>
                <title>Image Map | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Image Map</h1>
                <div id="map" className={styles.map}></div>
            </section>
        </Layout>
    )
}

export default ImageMap
