
/****************************************************************************************************
****************************************************************************************************

															fastest numbers

****************************************************************************************************
*****************************************************************************************************/

var fastestInfo = [
	['6336','nineteen thousand eight\nthirds','19008 / 3'],
	['4802','fourteen squared\nsquared eighths','14 ² ² / 8'],
	['4272','six thousand\nminus twelve cubed','6000 - 12 ³'],
	['3250','thirteen thousand\nfourths','13000 / 4'],
	['2973','three thousand\nminus three cubed','3000 - 3 ³'],
	['2451','seventy squared halves\nplus one','70 ² / 2 + 1'],
	['1753','twelve cubed\nplus five squared','12 ³ + 5 ²'],
	['1536','three times\neight cubed','3 × 8 ³'],
	['1128','twelve times\nninety-four','12 × 94'],
	['775','five squared\ntimes thirty-one','5 ² × 31'],
];


var fastestIndex;

function fastestPrep(){
	fastestIndex = floor(random()*fastestInfo.length);
}

function fastestDraw(){
	textSize(unit*0.3);
	fill(color(palette.vivid));
	text(fastestInfo[fastestIndex][0],0,-unit*0.6);
	
	textSize(unit*0.1);
	fill(palette.mono);
	text('minimum syllables:',0,-unit*0.2);
	
	textSize(unit*0.16);
	fill(palette.front);
	text(fastestInfo[fastestIndex][1],0,unit*0.1);
	fill(palette.mono);
	text(fastestInfo[fastestIndex][2],0,unit*0.5);
}



/****************************************************************************************************
****************************************************************************************************

															hexponents

****************************************************************************************************
*****************************************************************************************************/



var modulus, multiplier, crowConstant, equivalenceClasses;

// var modList = [[5,0],[3,0],[5,0],[7,0],[7,0],[4,3],[3,1],[4,3]];
// var multList = [[0,1],[-1,2],[-1,2],[2,-1],[-2,-1],[2,-1],[2,-2],[-4,5]];
// var crowList = [-1,-2,-1,-11,-3,-1,-1,-1];


var modList = [[10,11],[17,0],[7,12],[3,14],[17,4],[3,17],[11,0],[11,3],[2,3]];
var multList = [[0,1],[2,-3],[-3,4],[-1,0],[-1,0],[1,-1],[-1,-4],[-1,0],[0,-1]];
var crowList = [-1,28,-1,-2,-2,-1,-1,-3,-1];


// var modList = [[7,18]];
// var multList = [[0,-1]];
// var crowList = [-1];


function hexponentPrep(){
	let listChoice = floor(random()*modList.length);
	// let listChoice = modList.length-1;
	modulus = [...modList[listChoice]];
	multiplier = [...multList[listChoice]];
	crowConstant = crowList[listChoice];
	processMod();
	processOrbits();
}

var highlight = 0;
var hexTick = 0;
var orbitNumber;
function hexponentDraw(){

	hexTick = hexTick+(Date.now()-lastDisplay)*0.003;
	lastDisplay = Date.now();
	if (hexTick > PI){
		hexTick = -PI;
		highlight = (highlight + 1) % orbitNumber;
	}
	radiusLerp = -cos(hexTick)*0.06+0.45;


	scale(hexScalar,hexScalar);
	for (let c of Object.keys(equivalenceClasses)){
		if (c == '0;0'){continue;}
		let radius = (equivalenceClasses[c].orbit == highlight)?radiusLerp:0.51;
		fill(palette.orbits[equivalenceClasses[c].orbit]);

		for (let hex of equivalenceClasses[c].hexes){
			hexagon(hex[0],hex[1],radius);
		}
	}
	
}




function hexMult(a, b){
	return [a[0]*b[0] + crowConstant*a[1]*b[1], a[1]*b[0] + a[0]*b[1] + a[1]*b[1]];
}

function hexStr(a){
	return str(a[0]) + ';' + str(a[1]);
}

function hexNorm(a){
	return a[0]**2 + a[0]*a[1] - crowConstant*a[1]**2;
}

// two values will return the same representative if they're congruent using the mod
function getRepresentative(a){
	let roundedQuotient = roundedDivision(a,modulus);
	let nearestMultiple = hexMult(modulus,roundedQuotient);
	return [a[0] - nearestMultiple[0], a[1] - nearestMultiple[1]];
}

function roundedDivision(a, b){
	let bNorm = hexNorm(b);
	let unscaled = hexMult(a,[b[0]+b[1],-b[1]]);
	return [round(unscaled[0]/bNorm),round(unscaled[1]/bNorm)];
}

