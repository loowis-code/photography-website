import { useEffect, useState } from 'react'
import Layout from '../../../../components/Layout'
import styles from './image.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'

export default function NewImage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        file: null,
        alt_text: '',
        date_taken: '',
        location: '',
        visible: true,
        featured: false,
        digital: true,
        camera: null,
    })
    const [cameras, setCameras] = useState([
        { camera_id: null, brand: 'None', model: '' },
    ])

    const [mapData, setMapData] = useState({ lat: null, lng: null })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setForm({ ...form, file: files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {}
        data.title = form.title
        data.description = form.description
        data.alt_text = form.alt_text
        data.date = form.date_taken
        data.location = form.location
        data.featured = form.featured
        data.digital = form.digital
        data.visible = form.visible
        data.camera = form.camera
        data.gps_lat = mapData.lat
        data.gps_long = mapData.lng
        const reader = new FileReader()
        await new Promise((resolve) => {
            reader.onload = () => {
                data.image = reader.result
                resolve()
            }
            reader.readAsDataURL(form.file)
        })
        const img = new Image()
        await new Promise((resolve) => {
            img.onload = () => {
                data.width = img.width
                data.height = img.height
                resolve()
            }
            img.src = data.image
        })

        const res = await fetch('/api/admin/create/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        await res.json()

        setForm({
            title: '',
            description: '',
            file: null,
            alt_text: '',
            date_taken: '',
            location: '',
            visible: true,
            featured: false,
            digital: true,
            camera: null,
        })
        setMapData({ lat: null, lng: null })
        e.target.reset()
        alert('Image uploaded successfully!')
    }

    const getCameraData = async () => {
        const res = await fetch('/api/admin/read/cameras')
        const cameraData = await res.json()
        setCameras(
            [{ camera_id: null, brand: 'None', model: '' }].concat(cameraData),
        )
    }

    useEffect(() => {
        var map
        setTimeout(() => {
            if (typeof window !== 'undefined' && window.L && map == undefined) {
                var popup = window.L.popup()
                function onMapClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent(e.latlng.toString())
                        .openOn(map)
                    setMapData({ lat: e.latlng.lat, lng: e.latlng.lng })
                }
                map = window.L.map('map').setView([55.952011, -3.198303], 13)
                window.L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '© OpenStreetMap',
                    },
                ).addTo(map)
                map.on('click', onMapClick)
            }
        }, 1000)
        getCameraData()
    }, [])

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Upload New Image</h1>
                <AdminNavbar />
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div>
                        <label className={styles.label}>
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Description:
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Alt Text:
                            <textarea
                                name="alt_text"
                                value={form.alt_text}
                                onChange={handleChange}
                                rows={3}
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Date Taken:
                            <input
                                type="date"
                                name="date_taken"
                                value={form.date_taken}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Location:
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Camera:
                            <select
                                id="camera"
                                name="camera"
                                aria-label="Select camera"
                                onChange={handleChange}
                                className={styles.input}
                            >
                                {cameras.map((camera) => (
                                    <option
                                        key={camera.brand + ' ' + camera.model}
                                        value={camera.camera_id}
                                    >
                                        {camera.brand + ' ' + camera.model}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Visible:
                            <input
                                type="checkbox"
                                name="visible"
                                checked={form.visible}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        visible: e.target.checked,
                                    })
                                }
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Featured:
                            <input
                                type="checkbox"
                                name="featured"
                                checked={form.featured}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        featured: e.target.checked,
                                    })
                                }
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Digital:
                            <input
                                type="checkbox"
                                name="digital"
                                checked={form.digital}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        digital: e.target.checked,
                                    })
                                }
                                className={styles.checkbox}
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.label}>
                            Image File:
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/jpeg, image/png, image/webp"
                                required
                                onChange={handleChange}
                                className={styles.fileInput}
                            />
                        </label>
                    </div>
                    <div id="map" className={styles.map}></div>
                    <button type="submit" className={styles.button}>
                        Upload
                    </button>
                </form>
            </section>
        </Layout>
    )
}
