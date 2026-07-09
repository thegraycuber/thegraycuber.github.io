
function nToBaseB(n,b){
	
	let nInB = [];
	
	while (n > 0){
		nInB.push(n%b);
		n = floor(n/b);
	} 
	
	return nInB;
}


var ints = [];
function processInts(updateDesc = true){

	setPaletteBase();
	
	if (modulo(d[0],4) == 1){
		isHex = true;
	}
	
	digPowers = [];
	let newPower = 1;
	while (newPower < 10000000000){
		digPowers.push(newPower);
		newPower *= digits.length;
	}

	ints = [];
	ints.push(new QuadInt(0,0,1,0,0));
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
		ints.push(new QuadInt(newInt[0], newInt[1], nb.length, nb[nb.length-1], ints.length));
	}
	
	baseRaw = coeffsToRaw(base);

	let descDiv = document.getElementById('system-desc');
	if (updateDesc){
		let htmlString = '<h2 class="svg-front">base ' + text2d(roundC(base,1),verticalUnit) + '</h2>';

		htmlString += '<p class="svg-mono">scaling factor: √' + round(quadNorm(base)[0],1) + '</p>';


		// htmlString += '<h2 class="svg-vivid">' + verticalUnit + '² = ' + text2d(d,verticalUnit) + '</h2>';
		htmlString += '<p class="svg-front">digits:<br>';

		for (let dig of digits){
			htmlString += text2d(roundC(dig[0],1),verticalUnit) + ' ,  ';
		}
		descDiv.innerHTML = htmlString.substring(0,htmlString.length-3) + '</p>';
	} else {
		descDiv.innerHTML = '';
	}
	
}



var colorType = 0;
var digPowers = [1,5,25,125,625,3125,15625];
class QuadInt {
	constructor(real,omega,size,lead,index) {

		this.real = real;
		this.omega = omega;
		this.norm = real**2 + omega**2*abs(d);
		
		if (isHex){
			this.coords = createVector(real-0.5*omega,0.866*omega);
		} else {
			this.coords = createVector(real,omega);
		}
			
		// this.color = color;
		this.size = size;
		this.lead = lead;
		this.index = index
		this.dropLead = this.index-this.lead*digPowers[this.size-1];

		this.setColor();

	}

	setColor(){

		if (colorType == 1 || (this.size == 1 && colorType == 0)){
			
			this.colorValue = palette.base[this.lead];
	
		} else if (colorType == 0){
			this.colorValue = lerpColor(ints[this.dropLead].colorValue,palette.base[this.lead],0.8);
			
		} else {
			
			let placeDigit = floor(this.index/digPowers[colorType-2])%digits.length;
			this.colorValue = palette.base[placeDigit];

		}
	}
	
	show(drawLabel = false) {

		push();
		translate(this.coords.x, this.coords.y);
		strokeWeight(shapeStroke);
		stroke(this.colorValue);

		fill(this.index<digits.length?this.colorValue:palette.back);

		drawShape(0,0,this.index<digits.length);
		
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
function drawShape(x,y,isDigit){
	if (isHex){
		hexagon(x, y, shapeSize*0.5);	
	} else {	
		rect(x, y, shapeSize,  shapeSize, max(0,0.2-shapeStroke));	
	}		
}


function quadMult(a, b){
	return [a[0]*b[0]+d[0]*a[1]*b[1], a[1]*b[0]+a[0]*b[1]+d[1]*a[1]*b[1]];
}

function quadNorm(a){
	return isHex ? quadMult(a,[a[0]-a[1],-a[1]]) : quadMult(a,[a[0],-a[1]]);
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
