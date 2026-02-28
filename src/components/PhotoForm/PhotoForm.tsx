import { useState, useEffect, useRef } from 'react'
import styles from './PhotoForm.module.css'
import { useNavigate } from '@tanstack/react-router'
import { getCameras, getFilms } from '~/lib/server/reference'
import { useFormFeedback } from '~/hooks/useFormFeedback'
import type { Camera, Film } from '~/lib/types'
import type L from 'leaflet'

interface PhotoFormProps {
    mode?: 'create' | 'edit'
    initialData?: Record<string, unknown> | null
    onSubmit?: (data: Record<string, unknown>) => Promise<void>
}

export default function PhotoForm({
    mode = 'create',
    initialData = null,
    onSubmit,
}: PhotoFormProps) {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: (initialData?.title as string) ?? '',
        description: (initialData?.description as string) ?? '',
        file: null as File | null,
        alt_text: (initialData?.alt_text as string) ?? '',
        date_taken: (initialData?.date_taken as string) ?? '',
        location: (initialData?.location as string) ?? '',
        visible: (initialData?.visible as boolean) ?? true,
        featured: (initialData?.featured as boolean) ?? false,
        digital: (initialData?.digital as boolean) ?? true,
        camera: (initialData?.camera as number | string | null) ?? null,
        film: (initialData?.film as number | string | null) ?? null,
    })
    const [mapData, setMapData] = useState({
        lat:
            ((initialData?.gps_lat ?? initialData?.latitude) as
                | number
                | null) ?? null,
        lng:
            ((initialData?.gps_long ?? initialData?.longitude) as
                | number
                | null) ?? null,
    })
    const [clickLocation, setClickLocation] = useState({
        lat: null as number | null,
        lng: null as number | null,
    })
    const [imageUrl, setImageUrl] = useState(
        (initialData?.url as string | null) ?? null,
    )
    const [cameras, setCameras] = useState<Camera[]>([
        { camera_id: 0, brand: '', model: '' },
    ])
    const [films, setFilms] = useState<Film[]>([
        { film_id: 0, brand: '', name: '' },
    ])

    useEffect(() => {
        getCameras().then((data) =>
            setCameras([{ camera_id: 0, brand: '', model: '' }, ...data]),
        )
        getFilms().then((data) =>
            setFilms([{ film_id: 0, brand: '', name: '' }, ...data]),
        )
    }, [])

    useEffect(() => {
        if (!initialData) return
        setForm({
            title: (initialData.title as string) ?? '',
            description: (initialData.description as string) ?? '',
            file: null,
            alt_text: (initialData.alt_text as string) ?? '',
            date_taken: (initialData.date_taken as string) ?? '',
            location: (initialData.location as string) ?? '',
            visible: (initialData.visible as boolean) ?? true,
            featured: (initialData.featured as boolean) ?? false,
            digital: (initialData.digital as boolean) ?? true,
            camera: (initialData.camera as number | string | null) ?? null,
            film: (initialData.film as number | string | null) ?? null,
        })
        setMapData({
            lat:
                ((initialData.latitude ?? initialData.gps_lat) as
                    | number
                    | null) ?? null,
            lng:
                ((initialData.longitude ?? initialData.gps_long) as
                    | number
                    | null) ?? null,
        })
        setImageUrl((initialData.url as string | null) ?? null)
    }, [initialData])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const target = e.target as HTMLInputElement
        const { name, value } = target
        if (name === 'image' && target.files) {
            setForm({ ...form, file: target.files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setForm({ ...form, [name]: checked })
    }

    const {
        feedback,
        isSubmitting,
        handleSubmit: wrapSubmit,
    } = useFormFeedback()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await wrapSubmit(async () => {
            const data: Record<string, unknown> = {
                title: form.title,
                description: form.description,
                alt_text: form.alt_text,
                date: form.date_taken,
                location: form.location,
                featured: form.featured,
                digital: form.digital,
                visible: form.visible,
                camera: form.camera,
                film: form.film,
                gps_lat: clickLocation.lat ?? mapData.lat,
                gps_long: clickLocation.lng ?? mapData.lng,
                url: imageUrl,
            }
            if (form.file) {
                const reader = new window.FileReader()
                await new Promise<void>((resolve) => {
                    reader.onload = () => {
                        data.image = reader.result
                        resolve()
                    }
                    reader.readAsDataURL(form.file!)
                })
                const img = new window.Image()
                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        data.width = img.width
                        data.height = img.height
                        resolve()
                    }
                    img.src = data.image as string
                })
            } else if (imageUrl) {
                data.url = imageUrl
            }
            if (onSubmit) {
                await onSubmit(data)
            }
            if (mode === 'create') {
                navigate({ to: '/admin' })
            }
        })
    }

    const mapRef = useRef<L.Map | null>(null)

    useEffect(() => {
        let cancelled = false

        import('leaflet').then((leaflet) => {
            if (cancelled) return
            const mapDiv = document.getElementById('map')
            if (!mapDiv || mapRef.current) return

            const initialCoords: [number, number] =
                mapData.lat && mapData.lng
                    ? [mapData.lat, mapData.lng]
                    : [51.505, -0.09]
            mapRef.current = leaflet.map('map').setView(initialCoords, 13)
            leaflet
                .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap',
                })
                .addTo(mapRef.current)

            leaflet
                .popup()
                .setLatLng(initialCoords)
                .setContent(
                    mapData.lat && mapData.lng
                        ? `${mapData.lat}, ${mapData.lng}`
                        : 'Click the map to set location',
                )
                .openOn(mapRef.current)

            function onMapClick(e: L.LeafletMouseEvent) {
                leaflet
                    .popup()
                    .setLatLng(e.latlng)
                    .setContent(e.latlng.toString())
                    .openOn(mapRef.current!)
                setClickLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
            }
            mapRef.current.on('click', onMapClick)
        })

        return () => {
            cancelled = true
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
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
                    value={String(form.camera ?? '')}
                    onChange={handleChange}
                    className={styles.input}
                >
                    {cameras.map((camera) => (
                        <option key={camera.camera_id} value={camera.camera_id}>
                            {camera.brand + ' ' + camera.model}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className={styles.label} htmlFor="film">
                    Film:
                </label>
                <select
                    id="film"
                    name="film"
                    aria-label="Select film"
                    value={String(form.film ?? '')}
                    onChange={handleChange}
                    className={styles.input}
                >
                    {films.map((film) => (
                        <option key={film.film_id} value={film.film_id}>
                            {film.brand + ' ' + film.name}
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
            {feedback.message && (
                <div
                    className={
                        feedback.type === 'success'
                            ? styles.feedbackSuccess
                            : styles.feedbackError
                    }
                    role={feedback.type === 'error' ? 'alert' : 'status'}
                >
                    {feedback.message}
                </div>
            )}
            <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? 'Saving...'
                    : mode === 'edit'
                      ? 'Update'
                      : 'Upload'}
            </button>
        </form>
    )
}
