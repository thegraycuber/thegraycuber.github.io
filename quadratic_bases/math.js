
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

	setPaletteBase();
	
	if (modulo(d[0],4) == 1){
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

	let descDiv = document.getElementById('system-desc');
	let htmlString = '<h2 class="svg-front">base ' + text2d(roundC(base,1),verticalUnit) + '</h2>';

	htmlString += '<h2 class="svg-vivid">' + verticalUnit + '² = ' + text2d(d,verticalUnit) + '</h2>';
	htmlString += '<p class="svg-mono">digits:<br>';

	for (let dig of digits){
		htmlString += text2d(roundC(dig[0],1),verticalUnit) + ' ,  ';
	}
	descDiv.innerHTML = htmlString.substring(0,htmlString.length-3) + '</p>';
}



function indexToColor(inputIndex,lerper){

	// let colorIndex = floor(inputIndex/digits.length**(maxDigitCount-1));
	// return palette.base[colorIndex%palette.base.length];
	
	let unprocessed = true;
	let baseColor = copyColor(palette.base[inputIndex%palette.base.length]);
	inputIndex = floor(inputIndex/digits.length);
	
	while (inputIndex > 0){
		baseColor = lerpColor(baseColor,palette.base[inputIndex%palette.base.length],lerper);
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
		// if (this.index<digits.length){
		// 	fill(this.colorValue);
		// } else {
		// 	noFill();
		// }
		fill(this.index<digits.length?this.colorValue:palette.back);
		// fill(this.colorValue);
		drawShape(0,0,this.index<digits.length);

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
var pointSize = 1;
function drawShape(x,y,isDigit){
	// if (!snapIsOn && !isDigit){
	// 	circle(x, y, pointSize);
	// } else 
	if (isHex){
		hexagon(x, y, shapeSize*0.5);	
	} else {
		// rect(x, y, shapeSize*1.6,  shapeSize*1.6);// max(0,0.2-shapeStroke));	
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

function snapToBest(digitIndex, skipProcessing = false){

	let minDist = 1000000;
	let bestPoint;
	let rawPoint = digitIndex == digits.length? base : digits[digitIndex][0];
	let centerPoint = roundC(rawPoint);

	for (let x = -3; x < 4; x++){
		for (let y = -3; y < 4; y++){
			let testPoint = addC(centerPoint,[x,y]);
			let testDist = normC(subC(coeffsToRaw(testPoint),coeffsToRaw(rawPoint)));
			if (testDist > minDist){
				continue;
			}

			let isDupe = false;
			for (let dig = 0; dig < digits.length; dig++){
				if (dig == digitIndex){continue;}
				if (closeC(digits[dig][0],testPoint)){
					isDupe = true;
					break;
				}
			}
			if (digits.length != digitIndex && closeC(base,testPoint)){
				isDupe = true;
			}

			if (isDupe){
				continue;
			}

			minDist = testDist;
			bestPoint = testPoint;
		}
	}

	setDigit(bestPoint, digitIndex, skipProcessing);
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
