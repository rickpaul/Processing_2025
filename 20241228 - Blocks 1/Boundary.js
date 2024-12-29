function Boundary(x, y, w, h) {
    var options = {
        restitution: 1,
        isStatic: true
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
}
  
Boundary.prototype.show = function () {
    p.fill(255);
    p.stroke(255);
    var pos = this.body.position;
    p.push();
    p.translate(pos.x, pos.y);
    p.rectMode(p.CENTER);
    p.rect(0, 0, this.w, this.h);
    p.pop();
}