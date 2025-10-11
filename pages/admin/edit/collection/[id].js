import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'

export default function EditCollection() {
    const [imageUrl, setImageUrl] = useState(null);
    const [form, setForm] = useState({
            name: "",
            description: "",
            file: null,
        });
    const [id, setId] = useState(null);
    const router = useRouter()

    const getCollectionData = async (id) => {
        const res = await fetch(`/api/admin/read/collection/${id}`);
        const data = await res.json();
        console.log(data)
        setForm({
            name: data.collection_name || "",
            description:data.collection_description || "",
            file: null,
        });
        setImageUrl(data.cover_url);
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
        data.name = form.name;
        data.description = form.description;
        data.url = imageUrl; 
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
        const res = await fetch(`/api/admin/update/collection/${id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        const result = await res.json();
        setImageUrl(result[0].cover_url);

        alert('Collection updated successfully!');
    };

    useEffect(() => {
        if (!router.isReady) return;
        const { id } = router.query;
        setId(id);
        getCollectionData(id);
    }, [router]); 

    return (
        <Layout>
        <section className={styles.container}>
            <h1>Edit Collection</h1>
            <AdminNavbar />
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label>
                        Name:
                        <input type="text" name="name" value={form.name} required onChange={handleChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        Description:
                        <textarea name="description" rows={3} value={form.description} onChange={handleChange}/>
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
                            required
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <button type="submit">Update</button>
            </form>
        </section>
        </Layout>
    );
}