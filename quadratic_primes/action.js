
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
	

	let rawInfo = pixelToPrincipal(focusPoint(),true);
	
	if (isHex){
		let lower = round(floor(rawInfo.x)/2,1);

		let loweroffset = round(lower - floor(lower),1);
		let lowclosest = [lower,round(rawInfo.y/2+loweroffset)-loweroffset];
		let highclosest = [lower+0.5,round(rawInfo.y/2+0.5-loweroffset)-0.5+loweroffset];
		let lowdist = (rawInfo.x/2-lowclosest[0])**2 + ((rawInfo.y/2-lowclosest[1])/1.154)**2;
		let highdist = (rawInfo.x/2-highclosest[0])**2 + ((rawInfo.y/2-highclosest[1])/1.154)**2;
		
		if (lowdist < highdist){
			rawInfo = [round(lowclosest[0]*2),round(lowclosest[1]*2)];
		} else {
			rawInfo = [round(highclosest[0]*2),round(highclosest[1]*2)];
		}
	} else {
		rawInfo = [round(rawInfo.x),round(rawInfo.y)];
	}
	
	infoInteger = rawInfo[0] == infoInteger[0] && rawInfo[1] == infoInteger[1] ? [] : rawInfo;
		
	setInfo();
	
	updateTouchInfo();
}

function touchMoved(event){

	if (mouseInMenu || hideCanvas){return;}
	// event.preventDefault(); 
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
	
	// if (autoZoom == false){
	if (hideCanvas){return;}
	updateTouchInfo();

	// scrolling will update scalar logarithmically 
	var scalarLog = log(scalar);
	scalarLog -= event.delta/4096; // make this positive to invert scroll
	scalar = max(scaleMin,exp(scalarLog));
	// iconBox.getItem('reset').Active = true;

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

