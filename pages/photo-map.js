import Layout from '../components/Layout'
import styles from './css-modules/photo-map.module.css'
import { useState, useEffect } from 'react'
import Head from 'next/head'

function PhotoMap() {
    useEffect(() => {

        var map = L.map('map').setView([54.304, -4.878], 6);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
        }).addTo(map);

        var marker = L.marker([55.9524,-3.1945]).addTo(map);
        var marker2 = L.marker([51.5098,-0.1226]).addTo(map);

        marker.bindPopup("<a href=/photos/4>Train Station</a>");

        marker2.bindPopup("<a href=/photos/46>Westminster Bridge</a>");

        

    });

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
