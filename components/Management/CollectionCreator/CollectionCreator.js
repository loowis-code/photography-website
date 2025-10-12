import styles from './CollectionCreator.module.css'

export default function CollectionCreator() {
    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            name: event.target.name.value,
            subtitle: event.target.subtitle.value,
            cover_url: event.target.cover_url.value,
            description: event.target.description.value,
            digital: event.target.digital.checked,
        }

        const endpoint = '/api/management/create/collection'

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        const response = await fetch(endpoint, options)
        await response.json()
        if (confirm('Collection created successfully!')) {
            window.location.href = '/management'
        }
    }

    return (
        <form onSubmit={handleSubmit} method="post" className={styles.form}>
            <div className={styles.formRow}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className={styles.formRow}>
                <label htmlFor="subtitle">Subtitle:</label>
                <input type="text" id="subtitle" name="subtitle" />
            </div>
            <div className={styles.formRow}>
                <label htmlFor="cover_url">Cover URL:</label>
                <input type="text" id="cover_url" name="cover_url" />
            </div>
            <div className={styles.formRow}>
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" name="description" />
            </div>
            <div className={styles.formRow}>
                <label htmlFor="digital">Digital</label>
                <input
                    type="checkbox"
                    role="switch"
                    id="digital"
                    name="digital"
                />
            </div>
            <button className={styles.button} type="submit">
                Submit
            </button>
        </form>
    )
}
