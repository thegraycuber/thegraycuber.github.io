
var zNoise = 0;
var qInts;
var DList = [-1,-2,-3,-7,-11,-19,-43,-67,-163,201,199,197,193,191,181,179,177,173,167,166,163,161,
			  158,157,151,149,141,139,137,134,133,131,129,127,118,113,109,107,103,101,97,94,93,89,86,83,77,
			  73,71,69,67,62,61,59,57,53,47,46,43,41,38,37,33,31,29,23,22,21,19,17,14,13,11,7,6,5,3,2];
// var coloringMode = 1;
var verticalUnit = 'i';

// 
function qIntText(qInt,skipAdjust){
	if (isHex){
		return text2d([round(qInt[0]+qInt[1]),round(qInt[1]*2)],verticalUnit);
	} else {
		return text2d(qInt,verticalUnit);
	}
}


function processInt(re, im){
	
	if (abs(re) >= qInts.length){
		if (processLimit == 0){
			return;
		}
		while (abs(re) >= qInts.length){
			qInts.push([]);
		}
	}
	
	while (abs(im) >= qInts[abs(re)].length){
		qInts[abs(re)].push(isHex ?  modulo(re+qInts[abs(re)].length,2) : 0);
	}
	
	if (qInts[abs(re)][abs(im)] == 0){
		if(processLimit == 0){
			return;
		}  
		if (isHex){
			qInts[abs(re)][abs(im)] = new QInt([abs(re)/2,abs(im)/2]);
		} else {
			qInts[abs(re)][abs(im)] = new QInt([abs(re),abs(im)]);
		}
		processLimit--;
		
	} else if (qInts[abs(re)][abs(im)] == 1){
		return;
	}

	if (!isHex || modulo(re+im,2)==0){
		qInts[abs(re)][abs(im)].display(re,im);	
	}
	
}
	
var typeKey = {
	'c' : 'composite',
	'p' : 'prime',
	'z' : 'zero',
	'u' : 'unit',
	'x' : 'unknown'
}
var normAdjust = 0.0625;

class QInt {
	constructor(coeffs) {
		//this.q = coeffs;
		this.norm = qNorm(coeffs);
		let absNorm = abs(this.norm);
		
		this.color = floor(modulo((abs(this.norm)**0.5)*normAdjust,360));
		// [
		// 	0,
		// 	floor(modulo(noise(coeffs[0]/24,coeffs[1]/24,zNoise)*540,360)),
		// 	floor(modulo(this.norm*normAdjust,360)),
		// 	floor(modulo((coeffs[0]-coeffs[1])*4,360)),
		// ];
		
		this.type = 'c'; //composite
		if (this.norm == 0){
			this.type = 'z'; //zero
		} else if (absNorm == 1){
			this.type = 'u'; //unit
			units.push([...coeffs]);
			if (coeffs[0] != 0){
				units.push([-coeffs[0],coeffs[1]]);
			}
			if (coeffs[1] != 0){
				units.push([coeffs[0],-coeffs[1]]);
			}
			if (coeffs[1] != 0 && coeffs[0] != 0){
				units.push([-coeffs[0],-coeffs[1]]);
			}
			
		} else if (absNorm > primeLimit){
			this.type = 'x'; //undefined
		} else {

			while (primes[primeNorms.length-1] < absNorm){
				addPrimeNorm();
			}
			if (primeNorms[getPrimeNorm(absNorm)] == absNorm){
				this.type = 'p'; //prime
			}
		}
		
	}

	display(re,im){
		
		if(this.type == 'p'){
			// if (coloringMode == 0){
			// 	fill(palette.mono);
			// } else {
			// 	fill(palette.gradient[this.color[coloringMode]]);
			// }
			fill(palette.gradient[this.color]);
			
		} else if(this.type == 'x'){
			fill(palette.undefined);
		} else {
			return;
		}

		intShape(re,im);
	}
}

function intShape(re,im){
	if (isHex){
		hexagon(re/2,-im*0.866,1);
	} else {
		rect(re,-im,1);
	}
}

function hexagon(xcenter,ycenter,hexrad){
	beginShape();
	vertex(xcenter,ycenter-hexrad*0.577);
	vertex(xcenter+hexrad*0.5,ycenter-hexrad*0.2886);
	vertex(xcenter+hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter,ycenter+hexrad*0.577);
	vertex(xcenter-hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter-hexrad*0.5,ycenter-hexrad*0.2886);
	endShape(CLOSE);
}


function resetD(){

	normAdjust = 4/(abs(D)**0.5);
	isHex = modulo(D,4) == 1 ? 1 : 0;
	verticalUnit = D == -1 ? 'i':'ω';
	
	if (isHex){
		let constCoeff = round((D - 1)/4);
		document.getElementById('ring-label').innerHTML = verticalUnit + '² = ' + text2d([constCoeff,-1],verticalUnit);
		
	} else {
		document.getElementById('ring-label').innerHTML = verticalUnit + '² = ' + str(D);
	}
	
	primeNorms = [modulo(D,8)==5 ? 4 : 2];
	filledNorms = -1;
	for (let i = 0; i < 20; i++){
		addPrimeNorm();
	}
	
	qInts = [];
	
	for (let re = 0; re < 1; re++){
		newRow = [];
		
		for (let im = 0; im < 1; im++){
			if (isHex ){
				if (modulo(re+im,2)==1){
					newRow.push(1);
				} else {
					newRow.push(new QInt([re/2,im/2]));	
				}
			} else {
				newRow.push(new QInt([re,im]));	
			}
		}
		qInts.push(newRow);
	}
}
