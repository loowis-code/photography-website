import React, { useState } from 'react';
import styles from '../css-modules/image-carousel.module.css';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={styles.carousel}>
        <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex ]}`} alt={`Image ${currentIndex}`} />
        <button className={styles.prevbutton} onClick={handlePrev} />
        <button className={styles.nextbutton} onClick={handleNext} />
    </div>
  );
};

export default ImageCarousel;