class Point {
  constructor(x, y, gridX, gridY) {
    // Position variables
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    // Neighbor connections
    this.neighbors = [];
    // Selection variables
    this.selected = false;
    // Pathing variables
    this.gScore = Infinity;
    this.fScore = Infinity;
    this.cameFrom = null;
    this.visited = false;
  }

  reset_pathing_variables() {
    this.gScore = Infinity;
    this.fScore = Infinity;
    this.cameFrom = null;
    this.visited = false;
  }
  
  // Heuristic function (straight-line distance)
  heuristic(target) {
    return this.distToOther(target);
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

  // Calculate distance to point
  distToOther(other) {
    return dist(this.x, this.y, other.x, other.y);
  }

  // Get grid coordinates as string key
  getGridKey() {
    return `${this.gridX},${this.gridY}`;
  }
}

class Network {
  points = [];
  selected_points = [];

}



function reconstruct_path(point) {
  let path = [point];
  while (point.cameFrom) {
    point = point.cameFrom;
    path.unshift(point);
  }
  return path;
}


// Find A* Path
function find_path(start, goal) {
  // Reset all points
  selectedPoints.forEach(p => p.reset_pathing_variables());
  // The set of discovered nodes that need to be evaluated
  let openSet = [start];
  let visited = [];
  start.gScore = 0; // cost from start along best known path
  start.fScore = start.heuristic(goal); // estimated total cost from start to goal through y
  let i = 0;
  while (openSet.length > 0) {
    i++;
    if (i > 100) {
      break;
    }

    // Find most promising node
    let current = openSet.reduce((a, b) => a.fScore < b.fScore ? a : b);
    
    // Check if goal reached
    if (current === goal) {
      return reconstruct_path(current);
    }
    // Remove current from 
    current.visited = true;
    visited.push(current);
    openSet = openSet.filter(p => p !== current);
    
    // Check all neighbors
    for (let neighbor of current.neighbors.filter(n => !n.visited)) {
      // Distance from start to neighbor through current
      let tentativeGScore = current.gScore + current.distToOther(neighbor);
      
      if (tentativeGScore < neighbor.gScore) {
        // This path is better than any previous one
        neighbor.cameFrom = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = tentativeGScore + neighbor.heuristic(goal);
        
        if (!openSet.includes(neighbor) && !neighbor.visited) {
          openSet.push(neighbor);
        }
      }
    }
  }
  // If we didn't reach the goal, return the visited node with the lowest fScore
  return reconstruct_path(visited.reduce((a, b) => a.fScore < b.fScore ? a : b));
}

let points = [];
let selectedPoints = [];
let edgePoints = [];
let selectionRadius;
let spacing;
let noiseOffset = 0;
const gridSize = 40;
const noiseScale = 0.37; // 0.25 is good
const perturbAmount = 76;
const selectionRadiusRatio = 0.57; // 0.37 is good
const spacingRatio = 1/37;
let redrawButton;

function setup() {
    createCanvas(1200, 1200);

    selectionRadius = width *.37;
    spacing = width / 37;
    redrawButton = createButton('Redraw Network');
    redrawButton.position(10, height + 10);
    redrawButton.mousePressed(_redraw_network);
    // Draw
    _redraw_network();
}

function create_grid() {
  const grid_points = [];
  for (let y = 0; y < gridSize; y++) {
    grid_points[y] = [];
    for (let x = 0; x < gridSize; x++) {
      const baseX = (width - (gridSize-1) * spacing) / 2 + x * spacing;
      const baseY = (height - (gridSize-1) * spacing) / 2 + y * spacing;
      grid_points[y][x] = new Point(baseX, baseY, x, y);
    }
  }
  return grid_points;
}

function select_points(points, centerX, centerY) {
  let selected_points = [];
  const select_map = new Map();
  
  // Select points within the circle
  for (let y = 0; y < points.length; y++) {
    for (let x = 0; x < points[y].length; x++) {
      const point = points[y][x];
      const angle = atan2(point.y - 0.8*centerY, point.x - 0.7*centerX); // note this is symmetric around y axis
      const radius = (selectionRadius * (noise(angle))); 
      if (point.distToCenter(centerX, centerY) < radius ) {
        selected_points.push(point);
        select_map.set(point.getGridKey(), point);
      }
    }
  }
  
  // Set up neighbor connections
  for (let point of selected_points) {
    // Check four adjacent neighbors
    const neighborCoords = [
      [point.gridX, point.gridY - 1], // up
      [point.gridX + 1, point.gridY], // right
      [point.gridX, point.gridY + 1], // down
      [point.gridX - 1, point.gridY]  // left
    ];
    // Save neighbors into points
    for (let [x, y] of neighborCoords) {
      if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        const neighborKey = `${x},${y}`;
        const neighbor = select_map.get(neighborKey);
        if (neighbor) {
          point.neighbors.push(neighbor);
        }
      }
    }
  }

