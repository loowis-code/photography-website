import React, { useState, useRef } from 'react'
import styles from '../css-modules/image-carousel.module.css'

import PhotoPreview from '../photo-preview'
import Link from 'next/link'
import Image from 'next/image'

const ImageCarousel = ({ images }) => {
  const [leftIndex, setLeftIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [rightIndex, setRightIndex] = useState(2)
  const touchStartX = useRef(null)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
    setLeftIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
    setRightIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    )
  }

  const handleNext = () => {
    setCurrentIndex((nextIndex) =>
      nextIndex === images.length - 1 ? 0 : nextIndex + 1,
    )
    setLeftIndex((nextIndex) =>
      nextIndex === images.length - 1 ? 0 : nextIndex + 1,
    )
    setRightIndex((nextIndex) =>
      nextIndex === images.length - 1 ? 0 : nextIndex + 1,
    )
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX
    const touchThreshold = 50

    if (touchStartX.current - touchEndX > touchThreshold) {
      handleNext()
    } else if (touchEndX - touchStartX.current > touchThreshold) {
      handlePrev()
    }
  }

  return (
    <div
      className={styles.carousel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.carouselwrapper}>
        <button className={styles.prevbutton} onClick={handlePrev}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            className="bi bi-caret-left"
            viewBox="0 0 16 16"
          >
            <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
          </svg>
        </button>
        <button className={styles.nextbutton} onClick={handleNext}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="currentColor"
            className="bi bi-caret-right"
            viewBox="0 0 16 16"
          >
            <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
          </svg>
        </button>
        <div className={styles.leftImage}>
          <div className={styles.leftImagePhoto}>
            <Image
              src={`https://photography-website.s3.eu-west-2.amazonaws.com/${
                images[0] ? images[leftIndex].filename : 'default.jpg'
              }`}
              alt={images[0] ? images[leftIndex].title : 'default'}
              width="1200"
              height="1200"
              layout="responsive"
            />
            <h5 className="card-title">
              {images[0] ? images[leftIndex].title : 'default'}
            </h5>
          </div>
        </div>

        <div className={styles.centerImage}>
          <Link
            className={styles.imageLink}
            href={`/photos/${
              images[0] ? images[currentIndex].url_id : 'default'
            }`}
          >
            <div className={styles.centreImagePhoto}>
              <Image
                src={`https://photography-website.s3.eu-west-2.amazonaws.com/${
                  images[0] ? images[currentIndex].filename : 'default.jpg'
                }`}
                alt={images[0] ? images[currentIndex].title : 'default'}
                width="1200"
                height="1200"
                layout="responsive"
              />
              <h5 className="card-title">
                {images[0] ? images[currentIndex].title : 'default'}
              </h5>
            </div>
          </Link>
        </div>

        <div className={styles.rightImage}>
          <div className={styles.rightImagePhoto}>
            <Image
              src={`https://photography-website.s3.eu-west-2.amazonaws.com/${
                images[0] ? images[rightIndex].filename : 'default.jpg'
              }`}
              alt={images[0] ? images[rightIndex].title : 'default'}
              width="1200"
              height="1200"
              layout="responsive"
            />
            <h5 className="card-title">
              {images[0] ? images[rightIndex].title : 'default'}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
