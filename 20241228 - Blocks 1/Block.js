function Block(x, y, w, h, rot) {
    let options = {
        restitution: 0.5,
        friction: 1,
        density: 1,
        angle: rot,
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.active = true;
    World.add(world, this.body);
}

Block.prototype.is_onscreen = function () {
  var x = this.body.position.x;
  var y = this.body.position.y;
  return (x > -50 && x < p.width + 50 && y < p.height);
}

Block.prototype.is_moving = function () {
  return(
      (Math.abs(this.body.velocity.x) > TOL) ||
      (Math.abs(this.body.velocity.y) > TOL) ||
      (Math.abs(this.body.angularSpeed) > TOL)
  )
}

Block.prototype.show = function () {
  p.fill(255);
  p.stroke(255);
  let pos = this.body.position;
  p.push();
  p.translate(pos.x, pos.y);
  p.rotate(this.body.angle);
  p.rectMode(p.CENTER);
  p.rect(0, 0, this.w, this.h);
  p.pop();
}

// TODO: Allow for other fills and strokes
Block.prototype.toSVG() = function () {
  let pos = this.body.position;
  let angle = this.body.angle;
  
  return`<rect 
      x="${pos.x - this.w/2}" 
      y="${pos.y - this.h/2}" 
      width="${this.w}" 
      height="${this.h}"
      transform="rotate(${angle * 180 / Math.PI} ${pos.x} ${pos.y})"
      fill="none"
      stroke="black"
  />`;

}