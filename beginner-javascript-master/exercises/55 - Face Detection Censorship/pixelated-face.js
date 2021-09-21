const video = document.querySelector('.webcam');

const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceCanvas = document.querySelector('.Face');
const faceCtx = canvas.getContext('2d');

const faceDetector = new window.FaceDetector();

const SIZE = 10;
const SCALE = 1.35;

// stuff
async function populateVideo() {
  const stream = navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 },
  });
  video.srcObject = stream;
  await video.play();
  // comments
  console.log(video.videoWidth, video.videoHeight);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  const faces = await faceDetector.detect(video);
  console.log(faces);
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.strokeRect(left, top, width, height);
}

function censor({ boundingBox: face }) {
  faceCtx.imageSmoothingEnabled = false;
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  faceCtx.drawImage(
    video,
    face.x,
    face.y,
    face.width,
    face.height,

    face.x,
    face.y,
    SIZE,
    SIZE
  );
}

faceCtx.drawImage(
  faceCanvas,
  face.x,
  face.y,
  SIZE,
  SIZE,

  face.x,
  face.y,
  face.width,
  face.height
);

populateVideo().then(detect);
