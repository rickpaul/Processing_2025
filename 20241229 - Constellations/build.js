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
  draw() {
    stroke(255);
    strokeWeight(4);
    point(this.x, this.y);
  }

  // Draw connections to neighbors
  drawConnections() {
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
  selectionRadius = width *.37;
  spacing = width / 37;
  redrawButton = createButton('Redraw Network');
  redrawButton.position(10, height + 10);
  redrawButton.mousePressed(redrawNetwork);
  
  redrawNetwork();
}

function createGrid() {
  const points = [];
  for (let y = 0; y < gridSize; y++) {
    points[y] = [];
    for (let x = 0; x < gridSize; x++) {
      const baseX = (width - (gridSize-1) * spacing) / 2 + x * spacing;
      const baseY = (height - (gridSize-1) * spacing) / 2 + y * spacing;
      points[y][x] = new Point(baseX, baseY, x, y);
    }
  }
  return points;
}

function selectCenterPoints(points, centerX, centerY) {
  const selectedPoints = [];
  const selectedMap = new Map();
  
  for (let y = 0; y < points.length; y++) {
    for (let x = 0; x < points[y].length; x++) {
      const point = points[y][x];
      if (point.distToCenter(centerX, centerY) < selectionRadius && random() > 0.63) {
        selectedPoints.push(point);
        selectedMap.set(point.getGridKey(), point);
      }
    }
  }
  
  // Set up neighbor connections
  for (let point of selectedPoints) {
    // Check four adjacent neighbors
    const neighborCoords = [
      [point.gridX, point.gridY - 1], // up
      [point.gridX + 1, point.gridY], // right
      [point.gridX, point.gridY + 1], // down
      [point.gridX - 1, point.gridY]  // left
    ];
    
    for (let [x, y] of neighborCoords) {
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        const neighborKey = `${x},${y}`;
        const neighbor = selectedMap.get(neighborKey);
        if (neighbor) {
          point.neighbors.push(neighbor);
        }
      }
    }
  }
  
  return selectedPoints;
}

function redrawNetwork() {
  noiseOffset = random(1000);
  
  // Create grid of points
  points = createGrid();
  
  // Apply perlin noise displacement
  for (let row of points) {
    for (let point of row) {
      point.perturb(noiseScale, noiseOffset, perturbAmount);
    }
  }
  
  // Select center points and set up their connections
  selectedPoints = selectCenterPoints(points, width/2, height/2);
  // Reset Background
  drawBackground();
  // Draw connections
  for (let point of selectedPoints) {
    point.drawConnections();
  }
  // Draw points
  for (let point of selectedPoints) {
    point.draw();
  }
}

function drawBackground() {
    // Draw mat background
    push();
        fill(1,3,4);
        noStroke();
        rect(0, 0, width, height);
    pop();
    // Create dark overlay central grid
    push();
        fill(6,14,26);
        noStroke();
        // Set to center of canvas
        translate(width / 2, height / 2);
        // Set to center mode
        rectMode(CENTER);
        // Draw circle of radius selectionRadius
        ellipse(0, 0, selectionRadius * 2 * 1.05);
    pop();
}

function draw() {
  noLoop();
}