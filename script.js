const stream = document.getElementById('stream')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startstream)

function startstream() {
  navigator.mediaDevices.getUserMedia({ audio: false, stream: { width: 800, height: 600 } }).then(function(mediaStream) {
      
      var stream = document.getElementById('stream');
      stream.srcObject = mediaStream;
      
      stream.onloadedmetadata = function(e) {
        stream.play();
      };
      
    }).catch(function(err) { console.log("error"); });
}

stream.addEventListener('play', () => {
  const cnv = faceapi.createCanvasFromMedia(stream)
  document.body.append(cnv)
  const displaySize = { width: stream.width, height: stream.height }
  faceapi.matchDimensions(cnv, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(stream, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    cnv.getContext('2d').clearRect(0, 0, cnv.width, cnv.height)
    faceapi.draw.drawDetections(cnv, resizedDetections)
    faceapi.draw.drawFaceLandmarks(cnv, resizedDetections)
    faceapi.draw.drawFaceExpressions(cnv, resizedDetections)
  }, 100)
})