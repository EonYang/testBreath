let canvas;
let breath;
let userCircle;
let circlesZoom = 0.1;
let smoothLevel = 40;
let sizeIndex = 1;

var video;
let poseNet;
let poses = [];
let smooth = {
  x: [],
  y: []
};

let started = 0;
let settedUp = 0;

let bgColor;

var cameraReady = 0;
let meditation


function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('fonts/Futura_PT/FuturaPTMedium.otf');
  song = loadSound('sound/Aduri - Rita 5 Min (No Vox).mp3');
}

function setup() {

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('z-index', '99999');
  canvas.position(0, 0);
  canvas.parent('sketch-holder');
  textFont(font);
  frameRate(30);
  ellipseMode(CENTER);
  textAlign(CENTER);
  rectMode(CENTER);
  noStroke();
  song.setVolume(4.0);
  sizeIndex = getSizeIndex();

  colorMode(HSB, 360, 100, 100, 100);
  bgColor = color(244, 33, 36, 100);

  userCircle = new CIRCLE(sizeIndex, 37, 84, 70, 30);
  breath = new BREATH();
  breath.circlesDia = sizeIndex;
  ui = new UI();
  meditation = new MEDITATION();
}

function startSketch() {
  started = 1;
  $("#promptDiv").children().remove();
}

function delayedSetup() {
  //poseNet
  startCamera();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  settedUp = 1;
}

function draw() {
  // console.log(frameRate().toFixed(2));
  tryRemoveSignUpText();
  breath.updateIndex();
  ui.updateColor(breath.index);
  // bgColor.setAlpha = 10 + 70 * breath.index;

  background(bgColor);

  translate(width / 2, height / 2);
  breath.showAnimation(breath.circlesDia, 8);


  // delayed loop
  if (started) {
    if (!settedUp) {

      // will only run once
      delayedSetup();
    }

    if (!song.isPlaying()) {
      song.play();
    }

    if (!cameraReady) {
      waitForCamera();
    } else {
      meditation.checkStatus(userCircle);
    }

    if (poses.length > 0) {
      for (let i = 0; i < poses.length; i++) {
        drawFace(poses[i]);
        userCircle.display(breath.index / 3);
      }
    }
    if (meditation.timePass >= meditation.goal / 2 && cameraReady && poses.length == 0) {
      console.log('resetting');
      meditation.reset();
    } else if (meditation.prepTime <= 0 && poses.length == 0) {
      meditation.onGoing();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeIndex = getSizeIndex();
  userCircle.dia = sizeIndex;
}

function drawFace() {

  // reverse X
  smooth.x.push(-(poses[0].pose.keypoints[0].position.x - video.width / 2) / 2);
  smooth.y.push((poses[0].pose.keypoints[0].position.y - video.height / 2) / 2);

  if (smooth.x.length > smoothLevel) {
    smooth.x.shift();
  }
  if (smooth.y.length > smoothLevel) {
    smooth.y.shift();
  }
  let smoothX = 0;
  let smoothY = 0;
  for (let i = 0; i < smooth.x.length; i++) {
    smoothX += smooth.x[i];
    smoothY += smooth.y[i];
  }

  userCircle.x = smoothX / smoothLevel;
  userCircle.y = smoothY / smoothLevel;
}

function modelReady() {
  cameraReady = 1;
}

function mouseMoved() {
  if (settedUp && !meditation.win) {

    if (meditation.prepTime <= 0) {
      if (cameraReady) {
        meditation.reset();
      }
    }
  }
}

function keyPressed() {
  if (settedUp && !meditation.win) {
    if (meditation.prepTime <= 0) {
      if (cameraReady) {
        meditation.reset();
      }
    }
  }
}

function cameraOff() {
  video.pause();
  video.srcObject.getTracks()[0].stop();
  console.log("Vid off");
}

function getSizeIndex() {
  let h = height;
  let w = width;
  let i;
  i = h / 20 + w / 10;
  return i
}

function waitForCamera() {

  myText(`You’re nearly there. This will require you to focus.`, -0.15, -6);
  //
  myText(`To help you stay focused, we need access to your computer’s camera.

    Don’t worry, nothing is being recorded or seen by anyone.
    Your camera will automatically shut off after the session.
    We value your privacy and will never share anything. See how we built all of this here.`, -0.05, -13);
  console.log('wait for camera');
  // push();
  // textSize(conf.promptTextSize - 6);
  // let c = ui.returnAnimatedColor(0);
  // fill(c);
  // noStroke();
  // text(`You’re nearly there.
  //   This will require you to focus.`, 0, -height * 0.2);
  // textSize(conf.promptTextSize - 13);
  // text(`To help you stay focused, we need access to your computer’s camera.
  //   Don’t worry, nothing is being recorded or seen by anyone.
  //   Your camera will automatically shut off after the session.
  //
  //   We value your privacy and will never share anything.
  //   See how we built all of this here.`, 0, -height * 0.1);
  // pop();
}
