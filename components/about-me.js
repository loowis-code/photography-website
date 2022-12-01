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
            <div className='col-2'>
                <img 
                src="https://photography-website.s3.eu-west-2.amazonaws.com/picture_of_me.jpg"
                alt="Photo of Me"
                width="100%"
                className="img-fluid rounded"/>
                

            </div>
            <div  className={styles.text} class='col'>
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