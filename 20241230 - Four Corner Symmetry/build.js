class Point {
  constructor(x, y, gridX, gridY) {
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.neighbors = [];
  }

  // Add perlin noise displacement to the point
  perturb(noiseScale, noiseOffset, amount) {
    this.x += noise(this.gridX * noiseScale, this.gridY * noiseScale, noiseOffset) * amount;
    this.y += noise(this.gridX * noiseScale, this.gridY * noiseScale, noiseOffset + 1000) * amount;
  }

  // Draw the point itself
  draw(color, size) {
    stroke(color || 255);
    strokeWeight(size || 4);
    point(this.x, this.y);
  }

  // Draw connections to neighbors
  drawConnections(color, weight) {
    stroke(200, 200, 255, 50);
    strokeWeight(0.5);
    for (let neighbor of this.neighbors) {
      line(this.x, this.y, neighbor.x, neighbor.y);
    }
  }

  // Calculate distance to canvas center
  distToCenter(centerX, centerY) {
    return dist(this.x, this.y, centerX, centerY);
  }

  // Get grid coordinates as string key
  getGridKey() {
    return `${this.gridX},${this.gridY}`;
  }
}

let points = [];
let selectedPoints = [];
const gridSize = 40;
const noiseScale = 0.5;
const perturbAmount = 76;
let selectionRadius;
let spacing;
let noiseOffset = 0;
let redrawButton;

function setup() {
    createCanvas(1200, 1200);
    background(255);
    selectionRadius = width *.37;
    angleMode(RADIANS);
    strokeWeight(3);    
    noFill();

    
    // Draw the noisy circle
    beginShape();
        for (let i = 0; i < TWO_PI; i += 0.01) {
            // Use sin and cos to create periodic noise
            let noiseX = cos(i);
            let noiseY = sin(i);
            // Adjust these multipliers to control the noisiness
            let radius = selectionRadius * .7 * (noise(noiseX, noiseY));
            
            vertex(
            width/2 + radius * cos(i), 
            height/2 + radius * sin(i)
            );
        }
    endShape(CLOSE);




    // spacing = width / 37;
    // redrawButton = createButton('Redraw Network');
    // redrawButton.position(10, height + 10);
    // redrawButton.mousePressed(redraw_network);
    // // Draw
    // redraw_network();
}

function draw() {
  noLoop();
}