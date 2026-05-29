

function qNorm(qToNorm){
	return round(qToNorm[0]**2 - D*(qToNorm[1]**2));
}


function qDiv(qNum, qDenom){
	let denomNorm = qNorm(qDenom);
	let testProduct = qMult(qNum,[qDenom[0],-qDenom[1]]);

	let divisible;
	if (isHex){
		divisible = modulo(round(testProduct[0]*2),denomNorm) == 0 && modulo(round(testProduct[1]*2),denomNorm) == 0;
	} else {
		divisible = modulo(testProduct[0],denomNorm) == 0 && modulo(testProduct[1],denomNorm) == 0;
	}
	
	if (!divisible){
		return [];
	} else {
		return roundC(scaleC(1/denomNorm,testProduct),1);
	}
}

function qMult(qA, qB){
	return [qA[0]*qB[0]+D*qA[1]*qB[1],qA[1]*qB[0]+qA[0]*qB[1]];
}


function qFactorize(qToFactor){
	if (highlightMode == 'prime factors'){
		highlights = [];
	}

	if (qToFactor[0] == 1 && qToFactor[1] == 0){
		return '1';
	} else if (qToFactor[0] == 0 && qToFactor[1] == 0){
		return '0';
	}
	
	let factorNorm = qNorm(qToFactor);
	let unfactored = [...qToFactor];
	let factorization = [];

	if (factorNorm >= primeLimit){
		return 'norm is above\ncompute limit';
	}

	while (factorNorm >= primes[primeNorms.length-1]){
		addPrimeNorm();
	}
	
	let repCount = 0;
	let pn = 0;
	while (abs(factorNorm) != 1 && repCount < 2000){

		repCount++;
		
		if (modulo(factorNorm,primeNorms[pn]) != 0){
			pn++;
			continue;
		}

		let qFactor = [];
		for (let sq of squares){
			for (let sqSign = (D>0?-1:1); sqSign < 2; sqSign += 2){
				let a2 = sqSign*primeNorms[pn]*(isHex?4:1) + D*sq;
				
				if (a2 < 0 || a2 >= rootOfIndex.length){
					continue;
				}
				if (rootOfIndex[a2] == -1){
					continue;
				}
				qFactor = [rootOfIndex[a2]*(isHex?0.5:1),rootOfIndex[sq]*(isHex?0.5:1)];
				break;
			}
			if (qFactor.length > 1){
				break;
			}
		}

		if (qFactor.length == 0){
			return 'failed to\nfind factors';
		}

		let factorFound = false;
		for (let l = 0; l < 2; l++){
			let factorQuotient = qDiv(unfactored,qFactor);
			if (factorQuotient.length > 0){
				factorNorm = round(factorNorm/primeNorms[pn]);
				unfactored = factorQuotient;
				if (factorization.length > 0 && factorization[factorization.length-1][0][0] == qFactor[0] && factorization[factorization.length-1][0][1] == qFactor[1]){
					factorization[factorization.length-1][1]++;
				} else {		
					factorization.push([[...qFactor],1]);
				}
				factorFound = true;
				l = 2;
			}
			qFactor[1] *= -1;
		}

		if (!factorFound){
			// infoBox.getItem('info_factor').Volume = 2;
			return 'failed to\nfind factors';
		}
		
	}
	if (repCount >= 5000){
		// infoBox.getItem('info_factor').Volume = 2;
		return 'failed to\nfind factors';
	}

	if (highlightMode == 'prime factors'){
		for (let u of units){
			for (let f of factorization){
				let h = qMult(u,f[0]);
				highlights.push([h[0]*(isHex?2:1),h[1]*(isHex?2:1)]);
			}
		}
	}

	if (unfactored[0] != 1 || unfactored[1] != 0){
		factorization.unshift([unfactored,1]);
	}

	let factorRows = floor(factorization.length**0.5);
	let factorDivisor = ceil(factorization.length/factorRows);
	let factorText = '';
	// infoBox.getItem('info_factor').Volume = factorRows;
	
	for (let f = 0; f < factorization.length; f++){
		factorText += '(' + qIntText(factorization[f][0],true) + ')' + superscriptInt(factorization[f][1]);
		if ((f+1)%factorDivisor == 0){
			factorText += '\n';
		} else if (f+1 != factorization.length){
			factorText += ' '
		}
	}
	if (factorText.substring(factorText.length-1) == '\n'){
		factorText = factorText.substring(0,factorText.length-1);
	}
	return factorText;
}


var primeNorms = [2];
var filledNorms = 0;
function addPrimeNorm(){

	if (primeNorms.length == primes.length){
		if (primes[primes.length - 1] > primeLimit){
			return;
		}
		addPrime();
	}

	let testPrime = primes[primeNorms.length];
	if (modulo(D,testPrime) == 0){
		let newIndex = getPrimeNorm(testPrime)+1;
		primeNorms.splice(newIndex,0,testPrime);
		filledNorms = newIndex;
		return;
	}
	
	let DPower = 1;
	let D2n = D*(4-3*isHex);
	let remainingExp = round((testPrime-1)/2,0);
	while (remainingExp > 0){
		if (remainingExp % 2 == 1){
			DPower = modulo(DPower*D2n,testPrime);
		}	
		remainingExp = floor(remainingExp/2);
		D2n = modulo(D2n*D2n,testPrime);
	}

	if (DPower == 1){
		let newIndex = getPrimeNorm(testPrime)+1;
		primeNorms.splice(newIndex,0,testPrime);
		filledNorms = newIndex;
	} else {
		primeNorms.splice(getPrimeNorm(testPrime**2)+1,0,testPrime**2);
	}
}

