
function nToBaseB(n,b){
	
	let nInB = [];
	
	while (n > 0){
		nInB.push(n%b);
		n = floor(n/b);
	} 
	
	return nInB;
}


var ints = [];
function processInts(){

	if (modulo(d,4) == 1){
		isHex = true;
	}
	
	ints = [];
	ints.push(new QuadInt(0,0,0,0));

	for (let dig = 0; dig < digits.length; dig++){
		while (digits[dig].length <= maxDigitCount){
			digits[dig].push(quadMult(base,digits[dig][digits[dig].length-1]));
		}
	}

	for (let n = 1; n < digits.length**maxDigitCount; n++){
		let nb = nToBaseB(n,digits.length);
		
		let newInt = [0,0];
		for (let newDigit = 0; newDigit < nb.length; newDigit++){
			newInt[0] += digits[nb[newDigit]][newDigit][0];
			newInt[1] += digits[nb[newDigit]][newDigit][1];
		}
		ints.push(new QuadInt(newInt[0], newInt[1],  nb.length-1 % palette.base.length, ints.length));
	}
	
	baseRaw = coeffsToRaw(base);
}



function indexToColor(inputIndex,lerper){
	let unprocessed = true;
	let baseColor = copyColor(palette.base[inputIndex%digits.length]);
	inputIndex = floor(inputIndex/digits.length);
	
	while (inputIndex > 0){
		baseColor = lerpColor(baseColor,palette.base[inputIndex%digits.length],lerper);
		inputIndex = floor(inputIndex/digits.length);
	}

	// while (baseList.length < digits){
	// 	baseList.push(0);
	// }
	return baseColor;
}
	
var indexLookup = [];

class QuadInt {
	constructor(real,omega,color,index) {

		this.real = real;
		this.omega = omega;
		this.norm = real**2 + omega**2*abs(d);
		
		if (isHex){
			this.coords = createVector(real-0.5*omega,0.866*omega);
		} else {
			this.coords = createVector(real,omega);
		}
			
		// this.color = color;
		this.index = index
		this.setColor();
		// this.basedIndices = indexToBase(this.index);

	}

	setColor(){
		this.colorValue = indexToColor(this.index,0.8);
		// this.fillValue = indexToColor(this.index,0.5);
	}
	
	show(drawLabel = false) {

		// let dFact = displayBase?1.2:1;
		// if (displayBase){
		// 	strokeWeight(0.08);
		// 	fill(palette.back);
		// 	stroke(palette.front);

		push();
		translate(this.coords.x, this.coords.y);
		strokeWeight(shapeStroke);
		stroke(this.colorValue);
		fill(this.index<digits.length?this.colorValue:palette.back);
		// fill(this.fillValue);
		drawShape(0,0);

		// if (this.index < digits.length){
		// 	onlyFill(palette.back);
		// 	drawShape(0,0,1);
		// } 
		
		if (drawLabel){
			scale(1,-1);
			onlyFill(this.index == 0?palette.mono:palette.back);
			let labelValue = text2d(roundC([this.real,this.omega],1),verticalUnit);
			textLimited(labelValue,0,0,0.5,0.6);
		}
		pop();

	}
}

var shapeSize = 0.9;
var shapeStroke = 0.1;
function drawShape(x,y){
	if (isHex){
		hexagon(x, y, shapeSize*0.5);	
	} else {
		rect(x, y, shapeSize,  shapeSize, max(0,0.2-shapeStroke));	
	}		
}


function quadMult(a, b){
	return [a[0]*b[0]+d[0]*a[1]*b[1], a[1]*b[0]+a[0]*b[1]+d[1]*a[1]*b[1]];
}

function quadPower(a ,e){
	if (e <= 1){
		return a;
	} else {
		return quadMult(a, quadPower(a,e-1));
	}
}


function intFrom(real,omega){
	
	let ii = 0;
	while (ii < ints.length && ints[ii].real != real && ints[ii].omega != omega){
		ii++;
	}
	
	if (ints.length == ii){return;}
	return ints[ii];
}

function coeffsToRaw(coeffs){
	if (!isHex){
		return coeffs;
	} else {
		return [coeffs[0] - 0.5*coeffs[1], coeffs[1]*0.866];
	}
}


function truncatePowers(){
	for (let dig = 1; dig < digits.length; dig++){
		digits[dig] = [digits[dig][0]];
	}
}


// function indexToBase(inputIndex){
// 	let baseList = [];
// 	while (inputIndex > 0){
// 		baseList.push(inputIndex%digits[0].length);
// 		inputIndex = floor(inputIndex/digits[0].length);
// 	}

// 	// while (baseList.length < digits){
// 	// 	baseList.push(0);
// 	// }
// 	return baseList;
// }
