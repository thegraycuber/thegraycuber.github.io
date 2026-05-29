
//##################################
//              CONTROLS
//##################################


var infoClick = false;
var clickStart;


function touchStarted(){
		
	if (mouseInMenu || hideCanvas){return;}
	clickStart = focusPoint();
	updateTouchInfo();
}

function touchEnded(){

	if (mouseInMenu || hideCanvas){
		mouseInMenu = false;	
		return;
	}
	

	let rawInfo = pixelToPrincipal(focusPoint());
	
	if (isHex){

		let rowNumber = floor(rawInfo.y+0.335);
		let xOffset = (modulo(rowNumber,2)==1)?1:0;

		let boxCenter = [round(0.5*(rawInfo.x-xOffset))*2+xOffset,rowNumber];
		let boxMod = subC(vectorToArray(rawInfo),boxCenter);

		if (boxMod[1] - boxMod[0]/3 > 0.6666){
			rawInfo = addC(boxCenter,[-1,1]);
		} else if (boxMod[1] + boxMod[0]/3 > 0.6666){
			rawInfo = addC(boxCenter,[1,1]);
		} else {
			rawInfo = boxCenter;
		}

	} else {
		rawInfo = roundC(vectorToArray(rawInfo));
	}
	
	infoInteger = closeC(rawInfo, infoInteger) ? [] : rawInfo;
		
	setInfo();
	
	updateTouchInfo();
}

function touchMoved(event){

	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 
	// if (infoClick && clickStart.dist(focusPoint()) > 5){
	// 	infoClick = false;
	// }
	updateMovement();

}


function updateMovement(){
	
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		if (isHex){
			origin = focusPoint().sub(principalPos.mult(scalar*0.5,-scalar*0.866));
		} else {
			origin = focusPoint().sub(principalPos.mult(scalar,-scalar));
		}
		principalPos = pixelToPrincipal(focusPoint());

		if (highlights.length > 0 && highlightMode == 'multiples'){
			highlightMultiples(infoIntegerTrue);
		}
	}
}


function mouseWheel(event){
	
	if (hideCanvas){return;}
	event.preventDefault(); 
	updateTouchInfo();

	// scrolling will update scalar logarithmically 
	var scalarLog = log(scalar);
	scalarLog -= event.delta/4096; // make this positive to invert scroll
	scalar = max(scaleMin,exp(scalarLog));

	updateMovement();
}


//##################################
//              ACTION
//##################################


function arrowHandlerCustom(clickedControl){
	hidePopups();
	
	if (clickedControl.id == 'arrow-ring'){

		units = [];
		D = DList[clickedControl.index];
		resetGrid();
	} else if (clickedControl.id == 'arrow-highlight'){

		highlightMode = clickedControl.value();
		setInfo();
	} 
}

function resetGrid(){
	hidePopups();

	infoInteger = [];
	let visibility = grid.visible;
	setInfo();
	setupLayout();
	resetD();
	grid.visible = visibility;
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

function customToggleHolder(holderType, holderToggle){
	if (holderType == 'menu'){

		let visibility = grid.visible;
		setOriginAndGrid();
		grid.visible = visibility;
		// let pixelZero = principalToPixel(createVector(0,0));
		// let saved
		
	}
}


function saveImage(){
	save(controllers['arrow-ring'].list[DList.indexOf(D)] + "_primes_" + nowString() + ".png");

}

// function changeColorMode(){
// 	coloringMode = (coloringMode + 1) % 4;
// }
// should i comment out or delete?
// i always delete, but why?
// my code from 5 years ago is gone.
// but how long was it supposed to last?
// it was going to disappear someday, anyway...
		
function randomize(){
	hidePopups();
	controllers['arrow-ring'].randomize();
	
}

