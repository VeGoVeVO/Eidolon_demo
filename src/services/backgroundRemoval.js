/**
 * Background Removal Service
 * Uses MediaPipe Selfie Segmentation for reliable client-side person detection
 * Falls back to simple color-based removal if MediaPipe fails
 */

let segmenter = null;
let isModelLoading = false;
let modelLoadFailed = false;

// Load the MediaPipe Selfie Segmentation model
async function loadModel() {
  if (segmenter) return segmenter;
  if (modelLoadFailed) return null;
  if (isModelLoading) {
    // Wait for model to load
    while (!segmenter && isModelLoading && !modelLoadFailed) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return segmenter;
  }

  isModelLoading = true;

  try {
    // Dynamically load MediaPipe
    if (typeof window.selfieSegmentation === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675469541/selfie_segmentation.js');
    }

    // Create segmenter
    const SelfieSegmentation = window.selfieSegmentation.SelfieSegmentation;
    segmenter = new SelfieSegmentation({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675469541/${file}`,
    });

    await segmenter.initialize();

    isModelLoading = false;
    return segmenter;
  } catch (error) {
    console.error('Error loading MediaPipe model:', error);
    isModelLoading = false;
    modelLoadFailed = true;
    return null;
  }
}

// Helper function to load external scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Remove background from image using MediaPipe
export async function removeBackground(imageElement) {
  try {
    // Load model if not already loaded
    const model = await loadModel();

    if (!model) {
      console.log('MediaPipe not available, using fallback method');
      return simpleBackgroundRemoval(imageElement);
    }

    // Create canvas for processing
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);

    // Get segmentation mask from MediaPipe
    const results = await model.segmentForImage(imageElement);
    const mask = results.segmentationMask;

    // Create output canvas
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = imageElement.width;
    outputCanvas.height = imageElement.height;

    const outputCtx = outputCanvas.getContext('2d');
    outputCtx.drawImage(imageElement, 0, 0);

    // Get image data
    const imageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = imageData.data;

    // Apply segmentation mask - make background transparent
    const maskData = mask.getAsFloat32Array();

    for (let i = 0; i < maskData.length; i++) {
      // If mask value is low (background), make transparent
      if (maskData[i] < 0.5) {
        data[i * 4 + 3] = 0; // Set alpha to 0
      }
    }

    outputCtx.putImageData(imageData, 0, 0);

    // Crop to person
    const croppedCanvas = cropToPerson(outputCanvas, maskData);

    return croppedCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error removing background with MediaPipe:', error);
    console.log('Falling back to simple background removal');
    try {
      return simpleBackgroundRemoval(imageElement);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      // Return original image as last resort
      const canvas = document.createElement('canvas');
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageElement, 0, 0);
      return canvas.toDataURL('image/png');
    }
  }
}

// Crop image to focus on person
function cropToPerson(canvas, maskData) {
  const width = canvas.width;
  const height = canvas.height;

  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  // Find bounding box of person (where mask > 0.5)
  for (let i = 0; i < maskData.length; i++) {
    if (maskData[i] > 0.5) {
      const x = i % width;
      const y = Math.floor(i / width);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  // Add adaptive padding based on person size
  const personWidth = maxX - minX;
  const personHeight = maxY - minY;
  const horizontalPadding = Math.round(personWidth * 0.12);
  const verticalPadding = Math.round(personHeight * 0.08);

  minX = Math.max(0, minX - horizontalPadding);
  maxX = Math.min(width, maxX + horizontalPadding);
  minY = Math.max(0, minY - verticalPadding);
  maxY = Math.min(height, maxY + verticalPadding);

  const cropWidth = maxX - minX;
  const cropHeight = maxY - minY;

  // Create cropped canvas
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;

  const ctx = croppedCanvas.getContext('2d');
  ctx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return croppedCanvas;
}

// Process image file
export async function processImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          const result = await removeBackground(img);
          resolve(result);
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

// Fallback: Simple background removal using color detection
export async function simpleBackgroundRemoval(imageElement) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Detect background color (usually corners)
    const bgColor = detectBackgroundColor(data, canvas.width, canvas.height);

    // Remove background based on color similarity
    const threshold = 30;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const distance = Math.sqrt(
        Math.pow(r - bgColor.r, 2) +
        Math.pow(g - bgColor.g, 2) +
        Math.pow(b - bgColor.b, 2)
      );

      if (distance < threshold) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error in simple background removal:', error);
    throw error;
  }
}

// Detect background color from image corners
function detectBackgroundColor(data) {
  const cornerSize = 10;
  const colors = [];

  // Sample corners
  for (let i = 0; i < cornerSize * cornerSize; i++) {
    const idx = i * 4;
    colors.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Average corner colors
  const avg = colors.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(avg.r / colors.length),
    g: Math.round(avg.g / colors.length),
    b: Math.round(avg.b / colors.length),
  };
}

export default {
  removeBackground,
  processImageFile,
  simpleBackgroundRemoval,
  loadModel,
};

