// src/components/Gallery/Gallery.js
import React, { useState, useEffect } from 'react';
import styles from './Gallery.module.css';

const Gallery = ({ images, onImageClick, currentIndex, setCurrentIndex }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fungsi untuk berpindah ke gambar sebelumnya
  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Fungsi untuk berpindah ke gambar berikutnya
  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Handler untuk swipe pada perangkat mobile
  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    document.touchStartX = touchDown;
  };

  const handleTouchMove = (e) => {
    if (!document.touchStartX) return;
    
    const touchUp = e.touches[0].clientX;
    const difference = document.touchStartX - touchUp;
    
    if (difference > 50) {
      nextImage();
      document.touchStartX = null;
    } else if (difference < -50) {
      prevImage();
      document.touchStartX = null;
    }
  };

  return (
    <div className={styles.galleryContainer}>
      <div 
        className={styles.featuredImage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className={`${styles.imageWrapper} ${isTransitioning ? styles.transition : ''}`}>
          <img 
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
            onClick={() => onImageClick(images[currentIndex])}
            style={{
              objectFit: isMobile ? 'cover' : 'contain'
            }}
          />
          <div className={styles.imageInfo}>
            <h3>{images[currentIndex].title}</h3>
            <p>{images[currentIndex].description}</p>
          </div>
        </div>
        
        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevImage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextImage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className={styles.thumbnailContainer}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              setIsTransitioning(true);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
          >
            <img src={image.url} alt={image.title} />
          </div>
        ))}
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressIndicator} 
          style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Gallery;