import styles from './css-modules/about-me.module.css'
import Image from 'next/image'

export default function AboutMe({}) {
    return (
        <div>
            <div className="row">
                <div className="col">
                    <div className={styles.mainabouttext}>
                        <p>Hi, I'm Lewis and I am a software engineer from Edinburgh. This website showcases some of the photos I've taken, mainly around Edinburgh and using my Olympus OM40.</p>
                    </div>  
                </div>
                <div className="col">
                    <Image 
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/glass_building_13_07_2023.jpg`}
                    alt="Close"
                    width="766"
                    height="508"              
                    />
                </div>
            </div>
            <div className="row">
            <div className="col">
                    <Image 
                    src={`https://photography-website.s3.eu-west-2.amazonaws.com/big_ben_12_07_2023.jpg`}
                    alt="Big BEn"
                    width="336"
                    height="508"              
                    />
                </div>
                <div className="col">
                    <div className={styles.mainabouttext}>
                        <p>Hi, I'm Lewis and I am a software engineer from Edinburgh. This website showcases some of the photos I've taken, mainly around Edinburgh and using my Olympus OM40.</p>
                    </div>  
                </div>
            </div>
        </div>
    );
}