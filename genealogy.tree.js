
var $ = $ || {};

function GTSvgRender(config){
	this.config = {
		element: '#svg',
		
	}.update(config);

	self.inif();
	
	/*
	var rectangle = self.svg.append("rect")
	                             .attr("x", 10)
	                             .attr("y", 10)
	                            .attr("width", 50)
	                            .attr("height", 100)
	                            .call(self.dragBehaviour);
	*/
	
	//var tree = d3.layout.tree()
    //	.separation(function(a, b) { return a.parent === b.parent ? 1 : .5; })
    //	.children(function(d) { return d.parents; })
    //	.size([height, width]);
	
	/*
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
	*/
}

GTSvgRender.prototype.init = function(){
	
}

var NodePerson = function(id, firstname, lastname){
	
	// relations
	this.family = null;
	this.families = [];
	
	// xy
	this.position_x = 0;	// absolute x
	this.position_y = 0;	// absolute y
	this.position_rx = 0;	// relative x
	this.position_ry = 0;	// relative y
	this.size_w = 0;
	
	this.rendered = false;
	this.visited = false;
	
	return this;
}

var NodeFamily = function(id, p1, p2, children){
	
	this.children = children || [];
	
	// xy
	this.size_w = 0;
	
	return this;
}

var GenealogyTree = function(config){
	
	this.person_list = {}
	this.family_list = {}
	
	this.renderer_list = []
	
	var margin = {top: 0, right: 320, bottom: 0, left: 0},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	//var options = require("./options")();
	
	console.log('1');
	
	return this;
}

GenealogyTree.prototype.addRenderer = function(renderer){
	this.renderer_list.push(renderer);
}

GenealogyTree.prototype.clearNodes = function(){
	for( var node in this.person_list ){
		node.visited = false;
	}
}

GenealogyTree.prototype._moveTreeToZeroZero = function(node){
	
	// find the offset
	
	// apply the offset
	
}

GenealogyTree.prototype._fixPositions = function(node){
	
	if( this.person_list[node].visited ){
		return;
	}
	
	this.person_list[node].visited = 1;
	
	// @todo calc position_x, position_y
	
	//console.log(this.person_list[node]);
	
}

GenealogyTree.prototype.fixPositions = function(pid){
	
	console.log('fixPositions');
	
	if( pid == null ){
		pid = Object.keys(this.person_list)[0].id;
	}
	
	this.clearNodes();
	
	this.person_list[pid].position_x = 0;
	this.person_list[pid].position_y = 0;
	
	
	
	this._fixPositions(pid);
	
	this._moveTreeToZeroZero();
	
}

/**
 * Oblicza szerokosc osoby i jej rodzin
 * 
 * @param pid person id
 * @returns {Number}
 */
GenealogyTree.prototype.calcWidth = function(pid){
	
	console.log('');
	console.log('calcWidth', pid);
	
	// jesli juz policzone do zwracamy
//	if( this.person_list[pid].size_w > 0 ){
//		return this.person_list[pid].size_w;
//	}
	
	// jesli nie mamy rodzin to szerokosc 1
	console.log('families.length', this.person_list[pid].families.length);
	if( this.person_list[pid].families.length == 0 ){
		this.person_list[pid].size_w = 1;
		return 1;
	}
	
	var sum_all = 0;
	for( var family_idx in this.person_list[pid].families ){
		var family_id = this.person_list[pid].families[family_idx];
		var sum = 0;
		var family = this.family_list[family_id];
		console.log(family_id, family.children);
		for( var child in family.children ){
			sum += this.calcWidth(child);
		}
		console.log('sum0', sum);
		
		// odleglosc miedzy osobami
		sum += (family.children.length - 1);
		console.log('sum1', sum);
		
		// rodzina minimalnie szerokosc 3
		if(sum < 3){
			sum = 3;
		}
		
		this.family_list[family_id].size_w = sum;
		
		sum_all += sum;
		console.log('sum', sum);
	}
	
	// odleglosc miedzy rodzinami
	sum_all += (this.person_list[pid].families.length - 1);	
	this.person_list[pid].size_w = sum_all;
	console.log('sum_all', sum_all);
	return sum_all;
}

/**
 * Aktualizuje relatywne pozycje...
 * 
 */
