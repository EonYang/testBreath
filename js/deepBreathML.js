let canvas;
let breath;
let userCircle;
let circlesZoom = 0.1;
let training = false;

var video;
let smooth = {
  x: [],
  y: []
};

let started = 0;
let settedUp = 0;

let bgColor;

var cameraReady = 0;

let featureExtractor;
let regressor;
let loss;
let slider;
let samples = 0;
let positionX = 140;
let exhaleSampleNum = 0;
let inhaleSampleNum = 0;

function preload() {
  font = loadFont('fonts/Futura_PT/FuturaPTMedium.otf');
  song = loadSound('sound/Aduri - Monica 5 Min (No Vox).mp3');
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
  noStroke();

  colorMode(HSB, 360, 100, 100, 100);
  bgColor = color(244, 33, 36, 100);

  userCircle = new CIRCLE(height / 5, 37, 84, 70, 90);
  breath = new BREATH();
  breath.circlesDia = height / 6;
  ui = new UI();

}

function startSketch() {
  started = 1;
  $("#promptDiv").children().remove();
}

function delayedSetup() {
  // startCamera();
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.hide();
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  regressor = featureExtractor.regression(video, videoReady);
  settedUp = 1;
}

function draw() {
  // console.log(frameRate().toFixed(2));

  breath.updateIndex();
  bgColor.setAlpha = 10 + 70 * breath.index;
  background(bgColor);

  translate(width / 2, height / 2);
  breath.showAnimation(breath.circlesDia, 8);

  // delayed loop
  if (started) {
    if (!settedUp) {
      delayedSetup();
    }
    delayedLoop();
  }
}

function delayedLoop() {
  userCircle.a = 30;
  userCircle.display(breath.userRegression);

  // image(video, 0, 0, 340, 280);

  if (breath.state == 'inhaleSampling' && breath.index >= 0.8) {
    addInhaleSample();
    console.log(inhaleSampleNum);
  }

  if (breath.state == 'exhaleSampling' && breath.index <= 0.2) {
    addExhaleSample();
    console.log(exhaleSampleNum);
  }

  if (breath.state == 'training' && !training) {
    console.log(training);
    training = true;
    trainModel();
  }

  breath.updateIndex();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  userCircle.dia = height / 6;
  breath.circlesDia = height / 6;
}

// A function to be called when the model has been loaded
function modelReady() {
  console.log('Base Model (MobileNet) Loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  console.log('Video ready!');
  breath.state = 'rightBeforeSampling';
  if (!song.isPlaying()) {
    song.play();
  }
}

function addInhaleSample() {
  regressor.addImage(0.9);
  inhaleSampleNum++;
}

function addExhaleSample() {
  regressor.addImage(0.1);
  exhaleSampleNum++;
}

function trainModel() {
  regressor.train(function(lossValue) {
    if (lossValue) {
      loss = lossValue;
      console.log('Loss: ' + loss);

    } else {
      console.log('Done Training! Final Loss: ' + loss);
      breath.state = 'trained';
      predict();
    }
  });
}

function predict() {
  regressor.predict(gotResults);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  breath.userRegression = smoothRegression(result);
  if (frameCount % 30 == 0) {
    console.log(breath.userRegression);
  }

  // positionX = map(result, 0, 1, 0, width);
  // slider.value(result);
  predict();
}

function cameraOff() {
  video.pause();
  video.srcObject.getTracks()[0].stop();
  console.log("Vid off");
}


function smoothRegression(data) {

  // reverse X
  smooth.x.push(data);

  if (smooth.x.length > 10) {
    smooth.x.shift();
  }
  let smoothX = 0;
  for (let i = 0; i < smooth.x.length; i++) {
    smoothX += smooth.x[i];
  }


  return smoothX / smooth.x.length;
}
