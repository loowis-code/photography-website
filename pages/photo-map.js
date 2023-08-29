import Layout from '../components/Layout'
import styles from './css-modules/photo-map.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function PhotoMap() {

    function initaliseMap(trimmedPhotoData) {
        var map = L.map('map').setView([54.304, -4.878], 6);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
        }).addTo(map);
        
        for (var i = 0; i < trimmedPhotoData.length; i++) {
            if (trimmedPhotoData[i].lat != undefined && trimmedPhotoData[i].long != undefined) {
                var marker = L.marker([trimmedPhotoData[i].lat, trimmedPhotoData[i].long]).addTo(map);
                marker.bindPopup("<a href=/photos/" + trimmedPhotoData[i].id + ">" + trimmedPhotoData[i].title + "</a>");
            }

        }
    }

    async function getAllPhotos() {
        const req = await fetch('/api/getPhotos')
        const photoData = await req.json()

        var trimmedPhotoData = []
        for (var i = 0; i < photoData.length; i++) {
            if (photoData[i].data.photo_data.GPS_data != null) {
                var gps = photoData[i].data.photo_data.GPS_data
                var lat = gps.split(',')[0]
                var long = gps.split(',')[1]
                trimmedPhotoData.push({
                    lat: lat,
                    long: long,
                    title: photoData[i].data.title,
                    id: photoData[i].data.url_id
                })
            }
        }
        initaliseMap(trimmedPhotoData)
    }



    useEffect(() => {
        getAllPhotos()


    }, []);

    return (
        <Layout>
            <Head>
                <title>Photo Map | Lewis Inches - Photography</title>
            </Head>
            <section className={styles.container}>
                <h1 className={styles.header}>Photo Map</h1>
                <div id="map" className={styles.map}></div>
            </section>
        </Layout>
    )
}

export default PhotoMap
