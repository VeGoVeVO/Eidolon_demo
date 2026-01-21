import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './BeforeAfterSlider.css';

function BeforeAfterSlider({ beforeImage, afterImage, showLabels = true }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const { t } = useLanguage();

  // Reset slider to center when new images load
  useEffect(() => {
    setSliderPosition(50);
  }, [beforeImage, afterImage]);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="before-after-slider"
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (Background) */}
      <div className="before-image-container">
        <img src={beforeImage} alt="Before" className="comparison-image" />
      </div>

      {/* After Image (Foreground with clip from right) */}
      <div
        className="after-image-container"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}%)`,
        }}
      >
        <img src={afterImage} alt="After" className="comparison-image" />
      </div>

      {/* Persistent labels (not clipped) */}
      {showLabels && (
        <>
          <div className="image-label before-label">{t('before')}</div>
          <div className="image-label after-label">{t('after')}</div>
        </>
      )}

      {/* Slider Handle */}
      <div 
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div className="slider-line"></div>
        <div className="slider-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;

