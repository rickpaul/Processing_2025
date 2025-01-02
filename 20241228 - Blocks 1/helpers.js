get_random_int = function (min_, max_) {
	return min_ + Math.floor(Math.random() * (max_-min_));
}

find_max_height = function () {
    if(blocks.length==0) { return(0); }
    return(Math.max.apply(null,
        blocks.map(function(block_) {
            let h_ = Math.min.apply(null, block_.body.vertices.map(function(v){return(v.y);}));
            if(!isFinite(h_) || isNaN(h_)){return(0);}
            else{ return(p.height - h_); }
        })
    ));
}

find_moment_of_inertia = function () {
    if(blocks.length==0) { return(0); }
    return(blocks.reduce(
        function(sum_, block_){
            let h_ = p.height - block_.body.position.y;
            if(!isFinite(h_) || isNaN(h_)){return(0);}
            return(sum_ + h_**2*block_.body.area);
        }, 0)
    );
}

find_total_area = function () {
    if(blocks.length==0) { return(0); }
    return(blocks.reduce(
        function(sum_, block_){
            return(sum_ + block_.body.area);
        }, 0)
    );
}

find_base_contact_percentage = function() {
    throw "Not implemented";
    /*
        desc:
        +   Finds how much surface area is in contact with the base
        ... as a percentage of total outside area
    */
}

find_base_span = function() {
    throw "Not implemented";
    /*
        desc:
        +   Finds the span of the base
    */
}

find_tilted_block_percentage = function() {
    throw "Not implemented";
    /*
        desc:
        +   Finds how many blocks are tilted
    */
}

find_sum_horizontal_span = function() {
    /*
        desc:
        +   Finds 
        TODO:
        +   Could be more clever -- more of a projection
    */
    if(blocks.length==0) { return(0); }
    // Push points
    let points = [];
    blocks.forEach(block_ => {
        angle_ = Math.abs(Math.round(200*block_.body.angle/Math.PI)%100);
        if(angle_ <= 1) {
            points.push([Math.round(block_.body.bounds.min.x), Math.round(p.height - block_.body.bounds.min.y)]);
            points.push([Math.round(block_.body.bounds.max.x), Math.round(p.height - block_.body.bounds.min.y)]);
        }
        else {
            // find highest vertex
            let highest_point = Math.min.apply(null, block_.body.vertices.map(function(v){return(v.y);}));
            let highest_vertex = block_.body.vertices.filter(function(v){return(v.y === highest_point)})[0];
            points.push([Math.round(highest_vertex.x), Math.round(p.height - highest_vertex.y)]);
        }
    });
    points.sort(function(a,b){return(a[0]-b[0])});
    let max_height = Math.max.apply(null, points.map(function(pt){return(pt[1])}));
    let max_points = points.filter(function(pt){return(pt[1] === max_height)});
    let min_x = Math.min.apply(null, max_points.map(function(pt){return(pt[0])}));
    let max_x = Math.max.apply(null, max_points.map(function(pt){return(pt[0])}));
    return(Math.min(120, max_x - min_x));
}

// TODO: add fitness function that measures longest available span for future building
// measure_success = function() {
//     let max_height = find_max_height();
//     let log_area = blocks.reduce(function(sum_, v){return(sum_+Math.log10(v.w*v.h));},0)
//     return(Math.max(1, max_height-log_area));
// }

measure_success = function() {
    let fitness = (  0.5*Math.log10(find_max_height())
                   + 1.0*Math.log10(find_sum_horizontal_span())
                   + 0.0*Math.log10(find_moment_of_inertia()) 
                   - 0.0*Math.log10(find_total_area()))
    return(Math.max(0, fitness));
}