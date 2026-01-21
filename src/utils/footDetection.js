// MoveNet Foot Detection System
// Uses TensorFlow.js MoveNet Lightning for fast foot detection

const MOVENET_KEYPOINTS = {
  left_ankle: 15,
  right_ankle: 16
};

const EXPECTED_FEET = 2;
const CONFIDENCE_THRESHOLD = 0.3;

let poseDetector = null;
let isLoadingModel = false;
let loadingPromise = null;

// Load TensorFlow.js script dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Load pose detector model (pre-load on demand)
export async function loadPoseDetector() {
  if (poseDetector) return poseDetector;
  
  if (isLoadingModel) {
    return loadingPromise;
  }

  isLoadingModel = true;
  loadingPromise = (async () => {
    try {
      console.log('🔄 Loading MoveNet model...');
      
      // Load TensorFlow.js libraries from CDN
      if (!window.poseDetection) {
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.22.0/dist/tf-core.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.22.0/dist/tf-converter.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.22.0/dist/tf-backend-webgl.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js');
      }

      poseDetector = await window.poseDetection.createDetector(
        window.poseDetection.SupportedModels.MoveNet,
        {
          runtime: 'tfjs',
          modelType: 'SinglePose.Lightning',
          enableSmoothing: false
        }
      );
      
      console.log('✅ MoveNet model loaded successfully');
      return poseDetector;
    } catch (error) {
      console.error('❌ Failed to load MoveNet model:', error);
      isLoadingModel = false;
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

// Count feet from keypoints
function countFeet(keypoints) {
  let feetDetected = 0;
  const detectedAnkles = [];

  keypoints.forEach((kp, index) => {
    if (kp.score < CONFIDENCE_THRESHOLD) return;

    const name = kp.name || Object.keys(MOVENET_KEYPOINTS).find(k => MOVENET_KEYPOINTS[k] === index);
    
    if (name && name.includes('ankle')) {
      feetDetected++;
      detectedAnkles.push({
        name: name,
        x: kp.x,
        y: kp.y,
        score: kp.score
      });
    }
  });

  return {
    count: feetDetected,
    ankles: detectedAnkles
  };
}

// Detect feet in image (single check)
async function detectFeetSingleCheck(imageElement) {
  const detector = await loadPoseDetector();

  const poses = await detector.estimatePoses(imageElement);

  if (!poses || poses.length === 0) {
    return { count: 0, ankles: [] };
  }

  const pose = poses[0];
  return countFeet(pose.keypoints);
}

// Run 4 detection checks on the same image
export async function detectFeetMultipleChecks(imageDataUrl, checkCount = 4) {
  console.log(`🔍 Running ${checkCount} foot detection checks...`);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      try {
        const results = [];

        for (let i = 0; i < checkCount; i++) {
          const checkStartTime = performance.now();
          const feetData = await detectFeetSingleCheck(img);
          const checkTime = ((performance.now() - checkStartTime) / 1000).toFixed(2);

          const hasCorrectFeet = feetData.count === EXPECTED_FEET;
          results.push(hasCorrectFeet);

          console.log(`  Check ${i + 1}/${checkCount}: ${hasCorrectFeet ? '✓' : '✗'} (${feetData.count} feet detected in ${checkTime}s)`);
        }

        const passCount = results.filter(r => r).length;
        const failCount = checkCount - passCount;

        console.log(`📊 Results: ${passCount}/${checkCount} checks passed`);

        resolve({
          passCount,
          failCount,
          totalChecks: checkCount,
          passed: results
        });
      } catch (error) {
        console.error('❌ Error during foot detection:', error);
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for foot detection'));
    };

    img.src = imageDataUrl;
  });
}

// Validate feet with retry logic (keep checking until 1/4 or 3/4)
export async function validateFeetWithRetry(imageDataUrl, maxRetries = 10) {
  console.log('🎯 Starting foot validation with retry logic...');

  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`\n🔄 Validation attempt ${attempt}/${maxRetries}`);

    const result = await detectFeetMultipleChecks(imageDataUrl, 4);

    // Clear result: 0/4 or 1/4 = FAIL
    if (result.passCount <= 1) {
      console.log(`❌ Clear FAIL: ${result.passCount}/4 checks passed`);
      return {
        valid: false,
        passCount: result.passCount,
        totalChecks: result.totalChecks,
        attempts: attempt,
        reason: result.passCount === 0
          ? 'No feet detected in any check - person may be sitting or feet not visible'
          : 'Only 1/4 checks detected feet - feet likely not visible'
      };
    }

    // Clear result: 3/4 or 4/4 = PASS
    if (result.passCount >= 3) {
      console.log(`✅ Clear PASS: ${result.passCount}/4 checks passed`);
      return {
        valid: true,
        passCount: result.passCount,
        totalChecks: result.totalChecks,
        attempts: attempt,
        reason: 'Feet detected consistently across multiple checks'
      };
    }

    // Ambiguous result: 2/4 = RETRY
    console.log(`⚠️ Ambiguous result: ${result.passCount}/4 checks passed - retrying...`);
  }

  // Max retries reached with 2/4 results - fail safe
  console.log(`❌ Max retries (${maxRetries}) reached with ambiguous results - failing safe`);
  return {
    valid: false,
    passCount: 2,
    totalChecks: 4,
    attempts: maxRetries,
    reason: 'Ambiguous results after maximum retries - feet detection inconsistent'
  };
}

// Validate batch result image (called after each batch completes)
export async function validateBatchResultFeet(imageDataUrl) {
  console.log('\n🦶 Validating batch result for feet visibility...');
  const startTime = performance.now();

  const validation = await validateFeetWithRetry(imageDataUrl);

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  console.log(`⏱️ Total validation time: ${totalTime}s`);

  if (validation.valid) {
    console.log(`✅ Feet validation PASSED (${validation.passCount}/${validation.totalChecks} in ${validation.attempts} attempt(s))`);
  } else {
    console.log(`❌ Feet validation FAILED (${validation.passCount}/${validation.totalChecks} in ${validation.attempts} attempt(s))`);
    console.log(`   Reason: ${validation.reason}`);
  }

  return validation;
}

// Pre-load model (call this when user navigates to Build page)
export async function preloadFootDetectionModel() {
  try {
    console.log('🚀 Pre-loading foot detection model...');
    await loadPoseDetector();
    console.log('✅ Foot detection model pre-loaded and ready');
  } catch (error) {
    console.error('❌ Failed to pre-load foot detection model:', error);
  }
}

// Cleanup detector
export function cleanupFootDetection() {
  if (poseDetector) {
    poseDetector.dispose();
    poseDetector = null;
    isLoadingModel = false;
    loadingPromise = null;
    console.log('🧹 Foot detection model cleaned up');
  }
}

