
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

	let focusRaw = pixelToPrincipal(focusPoint(),'raw');

	if (focusRaw.dist(arrayToVector(baseRaw)) < 0.58){
		showViewIcon();
		dragged = digits.length;
		draggedSubFocus = subC(base,focusPrincipal);
		return;
	}
	
	for (let dig = digits.length-1; dig > 0 ; dig--){
		// if (closeC(mouseInt,digits[dig][0])){
		// 	dragged = dig;
		// 	draggedSubFocus = subC(digits[dig][0],focusPrincipal);
		// 	break;
		// }
		if (ints[dig].coords.dist(focusRaw) < 0.58){
			showViewIcon();
			dragged = dig;
			draggedSubFocus = subC(digits[dig][0],focusPrincipal);
			break;
		}
	}

	if (dragged > -1 && digits.length > 2){
		document.getElementById('delete-digit-icon').style.display = 'flex';
		document.getElementById('new-digit-icon').style.display = 'none';
	}
}


function touchEnded(){

	if (dragged > -1){
		dropDigit();
		dragged = -1;
		document.getElementById('delete-digit-icon').style.display = 'none';
		document.getElementById('new-digit-icon').style.display = 'flex';
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
	
	if (hideCanvas){return;}
	event.preventDefault(); 
	updateTouchInfo();
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

	let maxSize = base[0]**2 + base[1]**2;
	for (let i = 0; i < limitInt; i++){
		let intSize = ints[i].coords.magSq();
		if (maxSize < intSize){
			maxSize = intSize;
		}
	}

	scalarLerp = 0;
	scalarValues = [scalar,defaultScalar*4.5/(maxSize**0.5)];
	originValues = origin.copy();
}

function iconChecks(){
	if (Date.now() > copySuccessExpiration){
		document.getElementById('copy-icon').style.display = 'flex';
		document.getElementById('copy-success').style.display = 'none';
		
	}
}

// function customToggleHolder(holderType, holderToggle){
// 	if (holderType == 'info'){
// 		document.getElementById('arrow-function').style.display = (holderToggle == 'show'? 'none':'flex');
	
// 	} else if (holderType == 'menu'){
// 		setDefaultOrigin();
		
// 	}
// }


function newDigit(){
	hidePopups();

	digits.push([randomDonut(0.5,1.6)]);
	ints.splice(digits.length-1,0,[]);
	dragged = digits.length-1;

	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	
	dropDigit(true);
	processInts();
	dragged = -1;
}

var snapIsOn = true;
function dropDigit(digitIsNew = false){

	if (digits.length > 2 && dragged < digits.length && !digitIsNew){

		let pixelPos = principalToPixel(principalPos);
		let deleteDrop = portrait ? pixelPos.y > deleteLimit : pixelPos.x < deleteLimit;
		if (deleteDrop){
			digits.splice(dragged,1);
			
			maxDigitCount = floor(log(desiredLimit)/log(digits.length));
			controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
			
			processInts();
			deleteDrop = false;
			return;
		}
	}

	if (!snapIsOn){
		return;
	}

	snapToBest(dragged);
}


function setDigit(newArray,digitIndex,skipProcessing = false){
	if (digitIndex < digits.length){
		digits[digitIndex] = [newArray];	
		
	} else {
		base = newArray;	
		truncatePowers();
	}
	ints[digitIndex] = new QuadInt(...newArray, 0, digitIndex);
	
	if (!skipProcessing){
		processInts();	
	}
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
				processInts();
			}
			break;
	}
}


var desiredLimit = 3125;
var verticalUnit = 'i'
function arrowHandlerCustom(clickedControl){
	hidePopups();
	
	if (clickedControl.id == 'arrow-definition'){
		let dValue = dList[clickedControl.index];
		
		isHex = modulo(dValue,4) == 1;
		if (isHex){
			d = [round((dValue-1)/4),-1];
		} else {
			d = [dValue,0];
		}

		if (dValue == -1){
			verticalUnit = 'i';
		} else if (dValue == 0){
			verticalUnit = 'ε';
		} else if (dValue == -3){
			verticalUnit = 'ω';
		} else {
			verticalUnit = 'k';
		}
		
		truncatePowers();
		
	} else if (clickedControl.id == 'arrow-limit'){
		
		maxDigitCount = clickedControl.index+1;
		desiredLimit = digits.length**maxDigitCount;
	} 
	
	processInts();
}


function randomize(){

	let randomDefinition = random();

	if (randomDefinition < 0.25){
		controllers['arrow-definition'].giveIndex(dList.length-1);
	} else if (randomDefinition < 0.5){
		controllers['arrow-definition'].giveIndex(dList.length-3);
	} else if (randomDefinition < 0.6){
		controllers['arrow-definition'].giveIndex(0);
	} else if (randomDefinition < 0.7){
		controllers['arrow-definition'].giveIndex(1);
	} else if (randomDefinition < 0.8){
		controllers['arrow-definition'].giveIndex(dList.length-2);
	} else {
		controllers['arrow-definition'].randomize();
	}


	setDigit(randomDonut(1.2,2),digits.length,true);
	snapToBest(digits.length,true);

	let digitCount = max(2,normC(base)**0.5-1);//floor(random(1,1.5)**2));
	digits = [[0,0]];
	for (let dig = 0; dig < digitCount; dig++){
		digits.push([]);
		setDigit(randomDonut(0.5,1.6),dig+1,true);
		snapToBest(digits.length-1,true);
	}

	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);

	processInts();

}