var hexScalar, lastDisplay;
function processMod(){
	lastDisplay = Date.now();
	
	// let modNorm = abs(hexNorm(modulus));
	// let modSize = modNorm**0.5;
	hexScalar = unit/12;
	let extremes = [floor(1.1*width/hexScalar),floor(0.75*height/hexScalar)];
	equivalenceClasses = {};
	
	for (let re = -extremes[0]; re <= extremes[0]; re++){
		for (let im = -extremes[1]; im <= extremes[1]; im++){
			if (abs(re+im)%2!=0){
				continue;
			}

			let repVal = getRepresentative([round((re-im)/2),im]);
			let rep = hexStr(repVal); 
			if (typeof equivalenceClasses[rep] == 'undefined'){
				Object.defineProperty(equivalenceClasses,rep,{value:{rep:repVal,orbit:-1,hexes:[]},enumerable:true});
			}
			// if (abs(re*0.5)**2 + (im*0.866)**2 <= modNorm*4){
				equivalenceClasses[rep].hexes.push([re*0.5,im*0.866]);
			// }
		}
	}
}

function processOrbits(){

	for (let c of Object.keys(equivalenceClasses)){
		equivalenceClasses[c].orbit = -1;
	}

	orbitNumber = 0;
	let classKeys = Object.keys(equivalenceClasses);
	classKeys.sort();
	for (let c of classKeys){
		if (c == '0;0'){continue;}
		if (equivalenceClasses[c].orbit == -1){
			let orbiter = [...equivalenceClasses[c].rep];
			while (equivalenceClasses[hexStr(orbiter)].orbit == -1){
				equivalenceClasses[hexStr(orbiter)].orbit = orbitNumber;
				orbiter = getRepresentative(hexMult(orbiter,multiplier));
			}
			orbitNumber++;
		}
	}

	
	palette.halfdark = lerpColor(palette.half,palette.back,0.8);
	if (orbitNumber <= 2){
		palette.orbits = [palette.mono, palette.halfdark];
		
	} else if (orbitNumber <= 6){
		palette.orbits = [palette.vivid,palette.halfdark,palette.mono,palette.front,palette.half,palette.alert];
		
	} else if (orbitNumber <= 8){
		palette.orbits = [palette.front,palette.vivid,palette.alert];
		for (let c = 3; c < orbitNumber; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,(c-3)/(orbitNumber-3)));
		}
	} else {
		palette.orbits = [];
		for (let c = 0; c < orbitNumber; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,c/orbitNumber));
		}
	}
}

function hexagon(x,y,radius){
	beginShape();
	vertex(x,y-radius*1.16);
	vertex(x+radius,y-radius*0.58);
	vertex(x+radius,y+radius*0.58);
	vertex(x,y+radius*1.16);
	vertex(x-radius,y+radius*0.58);
	vertex(x-radius,y-radius*0.58);
	endShape(CLOSE);
}





/****************************************************************************************************
****************************************************************************************************

															visual groups

****************************************************************************************************
*****************************************************************************************************/


let randomGroup = -1;

function visualGroupPrep(){
	
	
	randomGroup = (randomGroup + 1 + int(random(explorerGroups.length-1)) )% explorerGroups.length;
	//randomGroup = explorerGroups.length - 1;
	mainList = [];
	
	elSize = unit/explorerGroups[randomGroup].length;
		
	for (let g of explorerGroups[randomGroup]){
		mainList.push(new GroupElement(...g));
	}
	
	elRadius = (innerAngle*0.6+3/innerAngle)*elSize;
	
	innerAngle = TWO_PI/innerAngle;
	outerAngle = TWO_PI/explorerGroups[randomGroup].length;
	
	
}


function visualGroupDraw(){
	
	inTheta += 0.0061;
	outTheta += 0.0103;
	
	for (let el of mainList){
		el.update();
	}
	strokeWeight(0.2*elSize);
	for (let el of mainList){
		el.drawArrows();
	}
	strokeWeight(0.4*elSize);
	for (let el of mainList){
		el.display();
	}
	
}



var elSize, elRadius;
var inTheta = 0;
var innerAngle = 0;
var outTheta = 0;
var outerAngle = 0;

class GroupElement{
	constructor (displayName, inner, outer, color, arrow1, arrow2){
		
		this.displayName = displayName;
		this.inner = inner;
		this.outer = outer;
		this.color = color;
		this.arrows = [arrow1,arrow2];
		
		innerAngle = max(innerAngle,inner+1);
	}
	
