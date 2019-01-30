class CIRCLE {
  constructor(size, h, s, b, a) {
    this.h = h;
    this.s = s;
    this.b = b;
    this.a = a;
    this.dia = size;
    this.expansion = 100;
    this.x = 0;
    this.y = 0;
  }

  display(breathIndex) {
    push();
    // console.log(this.a);
    let c = color(this.h, this.s, this.b, 10);
    fill(c);
    strokeWeight(1);
    stroke(this.h, this.s, this.b, 30);
    ellipse(this.x, this.y, this.dia + this.expansion * breathIndex, this.dia + this.expansion * breathIndex);
    pop();
  }
}
