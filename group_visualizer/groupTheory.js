
var G;
var gOrder = 4;
var gClass = 0;
var gGroup = 0;

var groupClasses = [];
var groups = [];

class Group{
	
	constructor(names,groupName){
		this.names = names;
		this.groupName = groupName;
	}
	
}

function generateGroupClasses(){
	
	let newCardinality = 0;	
	let newOrder = [];
	let newClass = '';
	let newOrderGroups = [];
	let newGroups = [];

	for (let elRow = 0; elRow < elData.getRowCount(); elRow++){
		
		if (newClass != elData.getString(elRow,0)){
			newOrder.push(newClass);
			newClass = elData.getString(elRow,0);
			newOrderGroups.push(newGroups);
			newGroups = [];
		}
		
		if (newCardinality != elData.getNum(elRow,1)){
			groupClasses.push(newOrder);
			groups.push(newOrderGroups);
			newCardinality = elData.getNum(elRow,1);
			newOrder = [];
			newOrderGroups = [];
		}
		
		
		if (elData.getString(elRow,2) != 'gen'){
			let rowGroup = [];
			for (let elCol = 0; elCol < newCardinality; elCol++){
				rowGroup.push(elData.getString(elRow,elCol+3));
			}
			newGroups.push(new Group(rowGroup,elData.getString(elRow,2)));
		}
	}
	
	
	newOrder.push(newClass);
	groupClasses.push(newOrder);
	
	newOrderGroups.push(newGroups);
	groups.push(newOrderGroups);
	
}

function generateGroup(){
	genRules = [];
	for (let genRow = 1; genRow < genData.getRowCount(); genRow++){
		if (genData.getString(genRow,0) == groupClasses[gOrder][gClass]){
			//genRules.push([genData.getString(genRow,1).replaceAll('a','r').replaceAll('b','f'),genData.getString(genRow,2).replaceAll('a','r').replaceAll('b','f')]);
			genRules.push([genData.getString(genRow,1),genData.getString(genRow,2)]);
		}
	}
	
	GName = groupClasses[gOrder][gClass];
	groupFromGens();
	
}


/*####################################

           generators

####################################*/


var gen = [];
var genRules = [];

class generator{
	constructor(name,reduceOrder){
		this.name = name;
		this.reduceOrder = reduceOrder;
	}
}

function groupFromGens(){
	
	gen = [];
	G = [];
	
	for (var rule of genRules){
		
		var firstLetter = rule[0].substring(0,1);
		if (rule[0].replaceAll(firstLetter,'').length == 0){
			gen.push(new generator(firstLetter,rule[0].length));
		}
	}
	
	var groupOrder = 1;
	for (var genEl of gen){
		groupOrder *= genEl.reduceOrder;
	}
	generatorRecursive(0,groupOrder,'');
	
	for (let el of G){
		el.processOperate();
	}
	for (let el of G){
		el.processConjugate();
	}
}

function generatorRecursive(genI,groupOrder,elName){
	
	if (genI == gen.length){
	
		G.push(new element(elName));
		return;
	}
	
	for (var o = 0; o < gen[genI].reduceOrder; o++){
		generatorRecursive(genI+1,groupOrder,elName);
		elName = gen[genI].name + elName;
	}
}


function reduce(wordToReduce){
	
	while (true){
		var tracker = wordToReduce;
		for (var rule of genRules){
			wordToReduce = wordToReduce.replace(rule[0],rule[1]);
		}
		if (tracker == wordToReduce){
			return wordToReduce;
		}
	}
}
function wordToIndex(inputWord){

	var indexFromWord = 0;
	
	for (var gI = 0; gI < gen.length; gI++){
		indexFromWord += inputWord.length - inputWord.replaceAll(gen[gI].name,'').length;
		if (gI != gen.length - 1){
			indexFromWord *= gen[gI+1].reduceOrder;
		}
	}
	
	return indexFromWord;
}


function nameReduce(fullName){
	let reduced = '';
	let currLetter = '';
	let currCount = 0;
	for (let r = 0; r < fullName.length; r++){
		if (fullName.substring(r,r+1) == currLetter){
			currCount += 1;
		} else {
			reduced += superscriptInt(currCount);
			currLetter = fullName.substring(r,r+1);
			reduced += currLetter;
			
		}
	}
	reduced += superscriptInt(currCount);
	return reduced;
}


