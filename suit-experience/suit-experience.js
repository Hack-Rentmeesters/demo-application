// Get DOM elements
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

// Load your transparent suit overlay
const suitImg = new Image();
suitImg.src = 'images/suit.png'; // suit overlay should be inside /images/

// Initialize pose detection
const pose = new Pose.Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
  }
});

// Configure pose detection
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Handle pose detection results
pose.onResults((results) => {
  // Clear the canvas
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
  // Draw the video frame
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
  // If pose landmarks are detected
  if (results.poseLandmarks) {
    // Draw the pose landmarks
    DrawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, DrawingUtils.POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2
    });
    DrawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#FF0000',
      lineWidth: 1
    });

    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];

    const suitWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvasElement.width * 2;
    const suitHeight = suitWidth * 1.2;

    const centerX = (leftShoulder.x + rightShoulder.x) / 2 * canvasElement.width;
    const centerY = (leftShoulder.y + rightShoulder.y) / 2 * canvasElement.height;

    canvasCtx.drawImage(
      suitImg,
      centerX - suitWidth / 2,
      centerY - suitHeight / 2,
      suitWidth,
      suitHeight
    );
  }
});

// Initialize camera and start pose detection
async function init() {
  try {
    // Request camera access
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: 'user'
      }
    });
    
    // Set up video stream
    videoElement.srcObject = stream;
    
    // Wait for video to be ready
    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve();
      };
    });

    // Start the camera
    const camera = new CameraUtils.Camera(videoElement, {
      onFrame: async () => {
        await pose.send({image: videoElement});
      },
      width: 640,
      height: 480
    });

    // Start the camera
    await camera.start();
    console.log('Camera and pose detection started successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
    alert('Failed to start camera. Please make sure you have granted camera permissions.');
  }
}

// Start the application when the page loads
window.addEventListener('load', () => {
  if (typeof Pose === 'undefined' || typeof CameraUtils === 'undefined' || typeof DrawingUtils === 'undefined') {
    console.error('Required MediaPipe dependencies not loaded');
    return;
  }
  init();
});
