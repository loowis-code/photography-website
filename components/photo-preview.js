import Link from 'next/link';
import Image from 'next/image'
import styles from './css-modules/photo-preview.module.css'

export default function PhotoPreview({ title, imgurl }) {
    return (
        <div className={styles.photocontainer}>
            <Link className={styles.photopreview} href={`/photos/${imgurl}`}>
                <div>
                    <Image 
                        src={`https://photography-website.s3.eu-west-2.amazonaws.com/${imgurl}.jpg`}
                        alt={imgurl}
                        width="1200"
                        height="1200"
                        layout="responsive"
                    />
                    <h5 className="card-title">{title}</h5>
                </div>
            </Link>
        </div>
    )
}