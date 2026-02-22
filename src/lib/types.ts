export interface Image {
    image_id: number
    url: string
    width: number
    height: number
    title: string
    description: string | null
    alt_text: string | null
    date_taken: string | null
    location: string | null
    visible: boolean
    featured: boolean
    digital: boolean
    latitude: number | null
    longitude: number | null
    film: string | number | null
    camera: string | number | null
    created_at?: string
}

export interface Collection {
    collection_id: number
    collection_name: string
    cover_url: string
    width: number
    height: number
    collection_description: string | null
}

export interface Camera {
    camera_id: number
    brand: string
    model: string
}

export interface Film {
    film_id: number
    brand: string
    name: string
    type?: string
}

export interface CollectionWithImages extends Collection {
    images: number[]
    allImages?: Image[]
}