	update(){
		this.giveColors();
		
		let posAng =  inTheta + this.inner*innerAngle + this.outer*(outerAngle+outTheta) - PI/2;
		this.pos = createVector(elRadius*(this.outer+1)*cos(posAng),elRadius*(this.outer+1)*sin(posAng));
	}
	
	giveColors(){
		this.fillColor = palette[this.color];
		if (this.color == 'back'){
			this.strokeColor = palette.front;
			this.textColor = palette.front;
		} else {
			this.strokeColor = palette[this.color];
			this.textColor = palette.back;
		}
	}
	
	display(){

		fill(this.fillColor);
		stroke(this.strokeColor);
		strokeWeight(elSize*0.2);
		circle(this.pos.x,this.pos.y,elSize*2);
		
		fill(this.textColor);
		noStroke();
		textLimited(this.displayName,this.pos.x,this.pos.y,elSize*1.1,1.75*elSize);
	}
	
	drawArrows(){
		for (var m = 0; m < 2; m++){
			
			stroke(palette.accent[1-m]);
			noFill();
			
			var sourceEl = this.pos.copy();
			var destEl = mainList[this.arrows[m]].pos;
			var diff = destEl.copy().sub(sourceEl);
			var diffMag = diff.mag();
			if (diffMag < 1.4*elSize){
				continue;
			}
			diff.mult(elSize*1.4/diffMag);
			line(sourceEl.x+diff.x,sourceEl.y+diff.y,destEl.x-diff.x,destEl.y-diff.y);
			
			var arrowAng = atan2(diff.y,diff.x);
			arc(destEl.x - 1.7*cos(arrowAng)*elSize,destEl.y - 1.7*sin(arrowAng)*elSize,0.6*elSize,0.6*elSize,arrowAng-1.2,arrowAng+1.2);
	
		}
	}
	
	
}



var explorerGroups = [

	[
		//Q8 with i,j
		['1',0,0,'back',1,4],
		['i',1,0,'mono',2,7],
		['-1',2,0,'front',3,6],
		['-i',3,0,'front',0,5],
		['j',0,1,'vivid',5,2],
		['k',1,1,'front',6,1],
		['-j',2,1,'front',7,0],
		['-k',3,1,'front',4,3]
	],
	
	[
		//C3xC3 with 01,10
		['00',0,0,'back',1,3],
		['01',1,0,'mono',2,4],
		['02',2,0,'front',0,5],
		['10',0,1,'vivid',4,6],
		['11',1,1,'front',5,7],
		['12',2,1,'front',3,8],
		['20',0,2,'front',7,0],
		['21',1,2,'front',8,1],
		['22',2,2,'front',6,2]
	],
	
	[
		//D5 with r,f
		['e',0,0,'back',1,5],
		['r',1,0,'mono',2,9],
		['r²',2,0,'front',3,8],
		['r³',3,0,'front',4,7],
		['r⁴',4,0,'front',0,6],
		['f',0,1,'vivid',6,0],
		['r',1,1,'front',7,4],
		['r²f',2,1,'front',8,3],
		['r³f',3,1,'front',9,2],
		['r⁴f',4,1,'front',5,1]
	],
	
	[
		//C11 with 1,4
		['0',0,0,'back',1,4],
		['1',1,0,'mono',2,5],
		['2',2,0,'front',3,6],
		['3',3,0,'front',4,7],
		['4',4,0,'vivid',5,8],
		['5',5,0,'front',6,9],
		['6',6,0,'front',7,10],
		['7',7,0,'front',8,0],
		['8',8,0,'front',9,1],
		['9',9,0,'front',10,2],
		['10',10,0,'front',0,3]
	],
	
	[
		//A4 with 1,4
		['e',0,0,'back',1,3],
		['123',1,0,'mono',2,4],
		['132',2,0,'front',0,5],
		['(12)(34)',0,1,'vivid',10,0],
		['243',1,1,'front',11,1],
		['143',2,1,'front',9,2],
		['(13)(24)',0,2,'front',4,9],
		['142',1,2,'front',5,10],
		['234',2,2,'front',3,11],
		['(14)(23)',0,3,'front',7,6],
		['134',1,3,'front',8,7],
		['124',2,3,'front',6,8]
	],
	
	[
		//Q12 with 1,4
		['1',0,0,'back',1,6],
		['ζ',1,0,'mono',2,11],
		['ζ²',2,0,'front',3,10],
		['-1',3,0,'front',4,9],
		['-ζ',4,0,'front',5,8],
		['-ζ²',5,0,'front',0,7],
		['j',0,1,'vivid',7,3],
		['ζj',5,1,'front',8,2],
		['ζ²j',4,1,'front',9,1],
		['-j',3,1,'front',10,0],
		['-ζj',2,1,'front',11,5],
		['-ζ²j',1,1,'front',6,4]
	],
];