/*####################################

           element

####################################*/

var elementSize = 1;
var elementTextSize = 0.6;

class element{
	constructor (name){
		this.index = G.length;
		this.name = name;
		this.inverse = '';
		this.arrowTables = [[],[],[]];
		this.arrowed = -1;
		this.pos = createVector(random(-width*0.4,width*0.4),random(-height*0.4,height*0.4)).div(scalar);
		this.size = min(width,height)*0.1;
		
		this.inner = this.index;
		this.outer = 0;
		
		this.displayName = '';
		let accum = 0;
		for (let l = 0; l < this.name.length; l++){
			accum += 1;
			if (l + 1 == this.name.length || this.name.substring(l,l+1) != this.name.substring(l+1,l+2)){
				this.displayName += this.name.substring(l,l+1) + superscriptInt(accum);
				accum = 0;
			}
		}
		this.nickname = this.displayName;
		
		
		this.acc = createVector(0,0);
		this.vel = createVector(0,0);
		//this.rep = rep;
	}
	
	giveColor(){
		
		if (this.index == 0){
			this.fillColor = palette.back;
			this.strokeColor = palette.front;
			this.textColor = palette.front;
		} else if (arrowElements.includes(this.index)){
			this.fillColor = palette.accent[arrowElements.indexOf(this.index)];
			this.strokeColor = palette.accent[arrowElements.indexOf(this.index)];
			this.textColor = palette.back;
		} else {
			this.fillColor = palette.front;
			this.strokeColor = palette.front;
			this.textColor = palette.back;
		}
		
	}
	
	update(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		
		this.acc = createVector(0,0);
		this.vel.mult(0.98);
		
	}
	
	display(){
		this.giveColor();
		
		fill(this.fillColor);
		stroke(this.strokeColor);
		circle(this.pos.x,this.pos.y,2);
		onlyFill(this.textColor);
		textLimited(this.displayName,this.pos.x,this.pos.y,1.1,1.75);
	}
	
	arrows(a){
		for (var m = 0; m < this.arrowTables[a].length; m++){
			var sourceEl = G[m].pos.copy();
			var destEl = G[this.arrowTables[a][m]].pos;
			var diff = destEl.copy().sub(sourceEl);
			var diffMag = diff.mag();
			if (diffMag < 2.2){
				continue;
			}
			diff.mult(1.3/diffMag);
			line(sourceEl.x+diff.x,sourceEl.y+diff.y,destEl.x-diff.x,destEl.y-diff.y);
			
			var arrowAng = atan2(diff.y,diff.x);
			arc(destEl.x - 1.6*cos(arrowAng),destEl.y - 1.6*sin(arrowAng),0.6,0.6,arrowAng-1.2,arrowAng+1.2);
	
		}
	}
	
	isWithin(mouseVec){
		return this.pos.dist(mouseVec) < 1;
	}
	
	clicked(mouseVec){
		if (this.isWithin(mouseVec) == false){
			return false;
		}
		
		draggedElement = this.index;
		dragging = 'element';
	
	}
	
	processOperate(){
		
		for (let factor = 0; factor < this.index; factor++){
			
			let leftIndex = wordToIndex( reduce(this.name+G[factor].name) );
			this.arrowTables[0].push(leftIndex);
			G[factor].arrowTables[1].push(leftIndex);
			
			let rightIndex = wordToIndex( reduce(G[factor].name+this.name) );
			this.arrowTables[1].push(rightIndex);
			G[factor].arrowTables[0].push(rightIndex);
			
			if (leftIndex == 0){
				this.inverse = G[factor].name;
				G[factor].inverse = this.name;
			}
		}
		
		let elSquared = wordToIndex( reduce(this.name+this.name) );
		this.arrowTables[0].push(elSquared);
		this.arrowTables[1].push(elSquared);
		if (elSquared == 0){
			this.inverse = this.name;
		}
	}
	
	processConjugate(){
		
		for (let factor = 0; factor < this.index; factor++){
			
			this.arrowTables[2].push(wordToIndex( reduce(this.name+G[factor].name+this.inverse) ));
			G[factor].arrowTables[2].push(wordToIndex( reduce(G[factor].name+this.name+G[factor].inverse) ));
		}
		
		this.arrowTables[2].push(this.index);
		
	}
	
}

