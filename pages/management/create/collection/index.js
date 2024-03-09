import Layout from '../../../../components/Layout'

function AddNewCollection() {
    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            name: event.target.name.value,
            subtitle: event.target.subtitle.value,
            cover_url: event.target.cover_url.value,
            description: event.target.description.value,
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
        <Layout>
            <form onSubmit={handleSubmit} method="post" className="px-5">
                <label htmlFor="name" className="form-label">
                    Name:
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
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

                <label htmlFor="cover_url" className="form-label">
                    Cover URL:
                </label>
                <input
                    type="text"
                    id="cover_url"
                    name="cover_url"
                    className="form-control"
                />

                <label htmlFor="description" className="form-label">
                    Description:
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-control"
                />

                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
            </form>
        </Layout>
    )
}

export default AddNewCollection
