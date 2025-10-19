import { useState, useEffect, useRef } from 'react'
import styles from './PhotoForm.module.css'

export default function PhotoForm({
    mode = 'create',
    initialData = null,
    onSubmit,
}) {
    const [form, setForm] = useState({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        file: null,
        alt_text: initialData?.alt_text ?? '',
        date_taken: initialData?.date_taken ?? '',
        location: initialData?.location ?? '',
        visible: initialData?.visible ?? true,
        featured: initialData?.featured ?? false,
        digital: initialData?.digital ?? true,
        camera: initialData?.camera ?? null,
    })
    const [mapData, setMapData] = useState({
        lat: initialData?.gps_lat ?? null,
        lng: initialData?.gps_long ?? null,
    })
    const [clickLocation, setClickLocation] = useState({
        lat: null,
        lng: null,
    })
    const [imageUrl, setImageUrl] = useState(initialData?.url ?? null)
    const [cameras, setCameras] = useState([
        { camera_id: null, brand: 'None', model: '' },
    ])

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
        if (!initialData) return
        setForm({
            title: initialData.title ?? '',
            description: initialData.description ?? '',
            file: null,
            alt_text: initialData.alt_text ?? '',
            date_taken: initialData.date_taken ?? '',
            location: initialData.location ?? '',
            visible: initialData.visible ?? true,
            featured: initialData.featured ?? false,
            digital: initialData.digital ?? true,
            camera: initialData.camera ?? null,
        })
        setMapData({
            lat: initialData.latitude ?? null,
            lng: initialData.longitude ?? null,
        })
        setImageUrl(initialData.url ?? null)
    }, [initialData])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setForm({ ...form, file: files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleCheckbox = (e) => {
        const { name, checked } = e.target
        setForm({ ...form, [name]: checked })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const data = {
            title: form.title,
            description: form.description,
            alt_text: form.alt_text,
            date: form.date_taken,
            location: form.location,
            featured: form.featured,
            digital: form.digital,
            visible: form.visible,
            camera: form.camera,
            gps_lat: clickLocation.lat,
            gps_long: clickLocation.lng,
            url: imageUrl,
        }
        if (form.file) {
            const reader = new window.FileReader()
            await new Promise((resolve) => {
                reader.onload = () => {
                    data.image = reader.result
                    resolve()
                }
                reader.readAsDataURL(form.file)
            })
            const img = new window.Image()
            await new Promise((resolve) => {
                img.onload = () => {
                    data.width = img.width
                    data.height = img.height
                    resolve()
                }
                img.src = data.image
            })
        } else if (imageUrl) {
            data.url = imageUrl
        }
        if (onSubmit) {
            await onSubmit(data)
        }
        if (mode === 'create') {
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
            setImageUrl(null)
            e.target.reset()
        }
    }

    const mapRef = useRef(null)

    useEffect(() => {
        const interval = setInterval(() => {
            const mapDiv = document.getElementById('map')
            if (
                typeof window !== 'undefined' &&
                window.L &&
                mapDiv &&
                !mapRef.current
            ) {
                clearInterval(interval)
                const initialCoords =
                    mapData.lat && mapData.lng
                        ? [mapData.lat, mapData.lng]
                        : [51.505, -0.09]
                mapRef.current = window.L.map('map').setView(initialCoords, 13)
                window.L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    { attribution: '© OpenStreetMap' },
                ).addTo(mapRef.current)

                window.L.popup()
                    .setLatLng(initialCoords)
                    .setContent(
                        mapData.lat && mapData.lng
                            ? `${mapData.lat}, ${mapData.lng}`
                            : 'Click the map to set location',
                    )
                    .openOn(mapRef.current)

                function onMapClick(e) {
                    window.L.popup()
                        .setLatLng(e.latlng)
                        .setContent(e.latlng.toString())
                        .openOn(mapRef.current)
                    setClickLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
                }
                mapRef.current.on('click', onMapClick)

                mapRef.current._cleanup = () => {
                    mapRef.current.off('click', onMapClick)
                    mapRef.current.remove()
                    mapRef.current = null
                }
            }
        }, 50)

        return () => {
            clearInterval(interval)
            if (mapRef.current && mapRef.current._cleanup) {
                mapRef.current._cleanup()
            }
        }
    }, [mapData])

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
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
                    value={form.camera || ''}
                    onChange={handleChange}
                    className={styles.input}
                >
                    {(cameras.length
                        ? cameras
                        : [{ camera_id: null, brand: 'None', model: '' }]
                    ).map((camera) => (
                        <option
                            key={
                                camera.camera_id || camera.brand + camera.model
                            }
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
                    onChange={handleCheckbox}
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
                    onChange={handleCheckbox}
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
                    onChange={handleCheckbox}
                    className={styles.checkbox}
                />
            </div>
            {mode === 'edit' && imageUrl && (
                <div>
                    <img
                        src={imageUrl}
                        alt="Current Image"
                        className={styles.currentImage}
                    />
                </div>
            )}
            <div>
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
                    {...(mode === 'create' ? { required: true } : {})}
                />
            </div>
            <div id="map" className={styles.map}></div>
            <button type="submit" className={styles.button}>
                {mode === 'edit' ? 'Update' : 'Upload'}
            </button>
        </form>
    )
}
