
//##################################
//              CONTROLS
//##################################


// var infoClick = false;
// var clickStart;

var dragged = -1;
var draggedSubFocus;
var focusPrincipal;
function touchStarted(){
		
	if (mouseInMenu || hideCanvas || (dragged >= 0)){return;}
	// clickStart = focusPoint();
	
	updateTouchInfo();
	
	setFocusPrincipal();
	// let mouseInt = mouseToInt();
	// let searching = true;

	if (dragged > -1){
		return;
	}

	dragged = getMouseInt(focusPoint);

	if (dragged > -1){
		showViewIcon();
		if (dragged == digits.length){
			draggedSubFocus = subC(base,focusPrincipal);
			return;
		} else {
			draggedSubFocus = subC(digits[dragged][0],focusPrincipal);
		}

	}

	if (dragged > -1 && digits.length > 2){
		document.getElementById('trash-digit-icon').style.display = 'flex';
		document.getElementById('delete-digit-icon').style.display = 'none';
	}
}

function getMouseInt(){

	let focusRaw = pixelToPrincipal(focusPoint(),'raw');

	if (focusRaw.dist(arrayToVector(baseRaw)) < 0.58){
		return digits.length;
	}

	for (let dig = digits.length-1; dig > 0 ; dig--){

		if (ints[dig].coords.dist(focusRaw) < 0.58){
			return dig;
		}
	}

	return -1;
}


function touchEnded(){

	if (dragged > -1){
		dropDigit();
		dragged = -1;
		document.getElementById('trash-digit-icon').style.display = 'none';
		document.getElementById('delete-digit-icon').style.display = 'flex';
	}
	
	if (mouseInMenu || hideCanvas){
		mouseInMenu = false;	
		return;
	}
	setFocusPrincipal();
	// if (page)
	// infoInteger = rawInfo[0] == infoInteger[0] && rawInfo[1] == infoInteger[1] ? [] : rawInfo;

	// setInfo();
	
	updateTouchInfo();
}

// function mouseToInt(){
	
// 	if (isHex){
// 		let focusStraight = pixelToPrincipal(focusPoint());

// 		let rowNumber = floor(focusStraight.y+0.335);
// 		let xOffset = (modulo(rowNumber,2)==1)?1:0;

// 		let boxCenter = [round(0.5*(focusStraight.x-xOffset))*2+xOffset,rowNumber];
// 		let boxMod = subC(vectorToArray(focusStraight),boxCenter);

// 		if (boxMod[1] - boxMod[0]/3 > 0.6666){
// 			boxCenter = addC(boxCenter,[-1,1]);
// 		} else if (boxMod[1] + boxMod[0]/3 > 0.6666){
// 			boxCenter = addC(boxCenter,[1,1]);
// 		} 

// 		return [round((boxCenter[0]+boxCenter[1])/2),boxCenter[1]];
// 	} else {
// 		return roundC(focusPrincipal);
// 	}
// }

	

function touchMoved(event){

	event.preventDefault(); 
	if (mouseInMenu || hideCanvas){return;}
	setFocusPrincipal();
	// if (infoClick && clickStart.dist(focusPoint()) > 5){
	// 	infoClick = false;
	// }
	updateMovement();

}

function setFocusPrincipal(){
	focusPrincipal = vectorToArray(pixelToPrincipal(focusPoint(),'slant'));
	// focusPrincipal = pixelToPrincipal(focusPoint(),false);
}


var focusPixel;
function updateMovement(){
	
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		if (dragged == -1){
			if (isHex){
				origin = focusPoint().sub(principalPos.mult(scalar*0.5,-scalar*0.866));
			} else {
				origin = focusPoint().sub(principalPos.mult(scalar,-scalar));
			}
			showEditIcon();
		}
		principalPos = pixelToPrincipal(focusPoint());

		// if (highlights.length > 0 && highlightMode == 'multiples'){
		// 	highlightMultiples(infoIntegerTrue);
		// }
	}
}


