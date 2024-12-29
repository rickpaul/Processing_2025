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

// TODO: add fitness function that measures longest available span for future building
// measure_success = function() {
//     let max_height = find_max_height();
//     let log_area = blocks.reduce(function(sum_, v){return(sum_+Math.log10(v.w*v.h));},0)
//     return(Math.max(1, max_height-log_area));
// }

measure_success = function() {
    let fitness = Math.log10(find_moment_of_inertia()) - Math.log10(find_total_area())
    return(Math.max(0, fitness));
}