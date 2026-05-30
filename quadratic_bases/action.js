
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

	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 
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
			principalPos = pixelToPrincipal(focusPoint());
		}

		// if (highlights.length > 0 && highlightMode == 'multiples'){
		// 	highlightMultiples(infoIntegerTrue);
		// }
	}
}


function mouseWheel(event){
	
	if (hideCanvas){return;}
	event.preventDefault(); 
	updateTouchInfo();

	// scrolling will update scalar logarithmically 
	var scalarLog = log(scalar);
	scalarLog -= event.delta/2048; // make this positive to invert scroll
	scalar = max(scaleMin,exp(scalarLog));

	updateMovement();
}




//##################################
//              ACTION
//##################################


// function displayMode(){
// 	iconChecks();
// 	document.getElementById('display-icon').style.display = 'none';
// 	document.getElementById('edit-icon').style.display = 'flex';
	
// 	pageMode = 'display';
// 	setupLayout();
// 	processInts();
// }

// function editMode(){
// 	iconChecks();
// 	document.getElementById('edit-icon').style.display = 'none';
// 	document.getElementById('display-icon').style.display = 'flex';
	
// 	pageMode = 'edit';
// 	setupLayout();
// }


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
	digits.push([[0,0]]);
	ints.splice(digits.length-1,0,[]);
	dragged = digits.length-1;

	maxDigitCount = floor(log(desiredLimit)/log(digits.length));
	controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
	
	deleteDrop = false;
	dropDigit();
	dragged = -1;
}


var deleteDrop = false;
function dropDigit(){


	if (deleteDrop && dragged < digits.length){
		digits.splice(dragged,1);
		
		maxDigitCount = floor(log(desiredLimit)/log(digits.length));
		controllers['arrow-limit'].giveIndex(maxDigitCount-1,true);
		
		processInts();
		deleteDrop = false;
		return;
	}

	
	let minDist = 1000000;
	let bestPoint;
	let rawPoint = dragged == digits.length? base : digits[dragged][0];
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
				if (dig == dragged){continue;}
				if (closeC(digits[dig][0],testPoint)){
					isDupe = true;
					break;
				}
			}
			if (digits.length != dragged && closeC(base,testPoint)){
				isDupe = true;
			}

			if (isDupe){
				continue;
			}

			minDist = testDist;
			bestPoint = testPoint;
		}
	}

	setDragged(bestPoint);
}


function setDragged(newArray){
	if (dragged < digits.length){
		digits[dragged] = [newArray];	
		
	} else {
		base = newArray;	
		truncatePowers();
	}
	ints[dragged] = new QuadInt(...newArray, 0, dragged);
	
	processInts();	
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
	}
}



// function toggleShapeLabel(shapeIndex){
// 	for (let element of document.getElementById('shape-' + letters[shapeIndex]).children){
// 		element.classList.toggle('svg-' + shapeKeys[shapeIndex]);
// 		element.classList.toggle('svg-back');
// 	}
// }


var desiredLimit = 3125;
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
		digitArray.push(dig[0]);
	}
	
	let settingsObjects = {
		square: dList[controllers['arrow-definition'].index],
		base: base,
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