function getPrimeNorm(normMax){

	if (normMax < primeNorms[0]){
		return -1;
	}

	let normPower = 2**floor(log(primeNorms.length-1)/log(2));
	let currentIndex = 0;
	
	while (normPower > 0){
		if (currentIndex + normPower < primeNorms.length){
			if (primeNorms[currentIndex + normPower] <= normMax){
				currentIndex += normPower;
			}
		}
		normPower = floor(normPower/2);
	}

	return currentIndex;
}


var squares = [];
var rootOfIndex = [];
function generateSquares(squareCount){

	for (let s = 0; s <= squareCount; s++){
		let s2 = s*s;
		squares.push(s2);
		while (rootOfIndex.length < s2){
			rootOfIndex.push(-1);
		}
		rootOfIndex.push(s);
	}
}



/********************************************************
  
					INFO BOX

**********************************************************/


var units = [];
var highlights = [];
var highlightMode = 'prime factors';
let introInfo = true;
var infoInteger = [];
var infoIntegerTrue;


function setInfo(){

	highlights = [];
	let descMenu = document.getElementsByTagName('desc-menu')[0];

	if (infoInteger.length == 2){
		if (qInts.length <= abs(infoInteger[0])){
			infoInteger = [];
			
		} else if (qInts[abs(infoInteger[0])].length <= abs(infoInteger[1])){
			infoInteger = [];

		} else {
			
			introInfo = false;
			
			infoInt = qInts[abs(infoInteger[0])][abs(infoInteger[1])];
			if (isHex){
				infoIntegerTrue = [infoInteger[0]/2,infoInteger[1]/2];
			} else {
				infoIntegerTrue = infoInteger;
			}

			if (qInts[abs(infoInteger[0])][abs(infoInteger[1])].type == 'x'){
				descMenu.innerHTML = '<p class="svg-alert">norm exceeds <br>processing limit</p>';
				return;
			
			} 

			if (highlightMode == 'multiples'){
				if (abs(infoInt.norm) > 1){
					highlightMultiples(infoIntegerTrue);
				}
			}
			
			descMenu.innerHTML = '<br><h1 class="svg-front highlight-value">' + qIntText(infoIntegerTrue) + '</h1>';
			descMenu.innerHTML += '<br><h3 class="svg-vivid">' + typeKey[infoInt.type] + '</h3>';
			descMenu.innerHTML += '<h2 class="svg-vivid">' + 'norm ' + str(infoInt.norm) + '</h2>';
			descMenu.innerHTML += '<br><p class="svg-mono">' +  'factorization' + '</p>';
			descMenu.innerHTML += '<h3 class="svg-mono">' +  qFactorize(infoIntegerTrue) + '</h3><br>';
			controllers['arrow-highlight'].enable();
			return;
			
		}
	} 
	if (introInfo){
		return;
	}
	
	descMenu.innerHTML = '';
	controllers['arrow-highlight'].disable();
}


function highlightMultiples(hInt){

	let hPerp = isHex ? qMult(hInt,[-0.5,0.5]) : qMult(hInt,[0,1]);

	let upwards = [nearestMultiple(vectorToArray(pixelToPrincipal(defaultOrigin)),hInt)];
	let extremePoints = [
		vectorToArray(pixelToPrincipal(grid.gridMin)),
		vectorToArray(pixelToPrincipal(grid.gridMax)),
		vectorToArray(pixelToPrincipal(createVector(grid.gridMin.x,grid.gridMax.y))),
		vectorToArray(pixelToPrincipal(createVector(grid.gridMax.x,grid.gridMin.y)))
	];

	let extremes = [];
	for (let ep of extremePoints){
		epIntercept = waluigiSqueegee(ep,hPerp);
		extremes = extremes.length == 0 ?  [epIntercept,epIntercept] : [min(epIntercept,extremes[0]),max(epIntercept,extremes[1])];
	}

	let currentIntercept;
	let epSign = sign(waluigiSqueegee(hInt,hPerp));
	for (let hSign = -1; hSign < 2; hSign += 2){
		let currentInteger = [...upwards[0]];
		do {
			currentInteger = addC(currentInteger, scaleC(hSign,hInt));
			upwards.push([...currentInteger]);
			currentIntercept = waluigiSqueegee(currentInteger,hPerp);
		}
		while ( currentIntercept*epSign*hSign < extremes[(hSign*epSign+1)/2]*hSign*epSign);
	}
	extremes = [];
	for (let ep of extremePoints){
		epIntercept = waluigiSqueegee(ep,hInt);
		if (extremes.length == 0){
			extremes = [epIntercept,epIntercept];
		} else {
			extremes = [min(epIntercept,extremes[0]),max(epIntercept,extremes[1])];
		}
		
	}

	epSign = sign(waluigiSqueegee(hPerp,hInt));
	for (let u = upwards.length - 1; u > -1; u--){
		for (let hSign = -1; hSign < 2; hSign += 2){
			let currentInteger = [...upwards[u]];
			do {
				currentInteger = addC(currentInteger, scaleC(hSign,hPerp));
				upwards.push([...currentInteger]);
				currentIntercept = waluigiSqueegee(currentInteger,hInt);
			}
			while (currentIntercept*epSign*hSign < extremes[(hSign+1)/2]*hSign);
		}
	}

	for (let u of upwards){
		highlights.push([u[0]*(isHex?2:1),u[1]*(isHex?2:1)]);
	}	
}


function waluigiSqueegee(point, lineBase){
	return point[1]*lineBase[0]-point[0]*lineBase[1];
}

function nearestMultiple(a,b){
	let bNorm = qNorm(b);
	let unscaled = qMult(a,[b[0],-b[1]]);
	let roundedDiv = roundC(scaleC(1/bNorm,unscaled));
	return qMult(roundedDiv,b);
}
