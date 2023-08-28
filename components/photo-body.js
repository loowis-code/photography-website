import Image from 'next/image'
import styles from './css-modules/photo-body.module.css'

export default function PhotoBody({ data, id }) {
  return (
    <div className={styles.singleImage}>
      <a className={styles.prevbutton} href={`/photos/${id - 1}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="currentColor"
          className="bi bi-caret-left"
          viewBox="0 0 16 16"
        >
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
        </svg>
      </a>
      <a className={styles.nextbutton} href={`/photos/${++id}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="currentColor"
          className="bi bi-caret-right"
          viewBox="0 0 16 16"
        >
          <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
        </svg>
      </a>
      <div className={styles.imagecontainer}>
        <Image
          src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
          alt={data.title}
          width="600"
          height="400"
          layout="responsive"
        />
        <div className={styles.imageHeader}>
          <p className={styles.imagetitle}>
            {data.photo_data.location ? (
              <p>
                {data.title}, {data.photo_data.location}
              </p>
            ) : null}
          </p>
          <p className={styles.imagedate}>
            {new Date(data.photo_data.date_taken).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className={styles.imageDetails}>
          <p className={styles.imageCamera}>
            Camera: {data.photo_data.camera}
            {data.photo_data.film ? <p>Film: {data.photo_data.film}</p> : null}
          </p>
        </div>
      </div>
    </div>
  )
}
