import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'

function AddNewPhoto() {
    const [cameraData, setCameraData] = useState([])
    const [filmData, setFilmData] = useState([])

    async function getCameraData() {
        const req = await fetch(`/api/Get/GetCameraData`)
        const newCameraData = await req.json()
        setCameraData(newCameraData)
    }

    async function getFilmData() {
        const req = await fetch(`/api/Get/GetFilmData`)
        const newFilmData = await req.json()
        setFilmData(newFilmData)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const isoDate = new Date(event.target.date.value)
        const isoInt = parseInt(event.target.iso.value)
        const boolFeatured =
            event.target.featured.checked === 'on' ? true : false
        var gpsLat = null
        var gpsLong = null
        if (
            typeof event.target.gps_lat != 'undefined' ||
            typeof event.target.gps_long != 'undefined'
        ) {
            gpsLat = parseFloat(event.target.gps_lat.value)
            gpsLong = parseFloat(event.target.gps_long.value)
        }
        const data = {
            url: event.target.url.value,
            title: event.target.title.value,
            subtitle: event.target.subtitle.value,
            description_long: event.target.description_long.value,
            description_short: event.target.description_short.value,
            alt_text: event.target.alt_text.value,
            camera: event.target.camera.value,
            film: event.target.film.value,
            date: isoDate,
            location: event.target.location.value,
            author: event.target.author.value,
            iso: isoInt,
            aperture: event.target.aperture.value,
            shutter_speed: event.target.shutter_speed.value,
            featured: boolFeatured,
            gps_lat: gpsLat,
            gps_long: gpsLong,
        }

        const endpoint = '/api/Create/AddPhoto'

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const response = await fetch(endpoint, options)
        await response.json()
        if (confirm('Photo created successfully!')) {
            window.location.href = '/ViewExistingPhotos'
        }
    }

    useEffect(() => {
        getCameraData()
        getFilmData()
    }, [])

    return (
        <Layout>
            <form onSubmit={handleSubmit} method="post" className="px-5">
                <label htmlFor="url" className="form-label">
                    URL:
                </label>
                <input
                    type="text"
                    id="url"
                    name="url"
                    className="form-control"
                    required
                />

                <label htmlFor="title" className="form-label">
                    Title:
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    required
                />

                <label htmlFor="subtitle" className="form-label">
                    Subtitle:
                </label>
                <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    className="form-control"
                />

                <label htmlFor="description-long" className="form-label">
                    Description - Long:
                </label>
                <input
                    type="text"
                    id="description_long"
                    name="description_long"
                    className="form-control"
                />

                <label htmlFor="description_short" className="form-label">
                    Description - Short:
                </label>
                <input
                    type="text"
                    id="description_short"
                    name="description_short"
                    className="form-control"
                />

                <label htmlFor="alt_text" className="form-label">
                    Alt Text:
                </label>
                <input
                    type="text"
                    id="alt_text"
                    name="alt_text"
                    className="form-control"
                    required
                />

                <label htmlFor="camera" className="form-label">
                    Camera:
                </label>
                <select
                    id="camera"
                    name="camera"
                    className="form-select"
                    aria-label="Select camera"
                >
                    {cameraData.map((c) => (
                        <option key={c.model} value={c.brand + ' ' + c.model}>
                            {c.brand + ' ' + c.model}
                        </option>
                    ))}
                </select>

                <label htmlFor="film" className="form-label">
                    Film:
                </label>
                <select
                    id="film"
                    name="film"
                    className="form-select"
                    aria-label="Select film"
                >
                    {filmData.map((f) => (
                        <option key={f.name} value={f.name}>
                            {f.brand} {f.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="date" className="form-label">
                    Date:
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    aria-describedby="dateHelp"
                    required
                />

                <label htmlFor="location" className="form-label">
                    Location:
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                />

                <label htmlFor="author" className="form-label">
                    Author:
                </label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    className="form-control"
                    defaultValue="Lewis Inches"
                />

                <label htmlFor="iso" className="form-label">
                    ISO:
                </label>
                <input
                    type="number"
                    id="iso"
                    name="iso"
                    className="form-control"
                    defaultValue={0}
                />

                <label htmlFor="shutter_speed" className="form-label">
                    Shutter Speed:
                </label>
                <input
                    type="text"
                    id="shutter_speed"
                    name="shutter_speed"
                    className="form-control"
                />

                <label htmlFor="aperture" className="form-label">
                    Aperture:
                </label>
                <input
                    type="text"
                    id="aperture"
                    name="aperture"
                    className="form-control"
                />

                <div className="form-check form-switch">
                    <label className="form-check-label" htmlFor="featured">
                        Featured
                    </label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="featured"
                        name="featured"
                    />
                </div>

                <label htmlFor="gps_lat" className="form-label">
                    GPS Latitude:
                </label>
                <input
                    type="number"
                    step={0.00001}
                    id="gps_lat"
                    name="gps_lat"
                    className="form-control"
                />

                <label htmlFor="gps_long" className="form-label">
                    GPS Longitude:
                </label>
                <input
                    type="number"
                    step={0.00001}
                    id="gps_long"
                    name="gps_long"
                    className="form-control"
                />

                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
        </Layout>
    )
}

export default AddNewPhoto
