class UI {
  constructor() {
    this.hue = conf.color.h.left;
    this.sat = conf.color.s.right;
    this.alp = conf.color.a.left;
  }

  updateColor(breathIndex) {
    this.hue = conf.color.h.left + (conf.color.h.right - conf.color.h.left) * breathIndex;
    this.sat = conf.color.s.left + (conf.color.s.right - conf.color.s.left) * breathIndex;
    this.alp = conf.color.a.left + (conf.color.a.right - conf.color.a.left) * breathIndex;
  }


  returnAnimatedColor(hueOffset, breathIndex) {
    let h = conf.color.h.left + (conf.color.h.right - conf.color.h.left) * ((breathIndex * 100 + hueOffset) % 100) / 100;
    let c = color(h, this.sat, 90, this.alp);
    return c;
  }

  animateBtn() {
    let color = `hsla(${240}, 1%, 95%, ${100})`
    $('#startBtn').css("background-color", color);
  }

}

function tryRemoveSignUpText() {
  if ($('.pfy-form-container').length > 0) {
    $('#signUpText').children().remove();
  }
}