function mouseWheel(event){
	

	updateTouchInfo();

	if (hideCanvas || mouseOverMenu()){return;} 
	event.preventDefault(); 
	showEditIcon();

	// scrolling will update scalar logarithmically 
	var scalarLog = log(scalar);
	scalarLog -= event.delta/2048; // make this positive to invert scroll
	scalar = max(scaleMin,exp(scalarLog));
	// pointSize = 0.25/(scalar**0.25);

	updateMovement();
}




//##################################
//              ACTION
//##################################



function showEditIcon(){
	document.getElementById('view-icon').style.display = 'none';
	document.getElementById('edit-icon').style.display = 'flex';
}

function showViewIcon(){
	document.getElementById('view-icon').style.display = 'flex';
	document.getElementById('edit-icon').style.display = 'none';
}

function editMode(){
	hidePopups();
	showViewIcon();
	setMaxInt(digits.length);
}

function viewMode(){
	hidePopups();
	showEditIcon();	
	setMaxInt(ints.length);

}

var scalarLerp = 2;
var scalarValues, originValues;
function setMaxInt(limitInt){

	// let maxSize = base[0]**2 + base[1]**2;
	let maxDists = [-100000,-100000];
	let minDists = [100000,100000];
	for (let i = 0; i < limitInt; i++){
		maxDists[0] = max(maxDists[0],ints[i].coords.x);
		maxDists[1] = max(maxDists[1],ints[i].coords.y);
		minDists[0] = min(minDists[0],ints[i].coords.x);
		minDists[1] = min(minDists[1],ints[i].coords.y);
	}
	
	maxDists[0] = max(maxDists[0],baseRaw[0]);
	maxDists[1] = max(maxDists[1],baseRaw[1]);
	minDists[0] = min(minDists[0],baseRaw[0]);
	minDists[1] = min(minDists[1],baseRaw[1]);


	scalarLerp = 0;

	maxDists = addC([2,2],maxDists);
	minDists = addC([-2,-2],minDists);

	let maxDist = max(maxDists[0]-minDists[0], maxDists[1]-minDists[1]);
	scalarValues = [scalar,0.9*min(grid.wid.x,grid.wid.y)/maxDist];
	originValues = [ origin.copy(),
		createVector(...scaleC(-0.5*scalarValues[1],addC(maxDists,minDists))).mult(1,-1).add(defaultOrigin) 
	];

}

function iconChecks(){
	if (Date.now() > copySuccessExpiration){
		document.getElementById('copy-icon').style.display = 'flex';
		document.getElementById('copy-success').style.display = 'none';
		
	}
}

function customToggleHolder(holderType, holderToggle){
	if (holderType == 'menu'){
		setOriginAndGrid();
		
	}
}


function newDigit(){
	hidePopups();

	digits.push([randomDonut(0.5,1.6)]);
	ints.splice(digits.length-1,0,[]);
	dragged = digits.length-1;

	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	dropDigit(true);
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	updateColorList();
	
	dragged = -1;

	if (digits.length == 3){
		toggle('delete');
	}
}


function deleteDigit(digitIndex = digits.length-1){

	if (digits.length < 3){
		return;
	}

	digits.splice(digitIndex,1);
	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	updateColorList();

	toProcess = true;

	if (digits.length == 2){
		toggle('delete');
	}
}

function mouseOverMenu(){
	let pixelPos = principalToPixel(principalPos);
	return portrait ? pixelPos.y > deleteLimit : pixelPos.x < deleteLimit;
}


var snapIsOn = true;
function dropDigit(digitIsNew = false){

	toProcess = true;
	if (digits.length > 2 && dragged < digits.length && !digitIsNew){
		if (mouseOverMenu()){
			deleteDigit(dragged);
			return;
		}
	}

	if (snapIsOn){
		snapToBest(dragged);
	}

}