GenealogyTree.prototype.fixRelPositions = function(fid){
	
	console.log('fixRelPositions', fid);
	
	var family = this.family_list[fid];
	
	var sum = 0;
	for(var child_idx in family.children){
		var child_id = family.children[child_idx];
		this.person_list[child_id].position_rx = sum;
		sum += this.calcWidth(child_id);
	}
	
	// przesuwam w lewo
	var offset = parseInt(sum / 2);
	for(var child_idx in family.children){
		var child_id = family.children[child_idx];
		this.person_list[child_id].position_rx -= offset;
	}
	
}

// ============================================================================

GenealogyTree.prototype.addPerson = function(id, params){
	
	var person = new NodePerson(id, null, null);
	person.gt = this;
	this.person_list[id] = person;
	
	this.calcWidth(id);
}

GenealogyTree.prototype.delPerson = function(id){
	
}

GenealogyTree.prototype.addFamily = function(id, pid1, pid2){
	
	if(id == null){
		id = Object.keys(this.family_list).length
	}
	
	this.family_list[id] = new NodeFamily(id, pid1, pid2, []);
	this.person_list[pid1].families.push(id);
	this.person_list[pid2].families.push(id);
	
	this.calcWidth(pid1);
	this.calcWidth(pid2);
	
	return id;
}

GenealogyTree.prototype.delFamily = function(person_id, person){
	
}

GenealogyTree.prototype.addChild = function(fid, pid){
	
	this.person_list[pid].family = fid;
	this.family_list[fid].children.push(pid);
	
	//this.calcWidth(pid);
	
	this.fixRelPositions(fid);
	
}

GenealogyTree.prototype.delChild = function(fid, pid){
	
}

// ============================================================================

document.addEventListener('DOMContentLoaded', function(){	
	//var tree = new GenealogyTree();
	//tree.addPerson('aaa');
});

console.log("ok, to dziala");

$(function(){

	if (SVG.supported) {
		var draw = SVG('drawing').size(300, 300);
		var rect = draw.rect(100, 100);
		
		var gt = new GenealogyTree();
		gt.addPerson(1, {});
		gt.addPerson(2);
		gt.addPerson(3);
		gt.addPerson(4);
		gt.addPerson(5);
		gt.addPerson(6);
		gt.addPerson(7);
		gt.addPerson(8);
		gt.addPerson(9);
		gt.addPerson(10);
		gt.addPerson(11);
		gt.addPerson(12);
		gt.addPerson(13);
		gt.addPerson(14);
		gt.addPerson(15);
		gt.addPerson(16);
		gt.addPerson(17);
		gt.addPerson(18);
		gt.addPerson(19);
		gt.addPerson(20);
		gt.addPerson(21);
		gt.addPerson(22);
		gt.addPerson(23);
		gt.addPerson(24);
		gt.addPerson(25);
		gt.addPerson(26);
		gt.addPerson(27);
		gt.addPerson(28);
		
		var fid1 = gt.addFamily(1, 1, 2);
		var fid2 = gt.addFamily(2, 6, 7);
		var fid3 = gt.addFamily(3, 26, 27);
		var fid4 = gt.addFamily(4, 10, 9);
		var fid5 = gt.addFamily(5, 14, 15);
		var fid6 = gt.addFamily(6, 10, 20);
		var fid7 = gt.addFamily(7, 21, 22);
		
		gt.addChild(fid7, 19);
		gt.addChild(fid6, 14);
		gt.addChild(fid6, 15);
		gt.addChild(fid6, 16);
		gt.addChild(fid6, 17);
		gt.addChild(fid6, 18);
		gt.addChild(fid5, 9);
		gt.addChild(fid5, 8);
		gt.addChild(fid5, 1);
		gt.addChild(fid5, 2);
		gt.addChild(fid5, 5);
		gt.addChild(fid5, 6);
		gt.addChild(fid4, 11);
		gt.addChild(fid4, 12);
		gt.addChild(fid4, 13);
		gt.addChild(fid1, 3);
		gt.addChild(fid1, 4);
		gt.addChild(fid2, 23);
		gt.addChild(fid2, 24);
		gt.addChild(fid2, 25);
		gt.addChild(fid2, 26);
		gt.addChild(fid2, 27);
		gt.addChild(fid3, 28);
		
		console.log(gt);
		
		for( var p_idx in gt.person_list ){
			console.log(p_idx, ': ', gt.person_list[p_idx].position_rx );
		}
		
		gt.fixPositions(1)
		console.log(gt);
		
	} else {
		alert('SVG not supported');
	}
});
