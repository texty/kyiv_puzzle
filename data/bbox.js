var real = {
	left_top: [30.346, 50.518],
	right_top: [30.682, 50.526],	
	left_bottom: [30.338, 50.379],	
	right_bottom: [30.699, 50.377]	
};	

var picture = {
	left_top: [92.934, 128.615],
	right_top: [1766.244, 68.191],
	left_bottom: [55.264, 1215.481],
	right_bottom: [1850.616, 1231.967]
};


var top_scale = linearScale()
	.domain([real.left_top[0], real.right_top[0]])
	.range([picture.left_top[0], picture.right_top[0]]);

var bottom_scale = linearScale()
	.domain([real.left_bottom[0], real.right_bottom[0]])
	.range([picture.left_bottom[0], picture.right_bottom[0]]);


console.log(top_scale.scale());
console.log(bottom_scale.scale());


var left_scale = linearScale()
	.domain([real.left_top[1], real.left_bottom[1]])
	.range([picture.left_top[1], picture.left_bottom[1]]);

var right_scale = linearScale()
	.domain([real.right_top[1], real.right_bottom[1]])
	.range([picture.right_top[1], picture.right_bottom[1]]);


console.log(left_scale.scale());
console.log(right_scale.scale());

function linearScale() {
	var domain;
	var range;

	var s = function(inv) {
		var scale = (range[1] - range[0]) / (domain[1] - domain[0]);
		return (inv - domain[0]) * scale + range[0];
	};

	s.domain = function(v) {
		if (!arguments.length) return domain;
		domain = v;
		return s;
	};

	s.range = function(v) {
		if (!arguments.length) return range;
		range = v;
		return s;
	};

	s.scale = function() {
		return (range[1] - range[0]) / (domain[1] - domain[0]);
	};

	return s;
};