function setDigit(newArray,digitIndex){
	if (digitIndex < digits.length){
		digits[digitIndex] = [newArray];	
		
	} else {
		base = newArray;	
		truncatePowers();
	}
	ints[digitIndex] = new QuadInt(...newArray, 1, digitIndex, digitIndex);
	
	toProcess = true;
}


function toggle(iconName){
	hidePopups();
	for (let svgElement of document.getElementById('svg-' + iconName).children){
		svgElement.classList.toggle('svg-front');
		svgElement.classList.toggle('svg-half');
	}

	switch (iconName){
		case 'grid':
			grid.visible = !grid.visible;
			break;
		case 'lock':
			snapIsOn = !snapIsOn;
			if (snapIsOn){
				for (let dig = 1; dig <= digits.length; dig++){
					snapToBest(dig,true);
				}
				toProcess = true;
			}
			break;
	}
}

function setSystem(vUnit){

	verticalUnit = vUnit;
	isHex = vUnit == 'ω';
	d = [-1,isHex?-1:0];
	truncatePowers();

	toProcess = true;

	document.getElementById('iwaginary-icon').style.display = isHex?'none':'flex';
	document.getElementById('imaginary-icon').style.display = isHex?'flex':'none';
}



var desiredLimit = 6000;
var verticalUnit = 'i'
function arrowHandlerCustom(clickedControl){
	hidePopups();
	
	// if (clickedControl.id == 'arrow-definition'){
	// 	let dValue = dList[clickedControl.index];
		
	// 	isHex = modulo(dValue,4) == 1;
	// 	if (isHex){
	// 		d = [round((dValue-1)/4),-1];
	// 	} else {
	// 		d = [dValue,0];
	// 	}

	// 	verticalUnit = isHex ?  'ω' : 'i';

		// if (dValue == -1){
		// 	verticalUnit = 'i';
		// } else if (dValue == 0){
		// 	verticalUnit = 'ε';
		// } else if (dValue == -3){
		// 	verticalUnit = 'ω';
		// } else {
		// 	verticalUnit = 'k';
		// }
		
	// 	truncatePowers();
		
	// } else 
	if (clickedControl.id == 'arrow-limit'){
		
		maxDigitCount = clickedControl.index+1;
		desiredLimit = digits.length**maxDigitCount;
		updateColorList();
		toProcess = true;

	} else if (clickedControl.id == 'arrow-color'){
		
		colorType = clickedControl.index;
		for(let int of ints){
			int.setColor();
		}
	} 
	
	
}

function updateColorList(){
	let colorList = [...controllers['arrow-color'].list];

	let colorMax = colorList.length - 2;
	while (colorMax < maxDigitCount){
		colorMax++;
		colorList.push(ordinal(colorMax) + ' digit');
	}
	while (colorList.length - 2 > maxDigitCount){
		colorList.pop();
	}
	controllers['arrow-color'].giveList(colorList,-1,true);
	colorType = controllers['arrow-color'].index;
}


function randomize(){
	hidePopups();

	let deleteToggled = digits.length == 2;

	// controllers['arrow-definition'].randomize();
	setSystem(random()<0.5?'i':'ω');

	setDigit(randomDonut(1.2,2),digits.length);
	snapToBest(digits.length,true);

	let baseNorm = quadNorm(base);
	let digitCount = max(2,baseNorm[0]-floor(random(1,1.9)**2));
	digits = [[[0,0]]];
	for (let dig = 0; dig < digitCount; dig++){
		digits.push([]);
		setDigit(randomDonut(0.5,1.6),dig+1);
		snapToBest(digits.length-1,true);
	}

	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	updateColorList();
	controllers['arrow-color'].randomize(true);

	processInts();
	setMaxInt(ints.length);
	scalarLerp = 1;

	showEditIcon();

	if (deleteToggled != (digits.length == 2)){
		toggle('delete');
	}

}

