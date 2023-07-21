import React, { useState } from 'react';
import styles from '../css-modules/image-carousel.module.css';

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
        {/* <div className='row'> */}
            {/* <div className='col'> */}
                <div className={styles.leftImage}>
                    <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[leftIndex]}`} alt={`Image ${leftIndex}`} />
                </div>    
            {/* </div> */}
            {/* <div className='col'> */}
                <div className={styles.centerImage}>
                    <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex]}`} alt={`Image ${currentIndex}`} />
                </div>
            {/* </div> */}
            {/* <div className='col'> */}
                <div className={styles.rightImage}>
                    <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[rightIndex]}`} alt={`Image ${rightIndex}`} />
                </div>
            {/* </div> */}
        {/* </div> */}
        </div>
    </div>
  );
};

export default ImageCarousel;