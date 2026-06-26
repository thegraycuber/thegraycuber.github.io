
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
	digits.push([[random(0.2,1.3),random(-1.2,1.2)]]);
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


// function randomize(){

// 	controllers['arrow-function'].randomize();
// 	if (random() > 0.5){
// 		toggle('grid');
// 	}
// 	if (!autoZoom){toggle('autozoom');}
// }



function codeToSettings(inputStr){

	let settingsObject = JSON.parse(inputStr);
	controllers['arrow-definition'].giveIndex(dList.indexOf(settingsObject.square));
	
	base = settingsObject.base;

	digits = [];
	for (let dig = 0; dig < settingsObject.digits.length; dig++){
		digits.push([settingsObject.digits[dig]]);
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
	
	let settingsObjects = {
		base: base,
		square: dList[controllers['arrow-definition'].index],
		digits: digitArray
	}
	return JSON.stringify(settingsObjects);
	
}


// function nextFavorite(){
// 	hidePopups();

// 	favoriteIndex = (favoriteIndex + 1)%favorites.length;
// 	codeToSettings(favorites[favoriteIndex][0]);
	
// 	if (favorites[favoriteIndex][1].length > 1){
// 		document.getElementById('submitted-note').style.display = 'inline';
// 		document.getElementById('submitted-note').innerHTML = 'submitted by ' + favorites[favoriteIndex][1];
// 	} else {
// 		document.getElementById('submitted-note').style.display = 'none';
// 	}

// 	if (!autoZoom){toggle('autozoom');}
// } 

// var favoriteIndex = 0;
// var favorites = [

// ];