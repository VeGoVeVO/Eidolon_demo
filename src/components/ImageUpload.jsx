import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { optimizeImage } from '../services/imageCropping';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, isProcessing, uploadedImage, validationError }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cropStatus, setCropStatus] = useState('');
  const { t } = useLanguage();

  // Clear preview when validation error occurs
  useEffect(() => {
    if (validationError) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [validationError]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('pleaseUploadImage'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('fileSizeTooLarge'));
      return;
    }

    try {
      // Show cropping status
      setCropStatus(t('autoCroppingImage'));

      // Auto-crop and optimize image
      const optimized = await optimizeImage(file, 1200, 1600);

      // Create a new File object from the optimized data
      const blob = await fetch(optimized.dataUrl).then((res) => res.blob());
      const optimizedFile = new File([blob], file.name, { type: 'image/png' });

      // Log optimization stats
      console.log('Image optimization complete:', {
        originalSize: `${(file.size / 1024).toFixed(2)} KB`,
        optimizedSize: `${(blob.size / 1024).toFixed(2)} KB`,
        dimensions: `${optimized.optimizedWidth}x${optimized.optimizedHeight}`,
        compression: `${(optimized.compressionRatio * 100).toFixed(1)}%`,
      });

      // Clear preview and crop status before upload starts
      setPreview(null);
      setCropStatus('');

      // Upload optimized file to backend
      onImageUpload(optimizedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      setPreview(null);
      setCropStatus('');
      // Fallback: upload original file if optimization fails
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <div className="upload-content animate-slide-up">
        <div className="upload-header">
          <h2>{t('uploadYourPhoto')}</h2>
          <p>{t('uploadFullBodyPhoto')}</p>
        </div>

        {validationError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">Validation Failed</h3>
                <p className="text-red-700 dark:text-red-300 text-sm">{validationError}</p>
                <p className="text-red-600 dark:text-red-400 text-xs mt-2">Please upload a different photo that meets the requirements.</p>
              </div>
            </div>
          </div>
        )}

        <div
          className={`upload-area ${dragActive ? 'active' : ''} ${
            isProcessing ? 'processing' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isProcessing}
            style={{ display: 'none' }}
          />

          {preview && !isProcessing && !cropStatus ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
              <p className="preview-text">{t('readyToProcess')}</p>
            </div>
          ) : cropStatus ? (
            <div className="processing-state">
              <div className="spinner"></div>
              <p>{cropStatus}</p>
            </div>
          ) : (
            <div className="upload-placeholder">
              <h3>{t('dragDropPhoto')}</h3>
              <p>{t('orClickToBrowse')}</p>
              <span className="file-hint">{t('fileHint')}</span>
            </div>
          )}
        </div>

        <div className="upload-tips">
          <h4>{t('tipsForBestResults')}</h4>
          <ul>
            <li>{t('tip1')}</li>
            <li>{t('tip2')}</li>
            <li>{t('tip3')}</li>
            <li>{t('tip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;

