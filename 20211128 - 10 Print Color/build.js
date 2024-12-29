// Reference:
// https://openprocessing.org/sketch/858198


let WIDTH = 800;
let HEIGHT = 1200;
let CELL_SIZE = 30;
let w_offset_frac = 1/15;
let h_offset_frac = 1/15;
let W_CELL_N = Math.floor(WIDTH*(1-2*w_offset_frac)/CELL_SIZE);
let H_CELL_N = Math.floor(HEIGHT*(1-2*h_offset_frac)/CELL_SIZE);
let W_OFFSET = (WIDTH-CELL_SIZE*W_CELL_N)/2;
let H_OFFSET = (HEIGHT-CELL_SIZE*H_CELL_N)/2;
// let PALETTE = "d81159-8f2d56-218380-fbb13c-73d2de-39393a-7ebdc2".split('-').map(x => '#'+x);
// let PALETTE = "d81159-8f2d56-fbb13c-39393a-7ebdc2".split('-').map(x => '#'+x);
let PALETTE = "d81159-fbb13c-39393a-7ebdc2".split('-').map(x => '#'+x);
let N_PALETTE = PALETTE.length

let sketch = function(p) {
    p.setup = function() {
        console.log('Starting Script');
        p.createCanvas(WIDTH, HEIGHT);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.angleMode(p.DEGREES);
        p.frameRate(0.5);
    }

    p.draw = function() {
        p.background(0, 0, 95);
        p.drawingContext.shadowColor = p.color(0, 0, 0, 40);
        p.drawingContext.shadowBlur = CELL_SIZE/4;
        p.drawingContext.shadowOffsetX = CELL_SIZE;
        p.drawingContext.shadowOffsetY = CELL_SIZE/2;
        p.noFill();
        p.strokeWeight(CELL_SIZE/12);
        p.strokeCap(p.PROJECT);
        let colors = new Array(W_CELL_N);
        let left_sloping = new Array(W_CELL_N);
        for (let i = 0; i < W_CELL_N; i++) {
            colors[i] = PALETTE[Math.floor(Math.random()*N_PALETTE)];
            left_sloping[i] = true;
        }
        let c1, c2, c3;
        let x, y;
        for (let j = 0; j < H_CELL_N; j++) {
            let next_colors = new Array(W_CELL_N);
            let next_left_sloping = new Array(W_CELL_N);
            for (let i = 0; i < W_CELL_N; i++) {
                let c1_left, c1_right;
                x = W_OFFSET + i*CELL_SIZE;
                y = H_OFFSET + j*CELL_SIZE
                if(p.noise(x/100, y/100)>.5) { // right-sloping line
                    if(left_sloping[i]){
                        c1_left = colors[i];
                    }
                    if(!left_sloping[i-1]) {
                        c1_right = colors[i-1];
                    }
                    [c1, c2] = line_colors(c1_left, c1_right);
                    draw_line(y, x, x+CELL_SIZE, c1, c2);
                    next_left_sloping[i] = false;
                } else { // left-sloping line
                    if(left_sloping[i+1]){
                        c1_right = colors[i+1];
                    }
                    if(!left_sloping[i]) {
                        c1_left = colors[i];
                    }
                    [c1, c2] = line_colors(c1_left, c1_right);
                    draw_line(y, x+CELL_SIZE, x, c1, c2);
                    next_left_sloping[i] = true;
                }
                next_colors[i] = c2;
            }
            left_sloping = next_left_sloping;
            colors = next_colors;
        }
        p.noLoop();
    }

    let draw_line = function(y, x_start, x_end, c1, c2) {
        let gradient = p.drawingContext.createLinearGradient(x_start, y, x_end, y+CELL_SIZE);
        gradient.addColorStop(0.0, c1);
        gradient.addColorStop(0.5, c2);
        gradient.addColorStop(1.0, c2);
        p.drawingContext.strokeStyle = gradient;
        p.line(x_start, y, x_end, y+CELL_SIZE);
    }

    let line_colors = function(c1_left, c1_right) {
        let c1, c2, c3;
        if(c1_left==undefined && c1_right==undefined) {
            c1 = PALETTE[Math.floor(Math.random()*N_PALETTE)];
        } else if(c1_left!=undefined && c1_right==undefined) {
            c1 = c1_left;
        } else if(c1_left==undefined && c1_right!=undefined) {
            c1 = c1_right;
        } else {
            c1 = p.random([c1_left, c1_right]);
        }
        c2 = PALETTE[Math.floor(Math.random()*N_PALETTE)];
        while(c2==c1) {
            c2 = PALETTE[Math.floor(Math.random()*N_PALETTE)];
        }
        return [c1, c2]
    }
}



p = new p5(sketch, 'canvas')