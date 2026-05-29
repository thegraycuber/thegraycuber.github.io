

//##################################
//              CONTROLS
//##################################



var draggedElement = -1;
var dragging = 'none';
var mouseVec;
var acElPos, acElVel;
var skipMove = false;


// trigger updates when touches are started, stopped, or moved
function touchStarted(){
	if (dragging != 'none' || mouseInMenu || hideCanvas){
		return;
	}

	skipMove = true;
	updateTouchInfo();

	for (let g of G){
		if (g.clicked(mouseVec)){
			return;
		}
	}
}

function touchEnded(){
	mouseInMenu = false;
	dragging = 'none';
	draggedElement = -1;
	updateTouchInfo();
}


function touchMoved(event){

	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 
	updateMovement(); //&& display_state < 2
}


function updateMovement(){
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		
		if (dragging == 'slider'){
			// arrowBoxes[activeArrow].getItem('arrow_strength').clicked();
			return;
		}
		
		if (skipMove){
			skipMove = false;
			return;
		}
		
		if(draggedElement != -1){
			return;
			
		} 
		origin = focusPoint().sub(principalPos.mult(scalar));
		principalPos = pixelToPrincipal(focusPoint());
	}
}


function mouseWheel(event){
	
	if (hideCanvas){return;}
	event.preventDefault(); 
	updateTouchInfo();
	
	var scalarLog = log(scalar);
	scalarLog -= event.delta/1024; // make this positive to invert scroll
	scalar = exp(scalarLog);
	
	updateMovement();
}



//##################################
//              ACTION
//##################################


var displayState = 0;
function setDisplayState(newDisplayValue){
	hidePopups();

	if (displayState != 1 || newDisplayValue != 0){
		setupLayout();
	}

	toggleDisplayIcon(displayState);
	toggleDisplayIcon(newDisplayValue);
	
	displayState = newDisplayValue;
	refreshArrowTypes();
	refreshStrengthElements();
}

function toggleDisplayIcon(displayIndex){
	let displayElement = document.getElementById('display-' + str(displayIndex));
	for (let e of displayElement.children){
		e.classList.toggle('svg-half');
		e.classList.toggle('svg-front');
	}
}


var movement = true;
function toggleMovement(){
	hidePopups();
	movement = !movement;
	document.getElementById('play-icon').style.display = movement?'none':'flex';
	document.getElementById('pause-icon').style.display = movement?'flex':'none';
}
		

var activeElement = 0;
var elementKeys = ['vivid','mono','alert'];
function setElement(newElement, blockDisable = false){
	hidePopups();
	
	autoPositionSkip = false;
	if (arrowElements[activeElement] != -1){
		selectedElements[activeElement] = arrowElements[activeElement];
	}

	if (activeElement == newElement && controllers['arrow-element'].disabled == false && !blockDisable){
		arrowElements[activeElement] = -1;
		document.getElementById('element-'+str(activeElement)).children[0].style.opacity = '0.5';
		controllers['arrow-element'].disable();
		controllers['arrow-type'].disable();
		document.getElementById('slider-strength').disabled = true;
		return;
	} 

	document.getElementById('element-'+str(activeElement)).children[1].style.display = 'none';
	document.getElementById('element-'+str(newElement)).children[1].style.display = 'inline';
	activeElement = newElement;

	document.getElementById('element-'+str(newElement)).children[0].style.opacity = '1';
	controllers['arrow-element'].setColor(elementKeys[activeElement]);
	controllers['arrow-element'].enable();
	controllers['arrow-type'].setColor(elementKeys[activeElement]);
	controllers['arrow-type'].enable();

	if (arrowElements[activeElement] == -1){
		arrowElements[activeElement] = selectedElements[activeElement]<gOrder?selectedElements[activeElement]:1;
	}
	controllers['arrow-element'].giveIndex(arrowElements[activeElement],true);

	refreshArrowTypes();
	refreshStrengthElements();
}

function setStrength(strengthValue) {
	arrowStrengths[activeElement] = (strengthValue*0.01)**2;
}

function arrowHandlerCustom(clickedControl){
	hidePopups();
	// processFrame = true;

	if (clickedControl.id == 'arrow-order') {
		
		gOrder = clickedControl.index + 1;
		controllers['arrow-class'].giveList(groupClasses[gOrder]);
		setupLayout();

		
	} else if (clickedControl.id == 'arrow-class') {
		
		gClass = clickedControl.index;
		generateGroup();
		refreshArrowTypes();
				
		groupList = [];
		for (let g of groups[gOrder][gClass]){
			groupList.push(g.groupName);
		}
		groupList.push('generators');		
		controllers['arrow-group'].giveList(groupList);
		setupLayout();
	
	} else if (clickedControl.id == 'arrow-group') {
		
		autoPositionSkip = false;
		gGroup = clickedControl.index;
		
		if (gGroup == groups[gOrder][gClass].length) {
			for (let g of G) {
				g.displayName = g.nickname;
			}
		} else {
			let vers = groups[gOrder][gClass][gGroup];
			for (let g of G) {
				g.displayName = vers.names[g.index];
			}
		}
		
		refreshArrowElements();
		setupLayout();
	
	} else if (clickedControl.id == 'arrow-element'){
		
		autoPositionSkip = false;
		arrowElements[activeElement] = clickedControl.index;
		
	} else if (clickedControl.id == 'arrow-type'){
		
		autoPositionSkip = false;
		arrowTypes[activeElement] = clickedControl.index;
		
	}
}


function randomize(){

	setupLayout();

	setDisplayState(int(random(3)));
	controllers['arrow-order'].randomize();
	controllers['arrow-class'].randomize();
	controllers['arrow-group'].randomize();
	
	arrowElements = [-1,-1,-1];
	let actives = min(int((random(15)+1)**0.5), gOrder);
	
	for (let a = 0; a < actives; a++){
		arrowElements[a] = int(random(gOrder));
		document.getElementById('element-'+str(a)).children[0].style.opacity = '1';
	}
	for (let a = actives; a < 3; a++){
		document.getElementById('element-'+str(a)).children[0].style.opacity = '0.5';
	}
	setElement(0,true);
	
}



function refreshArrowTypes(){

	let typeList;
	if (displayState == 2){
		typeList = ['left operate', 'right operate', 'results'];
	} else if (groupClasses[gOrder][gClass].substring(0,1) != 'C' || groupClasses[gOrder][gClass].search('⋊') != -1){
		typeList = ['left operate', 'right operate', 'conjugate'];
	} else {
		typeList = ['operate'];
	}

	for (let a = 0; a < arrowTypes.length; a++){
		arrowTypes[a] = min(typeList.length-1,arrowTypes[a]);
	}
	controllers['arrow-type'].giveList(typeList,arrowTypes[activeElement]);

}

function refreshArrowElements(){

	let elementList = [];
	for (let g = 0; g < gOrder; g++) {
		elementList.push(G[g].displayName);
	}
	
	for (let a = 0; a < arrowElements.length; a++){
		arrowElements[a] = min(elementList.length-1,arrowElements[a]);
	}
	controllers['arrow-element'].giveList(elementList,arrowElements[activeElement]);

}


function refreshStrengthElements(){
	document.getElementById('slider-strength').value = arrowStrengths[activeElement]**0.5*100;
	document.getElementById('slider-strength').disabled = displayState != 0;
}

