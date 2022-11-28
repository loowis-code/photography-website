import Image from 'next/image'
import styles from './css-modules/photo-body.module.css'

export default function PostBody({data}) {
    return (
        <div className={styles.imagecontainer}>                        
            <Image 
                src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.img_url}`}
                alt={data.title}
                width="600"
                height="400"
                layout='responsive'
                priority='true'
                                        
            />
            <div className={styles.imageHeader}>
                <div className="row">
                    <p className={styles.imagetitle}>{data.title}</p>
                    <p className={styles.imagedate}>{data.date_taken}</p>
                </div>
            </div>
            <div className={styles.imageDetails}>
                <div className="row">
                    <div className={styles.imageinfo}>
                        <p>Location - {data.location}</p>
                    </div>
                    <div className={styles.imagesettings}>
                        <p>Camera - {data.settings.camera_used}</p>
                        <p>Image Settings</p>
                        <p>{data.settings.shutter_speed} - Shutter Speed</p>
                        <p>{data.settings.aperture} - Aperture</p>
                        <p>{data.settings.iso} - ISO</p>
                    </div>
                    
                </div>
                
            </div>
                           
        </div>
    )
}