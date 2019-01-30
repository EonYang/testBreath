class BREATH {
  constructor() {
    this.index = 0;
    this.base = -PI / 2;
    this.increment = 0.02;
    this.incrementFactor = 0.6;
    this.lastIndex = -0.1;
    this.lastUpdateTime = millis();
    this.expanding = 1;
    this.index2 = 0;
    this.zoomBase = PI / 20;
    this.zoom = 0.05;
    this.circlesDia = 1;
    this.state = 'prep';
    this.prepTime = 90;
    this.userRegression = 0;
    this.goal = 3;
    this.inhale = 0;
    this.exhale = 0;
    this.nowInhale = true;
    this.win = 0;
    this.formFadeIn = 0;


  }

  _beforSampling() {
    this.prepScaleUp();
    this.prepTime--;
    if (this.prepTime <= 0) {
      this.state = 'inhaleSampling';
    }
  }

  _inhaling(timePass) {
    if (this.index < 0.98) {
      // expanding the animation
      this.increment = PI * timePass / (conf.breathSec.inhale * 1000);
      this.base += this.increment;
      this.index = (sin(this.base) + 1) / 2;
      this.index2 += this.index - this.lastIndex;
    }
  }

  _exhaling(timePass) {
    if (this.index > 0.02) {
      // expanding the animation
      this.increment = PI * timePass / (conf.breathSec.exhale * 1000);
      this.base -= this.increment;
      this.index = (sin(this.base) + 1) / 2;
      this.index2 -= this.index - this.lastIndex;

    }
  }

  _mainSession(timePass) {
    if (this.nowInhale) {
      this._inhaling(timePass);
      if (this.index > 0.98 && this.userRegression > 0.7) {
        this.inhale++;
        this.nowInhale = false;
      }
    } else {
      this._exhaling(timePass);
      if (this.index < 0.03 && this.userRegression < 0.3) {
        this.exhale++;
        this.nowInhale = true;
      }
    }
  }



  updateIndex() {
    let timePass = millis() - this.lastUpdateTime;

    if (this.state == 'rightBeforeSampling') {
      this._beforSampling();
      textH1('Please be ready to take a deep breath with us');
    }

    if (this.state == 'inhaleSampling') {
      this._inhaling(timePass);
      if (this.index > 0.98) {
        let self = this;
        textH1('Very good, hold it');
        setTimeout(function() {
          self.state = 'exhaleSampling';
        }, 1000);
      } else {
        textH1('Please inhale');
      }
    }

    if (this.state == 'exhaleSampling') {
      this._exhaling(timePass);
      if (this.index < 0.02) {
        let self = this;
        textH1(`You've done perfect`);
        setTimeout(function() {
          self.state = 'training';
        }, 1000);
      } else {
        textH1('Please exhale');
      }
    }

    if (this.state == 'traning') {
      textH1(`Analyzing, please wait.`);
    }

    if (this.state == 'trained') {
      if (this.exhale < this.goal) {
        if (this.nowInhale) {
          textCountDown(`please inhale`);
        } else {
          textCountDown(`please exhale`);
        }
        textH1(`Breathed : ${this.exhale} / ${this.goal}`);
        this._mainSession(timePass);
      } else {
        if (!this.win) {
          this.success();
        }else {
          this.showForm();
        }
      }
    }

    // if (this.expanding) {
    //   this.increment = PI * timePass / (conf.breathSec.inhale * 1000);
    // } else {
    //   this.increment = PI * timePass / (conf.breathSec.exhale * 1000);
    // }

    this.lastIndex = this.index;
    this.lastUpdateTime = millis();

    this.showAnimation(this.circlesDia, 8);
  }

  prepScaleUp() {

    this.index = 0.01;
    if (this.zoomBase < PI) {
      this.zoomBase += 0.02;
    }
    this.zoom = (sin(this.zoomBase - PI / 2) + 1) / 2;

  }

  showAnimation(diaInit, seg) {
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

  success() {
    this.win = 1;
    $('#signUp').show();
    cameraOff();
  }

  showForm(){
    if (this.formFadeIn < 1) {
      this.formFadeIn += 0.02;
      $('#signUp').css("opacity", `${this.formFadeIn}`);
    }
  }



}

function textH1(t) {
  push();
  textSize(conf.promptTextSize - 6);
  let c = ui.returnAnimatedColor(0);
  fill(c);
  noStroke();
  text(t, 0, -height * 0.4);
  pop();
}

function textCountDown(t) {
  push();
  let c = ui.returnAnimatedColor(0);
  fill(c);
  noStroke();
  textSize(conf.countdownTextSize - 6);
  text(t, 0, -height * 0.28);
  pop();
}


// updateIndex() {
//     let timePass = millis() - this.lastUpdateTime;
//     if (this.expanding) {
//       this.increment = PI * timePass / (conf.breathSec.inhale * 1000);
//     } else {
//       this.increment = PI * timePass / (conf.breathSec.exhale * 1000);
//     }
//
//     if ( this.index >= 0.01) {
//       this.base += this.increment;
//     }
//     this.index = (sin(this.base) + 1) / 2;
//     if (this.index > this.lastIndex) {
//       this.expanding = 1;
//       this.index2 += this.index - this.lastIndex;
//     } else if (this.index < this.lastIndex) {
//       this.expanding = 0;
//       this.index2 -= this.index - this.lastIndex;
//     }
//     this.lastIndex = this.index;
//     this.lastUpdateTime = millis();
// }