function randomDonut(lowerRoot, upperRoot){

	let randomSize = random(lowerRoot,upperRoot)**2;
	let randomAng = random(TWO_PI);
	return [randomSize*cos(randomAng),randomSize*sin(randomAng)];
}


var goodUnits = ['i','j','k','ω',''];
function codeToSettings(rawInputStr){
	let deleteToggled = digits.length == 2;

	let lockIntegers = true;

	let inputStr = rawInputStr.split(' ').join('').split(' ').join('');


	let baseIndex = inputStr.search('base');
	let digitsIndex = inputStr.search('digits');
	let colorIndex = inputStr.search('colorby');
	// let whereIndex = inputStr.search('where');

	if (baseIndex == -1 || digitsIndex == -1){
		return false;
	}

	// let codeUnit = inputStr.substring(whereIndex+5, whereIndex+6);
	// if (!goodUnits.includes(codeUnit) == -1){
	// 	return false;
	// }

	let notOmega = inputStr.indexOf('ω') == -1;
	let codeUnit = notOmega ? 'i' : 'ω';


	let testBase = textInto2d(inputStr.substring(baseIndex+4,digitsIndex-4),codeUnit);
	if (isNaN(testBase[0])||isNaN(testBase[1])){
		return false;
	}
	lockIntegers = lockIntegers && equalArrays(base,roundC(base,4));

	let digitsEnd = colorIndex == -1 ? inputStr.length : colorIndex;
	let digitList = inputStr.substring(digitsIndex+6,digitsEnd).replace('and','') .split(',');
	maxDigitCount = floor(log(desiredLimit)/log(digitList.length));

	let newDigits = [];
	for (let newDigit of digitList){
		let testNum = textInto2d(newDigit,codeUnit);
		if (isNaN(testNum[0])||isNaN(testNum[1])){
			return false;
		}
		newDigits.push([testNum]);
		lockIntegers = lockIntegers && equalArrays(testNum,roundC(testNum,0));
	}

	base = [...testBase];
	digits = newDigits;


	setSystem(notOmega?'i':'ω');
	// controllers['arrow-definition'].giveIndex(notOmega?0:1);
	// let pasteD = textInto2d(inputStr.substring(whereIndex+8),codeUnit);
	// if (isNaN(pasteD[0])||isNaN(pasteD[1])){
	// 	return false;
	// }
	// if (pasteD[1] == 0){
	// 	controllers['arrow-definition'].giveIndex(dList.indexOf(pasteD[0]));
	// } else {
	// 	controllers['arrow-definition'].giveIndex(dList.indexOf(pasteD[0]*4+1));
	// }

	if (snapIsOn != lockIntegers){
		toggle('lock');
	}
	if (deleteToggled != (digits.length == 2)){
		toggle('delete');
	}


	let newColorType = 0;
	if (colorIndex != -1 && inputStr.search('lead') != -1){
		newColorType = 1;
	} else if (colorIndex != -1){
		colorIndex += 7;
		if (isNaN(inputStr.substring(colorIndex,colorIndex+1))){
			newColorType = 0;
		} else if (isNaN(inputStr.substring(colorIndex+1,colorIndex+2))){
			newColorType = int(inputStr.substring(colorIndex,colorIndex+1))+1;
		} else {
			newColorType = int(inputStr.substring(colorIndex,colorIndex+2))+1;
		}
	}
	maxDigitCount = max(maxDigitCount,newColorType-1)

	setupLayout();
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	updateColorList();
	controllers['arrow-color'].giveIndex(newColorType);
	// toProcess = true;

	processInts();
	setMaxInt(ints.length);
	scalarLerp = 1;
	return true;
}


