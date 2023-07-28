import React, { useState } from 'react';
import styles from '../css-modules/image-carousel.module.css';

import Image from 'next/image'

const ImageCarousel = ({ images }) => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(2);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setLeftIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setRightIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((nextIndex) =>
        nextIndex === images.length - 1 ? 0 : nextIndex + 1
    );
    setLeftIndex((nextIndex) =>
        nextIndex === images.length - 1 ? 0 : nextIndex + 1
    );
    setRightIndex((nextIndex) =>
        nextIndex === images.length - 1 ? 0 : nextIndex + 1
    );


  };

  return (
    <div className={styles.carousel}>
        <div className={styles.carouselwrapper}>
        <button className={styles.prevbutton} onClick={handlePrev} />
        <button className={styles.nextbutton} onClick={handleNext} />
            <div className={styles.leftImage}>
                {/* <Image width={1200} height={1200} src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[leftIndex]}`} alt={`Image ${leftIndex}`} /> */}
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[leftIndex]}`} alt={`Image ${leftIndex}`}/>
            </div>    

            <div className={styles.centerImage}>
                {/* <Image width={1200} height={1200}  src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex]}`} alt={`Image ${currentIndex}`} /> */}
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex]}`} alt={`Image ${currentIndex}`}/>
            </div>

            <div className={styles.rightImage}>
                {/* <Image width={1200} height={1200} src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[rightIndex]}`} alt={`Image ${rightIndex}`}/> */}
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[rightIndex]}`} alt={`Image ${rightIndex}`}/>
            </div>
        </div>
    </div>
  );
};

export default ImageCarousel;