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
  // Add movement history arrays
  this.velocityHistory = Array(10).fill({ x: 0, y: 0 });
  this.angularHistory = Array(10).fill(0);
  World.add(world, this.body);
}

Block.prototype.is_onscreen = function () {
  var x = this.body.position.x;
  var y = this.body.position.y;
  return (x > -50 && x < p.width + 50 && y < p.height);
}

Block.prototype.update_movement_history = function() {
  // Add current velocities to history
  this.velocityHistory.push({
      x: this.body.velocity.x,
      y: this.body.velocity.y
  });
  this.angularHistory.push(this.body.angularSpeed);
  
  // Remove oldest entries
  if (this.velocityHistory.length > 10) {
      this.velocityHistory.shift();
  }
  if (this.angularHistory.length > 10) {
      this.angularHistory.shift();
  }
}

Block.prototype.is_moving = function () {
  // First update the history
  this.update_movement_history();
  
  // Calculate average velocities over the last 10 frames
  const avgVelocity = {
      x: this.velocityHistory.reduce((sum, vel) => sum + vel.x, 0) / 10,
      y: this.velocityHistory.reduce((sum, vel) => sum + vel.y, 0) / 10
  };
  
  // Calculate the maximum velocities over the last 10 frames
  const maxVelocity = this.velocityHistory.reduce((max, vel) => Math.max(max, vel.x, vel.y), 0);

  // Calculate the average angular speed over the last 10 frames
  const avgAngularSpeed = this.angularHistory.reduce((sum, ang) => sum + Math.abs(ang), 0) / 10;

  // Calculate the maximum angular speed over the last 10 frames
  const maxAngularSpeed = this.angularHistory.reduce((max, ang) => Math.max(max, Math.abs(ang)), 0);
  
  // Return true if any average velocity component is above tolerance
  return (
      avgVelocity.x > TOL ||
      avgVelocity.y > TOL ||
      maxVelocity > TOL ||
      avgAngularSpeed > TOL ||
      maxAngularSpeed > TOL
  );
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