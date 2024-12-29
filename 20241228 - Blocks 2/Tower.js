

const minBlockWidth = 30;   // Minimum block width
const maxBlockWidth = 80;   // Maximum block width
const minBlockHeight = 20;  // Minimum block height
const maxBlockHeight = 40;  // Maximum block height

const minSpawnHeight = 20;  // Minimum height above highest block
const maxSpawnHeight = 100; // Maximum height above highest block
const maxSpawnOffset = 50;  // Maximum x offset from previous block



function Tower(genes) {
    this.blocks = [];
    this.genes = genes || _generateGenes();
    this.fitness = 0;
    this.stability = 0;
    this.currentBlock = 0;
    this.isComplete = false;
}

Tower.prototype.getHighestPoint = function() {
    if(this.blocks.length === 0) {
        return 0;
    }
    else {
        let highest = Math.min(...this.blocks.map(block => block.body.position.y - block.h/2));
        return highest;
    }
}

Tower.prototype.getLastBlockX = function() {
    if(this.blocks.length === 0) {
        return WIDTH/2;
    }
    else {
        return this.blocks[this.blocks.length - 1].body.position.x;
    }

}

Tower.prototype.spawnNextBlock = function() {
    if (this.currentBlock >= this.genes.length) {
        this.isComplete = true;
        return;
    }

    let gene = this.genes[this.currentBlock];
    let highestPoint = this.getHighestPoint();
    let lastX = this.getLastBlockX();
    
    // Calculate new x position based on offset from last block
    let newX = lastX + gene.xOffset;
    // Keep within boundaries
    // TODO: Is this right?
    newX = constrain(newX, gene.w/2, width - gene.w/2);

    let block = new Block(
        newX,
        highestPoint - gene.spawnHeight,
        gene.w,
        gene.h
    );
    this.blocks.push(block);
    // TODO: Removed code below
    // blocks.push(block);
    this.currentBlock++;
}

_generateGenes = function() {
    let genes = [];
    for (let i = 0; i < maxBlocks; i++) {
        genes.push({
            xOffset: random(-maxSpawnOffset, maxSpawnOffset), // Offset from previous block's x position
            w: random(minBlockWidth, maxBlockWidth),
            h: random(minBlockHeight, maxBlockHeight),
            spawnHeight: random(minSpawnHeight, maxSpawnHeight)
        });
    }
    return genes;
}