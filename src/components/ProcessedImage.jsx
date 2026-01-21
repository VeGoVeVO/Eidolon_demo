import { useRef } from 'react';
import './ProcessedImage.css';

function ProcessedImage({ processedImage, onReset }) {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `virtual-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      const blob = await fetch(processedImage).then((r) => r.blob());
      const file = new File([blob], 'virtual-tryon.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'Virtual Try-On',
          text: 'Check out my virtual try-on!',
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(processedImage);
        alert('Image link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <div className="processed-image-container">
      <div className="processed-content animate-slide-up">
        <div className="result-header">
          <h2>Your Virtual Try-On Result</h2>
          <p>Background removed and optimized for you</p>
        </div>

        <div className="image-display">
          <img
            src={processedImage}
            alt="Processed"
            className="result-image"
            ref={canvasRef}
          />
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={handleDownload}>
            <span>⬇️</span>
            Download
          </button>
          <button className="btn-secondary" onClick={handleShare}>
            <span>📤</span>
            Share
          </button>
          <button className="btn-secondary" onClick={onReset}>
            <span>🔄</span>
            Try Another
          </button>
        </div>

        <div className="result-info">
          <h4>What's next?</h4>
          <ul>
            <li>Download your processed image</li>
            <li>Share with friends and family</li>
            <li>Use for fashion recommendations</li>
            <li>Try another photo for comparison</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProcessedImage;

