import styles from './css-modules/about-me.module.css'
import Image from 'next/image'

export default function AboutMe({}) {
    return (
        <div>
            <div className={styles.header}>
                <p>About Me</p>
            </div>
            <div className={styles.mainabouttext}>
                <div className='row'>
                    <div className='col-md-2 col'>
                            <Image
                            src="https://photography-website.s3.eu-west-2.amazonaws.com/picture_of_me.jpg"
                            alt="Photo of Me"
                            width='600'
                            height='600'
                            className="img-fluid rounded"/>
                    </div>
                    <div className='col-xl-5 col-sm'>
                        <p>
                        My name is Lewis Inches, a software engineer from Edinburgh. This website
                        features some pictures I've taken, mainly around Edinburgh, using my Olympus OM40.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}