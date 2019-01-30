video = document.getElementById("_video");
var imageData = document.getElementById("_imageData"); // image data for BRFv4





function startCamera() {

  let constraints = {
    audio: false,
    video: {
      width: 640,
      height: 480,
      frameRate: 30
    }
  }

  video.setAttribute('width', 640);
  video.setAttribute('height', 480);
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');

  // Start video playback once the camera was fetched.
  function onStreamFetched(mediaStream) {
    video.srcObject = mediaStream;
    // Check whether we know the video dimensions yet, if so, start BRFv4.
    function onStreamDimensionsAvailable() {
      if (video.videoWidth === 0) {
        setTimeout(onStreamDimensionsAvailable, 100);
      } else {

      }
    }
    onStreamDimensionsAvailable();
  }

  window.navigator.mediaDevices.getUserMedia(constraints).then(onStreamFetched).catch(function() {
    alert("No camera available.");
  });
}