//superscripts = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];


/****************************************************************************************************
****************************************************************************************************

															hypercomplex

****************************************************************************************************
*****************************************************************************************************/


var hyperShape;
var hyperAng = 0;
function hyperPrep(){
	hyperShape = new HyperShape(floor(random()*5+4));
}

function hyperDraw(){
	scale(unit*0.4,-unit*0.4);
	
	if (width*4<height*3){
		hyperAng += 0.04;
		hyperIdeal = [1.5*cos(hyperAng*0.71), 1.5*cos(hyperAng*0.47)];
		
	} else {
		hyperIdeal = [(mouseX-width/2)/unit, -(mouseY-height/2)/unit];
	}

	hyperShape.rotate(PI/360);
	hyperShape.displayOutput();
}

class HyperShape {
	constructor(vertices) {
	
		this.vertices = vertices;
		this.points = [];
		this.vertexIndices = [];
		
		let hyperRes = 720 - (720 % vertices);
		let vertexFreq = floor(hyperRes / vertices);
		let angleStep = TWO_PI/hyperRes;

		let phi = 0;

		for (let v = 0; v < vertices; v++){
			this.vertexIndices.push(v*vertexFreq);
		}

		let increment = TWO_PI*vertices/hyperRes;
		for (let p = 0; p < hyperRes; p++){
			let pointMag = cos(phi)*0.15+0.85;
			this.points.push([pointMag*cos(angleStep*p), pointMag*sin(angleStep*p)]);
			phi = phi+increment;
		} 
	}
		
	rotate(angle){
		
		let trigs = [cos(angle), sin(angle)];
		
		for (let p = 0; p < this.points.length; p++){
			this.points[p] = cMult(this.points[p],trigs);
		}
	}
	
	displayOutput(){
		
		noFill();
		stroke(palette.front);
		strokeWeight(0.08);
		beginShape();

		for (let p of this.points){
			let p2 = iMult(p,p);
			let p3 = iMult(p,p2);
			vertex(p3[0],-p3[1]);
		}
		
		endShape();
	
		noStroke();
		fill(palette.vivid);
		for (let i of this.vertexIndices){
			let p = this.points[i];
			let p2 = iMult(p,p);
			let p3 = iMult(p,p2);
			circle(p3[0],-p3[1],0.25);
		}
		
		
	}
	
}


var hyperIdeal = [-1,0];
function iMult(cA,cB){
	return [cA[0]*cB[0]+cA[1]*cB[1]*hyperIdeal[0],cA[0]*cB[1]+cA[1]*cB[0]+cA[1]*cB[1]*hyperIdeal[1]];
}

function cMult(cA,cB){
	return [cA[0]*cB[0]-cA[1]*cB[1],cA[0]*cB[1]+cA[1]*cB[0]];
}



/****************************************************************************************************
****************************************************************************************************

															complex primes

****************************************************************************************************
*****************************************************************************************************/



function complexPrimePrep(){
	mainList = [];
	var gaussRand = random();
	
	var wmax = ceil(1+5*width/unit);
	var hmax = ceil(1+5*height/unit);
	for (var re = -wmax; re <= wmax; re++){
		for (var im = -hmax; im <= hmax; im++){
			//console.log(re,im);
			var gaussN = re**2 + im**2;
			var isPrime = false;
			var gaussP = 0;
			if (re == 0){
				while(primes[gaussP] < abs(im)){
					gaussP++;
					if(gaussP == primes.length){
						addPrime();
					}
				}
				if (primes[gaussP] == abs(im) && primes[gaussP] % 4 == 3){
					isPrime = true;
				}
			} else if (im == 0){
				while(primes[gaussP] < abs(re)){
					gaussP++;
					if(gaussP == primes.length){
						addPrime();
					}
				}
				if (primes[gaussP] == abs(re) && primes[gaussP] % 4 == 3){
					isPrime = true;
				}
			} else {
				while(primes[gaussP] < gaussN){
					gaussP++;
					if(gaussP == primes.length){
						addPrime();
					}
				}
				if (primes[gaussP] == gaussN){
					isPrime = true;
				}
			}
			
			if (isPrime){
				mainList.push(new Gauss(re,im,gaussN,gaussRand));
			}
			
		}
	}
	
}


