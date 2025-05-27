const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

// Load your transparent suit overlay
const suitImg = new Image();
suitImg.src = 'images/suit.png'; // suit overlay should be inside /images/

// Function to request camera permissions
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: 'user'
      }
    });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Unable to access camera. Please make sure you have granted camera permissions.');
    throw error;
  }
}

// Initialize pose detection
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
  }
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// Add debug logging to check if pose detection is working
pose.onResults((results) => {
  console.log('Pose detection results:', results.poseLandmarks ? 'Landmarks detected' : 'No landmarks');
  
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.poseLandmarks) {
    // Draw pose landmarks for debugging
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
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

  canvasCtx.restore();
});

// Initialize everything
async function init() {
  try {
    // First request camera permissions
    await setupCamera();
    
    // Then start the camera and pose detection
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        try {
          await pose.send({image: videoElement});
        } catch (error) {
          console.error('Error in pose detection:', error);
        }
      },
      width: 640,
      height: 480
    });

    // Start the camera
    await camera.start();
    console.log('Camera started successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

// Start the application
init();
