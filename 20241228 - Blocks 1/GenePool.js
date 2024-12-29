// TODO: Rename "genes" to "chromosomes"

function GenePool(popSize, numBlocks){
    this.age = 0;
    this.genes = [];
    this.gene_fitness = [];
    for(let i=0; i<popSize; i++) {
        this.genes.push(this.spawn_random_tower(numBlocks))
    }
}

GenePool.prototype.reset = function() {
    this.gene_fitness = [];
    current_gene = 0;
}

GenePool.prototype.reproduce = function() {
    // Create weighted gene pool
    let top_fitness = Math.max.apply(null, this.gene_fitness)
    let wghtd_fitness = this.gene_fitness.map(function(x){return(Math.floor(100*x/top_fitness))});
    let wghtd_gene_pool = [];
    
    for(let i=0; i<this.genes.length; i++) {
        // Add index i to the pool fitness[i] times
        const copies = wghtd_fitness[i];
        for(let j=0; j<copies; j++) {
            wghtd_gene_pool.push(i);
        }
    }
    // Crossover and Mutate
    let new_genes = [];
    let a_, b_, new_;
    for(let i=0; i<this.genes.length; i++) {
        // Select two random genes from the gene pool
        a_ = wghtd_gene_pool[get_random_int(0, wghtd_gene_pool.length)];
        b_ = wghtd_gene_pool[get_random_int(0, wghtd_gene_pool.length)]; 
        new_ = this.crossover_genes(this.genes[a_], this.genes[b_]);
        // Mutate
        new_ = this.mutate_gene(new_);
        // Push to new gene pool
        new_genes.push(new_);
    }
    this.genes = new_genes;
}

GenePool.prototype.mutate_gene = function(gene, mutationRate = 0.1, addRate = 0.3, deleteRate = 0.05) {
    // 
    let new_chromosome = [...gene];
    // Delete
    for(let i = new_chromosome.length - 1; i >= 0; i--) {
        // Possibly delete gene
        if(Math.random() < deleteRate) {
            new_chromosome.splice(i, 1);
        }
    }
    // Mutate
    for(let i = 0; i < new_chromosome.length; i++) {
        // Possibly mutate gene
        if(Math.random() < mutationRate) {
            new_chromosome[i] = this.spawn_random_block()
        }
    }
    
    // Possibly add new gene
    if(Math.random() < addRate || new_chromosome.length === 0) {
        // Create a new random gene
        const new_gene = this.spawn_random_block();
        const randi = Math.floor(Math.random() * (new_gene.length + 1)); 
        new_chromosome.splice(randi, 0, new_gene);
    }

    return(new_chromosome)
}

GenePool.prototype.crossover_genes = function(genes_a, genes_b) {
    var new_gene = [];
    // Picks random midpoint
    var mid = Math.floor(Math.random()*Math.min(genes_a.length, genes_b.length));
    for (let i = 0; i < mid; i++) {
        new_gene.push(genes_a[i]);
    }
    for (let i = mid; i < genes_b.length; i++) {
        new_gene.push(genes_b[i]);
    }
    return(new_gene);
}

GenePool.prototype.spawn_random_block = function(){
    // Genes are expressed from left to right
    // width selected every 10 from 10 to 120
    // height selected every 10 from 10 to 120
    // starting x an integer from mid-screen +/- 100 in increments of 5
    // rotation an integer either 0 or 90
    return([
        get_random_int(1, 12) * 10,
        get_random_int(1, 12) * 10,
        p.width/2 + get_random_int(-10, 10)*10,
        0 // get_random_int(0, 1) * 90 // No rotations.
    ])
}

GenePool.prototype.spawn_random_tower = function(numBlocks){
    let genes = [];
    for(let i=0; i<numBlocks; i++) {
        genes.push(this.spawn_random_block())
    }
    return(genes);
}