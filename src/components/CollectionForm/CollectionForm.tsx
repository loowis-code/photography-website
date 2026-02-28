import { useState, useEffect } from 'react'
import styles from './CollectionForm.module.css'
import { useFormFeedback } from '~/hooks/useFormFeedback'
import type { Image } from '~/lib/types'

interface CollectionFormProps {
    mode?: 'create' | 'edit'
    initialData?: Record<string, unknown> | null
    onSubmit?: (data: Record<string, unknown>) => Promise<void>
}

export default function CollectionForm({
    mode = 'create',
    initialData = null,
    onSubmit,
}: CollectionFormProps) {
    const [selectedImages, setSelectedImages] = useState<number[]>(
        (initialData?.images as number[]) ?? [],
    )
    const [form, setForm] = useState({
        name: (initialData?.collection_name as string) ?? '',
        description: (initialData?.collection_description as string) ?? '',
        file: null as File | null,
    })
    const [imageUrl, setImageUrl] = useState(
        (initialData?.cover_url as string | null) ?? null,
    )

    useEffect(() => {
        if (!initialData) return
        setForm({
            name: (initialData.collection_name as string) ?? '',
            description: (initialData.collection_description as string) ?? '',
            file: null,
        })
        setImageUrl((initialData.cover_url as string | null) ?? null)
        setSelectedImages((initialData.images as number[]) ?? [])
    }, [initialData])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const target = e.target as HTMLInputElement
        const { name, value } = target
        if (name === 'image' && target.files) {
            setForm({ ...form, file: target.files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const {
        feedback,
        isSubmitting,
        handleSubmit: wrapSubmit,
    } = useFormFeedback()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formElement = e.target as HTMLFormElement
        await wrapSubmit(async () => {
            const data: Record<string, unknown> = {
                name: form.name,
                description: form.description,
                images: selectedImages,
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
                data.cover_url = imageUrl
            }
            if (onSubmit) {
                await onSubmit(data)
            }
            if (mode === 'create') {
                setForm({ name: '', description: '', file: null })
                formElement.reset()
            } else if (mode === 'edit') {
                setForm({ ...form, file: null })
            }
        })
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
            {mode === 'edit' &&
                imageUrl &&
                Array.isArray(initialData?.allImages) && (
                    <div>
                        <img
                            src={imageUrl}
                            alt="Current Cover"
                            className={styles.currentImage}
                        />
                        <label>
                            Images:
                            <div className={styles.imageGrid}>
                                {(initialData.allImages as Image[]).map(
                                    (img) => (
                                        <div
                                            key={img.image_id}
                                            className={styles.imageItem}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.title}
                                                onClick={() =>
                                                    setSelectedImages(
                                                        (prev) => {
                                                            if (
                                                                prev &&
                                                                prev.includes(
                                                                    img.image_id,
                                                                )
                                                            ) {
                                                                return prev.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        img.image_id,
                                                                )
                                                            }
                                                            return [
                                                                ...prev,
                                                                img.image_id,
                                                            ]
                                                        },
                                                    )
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
                                    ),
                                )}
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
                      : 'Create'}
            </button>
        </form>
    )
}
