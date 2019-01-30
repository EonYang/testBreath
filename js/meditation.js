class MEDITATION {
  constructor() {
    this.startTime = millis() / 1000;
    this.goal = conf.goal;
    this.tolerance = conf.tolerance;
    this.dist = 0;
    this.timePass = 0;
    this.win = 0;
    this.isfailed = 0;
    this.successCalled = 0;
    this.formFadeIn = 0;
    this.failCountDown = 0;
    this.startCountDonw = 30;
    this.prepTime = 90;
    this.state = 'prep';
  }

  checkStatus(userCircle) {
    this.dist = dist(userCircle.x, userCircle.y, 0, 0);

    if (!cameraReady) {
      console.log("waiting");
    } else if (this.state == 'prep') {
      this.prep();
    } else if (this.state == 'inProgress') {
      // console.log(`${this.prepTime} <= 0`);
      this.timePass = floor(millis() / 1000 - this.startTime);
      this.onGoingText();
      this.failCountDown--;
      if (this.dist >= this.tolerance) {
        this.reset();
      } else if (this.goal - this.timePass <= 0) {
        this.success();
      }
    } else if (this.state == 'signUp') {
      this.showForm();
    }
    this.visualizeDistance();
  }

  visualizeDistance() {
    // userCircle.a = 30;
    userCircle.a = constrain((this.tolerance - this.dist + 40) / 2, 20, 90);
  }

  prep() {
    if (this.prepTime > 0) {
      this.prepTime -= 1;
    } else {
      this.state = 'inProgress';
    }
    this.startTime = millis() / 1000;

    myText(`Move you head to place to circle in the center of the screen`, -0.3, -6);
    myText(`Starting in ${floor(this.prepTime/30) + 1} seconds.`, -0.2, -6);

  }



  onGoing() {
    this.isfailed = 0;
    if (cameraReady && !this.win) {
      this.onGoingText();
    }
  }

  onGoingText() {
    myText(`${conf.prompt}\n${fancyTimeFormat(this.goal - this.timePass)}`, -0.4, -6, 2);

    // myText(fancyTimeFormat(this.goal - this.timePass), -0.22, 6);

    if (this.failCountDown > 0) {
      myText(conf.prompt2, 0.3, -6, 50);
    }
  }

  reset() {
    this.startTime = millis() / 1000;
    this.failCountDown = 90;
  }


  success() {
    if (this.state == 'inProgress') {
      this.state = 'signUp';
      $('#signUp').show();
      this.win = true;
      cameraOff();
    }
  }

  showForm() {
    if (this.formFadeIn <= 1) {
      this.formFadeIn += 0.03;
      $('#signUp').css("opacity", `${this.formFadeIn}`);
    }
  }
}

class BREATH {
  constructor() {
    this.index = 0;
    this.base = 0;
    this.increment = 0.02;
    this.incrementFactor = 0.6;
    this.lastIndex = -0.1;
    this.lastUpdateTime = millis();
    this.expanding = 1;
    this.index2 = 0;
    this.zoomBase = PI / 20;
    this.zoom = 0.05;
    this.circlesDia = 1;

  }
  updateIndex() {

    let timePass = millis() - this.lastUpdateTime;
    if (this.expanding) {
      this.increment = PI * timePass / (conf.breathSec.inhale * 1000);
    } else {
      this.increment = PI * timePass / (conf.breathSec.exhale * 1000);
    }

    if (!meditation.win || this.index >= 0.01) {
      this.base += this.increment;
    }
    this.index = (sin(this.base) + 1) / 2;
    if (this.index > this.lastIndex) {
      this.expanding = 1;
      this.index2 += this.index - this.lastIndex;
    } else if (this.index < this.lastIndex) {
      this.expanding = 0;
      this.index2 -= this.index - this.lastIndex;
    }
    this.lastIndex = this.index;
    this.lastUpdateTime = millis();

    // text(this.base, 100, 100);
    // text(this.increment * this.incrementFactor, 100, 150);
    // text(this.index, 100, 200);
  }

  updateCircleZoomFactor() {
    if (cameraReady) {
      if (this.zoomBase < PI) {
        this.zoomBase += 0.02;
        // console.log('base');
        // console.log(this.zoomBase);
      }
      this.zoom = (sin(this.zoomBase - PI / 2) + 1) / 2;
      // console.log(this.zoom);
    }
  }

  showAnimation(diaInit, seg) {
    this.updateCircleZoomFactor();
    let dia = this.zoom * diaInit;
    for (let i = 0; i < seg; i++) {
      push();
      rotate(2 * i * PI / seg + this.index2);
      let w = cos(PI / seg) * dia * this.index; //x position
      let h = sin(PI / seg) * dia * this.index; //x position
      let c = color(240, 1, 95, 100);
      c.setAlpha(10);
      fill(c);
      c.setAlpha(60);
      stroke(c);
      ellipse(w, h, dia / 1.5 + w);
      pop();
    }
  }
}


function fancyTimeFormat(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function myText(t, p, sizeFix, moreH) {
  let h = (width - 64);
  if (moreH != undefined) {
    h = (width - 64) * moreH;
  }
  push();
  textSize(conf.promptTextSize + sizeFix);
  let c = ui.returnAnimatedColor(0);
  // if (o != undefined) {
  //   c.setAlpha = o;
  // }
  fill(c);
  noStroke();
  text(t, 0, height * p + (h / 2), width - 64, h );
  pop();
}
