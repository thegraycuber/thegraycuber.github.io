
//##################################
//              CONTROLS
//##################################


// var infoClick = false;
// var clickStart;

var dragged = [-1,-1];
var selected = [-1,-1];
var draggedSubFocus;
var focusPrincipal;

function touchStarted(){
		
	if (mouseInMenu || hideCanvas || (draggingItem())){return;}

	updateTouchInfo();
	setFocusPrincipal();

	dragged = getMousePoint(focusPoint);

	if (draggingItem()){
		draggedSubFocus = subC(getDragged(),focusPrincipal);

		if (dragged[0] > -1){
			enablePointEdit(dragged);
		} else {
			disablePointEdit();
		}
	}

}

function draggingItem(){
	return dragged[1] > -1;
}

function getMousePoint(){

	let focusRaw = pixelToPrincipal(focusPoint());

	if (focusRaw.dist(arrayToVector(center)) < radius){
		return [-1,1];
	} else if (focusRaw.dist(arrayToVector(border)) < radius){
		return [-1,0];
	}

	for (let p = 0; p < points.length; p++){
		for (let q = 0; q < points[p].length; q++){
			if (arrayToVector(points[p][q]).dist(focusRaw) < weightToSize(p)*1.2){
				return [p,q];
			}
		}
	}

	return [-1,-1];
}

function weightToSize(p){
	return radius*(1+abs(weights[p]));
}

function touchEnded(){

	if (mouseInMenu || hideCanvas){
		mouseInMenu = false;
		dragged = [-1,-1];
		return;
	}

	if (dragged[1] == -1){
		disablePointEdit();
	}
	dragged = [-1,-1];
	setFocusPrincipal();

	updateTouchInfo();
}

	

function touchMoved(event){


	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 
	setFocusPrincipal();
	updateMovement();

}

function setFocusPrincipal(){
	focusPrincipal = vectorToArray(pixelToPrincipal(focusPoint()));
}


var focusPixel;
function updateMovement(){
	
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		if (dragged[1] == -1){
			origin = focusPoint().sub(principalPos.mult(scalar,-scalar));
		}
		principalPos = pixelToPrincipal(focusPoint());

	}
}


function mouseWheel(event){

	updateTouchInfo();

	if (hideCanvas || mouseOverMenu()){return;} 
	event.preventDefault(); 

	if (dragged[1] == -1){
		// scrolling will update scalar logarithmically 
		var scalarLog = log(scalar);
		scalarLog -= event.delta/2048; // make this positive to invert scroll
		scalar = max(scaleMin,exp(scalarLog));
		radius = 0.18*defaultScalar/scalar;
	} 
	
	// else if (dragged[0] < points.length) {
	// 	weights[dragged[0]] -= event.delta/(keyIsDown(SHIFT)?8192:512); 
	// 	document.getElementById('indicator').innerHTML = str(round(weights[dragged[0]],2));
	// }	

	updateMovement();
}




//##################################
//              ACTION
//##################################


function iconChecks(){

}

function customToggleHolder(holderType, holderToggle){
	if (holderType == 'menu'){
		setOriginAndGrid();
	}
}


function addPoint(pointWeight){
	if (!addEnabled){return;}
	hidePopups();

	let zoomFactor = defaultScalar/scalar;
	points.push([randomDonut(0.5*zoomFactor,2.5*zoomFactor)]);
	weights.push(pointWeight);

	enablePointEdit([points.length-1,0]);
	pointChange();
}



function deletePoint(){

	if (!trashEnabled){return;}
	disablePointEdit();

	let deleteIndex = (selected[0] == -1) ? points.length - 1 : selected[0];

	points.splice(deleteIndex,1);
	weights.splice(deleteIndex,1);
	
	pointChange();
}


function setPoint(newPoint,pointIndex){
	if (pointIndex[0] != -1){
		points[pointIndex[0]][pointIndex[1]] = newPoint;	
		updateRepeats(...pointIndex);
	
	} else if (pointIndex[1] == 0){
		border = newPoint;	
	} else if (pointIndex[1] == 1){
		center = newPoint;	
		for (let p = 0; p < points.length; p++){
			updateRepeats(p,0);
		}
	}
	// findMinimum();
}


function setWeight(weightRaw){

	if ((weights[selected[0]] < 0) != (weightRaw < 0)){
		let pointIcon = document.getElementById('svg-point');
		pointIcon.classList.toggle('svg-front');
		pointIcon.classList.toggle('svg-alert');
		document.documentElement.style.setProperty('--color-slider', palette[weightToColor(weightRaw)]);
	}

	let weightValue = weightRaw/100;
	weights[selected[0]] = weightValue;

}

let repetitionList = [1,2,3,4,5,6,7,8];
function enablePointEdit(newSelected){

	let pointIcon = document.getElementById('svg-point');
	if (selected[0] > -1){
		pointIcon.classList.toggle('svg-' + (weights[selected[0]] > 0 ? 'front' : 'alert'));
	} else {
		pointIcon.classList.toggle('svg-backlight');
	}
	
	selected = [...newSelected];
	let pointColor = weightToColor(weights[selected[0]]);
	pointIcon.classList.toggle('svg-' + pointColor);

	let maxRepeat = min(8,pointCountLimit-getPointCount()+points[selected[0]].length);
	controllers['arrow-repetition'].enable();
	controllers['arrow-repetition'].giveList(repetitionList.slice(0,maxRepeat),points[selected[0]].length-1);


	document.documentElement.style.setProperty('--color-slider', palette[pointColor]);
	document.getElementById('slider-weight').disabled = false;

	document.getElementById('slider-weight').value = round(weights[selected[0]]*100);
}

