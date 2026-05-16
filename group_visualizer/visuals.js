
var arrowElements = [1,2,3];
var selectedElements = [1,2,3];
var arrowTypes = [0,0,0];
var arrowStrengths = [0.25,0.04,0.01];


var autoPositionSkip = false;
function updatePhysics(){
	
	if (!movement){
		return;
	} 
	
	for (let a = 0; a < arrowElements.length; a++){

		if (arrowElements[a] == -1){continue;}
		
		for (let arrowFrom = 0; arrowFrom < gOrder; arrowFrom++){

			let arrowTo = G[arrowElements[a]].arrowTables[arrowTypes[a]][arrowFrom];
			
			let diffVec = G[arrowFrom].pos.copy();
			diffVec = diffVec.sub(G[arrowTo].pos);
			
			diffVec.mult(arrowStrengths[a]/2000);
			
			G[arrowFrom].acc.sub(diffVec);
			G[arrowTo].acc.add(diffVec);
		}
	}
	
	for (let g of G){
		for (let h of G){
			if (g.index == h.index){continue;}
			
			let diffVec = g.pos.copy();
			diffVec = diffVec.sub(h.pos);
			if (diffVec.mag() > 6){
				continue;
			}
			diffVec.mult(min(0.0004/diffVec.mag(),100));
			g.acc.add(diffVec);
			h.acc.sub(diffVec);
		}
	}

	
	for (let g of G){
		g.update();
	}
	
	
}

var innerRing = [];
var outerRing = [];
function innerOuter(positionMode){
	
	if (gOrder == 1 || (autoPositionSkip && !movement)){
		return;
	}
	
	if (movement){
		inTheta += 0.0031;
		outTheta += 0.0021;
	}
	
	innerRing = [0];
	let arrowCheck = 0;
	while (innerRing.length == 1){
		if (arrowCheck < arrowElements.length){
			if (arrowElements[arrowCheck] > 0){
				innerRing.push(...powersOutsideOfList(arrowElements[arrowCheck]));
			}
		} else {
				innerRing.push(...powersOutsideOfList(1));
		}
		arrowCheck++;
	}
	
	let positioned = [];
	outerRing = [0];
	let outr = -1;
	let posRad = innerRing.length*0.6+3/innerRing.length;
	let innerAng = TWO_PI/innerRing.length;
	let testEl = 1;
	
	while (positioned.length < gOrder){
		
		while (outr < outerRing.length - 1){
			outr++;
			if (positioned.includes(outerRing[outr])){
				outerRing.splice(outr,1);
				outr--;
				continue;
			}
			
			for (let inr = 0; inr < innerRing.length; inr++){
				let posEl = G[innerRing[inr]].arrowTables[arrowTypes[0]%2][outerRing[outr]];
				let posAng =  inTheta + inr*innerAng + outr*(TWO_PI/gOrder+outTheta) - PI/2;
				G[posEl].inner = inr;
				G[posEl].outer = outr+1;
				
				if (positionMode == 'auto'){
					G[posEl].pos = createVector(posRad*(outr+1)*cos(posAng),posRad*(outr+1)*sin(posAng));
				}
				
				positioned.push(posEl);
			}
		}
		if (positioned.length == gOrder){break;}
		
		let newOuter = [];
		if (arrowCheck < arrowElements.length){
			if (arrowElements[arrowCheck] > 0){
				newOuter = powersOutsideOfList(arrowElements[arrowCheck],positioned);
			}
		} else {
			while (newOuter.length == 0){
				newOuter = powersOutsideOfList(testEl,positioned);
				testEl++;
			}
		}
		arrowCheck++;
		
		let oldLen = outerRing.length;
		for (let no of newOuter){
			for (let ol = 0; ol < oldLen; ol++){
				outerRing.push( G[no].arrowTables[0][ol] );
			}
		}
		
		
	}
	autoPositionSkip = true;
}

function powersOutsideOfList(elIndex, indexList = [0]){
	
	let powerOutput = [];
	let powerIndex = elIndex;
	
	while (indexList.includes(powerIndex) == false){
		powerOutput.push(powerIndex);
		powerIndex = G[elIndex].arrowTables[0][powerIndex];
	}
	
	return powerOutput;
}

