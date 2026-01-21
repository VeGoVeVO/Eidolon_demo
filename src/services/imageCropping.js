/**
 * Optimized Image Auto-Cropping Service
 * Client-side only - no server resources used
 * Detects and crops to person with smart padding
 */

// Import body segmentation from backgroundRemoval service
import { removeBackground } from './backgroundRemoval.js';

/**
 * Find the bounding box of non-transparent pixels (person)
 * Works with both regular images and transparent background images
 */
function findPersonBounds(imageData) {
  const { data, width, height } = imageData;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let foundPerson = false;

  // Scan pixels for non-transparent content
  for (let i = 3; i < data.length; i += 4) {
    // Check alpha channel (index 3, 7, 11, etc.)
    if (data[i] > 10) {
      // If alpha > 10, it's part of the person
      foundPerson = true;
      const pixelIndex = (i - 3) / 4;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  if (!foundPerson) {
    return null;
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Find person bounds using body segmentation
 * Works on regular photos without transparent backgrounds
 */
async function findPersonBoundsWithSegmentation(imageElement) {
  try {
    // Use the existing background removal service which has body segmentation
    const segmentedImage = await removeBackground(imageElement);

    // Create image from segmented result
    const img = new Image();
    img.src = segmentedImage;

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const bounds = findPersonBounds(imageData);
        resolve(bounds);
      };
    });
  } catch (error) {
    console.warn('Body segmentation failed, using fallback:', error);
    return null;
  }
}

/**
 * Calculate smart padding based on image dimensions
 * More padding on sides for fashion, less on top/bottom
 */
function calculateSmartPadding(bounds, width, height) {
  const personWidth = bounds.maxX - bounds.minX;
  const personHeight = bounds.maxY - bounds.minY;

  // Adaptive padding: 8-15% of person size
  const horizontalPadding = Math.round(personWidth * 0.12);
  const verticalPadding = Math.round(personHeight * 0.08);

  return {
    left: Math.max(0, bounds.minX - horizontalPadding),
    right: Math.min(width, bounds.maxX + horizontalPadding),
    top: Math.max(0, bounds.minY - verticalPadding),
    bottom: Math.min(height, bounds.maxY + verticalPadding),
  };
}

/**
 * Maintain aspect ratio while cropping
 * Ensures the image doesn't look stretched
 */
function maintainAspectRatio(crop, originalWidth, originalHeight) {
  const cropWidth = crop.right - crop.left;
  const cropHeight = crop.bottom - crop.top;
  const aspectRatio = originalWidth / originalHeight;

  // If crop is too wide, adjust height
  if (cropWidth / cropHeight > aspectRatio) {
    const newHeight = cropWidth / aspectRatio;
    const diff = newHeight - cropHeight;
    crop.top = Math.max(0, crop.top - diff / 2);
    crop.bottom = Math.min(originalHeight, crop.bottom + diff / 2);
  }
  // If crop is too tall, adjust width
  else if (cropWidth / cropHeight < aspectRatio) {
    const newWidth = cropHeight * aspectRatio;
    const diff = newWidth - cropWidth;
    crop.left = Math.max(0, crop.left - diff / 2);
    crop.right = Math.min(originalWidth, crop.right + diff / 2);
  }

  return crop;
}

/**
 * Auto-crop image to person with smart padding
 * Optimized for performance
 */
export function autoCropImage(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Find person bounds
    const bounds = findPersonBounds(imageData);
    if (!bounds) {
      console.warn('No person detected in image');
      return canvas;
    }

    // Calculate smart padding
    const crop = calculateSmartPadding(bounds, canvas.width, canvas.height);

    // Maintain aspect ratio
    maintainAspectRatio(crop, canvas.width, canvas.height);

    const cropWidth = crop.right - crop.left;
    const cropHeight = crop.bottom - crop.top;

    // Create cropped canvas
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;

    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.drawImage(
      canvas,
      crop.left,
      crop.top,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return croppedCanvas;
  } catch (error) {
    console.error('Error auto-cropping image:', error);
    return canvas;
  }
}

/**
 * Crop image from file with auto-detection using body segmentation
 */
export async function cropImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          try {
            // First, try to detect person using body segmentation
            const bounds = await findPersonBoundsWithSegmentation(img);

            if (bounds) {
              // Create canvas from original image
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);

              // Calculate smart padding
              const crop = calculateSmartPadding(bounds, canvas.width, canvas.height);
              maintainAspectRatio(crop, canvas.width, canvas.height);

              const cropWidth = crop.right - crop.left;
              const cropHeight = crop.bottom - crop.top;

              // Create cropped canvas
              const croppedCanvas = document.createElement('canvas');
              croppedCanvas.width = cropWidth;
              croppedCanvas.height = cropHeight;

              const croppedCtx = croppedCanvas.getContext('2d');
              croppedCtx.drawImage(
                canvas,
                crop.left,
                crop.top,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
              );

              const dataUrl = croppedCanvas.toDataURL('image/png');

              resolve({
                dataUrl,
                originalWidth: img.width,
                originalHeight: img.height,
                croppedWidth: croppedCanvas.width,
                croppedHeight: croppedCanvas.height,
                compressionRatio: (croppedCanvas.width * croppedCanvas.height) / (img.width * img.height),
              });
            } else {
              // Fallback: return original image if detection fails
              console.warn('Person detection failed, returning original image');
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);

              resolve({
                dataUrl: canvas.toDataURL('image/png'),
                originalWidth: img.width,
                originalHeight: img.height,
                croppedWidth: img.width,
                croppedHeight: img.height,
                compressionRatio: 1,
              });
            }
          } catch (error) {
            console.error('Error during cropping:', error);
            // Fallback: return original image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            resolve({
              dataUrl: canvas.toDataURL('image/png'),
              originalWidth: img.width,
              originalHeight: img.height,
              croppedWidth: img.width,
              croppedHeight: img.height,
              compressionRatio: 1,
            });
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image to max dimensions while maintaining aspect ratio
 * Optimized for web: reduces file size
 */
export function resizeImage(canvas, maxWidth = 1200, maxHeight = 1600) {
  const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);

  if (ratio >= 1) {
    return canvas; // No resize needed
  }

  const newWidth = Math.round(canvas.width * ratio);
  const newHeight = Math.round(canvas.height * ratio);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;

  const ctx = resizedCanvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return resizedCanvas;
}

/**
 * Complete optimization pipeline: crop + resize
 */
export async function optimizeImage(file, maxWidth = 1200, maxHeight = 1600) {
  try {
    const cropped = await cropImageFile(file);
    
    // Create canvas from cropped image
    const img = new Image();
    img.src = cropped.dataUrl;
    
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Resize if needed
        const resized = resizeImage(canvas, maxWidth, maxHeight);
        // PNG is always lossless - no quality parameter needed
        const finalDataUrl = resized.toDataURL('image/png');

        resolve({
          dataUrl: finalDataUrl,
          originalSize: file.size,
          optimizedWidth: resized.width,
          optimizedHeight: resized.height,
          compressionRatio: cropped.compressionRatio,
        });
      };
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw error;
  }
}

export default {
  autoCropImage,
  cropImageFile,
  resizeImage,
  optimizeImage,
};

