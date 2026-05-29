

//##################################
//              CONTROLS
//##################################


// trigger updates when touches are started, stopped, or moved
function touchStarted(){
	if (mouseInMenu || hideCanvas){return;}
	
	if (!portrait){
		let iLoc = idealLocation(portrait);
		let iSqVar = createVector(mouseX, mouseY).sub(createVector(iLoc[0], iLoc[1]));
		if (iSqVar.mag() < circleWidth*3){
			iDragging = true;
			iTouched = true;
		}
	}
	
	
	if (level == 12){
		for (let gi of gameIcons){
			gi.clicked();
		}
	}
	
	updateTouchInfo();
}
function touchEnded(){
	mouseInMenu = false;
	iDragging = false;
	updateTouchInfo();
}

function touchMoved(event){
	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 
	// if (!inABox && iTouched){
		updateMovement();
	// }
}


function updateMovement(){
	
	if (iDragging || gameMode){
		return;
	}
	
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		origin = focusPoint().sub(principalPos.mult(scalar).mult(1,yFlip));
		principalPos = pixelToPrincipal(focusPoint());
		// iconBox.getItem('reset').Active = true;
	}
}




function mouseWheel(event){
	if (hideCanvas){return;}
	event.preventDefault(); 
	
	// if (!iTouched && !gameMode){
		updateTouchInfo();

		// scrolling will update scalar logarithmically 
		var scalarLog = log(scalar);
		scalarLog -= event.delta/1024; // make this positive to invert scroll
		scalar = exp(scalarLog);

		updateMovement();
	// }
}




//##################################
//              ACTION
//##################################


function customToggleHolder(holderType, holderToggle){
	if (holderType == 'info'){
		document.getElementById('arrow-function').style.display = (holderToggle == 'show'? 'none':'flex');
	
	} else if (holderType == 'menu'){
		setDefaultOrigin();
		
	}
}


var resolution = 840;
// var resolutionList = [420,840,1260,2520,5040];
// function toggleMeter(){
// 	hidePopups();
// 	let resolutionIndex = modulo(resolutionList.indexOf(resolution)+1, 5);
// 	resolution = resolutionList[resolutionIndex];
// 	document.getElementById('meter-dial').setAttribute ('transform','translate(50 79) rotate(' + str(144+18*resolutionIndex) + ')');

// 	shape = new Shape(shape.vertices, shape.step, shape.type);

// 	if (gameMode){
// 		targetShape = new Shape(targetShape.vertices,targetShape.step,targetShape.type);
// 	}
		
// }


function disableIcon(iconName,disabledValue){
	if (document.getElementById('reset-icon').disabled != disabledValue){
		toggle('reset');
	}
	document.getElementById('reset-icon').disabled = disabledValue;
}

function toggle(iconName){
	hidePopups();
	for (let svgElement of document.getElementById('svg-' + iconName).children){
		svgElement.classList.toggle('svg-front');
		svgElement.classList.toggle('svg-half');
	}

	if (iconName == 'spin'){
		spinShape = !spinShape;
	}
}


function arrowHandlerCustom(clickedControl){
	hidePopups();
	processFrame = true;

	if (clickedControl.id == 'arrow-function'){
		let funkI = 0;
		while (functionList[funkI][1] != clickedControl.value()){
			funkI++;
		}
		polynomial = funkI;
		return;
	}

	let versionArrow = controllers['arrow-version'];
	let stepArrow = controllers['arrow-step'];
	let typeArrow = controllers['arrow-type'];
	
	if (clickedControl.id == 'arrow-version'){

		let step = shape.step;
		stepArrow.list = allowedLaps(indexToVerts[clickedControl.index]);
		
		let newStep = (step > 0) ? stepArrow.list.length-1 : 0;
		let stepSign = sign(step);
		while(int(stepArrow.list[newStep])*stepSign > step){
			newStep -= stepSign;
		}
		stepArrow.giveIndex(newStep, true);

		let typeList = (indexToVerts[clickedControl.index] > 0) ? ['regular','flower','wiggle','smooth'] : ['regular'];
		typeArrow.giveList(typeList,-1,true);
	

	}

	shape = new Shape(
		indexToVerts[versionArrow.index],
		parseInt(stepArrow.value()),
		typeArrow.value()
	);
}


function randomize(avoidance){

	magLerp = 0;

	for (let c of Object.keys(controllers)){
		
		controllers[c].randomize();

		if (avoidance && level >= 5){
			while(c == 'arrow-function' && polynomial == targetPolynomial){
				controllers[c].randomize();
			}
		}
		if (avoidance && level >= 9){
			while(c == 'arrow-version' && targetShape.vertices == shape.vertices){
				controllers[c].randomize();
			}
		}

	}
	
	setIdeal(roundC([random()*2-1,random()*2-1],grid.scaleLog+2));
}

function updateIdeal(){
	if (iDragging){
		let roundAdd = 2;
		if (keyIsDown(32) || touches.length == 2){roundAdd = 1;}
		if (portrait){
			if (!iTouched){
				iTouched = true;
				document.getElementById('drag-alert').style.display = 'none';
			}

			document.getElementById('ideal-desc').innerHTML = 'i² = ' + text2d(ideal,'i');
			let idealRect = document.getElementById('ideal-holder').getBoundingClientRect();
			let idealPad = (idealRect.right - idealRect.left)*0.05;
			let idealRadius = (idealRect.right- idealRect.left)/2 - idealPad;
			let xIdeal = constrain(mouseX-(idealRect.left+idealRect.right)/2, -idealRadius, idealRadius)/idealRadius;
			let yIdeal = constrain(mouseY-(idealRect.top+idealRect.bottom)/2, -idealRadius, idealRadius)/idealRadius;
			ideal = [xIdeal,-yIdeal];
	
		} else {
			ideal = [(mouseX-origin.x)/scalar, -(mouseY-origin.y)/scalar,grid.scaleLog];
			if (gameMode){
				ideal = [constrain(ideal[0],-1,1),constrain(ideal[1],-1,1)];
			}
		}
		setIdeal(roundC(ideal,grid.scaleLog+roundAdd));
	}
	document.getElementById('ideal-desc').innerHTML = 'i² = ' + text2d(ideal,'i');
}

function setIdeal(idealToSet){

	ideal = idealToSet;

	if (!portrait){return;}
	let idealController = document.getElementById('ideal-dragger')
	idealController.style.left = str(ideal[0]*15+15) + 'vw';
	idealController.style.top = str(-ideal[1]*15+15) + 'vw';
}


function resetLayout(){
	hidePopups();
	origin = defaultOrigin.copy();
	scalar = defaultScalar;
	setIdeal([-1,0]);
}