var inTheta = 0;
var outTheta = 0;




/*******************************
				TABLE
*******************************/


function showTable(){
	innerOuter('table');
	let boxColors = getBoxColors();
	let boxSize = 4.5/log(gOrder+5); //
	
	onlyFill(palette.front);
	
	let ts = boxSize*0.5;
	let tmax = boxSize*0.8;
	
	
	let boxBase = (-0.25-gOrder/2)*boxSize;
	
	for (let x = 0; x < gOrder; x++){
		
		let boxX = (x-(gOrder-1.5)/2)*boxSize;
		onlyFill(boxColors[x][gOrder][0]);
		textLimited(G[x].displayName ,boxX,boxBase-boxSize*0.1, ts, tmax);
		onlyFill(boxColors[gOrder][x][0]);
		textLimited(G[x].displayName ,boxBase,boxX-boxSize*0.1, ts, tmax);
		
		
		for (let y = 0; y < gOrder; y++){
		
			let boxY = (y-(gOrder-1.5)/2)*boxSize;

			onlyFill(boxColors[x][y][0]);
			rect(boxX,boxY,boxSize*0.9,boxSize*0.9,boxSize*0.05);
			
			onlyFill(boxColors[x][y][1]);
			textLimited(G[G[y].arrowTables[0][x]].displayName ,boxX,boxY-boxSize*0.05, ts, tmax);
		}	
	}
	
}

var boxAdjust = 0;
function getBoxColors(){
	
	if (movement){
		boxAdjust += 0.003;
	}
	
	let boxColors = [];
	
	for (let x = 0; x < gOrder + 1; x++){
		let newRow = [];
		if (gOrder == x){
			for (let y = 0; y < gOrder; y++){
				newRow.push([palette.front]);
			}	
			
		} else {
			
			for (let y = 0; y < gOrder; y++){
				
				let sqel = G[G[y].arrowTables[0][x]];
				let squareColor;
				
				if (!autoColorTable){
					
					let lerper = 0.1 + (0.9*G[y].arrowTables[0][x]/gOrder+boxAdjust)%0.9;
					squareColor = lerpColor(palette.back, palette.front, lerper);
			
				} else {
	
					let lerperIn = 0.3 + 0.7*sqel.inner/(innerRing.length-1);
					let lerperOut = 0.3 + 0.7*sqel.outer/(outerRing.length-1);
				
					if (sqel.outer == 4 || outerRing.length > 4){
						squareColor = lerpColor(palette.back, palette.front, lerperIn);
					} else {
						squareColor = lerpColor(palette.back, palette.accent[sqel.outer-1], lerperIn);
					}

					
				}
				
				let brightBack = false;
				if (brightness(squareColor) > (palette.dark?60:80)){
					brightBack = true;
				}
				if (brightBack == palette.dark){
					newRow.push([squareColor,palette.back]);
				} else {
					newRow.push([squareColor,palette.front]);
				}
				
			}	
			
		}
		newRow.push([palette.front]);
		boxColors.push(newRow.slice());
	}
	
	if (autoColorTable){
		return boxColors;
	}
	
	
	for (let a = arrowElements.length -1; a > -1; a--){
		if (arrowElements[a] == -1){continue;}
		
		if (arrowTypes[a] == 1){
			for (let y = 0; y < gOrder+1; y++){
				boxColors[arrowElements[a]][y] = [palette.accent[a],palette.back];
			}	
		} else if (arrowTypes[a] == 0){
			for (let x = 0; x < gOrder+1; x++){
				boxColors[x][arrowElements[a]] = [palette.accent[a],palette.back];
			}	
		} else if (arrowTypes[a] == 2){
			for (let x = 0; x < gOrder; x++){
				for (let y = 0; y < gOrder; y++){
				//for (let y = x; y < x+1; y++){
					if (G[y].arrowTables[0][x] == arrowElements[a]){
						boxColors[x][y] = [palette.accent[a],palette.back];
					}
				}	
			}	
			
			boxColors[gOrder][arrowElements[a]] = [palette.accent[a]];
			boxColors[arrowElements[a]][gOrder] = [palette.accent[a]];
			
		}
		
	}
	
	return boxColors;
}

var autoColorTable = false;