  // Remove points with only one neighbor
  // TODO: Fix this so it actually works. I don't hate the effect though.
  let queue = [];
  queue = queue.concat(selected_points);
  while (queue.length > 0) {
    const point = queue.shift();
    if (point.neighbors.length <= 1) {
      selected_points = selected_points.filter(p => p !== point);
      select_map.delete(point.getGridKey());
      // Remove connections from neighbors
      for (let neighbor of point.neighbors) { 
        neighbor.neighbors = neighbor.neighbors.filter(n => n !== point);
        // Push neighbors to queue
        queue.push(neighbor);
      }
    }
  }
  
  // Remove non-selected points from neighbors
  for (let row of points) {
    for (let point of row) {
      if (!select_map.has(point.getGridKey())) {
        // Remove connections from neighbors
        for (let neighbor of point.neighbors) {
          neighbor.neighbors = neighbor.neighbors.filter(n => n !== point);
        }
      }
    }
  }
  
  return selected_points;
}

function select_edge_points() {
  /*
  desc:
    Select points on the edge of the circle
  */
  let edge_points = [];
  for (let point of selectedPoints) {
    if (point.neighbors.length <= 3) {
      edge_points.push(point);
    }
  }
  return edge_points;
}

///////////////////////////////////////
// Draw Functions
///////////////////////////////////////

function draw_path(path) {
  if (!path) return;
  
  // Draw the path (debugging)
  push();
    stroke(100, 100, 100, 200); // Red color for the path
    strokeWeight(2);
    for (let i = 0; i < path.length - 1; i++) {
      line(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
    }
    
    // Highlight start and end points
    stroke(0, 255, 0); // Green for start
    fill(0, 255, 0);
    circle(path[0].x, path[0].y, 8);
    
    stroke(255, 0, 0); // Red for end
    fill(255, 0, 0);
    circle(path[path.length-1].x, path[path.length-1].y, 8);
  pop();
}

function _redraw_network() {
    // Create grid of points
    points = create_grid();
    
    // Apply perlin noise displacement
    for (let row of points) {
        for (let point of row) {
            point.perturb(noiseScale, noiseOffset, perturbAmount);
        }
    }
    // Select center points and set up their connections
    selectedPoints = select_points(points, width/2, height/2);
    edgePoints = select_edge_points();
    // Reset Background
    _draw_background();
    // Draw connections
    for (let point of selectedPoints) {
        point.drawConnections();
    }
    // Draw points
    for (let point of selectedPoints) {
        point.draw();
    }
    for(let i = 0; i < selectedPoints.length; i++) {
        // Draw single path (debugging)
        if (edgePoints.length >= 2) {
          let start = random(edgePoints);
          let end;
          do {
              end = random(edgePoints);
          } while (end === start);
          
          let path = find_path(start, end);
          draw_path(path);
      }
    }
}

function _draw_background() {
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