// TODO: make width, height dynamic
function exportSVG() {
    let svgContent = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="800" height="600" fill="#dcdcdc"/>
            <rect x="0" y="590" width="800" height="20" fill="#808080"/>
            ${blocks.map(block => block.toSVG()).join('\n')}
        </svg>
    `;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tower-generation-${generation}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function startSimulation() {
    isRunning = true;
}

function pauseSimulation() {
    isRunning = false;
}

function resetSimulation() {
    for (let block of blocks) {
        Matter.World.remove(world, block.body);
    }
    blocks = [];
    
    generation = 0;
    currentTower = 0;
    scores = [];
    bestScore = 0;
    bestTower = null;
    maxBlocks = 4;
    
    initializePopulation();
}

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
    
    engine = Matter.Engine.create();
    world = engine.world;
    
    ground = Matter.Bodies.rectangle(width/2, height-10, width, 20, {
        isStatic: true
    });
    Matter.World.add(world, ground);
    
    initializePopulation();
}

function draw() {
    if (!isRunning) return;
    
    background(220);
    Matter.Engine.update(engine);
    
    // Draw ground
    fill(128);
    rectMode(CENTER);
    rect(width/2, height-10, width, 20);
    
    // Draw blocks
    fill(200);
    stroke(0);
    for (let block of blocks) {
        block.show();
    }
    
    // Display stats
    fill(0);
    noStroke();
    textSize(16);
    text(`Generation: ${generation}`, 20, 30);
    text(`Best Score: ${bestScore.toFixed(2)}`, 20, 50);
    text(`Max Blocks: ${maxBlocks}`, 20, 70);

    // Check current tower status
    let currentTowerObj = towers[currentTower];
    if (currentTowerObj.isComplete) {
        if (stabilityCheckCounter++ > 60) {
            let score = currentTowerObj.calculateFitness();
            scores[currentTower] = score;

            if (score > bestScore) {
                bestScore = score;
                bestTower = currentTowerObj;
            }

            currentTower++;
            stabilityCheckCounter = 0;

            if (currentTower >= populationSize) {
                nextGeneration();
                currentTower = 0;
            }

            if (currentTower < populationSize) {
                for (let block of blocks) {
                    Matter.World.remove(world, block.body);
                }
                blocks = [];
                towers[currentTower].spawnNextBlock();
            }
        }
    } else if (frameCount % blockSpawnDelay === 0 && currentTowerObj.areAllBlocksStable()) {
        currentTowerObj.spawnNextBlock();
    }
}