class Gauss {
	constructor(re,im,norm,gaussRand) {
		this.coords = [re*unit*0.1, im*unit*0.1];
		this.colorvalue = [0];
		
		var thetacolor = 0;
		if(re == 0 && im > 0){
			thetacolor = PI/2;
		} else if(re == 0){
			thetacolor = PI*3/2;
		} else if (re > 0){
			thetacolor = atan(im/re)+TWO_PI;
		} else if (re < 0){
			thetacolor = atan(im/re)+PI;
		} 
		
		this.colorvalue = (modulo((abs(re)-abs(im)+160)*3,sunlen));
		
	}
}


var sunset = [];
var sunlen = 120;
function complexPrimeDraw(){
	sunset.push(sunset[0]);
	sunset.splice(0, 1);
	for (var gp of mainList) {
		noStroke();
		fill(sunset[gp.colorvalue]);
		rect(gp.coords[0], gp.coords[1], unit*0.1);
	}
}



/****************************************************************************************************
****************************************************************************************************

															cursed equations

****************************************************************************************************
*****************************************************************************************************/



class CursedShape {
	constructor(vertices,step,rotation = 0, radiusTheta = 0, type = 0) {
	
		this.vertices = vertices;
		this.step = step;
		this.radiusTheta = radiusTheta;
		this.radius = 2**(sin(radiusTheta)*2);
		this.mags = [];
		this.isvertex = [];
		
		var p, increment;
		var phi = 0;
		
		if (vertices == 0){
			for (p = 0; p < cursedResolution; p++){
				this.mags.push(1);
				this.isvertex.push(false);
			}
			
		} else if (vertices == -2){
			
			phi = 0.2;
			increment = 0.8/cursedResolution;
			for (p = 0; p < cursedResolution; p++){
				this.isvertex.push(false);
				this.mags.push(phi);
				phi += increment;
			}
			
		} else {
		
			var theta = TWO_PI*abs(step)/vertices;
			var m = sin(theta)/(1 - cos(theta));
			
			if (type == 3){
				increment = TWO_PI*vertices/cursedResolution;
				for (p = 0; p < cursedResolution; p++){
					this.mags.push(cos(phi)*0.15+0.85);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % TWO_PI;
				} 
				
			} else if (type == 1){
				increment = 2*vertices/cursedResolution;
				for (p = 0; p < cursedResolution; p++){
					this.mags.push(abs(1-phi)*0.6+0.4);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % 2;
				} 
				
			} else {
				increment = TWO_PI*abs(step)/cursedResolution;
				for (p = 0; p < cursedResolution; p++){
					this.mags.push(abs(m/(sin(phi) + cos(phi)*m)));
					this.isvertex.push(phi < increment);

					phi += increment;
					if (phi >= theta){
						phi -= theta;
					}
				}
				
				if (type == 2){
					phi = 0;
					increment = TWO_PI*vertices*3/cursedResolution;
					for (p = 0; p < cursedResolution; p++){
						this.mags[p] *= cos(phi)*0.1+0.9;
						phi += increment;
					}
				}
			} 
		}
	}
	
}

var outCursed, vertCursed, rotationAngle, maxMag, cursedRot;
function cursedDraw(){

	cursedRot[3] += 1;
	for (var fi = 0; fi < 3; fi++){
		if (cursedFavorites[fav][2+4*fi] == 1){
			var rotSpeed = [1,0.75,1.5];
			while (cursedRot[3] > cursedRot[fi]){
				cursedRot[fi] += rotSpeed[fi];
				shapes[fi].mags.push(shapes[fi].mags[0]);
				shapes[fi].mags.splice(0,1);
				shapes[fi].isvertex.push(shapes[fi].isvertex[0]);
				shapes[fi].isvertex.splice(0,1);
			}
		} else if (cursedFavorites[fav][2+4*fi] == 2){
			shapes[fi].radiusTheta += rotationAngle[fi]*2;
			shapes[fi].radius = 2**(sin(shapes[fi].radiusTheta)*2);
		}
	}
	
	noStroke();
	cursedQuadratic();
	var circleRad = unit*0.025;
	fill(palette.front);
	for (let out of outCursed){
		for (let o = 0; o < cursedResolution; o++){
			if (showVertices == false || vertCursed[o] == -1){
				circle(out[o][0]*scalar,-out[o][1]*scalar,circleRad);
			}
		}
	}
	
	circleRad = unit*0.075;
	if (showVertices){
		for (var sidx = 2; sidx > -1; sidx--){
			for (let out of outCursed){
				for (let o = 0; o < cursedResolution; o++){
					if (vertCursed[o] == sidx){
						fill(palette.accent[sidx]);
						circle(out[o][0]*scalar,-out[o][1]*scalar,circleRad);
					}
				}
			}
		}
	}
	
}



