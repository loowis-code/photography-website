import Link from 'next/link';
import Image from 'next/image'
import styles from './css-modules/photo-preview.module.css'

export default function PhotoPreview({ id, title, imgurl }) {
    return (
        <div className="col-4">
            <Link className={styles.photopreview} href={`/photos/${id}`}>

                    <div>
                        <Image 
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/${imgurl}`}
                            alt={imgurl}
                            width="600"
                            height="400"
                            layout='responsive'
                            priority='true'                           
                        />
                    </div>
                        <h5 className="card-title">{title}</h5>
            </Link>
        </div>
    )
}