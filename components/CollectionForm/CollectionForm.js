import { useState, useEffect } from 'react'
import styles from './CollectionForm.module.css'

export default function CollectionForm({
    mode = 'create',
    initialData = null,
    onSubmit,
}) {
    const [selectedImages, setSelectedImages] = useState(
        initialData?.images ?? [],
    )
    const [form, setForm] = useState({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        file: null,
    })
    const [imageUrl, setImageUrl] = useState(initialData?.cover_url ?? null)

    useEffect(() => {
        if (!initialData) return
        setForm({
            name: initialData.collection_name ?? '',
            description: initialData.collection_description ?? '',
            file: null,
        })
        setImageUrl(initialData.cover_url ?? null)
    }, [initialData])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'image') {
            setForm({ ...form, file: files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const data = {
            name: form.name,
            description: form.description,
            images: selectedImages,
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
            data.cover_url = imageUrl
        }
        if (onSubmit) {
            await onSubmit(data)
        }
        if (mode === 'create') {
            setForm({
                name: '',
                description: '',
                file: null,
            })
            e.target.reset()
        } else if (mode === 'edit') {
            setForm({
                ...form,
                file: null,
            })
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className={styles.form}>
            <div>
                <label className={styles.label} htmlFor="name">
                    Name:
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={form.name}
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
            {mode === 'edit' && imageUrl && initialData.allImages && (
                <div>
                    <img
                        src={imageUrl}
                        alt="Current Cover"
                        className={styles.currentImage}
                    />
                    <label>
                        Images:
                        <div className={styles.imageGrid}>
                            {initialData.allImages.map((img) => (
                                <div
                                    key={img.image_id}
                                    className={styles.imageItem}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.title}
                                        onClick={() =>
                                            setSelectedImages((prev) => {
                                                if (
                                                    prev &&
                                                    prev.includes(img.image_id)
                                                ) {
                                                    return prev.filter(
                                                        (id) =>
                                                            id !== img.image_id,
                                                    )
                                                }
                                                return [...prev, img.image_id]
                                            })
                                        }
                                        className={
                                            selectedImages &&
                                            selectedImages.includes(
                                                img.image_id,
                                            )
                                                ? styles.selected
                                                : styles.image
                                        }
                                    />
                                    <p>{img.title}</p>
                                </div>
                            ))}
                        </div>
                    </label>
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
            <button type="submit" className={styles.button}>
                {mode === 'edit' ? 'Update' : 'Create'}
            </button>
        </form>
    )
}
