
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

function processMod(){
	scalar = 0.4*min(width,height)/max(abs(hexNorm(modulus))**0.5,8);
	let extremes = [floor(width/(2*scalar))*2+4,floor(height/(2*scalar))*2+4];
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
			equivalenceClasses[rep].hexes.push([re*0.5,im*0.866]);
		}
	}
}

function processOrbits(){
	
	let modNorm = abs(hexNorm(modulus));
	let targetOrder = round((modNorm-1)/orbits);
	let oneRep = hexStr(getRepresentative([1,0]));

	let multiplier = [];
	for (let c of Object.keys(equivalenceClasses)){
		if (c == '0;0'){continue;}
		let cVal = [...equivalenceClasses[c].rep];
		let cPow = 1;
		let cStr = hexStr(cVal);
		while (cStr != oneRep && cPow < targetOrder){
			cPow++;
			cVal = getRepresentative(hexMult(cVal,equivalenceClasses[c].rep));
			cStr = hexStr(cVal);
		}

		if (cStr == oneRep && cPow == targetOrder){
			multiplier = [...equivalenceClasses[c].rep];
			break;
		}
	}
	for (let c of Object.keys(equivalenceClasses)){
		equivalenceClasses[c].orbit = -1;
	}

	let orbitNumber = 0;
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
}


var orbitOptions = [];
function generateOrbitOptions(modNorm){
	orbitOptions = [];
	let orbitTexts = [];
	let orbitIndex = 0;
	for (let oo = 2; oo < abs(modNorm); oo++){
		if (modulo(abs(modNorm) - 1,oo) == 0){
			orbitOptions.push(oo);
			orbitTexts.push(str(oo) + ' orbits');
			if (oo <= orbits){
				orbitIndex = orbitTexts.length-1;
			}
		}
	}
	controllers['arrow-orbits'].giveList(orbitTexts);
	
}


function generateHexPrimes(){	
	primeNorms = modulo(crowConstant,2)==1 ? [[2,0,4]]:[];
	
	
	for (let p = 1; p < primes.length; p++){
		addPrimeNorm(p);
	}

	let primeTexts = [];
	for (let pn of primeNorms){
		primeTexts.push('mod ' + text2d(pn,'c'));
	}
	
	controllers['arrow-modulus'].giveList(primeTexts);
}

var primeNorms;
function addPrimeNorm(primeIndex){

	let D = crowConstant*4+1;
	let testPrime = primes[primeIndex];
	if (modulo(D,testPrime) == 0){
		addHexWithNorm(testPrime);
		return;
	}
	
	let DPower = 1;
	let D2n = D;
	let remainingExp = round((testPrime-1)/2,0);
	while (remainingExp > 0){
		if (remainingExp % 2 == 1){
			DPower = modulo(DPower*D2n,testPrime);
		}	
		remainingExp = floor(remainingExp/2);
		D2n = modulo(D2n*D2n,testPrime);
	}

	if (DPower == 1){
		addHexWithNorm(testPrime);
	} else if (testPrime < 50){ // CAREFUL THIS WILL BREAK CODES
		primeNorms.push([testPrime,0,testPrime**2]);
	}
}

function addHexWithNorm(targetNorm){
	
	for (let re = 0; re < 20; re++){
		for (let im = -re; im < 30 - re; im++){
			if (abs(hexNorm([re,im])) == targetNorm){
				primeNorms.push([re,im,targetNorm]);
				return;
			}
		}
	}
}


