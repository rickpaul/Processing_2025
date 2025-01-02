// aliases
var Engine = Matter.Engine;
var World = Matter.World;
var Events = Matter.Events;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;

var GP;
var blocks;

// variables
var engine;
var world;

const TOL = 0.01;

var sketch = function(p) {


    var current_gene;
    var current_block;
    // var blocks;
    var statics = [];
    var bounds = [];
    var activeBlock;
    var latestBlock;
    // constants
    

    p.setup = function() {
        // Processing Setup
        p.createCanvas(1600, 900);
        p.colorMode(p.HSB);
        p.frameRate(100);
        // Matter Setup
        engine = Engine.create();
        engine.timing.timeScale = 1;
        world = engine.world;
        world.gravity.y = 0.1;
        // Create Boundaries
        bounds.push(new Boundary(p.width/2, p.height+50, p.width, 100));
        blocks = [];
        //
        activeBlock = false;
        latestBlock = null;
        GP = new GenePool(20, 20);
        current_gene = 0;
        current_block = 0;
    }

    p.draw = function() {
        success = buildTower(GP.genes[current_gene]);
        if(success != null){
            // Save fitness
            console.log(success);
            GP.gene_fitness.push(success);
            // Reset world
            blocks = [];
            current_gene += 1;
            current_block = 0;
            activeBlock = false;
        }
        if(current_gene >= GP.genes.length){
            GP.age += 1;
            console.log('#################### New Age');
            // Create next generation
            GP.reproduce();
            // TODO: Write to file
            // Reset for next run
            GP.reset();
            current_gene = 0;
        }
        if(GP.age > 20) {
            p.noLoop();
        }
    }

    buildTower = function(genes) {
        if(activeBlock) {
            draw_();
            activeBlock = (
                latestBlock.is_moving() &&
                latestBlock.is_onscreen())
            if(!activeBlock) {
                latestBlock.active = false;
            }
        } else {
            if(current_block >= genes.length) {
                blocks.map(function(pt){Composite.remove(world, pt.body)});
                return(measure_success());
            }
            else {
                latestBlock = new Block(genes[current_block][2], 
                                        p.height - (find_max_height() + 50), 
                                        genes[current_block][0], 
                                        genes[current_block][1], 
                                        genes[current_block][3]);
                blocks.push(latestBlock);
                activeBlock = true;
                current_block += 1;
            }
        }
        return(null);
    }

    draw_ = function() {
        /*
            desc: 
                This is the real draw function
        */
        p.background(0);
        Engine.update(engine, 1000/30);
        for (var i = 0; i < bounds.length; i++) {
            bounds[i].show();
        }
        for (var i = 0; i < blocks.length; i++) {
            blocks[i].show();
        }
    }

    //   function Particle(x, y, r) {
    //     this.hue = p.random(360);
    //     var options = {
    //       restitution: 0.5,
    //       friction: 0,
    //       density: 1
    //     }
    //     x += p.random(-1, 1);
    //     this.body = Bodies.circle(x, y, r, options);
    //     this.body.label = "particle";
    //     this.r = r;
    //     World.add(world, this.body);
    //   }
      
    //   Particle.prototype.isOffScreen = function () {
    //     var x = this.body.position.x;
    //     var y = this.body.position.y;
    //     return (x < -50 || x > p.width + 50 || y > p.height);
    //   }
      
    //   Particle.prototype.show = function () {
    //     p.fill(this.hue, 255, 255);
    //     p.noStroke();
    //     var pos = this.body.position;
    //     p.push();
    //     p.translate(pos.x, pos.y);
    //     p.ellipse(0, 0, this.r * 2);
    //     p.pop();
    //   }
}


p = new p5(sketch, 'canvas');