function randomDonut(lowerRoot, upperRoot){

	let randomSize = random(lowerRoot,upperRoot)**2;
	let randomAng = random(TWO_PI);
	return [randomSize*cos(randomAng),randomSize*sin(randomAng)];
}



function codeToSettings(rawInputStr){

	let inputStr = rawInputStr.split(' ').join('').split(' ').join('');
	// let settingsObject = JSON.parse(inputStr);
	// controllers['arrow-definition'].giveIndex(dList.indexOf(settingsObject.square));
	
	// base = settingsObject.base;

	// digits = [];
	// for (let dig = 0; dig < settingsObject.digits.length; dig++){
	// 	digits.push([settingsObject.digits[dig]]);
	// }
	let whereIndex = inputStr.search('where');
	if (whereIndex == -1){
		return false;
	}

	let codeUnit = inputStr.substring(whereIndex+5, whereIndex+6);
	
	let baseIndex = inputStr.search('base');
	let digitsIndex = inputStr.search('digits');

	base = textInto2d(inputStr.substring(baseIndex+4,digitsIndex-4),codeUnit);
	let digitList = inputStr.substring(digitsIndex+6,whereIndex).replace('and','') .split(',');
	
	maxDigitCount = floor(log(desiredLimit)/log(digitList.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);

	digits = [];
	for (let newDigit of digitList){
		digits.push([textInto2d(newDigit,codeUnit)]);
	}

	let pasteD = textInto2d(inputStr.substring(whereIndex+8),codeUnit);

	if (pasteD[1] == 0){
		controllers['arrow-definition'].giveIndex(dList.indexOf(pasteD[0]));
	} else {
		controllers['arrow-definition'].giveIndex(dList.indexOf(pasteD[0]*4+1));
	}

	setupLayout();
	processInts();
	return true;
}


function settingsToCode(){
	let digitArray = [];
	for (let dig of digits){
		digitArray.push(roundC(dig[0],2));
	}
	
	// let settingsObjects = {
	// 	base: base,
	// 	square: dList[controllers['arrow-definition'].index],
	// 	digits: digitArray
	// }
	// return JSON.stringify(settingsObjects);
	
	let settingsString = 'base ' + text2d(base,verticalUnit) + ' ';

	settingsString += 'with digits ' ;
	for (let dig = 0; dig < digits.length; dig++){
		if (dig + 1 < digits.length){
			settingsString += text2d(digits[dig][0],verticalUnit) + ' , ';
		} else {
			settingsString += 'and ' + text2d(digits[dig][0],verticalUnit);
		}
	}

	settingsString += ' where ' + verticalUnit + '² = ' + text2d(d,verticalUnit);
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

} 

var favoriteIndex = 0;

var favorites = [
['base -3 + ω with digits 0 , 1 , ω , -1 - ω , -2 - 3ω , 3 + ω , -1 + 2ω , 1 + ω , -ω , -3 - ω , 1 - 2ω , 2 + 3ω , and -1 where ω² = -1 - ω','name'],
['base -6 - ω with digits 0 , 2 + 4ω , 4ω , 4 + 2ω , -4 - 4ω , -3 , 3 , -3 - 3ω , 3ω , 2 , -1 - ω , -ω , 1 + ω , -1 , 4 , -2ω , -2 , 2 - 2ω , -3ω , -4 , 2 + 2ω , -2 - 2ω , 1 , ω , -2] + 2ω , 3 + 3ω , -2 - 4ω , 2ω , 4 + 4ω , -4ω , and -4 - 2ω where ω² = -1 - ω',''],
['base 6 + i with digits 0 , 1 , i , -1 , -i , 1 - 4i , 3 + i , -4 + i , 4 , 1 + 4i , -4 , -4 - 2i , -3 - i , 1 - 3i , 4 + 2i , 3 - 2i , -3 + 2i , 1 - i , 1 + i , -1 + 3i , -1 - i , 2 + 3i , 3 + 2i , -1 - 4i , -4 - i , -1 + i , 2 - 4i , -2 + 4i , 2 - 3i , -3 - 2i , -2 - 3i , -2 + 3i , 4 + i , 4i , 4 - i , -1 + 4i , and -4i where i² = -1',''],
// ['base 1 + 2i with digits 0 , 1 + i , i , -1 , and -i where i² = -1',''],
// ['base -4 + i with digits 0 , 1 , i , -1 , -i , 1 + i , 1 - i , -2i , 2 , 1 + 2i , 2 + i , -1 + i , -1 - i , 2i , and 2 + 2i where i² = -1','name'],
];
