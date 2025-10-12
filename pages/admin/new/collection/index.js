import Layout from '../../../../components/Layout'
import styles from './collection.module.css'
import AdminNavbar from '../../../../components/AdminNavbar/AdminNavbar'
import { useState } from 'react'

export default function NewCollection() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        file: null,
    })

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
        data.name = form.name
        data.description = form.description
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

        const res = await fetch('/api/admin/create/collection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        await res.json()

        setForm({
            name: '',
            description: '',
            file: null,
        })
        e.target.reset()
        alert('Collection created successfully!')
    }

    return (
        <Layout>
            <section className={styles.container}>
                <h1>Create New Collection</h1>
                <AdminNavbar />
                <form onSubmit={handleSubmit} method="POST">
                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                name="name"
                                required
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                rows={3}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
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

                    <button type="submit">Create</button>
                </form>
            </section>
        </Layout>
    )
}
