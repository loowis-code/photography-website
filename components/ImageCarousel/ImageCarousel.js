import React, { useState, useRef } from 'react';
import styles from '../css-modules/image-carousel.module.css';

const ImageCarousel = ({ images }) => {
  const [leftIndex, setLeftIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(2);
  const touchStartX = useRef(null);

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

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchThreshold = 50;

    if (touchStartX.current - touchEndX > touchThreshold) {
      handleNext();
    } else if (touchEndX - touchStartX.current > touchThreshold) {
      handlePrev();
    }
  };

  return (
    <div 
        className={styles.carousel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >
        <div className={styles.carouselwrapper}>
            <button className={styles.prevbutton} onClick={handlePrev} >
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
                    <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                </svg>
            </button>
            <button className={styles.nextbutton} onClick={handleNext} >
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
                    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                </svg>
            </button>
            <div className={styles.leftImage}>
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[leftIndex]}`} alt={`Image ${leftIndex}`}/>
                {/* <Link href={`/photos/${images[leftIndex].data.url_id}`}>
                    <div>
                        <Image 
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[leftIndex].data.filename}`}
                            alt={images[leftIndex].data.title}
                            width="1200"
                            height="1200"
                            layout="responsive"
                        />
                        <h5 className="card-title">{images[leftIndex].data.title}</h5>
                    </div>
                </Link> */}
            </div>    

            <div className={styles.centerImage}>
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex]}`} alt={`Image ${currentIndex}`}/>
                {/* <Link href={`/photos/${images[currentIndex].data.url_id}`}>
                        <Image 
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[currentIndex].data.filename}`}
                            alt={images[currentIndex].data.title}
                            width="1200"
                            height="1200"
                            layout="responsive"
                        />
                        <h5 className="card-title">{images[currentIndex].data.title}</h5>
                </Link> */}
            </div>

            <div className={styles.rightImage}>
                <img src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[rightIndex]}`} alt={`Image ${rightIndex}`}/>
                {/* <Link href={`/photos/${images[rightIndex].data.url_id}`}>
                    <div>
                        <Image 
                            src={`https://photography-website.s3.eu-west-2.amazonaws.com/${images[rightIndex].data.filename}`}
                            alt={images[rightIndex].data.title}
                            width="1200"
                            height="1200"
                            layout="responsive"
                        />
                        <h5 className="card-title">{images[rightIndex].data.title}</h5>
                    </div>
                </Link> */}
            </div>
        </div>
    </div>
  );
};

export default ImageCarousel;