function weightToColor(pointWeight){
	return pointWeight >= 0 ? 'front' : 'alert'
}


function disablePointEdit(){

	if (selected[0] > -1){
		let pointIcon = document.getElementById('svg-point');
		pointIcon.classList.toggle('svg-backlight');
		pointIcon.classList.toggle('svg-' + (weights[selected[0]] > 0 ? 'front' : 'alert'));

	}

	selected = [-1,-1];
	controllers['arrow-repetition'].disable();
	document.getElementById('slider-weight').disabled = true;
}

var movement = true;
function toggleMovement(){
	hidePopups();
	movement = !movement;
	document.getElementById('play-icon').style.display = movement?'none':'flex';
	document.getElementById('pause-icon').style.display = movement?'flex':'none';
}


function arrowHandlerCustom(clickedControl){
	hidePopups();
	
	if (clickedControl.id == 'arrow-repetition'){
		while (points[selected[0]].length < clickedControl.index+1){
			points[selected[0]].push([0,0]);
		}
		while (points[selected[0]].length > clickedControl.index+1){
			points[selected[0]].pop();
		}
		updateRepeats(selected[0],0);

		pointChange();
	} 
	
}


function randomize(fixedPointCount = -1){
	hidePopups();
	disablePointEdit();

	points = [];
	weights = [];

	let pointCount = (fixedPointCount == -1) ? floor(random(6,18)) : fixedPointCount;
	let unplaced = pointCount;
	let zoomFactor = defaultScalar/scalar;
	while (unplaced > 0){
		let repeater = floor(random(1,min(9,unplaced+1)**0.5)**2);
		let copies = floor(random(1,min(unplaced/repeater+1,5)**0.5)**2);

		unplaced -= repeater*copies;

		for (let c = 0; c < copies; c++){
			weights.push(random(-1,1));
			points.push([randomDonut(0.5*zoomFactor,2.5*zoomFactor)]);
			updateRepeats(points.length-1,0,repeater);
		}
	}

	pointChange();
	balance();
	balanceStart = 0;
}

var balancing = false;
var balanceStart;
var balanceValues;
function balance(){
	if (balancing){return;}

	balancing = true;
	balanceStart = Date.now();

	let avgWeight = 0;
	for (let p = 0; p < weights.length; p++){
		avgWeight += weights[p]*points[p].length;
	}

	avgWeight /= getPointCount();

	balanceValues = [];
	let maxSize = 0;
	for (let p = 0; p < weights.length; p++){
		balanceValues.push([weights[p],weights[p]-avgWeight]);
		maxSize = max(maxSize, abs(balanceValues[p][1]));
	}

	for (let p = 0; p < weights.length; p++){
		balanceValues[p][1] /= maxSize;
	}
}


function getDragged(){
	if (dragged[0] > -1){
		return points[dragged[0]][dragged[1]];
	} else if (dragged[1] == 0){
		return border;
	} else {
		return center;
	}
}


function updateRepeats(p, q, r = -1){
	let repeat = (r == -1) ? points[p].length : r;
	let diff = subC(points[p][q], center);
	let spinner = angleC(TWO_PI/repeat);
	for (let k = 1; k < repeat; k++){
		diff = multC(spinner,diff);
		points[p][modulo(q+k,repeat)] = [...addC(diff,center)];
	}
}


var trashEnabled = true;
var addEnabled = true;
var pointCountLimit = 30;
function pointChange(){

	if (trashEnabled != (points.length > 1)){
		document.getElementById('svg-trash').classList.toggle('svg-backlight');
		document.getElementById('svg-trash').classList.toggle('svg-mono');
		trashEnabled = !trashEnabled;
	}

	if (addEnabled != (getPointCount() < pointCountLimit)){
		document.getElementById('svg-positive').classList.toggle('svg-backlight');
		document.getElementById('svg-positive').classList.toggle('svg-front');
		document.getElementById('svg-negative').classList.toggle('svg-backlight');
		document.getElementById('svg-negative').classList.toggle('svg-alert');
		addEnabled = !addEnabled;
	}

}

function prepareVectors(){
	pointVec = [];
	weightVec = [];
	for (let p = 0; p < points.length; p++){
		for (let q = 0; q < points[p].length; q++){
			pointVec.push(...points[p][q]);	
			weightVec.push(weights[p]);
		}
	}
}

function getPointCount(){
	let pointAmount = 0;
	for (let p of points){
		pointAmount += p.length;
	}
	return pointAmount;
}

function randomDonut(lowerRoot, upperRoot){

	let randomSize = random(lowerRoot**0.5,upperRoot**0.5)**2;
	let randomAng = random(TWO_PI);
	return [randomSize*cos(randomAng),randomSize*sin(randomAng)];
}