function cursedQuadratic(){
	
	var newMaxMag = 0;
	outCursed = [[],[]];
	vertCursed = [];
	var incB2 = shapes[1].step*2*TWO_PI/cursedResolution;
	var incB = shapes[1].step*TWO_PI/cursedResolution;
	var incAc = (shapes[0].step+shapes[2].step)*TWO_PI/cursedResolution;
	var incA = shapes[0].step*TWO_PI/cursedResolution;
	var rad02 = shapes[0].radius*shapes[2].radius;
	var rad11 = shapes[1].radius**2;
	var q = [0,0,0];

	for (var p = 0; p < cursedResolution; p++){
		
		
		var vertexIndex = -1;
		for (var qindex = 0; qindex < 3; qindex++){
			q[qindex] = (q[qindex] + 1) % cursedResolution;
			if (shapes[qindex].isvertex[q[qindex]] && vertexIndex == -1){
				vertexIndex = qindex;
			}
		}
		vertCursed.push(vertexIndex);
		
		var b2 = [rad11*(shapes[1].mags[q[1]]**2)*cos(p*incB2),rad11*(shapes[1].mags[q[1]]**2)*sin(p*incB2)];
		var ac = [rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*cos(p*incAc),rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*sin(p*incAc)];
		
		var disc = [b2[0]-4*ac[0],b2[1]-4*ac[1]];
		
		var mag = (disc[0]**2+disc[1]**2)**0.25;
		var arg = atan2(disc[1],disc[0])/2;
		
		var aInv2 = [cos(p*incA)/(2*shapes[0].mags[q[0]]*shapes[0].radius),-sin(p*incA)/(2*shapes[0].mags[q[0]]*shapes[0].radius)];
		for (var out = 0; out < 2; out++){
			var numer = [mag*cos(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*cos(p*incB),mag*sin(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*sin(p*incB)];
			var result = [numer[0]*aInv2[0]-numer[1]*aInv2[1],numer[0]*aInv2[1]+numer[1]*aInv2[0]];
			outCursed[out].push(result);
	
			var thisMag = pow(result[0],2)+pow(result[1],2);
			if (thisMag > newMaxMag){
					newMaxMag = thisMag;
			}

		}
		
	}
	
    newMaxMag = (newMaxMag**0.5);
    if (maxMag != undefined){
        scalar = scalar*maxMag/newMaxMag;
    } else {
        scalar = scalar/newMaxMag;
    }
    maxMag = newMaxMag;
	
}

var cursedFavorites;
function cursedPrep(){
    
	cursedRot = [0,0,0,0];
    rotationAngle = [TWO_PI/480,TWO_PI/420,TWO_PI/360];
    cursedFavorites = [
		[4,1,1,0,0,-1,0,0,8,-3,2,1,true], //flower
		[6,-1,0,0,11,-4,1,0,0,3,0,0,true], //sunny
		[5,-1,1,2,10,1,0,1,5,-2,2,3,true], //better star
		[12,5,1,0,0,3,0,0,3,1,2,3,true], //atom
		[7,3,0,3,12,5,1,1,12,-5,2,1,true] //cursed
    ];
    
    var newFav = int(random(cursedFavorites.length));
    while (newFav == fav){
        newFav = int(random(cursedFavorites.length));
    }

    fav = newFav;
    shapes = [];
    for (var shp = 0; shp < 12; shp += 4){
        shapes.push(new CursedShape(cursedFavorites[fav][0+shp],cursedFavorites[fav][1+shp],0,0,cursedFavorites[fav][3+shp]));
    }
    showVertices = cursedFavorites[fav][12];

	scalar = unit;
	maxMag = undefined;
    
}

var scalar;
var showVertices = false;
var cursedResolution = 512;
var fav = -1;




/****************************************************************************************************
****************************************************************************************************

									quadratic bases

****************************************************************************************************
*****************************************************************************************************/