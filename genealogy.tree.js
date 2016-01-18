
var $ = $ || {};

function GenealogyTree(config){
	var margin = {top: 0, right: 320, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	//var options = require("./options")();
	
	console.log('1');
	
	//var tree = d3.layout.tree()
    //	.separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
    //	.children(function(d) { return d.parents; })
    //	.size([height, width]);
	
	var force = d3.layout.force()
		.on("tick", function(){
			console.log('tick');
		});
	
	self.dragBehaviour = d3.behavior.drag()
		.origin(function (d) {
			return d;
		})
		.on("dragstart", function (d) {
			console.log('drag start');
			//d3.event.sourceEvent.stopPropagation(); // Prevent panning
			//d.locked(true);
		})
		.on("drag", function (d) {
	console.log('drag');
			//d.px = d3.event.x;
			//d.py = d3.event.y;
			//force.resume();
		})
		.on("dragend", function (d) {
			console.log('drag end');
			//d.locked(false);
		});

	// Apply the zooming factor.
	var zoomed;
	var zoom = d3.behavior.zoom()
		.duration(150)
		.scaleExtent([options.minMagnification(), options.maxMagnification()])
		.on("zoom", zoomed);

	self.svg = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.call(zoom)
    	//.call(dragBehaviour)
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	console.log('2');
	
	var graph = {};
	graph.start = function () {
		force.stop();
		//loadGraphData();
		//redrawGraph();
		graph.update();
	};
	graph.update = function () {
		//refreshGraphData();
		//refreshGraphStyle();
		force.start();
		//redrawContent();
	};
}

GenealogyTree.prototype.addPerson = function(name){
	var rectangle = self.svg.append("rect")
	                             .attr("x", 10)
	                             .attr("y", 10)
	                            .attr("width", 50)
	                            .attr("height", 100)
	                            .call(self.dragBehaviour);
}

GenealogyTree.prototype.addFamily = function(person_id, person){
	
}

GenealogyTree.prototype.addChild = function(family_id, person){
	
}


document.addEventListener('DOMContentLoaded', function(){
	
	//var tree = new GenealogyTree();
	//tree.addPerson('aaa');
});


console.log("ok, to dziala");
/*
var __iterator__, i;
var __args_0, __kwargs_0;
__args_0 = create_array(0, 10);
__kwargs_0 = {};
__iterator__ = get_attribute(get_attribute(get_attribute(xrange, "__call__")(__args_0, __kwargs_0), "__iter__"), "__call__")(create_array(), {});
try {
i = get_attribute(__iterator__, "next")(create_array(), {});
while(true) {
console.log(i);
undefined;
i = get_attribute(__iterator__, "next")(create_array(), {});
}
}
catch(__exception__) {
if (__exception__ == StopIteration || isinstance([__exception__, StopIteration])) {

}

}
*/