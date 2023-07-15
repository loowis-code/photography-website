import Image from 'next/image'
import styles from './css-modules/photo-body.module.css'

export default function PhotoBody({data}) {
    return (
        <div className={styles.imagecontainer}>                        
            <Image 
                src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.filename}`}
                alt={data.title}
                width="600"
                height="400"
                layout='responsive'                 
            />
            <div className={styles.imageHeader}>
                <div className="row">
                    <p className={styles.imagetitle}>{data.title}</p>
                    <p className={styles.imagedate}>{new Date(data.photo_data.date_taken).toLocaleDateString("en-GB",{year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className={styles.imageDetails}>
                <div className="row">
                    <div className={styles.imageinfo}>
                        {(data.photo_data.location)? <p>{data.photo_data.location}</p> : null}
                    </div>
                    <div className={styles.imagesettings}>
                        <p>{data.photo_data.camera}</p>
                        <p>{(data.photo_data.film)? <p>{data.photo_data.film}</p> : null}</p>
                    </div>
                </div>
            </div>            
        </div>
    )
}