import Image from 'next/image'
import styles from './css-modules/photo-body.module.css'

export default function PhotoBody({data}) {
    return (
        <div className={styles.imagecontainer}>                        
            <Image 
                src={`https://photography-website.s3.eu-west-2.amazonaws.com/${data.imgurl}.jpg`}
                alt={data.title}
                width="600"
                height="400"
                layout='responsive'
                priority='true'
                                        
            />
            <div className={styles.imageHeader}>
                <div className="row">
                    <p className={styles.imagetitle}>{data.title}</p>
                    <p className={styles.imagedate}>{new Date(data.date_taken).toLocaleDateString("en-GB",{year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className={styles.imageDetails}>
                <div className="row">
                    <div className={styles.imageinfo}>
                        {(data.location)? <p>{data.location}</p> : null}
                    </div>
                    <div className={styles.imagesettings}>
                        <p>{data.settings.camera_used}</p>
                        {(data.settings.length > 1)? <p>Image Settings</p> : null}
                        {(data.settings.shutter_speed)? <p>{data.settings.shutter_speed}</p> : null}
                        {(data.settings.aperture)? <p>{data.settings.aperture}</p> : null}
                        {(data.settings.iso)? <p>{data.settings.iso}</p> : null}
                    </div>
                    
                </div>
                
            </div>
                           
        </div>
    )
}