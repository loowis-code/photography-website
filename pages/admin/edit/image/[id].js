import { use, useEffect, useState } from 'react'
import Layout from '../../../../components/Layout'
import styles from './image.module.css'
import { useRouter } from 'next/router'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'

export default function EditImage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        file: null,
        alt_text: '',
        date_taken: '',
        location: '',
        camera: null,
        visible: true,
        featured: false,
        digital: true,
    })
    const [mapData, setMapData] = useState({ lat: null, lng: null })
    const [imageUrl, setImageUrl] = useState(null)
    const [cameras, setCameras] = useState([
        { camera_id: null, brand: 'None', model: '' },
    ])
    const [id, setId] = useState(null)
    const router = useRouter()

    const getImageData = async (id) => {
        const res = await fetch(`/api/admin/read/image/${id}`)
        const data = await res.json()
        setForm({
            title: data.title || '',
            description: data.description || '',
            file: null,
            alt_text: data.alt_text || '',
            date_taken: data.date_taken ? data.date_taken.split('T')[0] : '',
            location: data.location || '',
            camera: data.camera || null,
            visible: data.visible,
            featured: data.featured,
            digital: data.digital,
        })
        setMapData({ lat: data.latitude, lng: data.longitude })
        setImageUrl(data.url)
    }

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
        data.url = imageUrl
        if (form.file) {
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
        }
        const res = await fetch(`/api/admin/update/image/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        const result = await res.json()
        setImageUrl(result[0].url)

        alert('Image updated successfully!')
    }

    useEffect(() => {
        if (!router.isReady) return
        const { id } = router.query
        setId(id)
        getImageData(id)
    }, [router])

    const getCameraData = async () => {
        const res = await fetch('/api/admin/read/cameras')
        const cameraData = await res.json()
        setCameras(
            [{ camera_id: null, brand: 'None', model: '' }].concat(cameraData),
        )
    }

    useEffect(() => {
        getCameraData()
    }, [])

    useEffect(() => {
        var map
        if (typeof window !== 'undefined' && window.L && !map) {
                var popup = window.L.popup()
                function onMapClick(e) {
                    popup
                        .setLatLng(e.latlng)
                        .setContent(e.latlng.toString())
                        .openOn(map)
                    setMapData({ lat: e.latlng.lat, lng: e.latlng.lng })
                }
                map = window.L.map('map').setView(mapData.lat && mapData.lng ? [mapData.lat, mapData.lng] : [51.505, -0.09], 13)
                window.L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '© OpenStreetMap',
                    },
                ).addTo(map)
                popup
                    .setLatLng(mapData.lat && mapData.lng ? [mapData.lat, mapData.lng] : [51.505, -0.09])
                    .setContent(mapData.lat && mapData.lng ? `${mapData.lat}, ${mapData.lng}` : 'Click the map to set location')
                    .openOn(map)
                map.on('click', onMapClick)
            }

        return () => {
            if (map) {
                map.off()
                map.remove()
            }
        }
    }, [mapData])

    return (
        <Layout>
            <section className={styles.container}>
                <h1 className={styles.heading}>Edit Image</h1>
                <AdminNavbar />
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div>
                        <label className={styles.label} htmlFor="title">
                            Title:
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="description">
                            Description:
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="alt_text">
                            Alt Text:
                        </label>
                        <textarea
                            name="alt_text"
                            id="alt_text"
                            value={form.alt_text}
                            onChange={handleChange}
                            rows={3}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="date_taken">
                            Date Taken:
                        </label>
                        <input
                            type="date"
                            name="date_taken"
                            id="date_taken"
                            value={form.date_taken}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="location">
                            Location:
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            value={form.location}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="camera">
                            Camera:
                        </label>
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
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="visible">
                            Visible:
                        </label>
                        <input
                            type="checkbox"
                            name="visible"
                            id="visible"
                            checked={form.visible}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    visible: e.target.checked,
                                })
                            }
                            className={styles.checkbox}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="featured">
                            Featured:
                        </label>
                        <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            checked={form.featured}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    featured: e.target.checked,
                                })
                            }
                            className={styles.checkbox}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="digital">
                            Digital:
                        </label>
                        <input
                            type="checkbox"
                            name="digital"
                            id="digital"
                            checked={form.digital}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    digital: e.target.checked,
                                })
                            }
                            className={styles.checkbox}
                        />
                    </div>
                    <div>
                        <img
                            src={imageUrl}
                            alt="Current Image"
                            className={styles.currentImage}
                        />
                        <label className={styles.label} htmlFor="image">
                            Image File:
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleChange}
                            className={styles.fileInput}
                        />
                    </div>
                    <div id="map" className={styles.map}></div>
                    <button type="submit" className={styles.button}>
                        Submit
                    </button>
                </form>
            </section>
        </Layout>
    )
}
