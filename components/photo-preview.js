import Link from 'next/link';
import Image from 'next/image'
import styles from './css-modules/photo-preview.module.css'

export default function PhotoPreview({ title, imgurl }) {
    return (
            <div className={styles.photocontainer}>
                <div class="col">
            <Link className={styles.photopreview} href={`/photos/${imgurl}`}>

                    <div>
                        <Image 
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/${imgurl}.jpg`}
                            alt={imgurl}
                            width="600"
                            height="600"
                            layout='responsive'                          
                        />
                    </div>
                    
            </Link>
            <h5 className="card-title">{title}</h5>
            </div>
        </div>

    )
}