function settingsToCode(){
	let digitArray = [];
	for (let dig of digits){
		digitArray.push(roundC(dig[0],2));
	}
	
	let settingsString = 'base ' + text2d(roundC(base,3),verticalUnit,'') + ' ';

	settingsString += 'with digits ' ;
	for (let dig = 0; dig < digits.length; dig++){
		if (dig + 1 < digits.length){
			settingsString += text2d(roundC(digits[dig][0],3),verticalUnit,'') + ', ';
		} else {
			settingsString += 'and ' + text2d(roundC(digits[dig][0],3),verticalUnit,'');
		}
	}

	if (colorType == 1){
		settingsString += ' color by lead'
	} else if (colorType > 1){
		settingsString += ' color by ' + ordinal(colorType-1);
	}


	// settingsString += ' where ' + verticalUnit + '² = ' + text2d(d,verticalUnit,'');
	return settingsString;
}


function nextFavorite(){
	hidePopups();
	favoriteIndex = (favoriteIndex + 1)%favorites.length;

	codeToSettings(favorites[favoriteIndex][0]);
	
	if (favorites[favoriteIndex][1].length > 1){
		document.getElementById('submitted-note').style.display = 'inline';
		document.getElementById('submitted-note').innerHTML = 'submitted by ' + favorites[favoriteIndex][1];
	} else {
		document.getElementById('submitted-note').style.display = 'none';
	}
	
	showEditIcon();
} 

var favoriteIndex = 0;

var favorites = [
['base -3+ω with digits 0, 1, ω, -1-ω, -2-3ω, 3+ω, -1+2ω, 1+ω, -ω, -3-ω, 1-2ω, 2+3ω, and -1',''],
['base -1+ω with digits 0, 1, and 1+ω',''],
['base -2+3i with digits 0, 1, i, -1, -i, 2+3i, -2-3i, -3+2i, 2, -2, -2i, 3-2i, and 2i',''],
['base 2+2ω with digits 0, -ω, 1, and -3ω','@a71_special'],
['base -6-ω with digits 0, 2+4ω, 4ω, 4+2ω, -4-4ω, -3, 3, -3-3ω, 3ω, 2, -1-ω, -ω, 1+ω, -1, 4, -2ω, -2, 2-2ω, -3ω, -4, 2+2ω, -2-2ω, 1, ω, -2+2ω, 3+3ω, -2-4ω, 2ω, 4+4ω, -4ω, and -4-2ω',''],
['base 6+i with digits 0, 1, i, -1, -i, 1-4i, 3+i, -4+i, 4, 1+4i, -4, -4-2i, -3-i, 1-3i, 4+2i, 3-2i, -3+2i, 1-i, 1+i, -1+3i, -1-i, 2+3i, 3+2i, -1-4i, -4-i, -1+i, 2-4i, -2+4i, 2-3i, -3-2i, -2-3i, -2+3i, 4+i, 4i, 4-i, -1+4i, and -4i color by 1st',''],
['base -3+ω with digits 0, 1, 1+ω, ω, -1, 1-ω, -1-2ω, -ω, 1+2ω, 2+ω, -2-ω, -1-ω, and -1+ω color by 2nd',''],
['base 3i with digits 0, 1, i, -1, -i, 2+2i, -2-2i, 2-2i, and -2+2i color by 3rd',''],
['base -2+3ω with digits 0, -ω, -1-ω, ω, -3-ω, 2+2ω, -1+2ω, -2ω, 1, 1-2ω, 3+ω, -2-3ω, -2, -3-3ω, 2+3ω, 3ω, 1+ω, -1, and 3 color by 2nd',''],
['base -1+2i with digits 0, 1, i, -1, and -i',''],
['base -2+3ω with digits 0, 1, ω, -5-3ω, 2+5ω, -1-ω, 3-2ω, 4+3ω, 3+ω, 2ω, -2-3ω, 3+2ω, -1+2ω, 2, -2+ω, -1-3ω, -2-2ω, -1-4ω, and -3+ω color by 2nd',''],
['base -4+i with digits 0, 2, -2, 4+3i, 2+2i, -1-i, 2-2i, -4-3i, 2i, -2-2i, 1+i, -3+4i, -2+2i, -1+i, -2i, 3-4i, and 1-i color by lead',''],
];

