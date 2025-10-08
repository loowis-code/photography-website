import { useEffect, useState } from "react";
import Layout from '../../../../components/Layout'
import styles from './image.module.css'
import { useRouter } from 'next/router'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'

export default function EditImage() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        file: null,
        alt_text: "",
        date_taken: "",
        location: "",
        visible: true,
        featured: false,
        digital: true,
    });
    const [mapData, setMapData] = useState({lat: null, lng: null});
    const [imageUrl, setImageUrl] = useState('');
    const [id, setId] = useState(null);
    const router = useRouter()

    const getImageData = async (id) => {
        const res = await fetch(`/api/admin/read/image/${id}`);
        const data = await res.json();
        setForm({
            title: data.title || "",
            description: data.description || "",
            file: null,
            alt_text: data.alt_text || "",
            date_taken: data.date_taken ? data.date_taken.split('T')[0] : "",
            location: data.location || "",
            visible: data.visible,
            featured: data.featured,
            digital: data.digital,
        });
        setMapData({lat: data.latitude, lng: data.longitude});
        setImageUrl(data.url);
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setForm({ ...form, file: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {}
        data.title = form.title;
        data.description = form.description;
        data.alt_text = form.alt_text;
        data.date = form.date_taken;
        data.location = form.location;
        data.featured = form.featured;
        data.digital = form.digital;
        data.visible = form.visible;
        data.gps_lat = mapData.lat;
        data.gps_long = mapData.lng;
        data.url = imageUrl;
        if (form.file) {
            const reader = new FileReader();
            await new Promise((resolve) => {
                reader.onload = () => {
                    data.image = reader.result;
                    resolve();
                };
                reader.readAsDataURL(form.file);
            });
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = () => {
                    data.width = img.width;
                    data.height = img.height;
                    resolve();
                };
                img.src = data.image;
            });
        }
        const res = await fetch(`/api/admin/update/image/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await res.json();
        setImageUrl(result[0].url);

        alert('Image updated successfully!');
    };

    useEffect(() => {
        if (!router.isReady) return;
        const { id } = router.query;
        setId(id);
        getImageData(id);
    }, [router]); 

        useEffect(() => {
        var map
        setTimeout(() => {
            if (typeof window !== "undefined" && window.L && map == undefined) {
                var popup = window.L.popup();
                function onMapClick(e) {
                    popup
                    .setLatLng(e.latlng)
                    .setContent(e.latlng.toString())
                    .openOn(map);
                    setMapData({lat: e.latlng.lat, lng: e.latlng.lng});
                }
                map = window.L.map('map').setView([51.505, -0.09], 13);
                window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap',
                }).addTo(map)
                map.on('click', onMapClick);
            }
        }, 1000);
    }, [])

    return (
        <Layout>
        <section className={styles.container}>
            <h1>Edit Image</h1>
            <AdminNavbar />
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Alt Text:
                        <textarea
                            name="alt_text"
                            value={form.alt_text}
                            onChange={handleChange}
                            rows={3}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Date Taken:
                        <input
                            type="date"
                            name="date_taken"
                            value={form.date_taken}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Location:
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Visible:
                        <input
                            type="checkbox"
                            name="visible"
                            checked={form.visible}
                            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Featured:
                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Digital:
                        <input
                            type="checkbox"
                            name="digital"
                            checked={form.digital}
                            onChange={(e) => setForm({ ...form, digital: e.target.checked })}
                        />
                    </label>
                </div>
                <div>
                    <img src={imageUrl} alt="Current Image" className={styles.currentImage} />
                    <label>
                        Image File:
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div id="map" className={styles.map}></div>
                <button type="submit">Upload</button>
            </form>
        </section>
        </Layout>
    );
}