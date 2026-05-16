
//##################################
//              CONTROLS
//##################################


function touchStarted(){
	if (mouseInMenu || hideCanvas){return;}
	updateTouchInfo();
}

function touchEnded(){
	mouseInMenu = false;
	updateTouchInfo();
}

function touchMoved(event){
	if (mouseInMenu || hideCanvas){return;}
	if (autoZoom){
		toggle('autozoom');
	}
	updateMovement();
}

function updateMovement(){
	if (touches.length == 2){
		var newDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= newDist/principalDist;
		principalDist = newDist;
	}
	
	if (touches.length <= 2){
		origin = focusPoint().sub(principalPos.mult(scalar).mult(1,yFlip));
		principalPos = pixelToPrincipal(focusPoint());
	}
}


function mouseWheel(event){

	if (hideCanvas){return;}
	if (autoZoom){
		toggle('autozoom');
	}

	updateTouchInfo();
	// scrolling will update scalar logarithmically 
	var scalarLog = log(scalar);
	scalarLog -= event.delta/1024; // make this positive to invert scroll
	scalar = exp(scalarLog);

	updateMovement();
}



//##################################
//              ACTION
//##################################


function iconChecks(){
	if (Date.now() > copySuccessExpiration){
		document.getElementById('copy-icon').style.display = 'flex';
		document.getElementById('copy-success').style.display = 'none';
		
	}
}

function customToggleHolder(holderType, holderToggle){
	if (holderType == 'info'){
		document.getElementById('arrow-function').style.display = (holderToggle == 'show'? 'none':'flex');
	
	} else if (holderType == 'menu'){
		setDefaultOrigin();
		
	}
}


var resolution = 840;
var resolutionList = [420,840,1260,2520,5040];
function toggleMeter(){
	hidePopups();
	let resolutionIndex = modulo(resolutionList.indexOf(resolution)+1, 5);
	resolution = resolutionList[resolutionIndex];
	document.getElementById('meter-dial').setAttribute ('transform','translate(50 79) rotate(' + str(144+18*resolutionIndex) + ')');

	for (let s = 0; s < 3; s++){
		shapes[s] = new Shape(shapes[s].vertices, shapes[s].step, shapes[s].rotation, shapes[s].radiusTheta, shapes[s].type, shapes[s].animation);
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
		case 'autozoom':
			autoZoom = !autoZoom;
			break;
		case 'points':
			showVertices = !showVertices;
			break;
	}
}


var activeShape = 0;
var letters = ['a','b','c'];
var shapeKeys = ['vivid','mono','alert'];
function setShape(newActiveShape){
	hidePopups();
	if (activeShape == newActiveShape){return;}
	toggleShapeLabel(newActiveShape);
	toggleShapeLabel(activeShape);

	activeShape = newActiveShape;
	controllers['arrow-version'].giveIndex(indexToVerts.indexOf(shapes[activeShape].vertices));

	updateShapeColor();
}


function toggleShapeLabel(shapeIndex){
	for (let element of document.getElementById('shape-' + letters[shapeIndex]).children){
		element.classList.toggle('svg-' + shapeKeys[shapeIndex]);
		element.classList.toggle('svg-back');
	}
}

function updateShapeColor(){
	// for (let e of document.getElementsByTagName('arrow-text')){
	// 	if (e.id == 'function-text'){
	// 		continue;
	// 	}
	// 	e.style.color = palette[shapeKeys[activeShape]];
	// }
	for (let c of Object.keys(controllers)){
		if (c == 'function-text'){
			continue;
		}
		controllers[c].setColor(shapeKeys[activeShape]);
	}
}

function arrowHandlerCustom(clickedControl){
	hidePopups();
	processFrame = true;
	
	if (clickedControl.id == 'arrow-animation'){
		shapes[activeShape].animation = clickedControl.value();
		return;
	} else if (clickedControl.id == 'arrow-function'){
		activeFunk = clickedControl.index;
		let showShapeC = funkShapes[activeFunk] > 2;
		document.getElementById('shape-c').style.display = showShapeC?'flex':'none';
		if (activeShape >= funkShapes[activeFunk]){
			setShape(0);
		}
		return;
	}

	let versionArrow = controllers['arrow-version'];
	let stepArrow = controllers['arrow-step'];
	let typeArrow = controllers['arrow-type'];
	let animArrow = controllers['arrow-animation'];
	
	if (clickedControl.id == 'arrow-version'){

		let step = shapes[activeShape].step;
		stepArrow.list = allowedSteps(indexToVerts[clickedControl.index]);
		
		let newStep = (step > 0) ? stepArrow.list.length-1 : 0;
		let stepSign = sign(step);
		while(int(stepArrow.list[newStep])*stepSign > step){
			newStep -= stepSign;
		}
		stepArrow.giveIndex(newStep, true);

		let typeList = (indexToVerts[clickedControl.index] > 0) ? ['regular','flower','wiggle','smooth'] : ['regular'];
		typeArrow.giveList(typeList,-1,true);

		animArrow.giveIndex(animArrow.list.indexOf(shapes[activeShape].animation), true);
		
	}

	shapes[activeShape] = new Shape(
		indexToVerts[versionArrow.index],
		stepArrow.value(),
		shapes[activeShape].rotation,
		shapes[activeShape].radiusTheta,
		typeArrow.value(), 
		animArrow.value()
	);
}


function randomize(){

	let startingShape = activeShape;
	for (let a = 1; a < 4; a++){
		activeShape = (startingShape + a) % 3;
		for (let c of Object.keys(controllers)){
			if (c == 'arrow-function'){continue;}
			controllers[c].randomize();
		}
	}

	activeShape = startingShape;
	controllers['arrow-function'].randomize();

	if (random() > 0.5){
		toggle('grid');
	}
	if (random() > 0.5){
		toggle('points');
	}
	magLerp = 0.1;
	processFrame = true;

	if (!autoZoom){toggle('autozoom');}
	
}



function codeToSettings(inputStr){

	inputStr = inputStr.trim().toLowerCase();
	if (inputStr.length < 39){
		return false;
	}

	if (inputStr.substring(0,1) != 'f'){
		let cut = inputStr.length - 8;
		inputStr = 'fqua' + inputStr.substring(cut,inputStr.length) + ',' + inputStr.substring(0,cut);
	}
	
	let inputValues = inputStr.split(',');
	let funkIndex = funkCodes.indexOf(inputValues[0]);
	if (funkIndex < 0 || funkIndex >= funkShapes.length){
		return false;
	}

	controllers['arrow-function'].giveIndex(funkIndex);
	let shapeCount = funkShapes[funkIndex];
	
	if (3 + shapeCount*4 != inputValues.length){
		return false;
	}

	
	if (grid.visible != (inputValues[1] == 'gri')){
		toggle('grid');
	}
	if (showVertices != (inputValues[2] == 'poi')){
		toggle('points');
	}

	let arrowTypes = ['arrow-version','arrow-step','arrow-animation','arrow-type'];
	
	let startingShape = (activeShape >= shapeCount ? 0 : activeShape);
	for (let s = 1; s < shapeCount+1; s++){
		activeShape = (startingShape + s) % shapeCount;

		for (let a = 0; a < arrowTypes.length; a++){
			let i = 0;
			let currentArrow = controllers[arrowTypes[a]];
			while (i < currentArrow.list.length){
				if (currentArrow.list[i].substring(0,3) == inputValues[3+activeShape*4+a]){
					currentArrow.giveIndex(i);
					break;
				}
				i++;
			}
			if (i == currentArrow.list.length){
				return false;
			}
		}
		shapes[activeShape].reset();
	}
	
	activeShape = startingShape;
	magLerp = 0.1;
	processFrame = true;
	return true;
}


function settingsToCode(){
	let settingsCode = funkCodes[activeFunk] + (grid.visible?',gri':',off') + (showVertices?',poi':',off');

	for (let s = 0; s < funkShapes[activeFunk]; s++){
		settingsCode += ',' + shapeVersions[indexToVerts.indexOf(shapes[s].vertices)].substring(0,3);
		settingsCode += ',' + str(shapes[s].step);
		settingsCode += ',' + shapes[s].animation.substring(0,3);
		settingsCode += ',' + shapes[s].type.substring(0,3);
	}
	return settingsCode;
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

	if (!autoZoom){toggle('autozoom');}
} 

var favoriteIndex = 0;
var favorites = [
['fPy3,Off,Poi,Hex,-1,Off,Reg,12g,5,Rot,Smo,Cir,3,Off,Reg',''],
['fPy3,Off,Poi,Pen,1,Rot,Reg,13g,2,Rot,Wig,Cir,-1,Off,Reg','@ymperal4663'],
['Oct,-3,Rot,Wig,Pen,2,Off,Reg,Cir,2,Off,Reg,Gri,Off','@Detteraleon'],
['fQua,Gri,Poi,Hep,2,Rot,Reg,Hep,-1,Rot,Wig,Hep,3,Rot,Reg','@gergelyarpa7071'],
['fPyt,Gri,Poi,Hex,1,Tra,Wig,Hex,1,Rot,Wig',''],
['fQua,Gri,Poi,Hep,2,Tra,Wig,13g,-2,Rot,Wig,11g,5,Off,Smo','@superdreamstelly5689'],
['fQua,Gri,Off,13g,-6,Off,Flo,13g,3,Rot,Smo,13g,-2,Off,Wig','@zdohmarbleblaster2048'],
['12g,5,Rot,Reg,Hex,-1,Rad,Smo,12g,-5,Rad,Reg,Gri,Poi','@oxSoul99'],
['Squ,1,Rot,Reg,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi',''],
['fPy3,Off,Off,Spi,-3,Rot,Reg,Spi,3,Rot,Reg,Hex,1,Rot,Flo','@axolotlmaru'],
['fPy3,Gri,Poi,Pen,1,Tra,Wig,10g,-1,Rot,Flo,Hep,-1,Rad,Smo','@SoulFule101'],
['fPy3,Off,Poi,Spi,4,Rot,Reg,Spi,-4,Tra,Reg,Spi,-4,Tra,Reg','@NoenD_io'],
['fPy3,Off,Off,12g,5,Rot,Flo,Cir,-1,Tra,Reg,Spi,-1,Off,Reg',''],
['fQua,Off,Poi,Cir,-1,Rot,Reg,10g,1,Off,Flo,Oct,-1,Rot,Smo','@tornadix99'],
['13g,1,Rot,Wig,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi','@memeing_donkey'],
['fPyt,Off,Off,Spi,4,Rad,Reg,Spi,-4,Rot,Reg','@JordanZhoug'],
['fPyt,Off,Off,9go,-1,Rot,Wig,11g,-2,Off,Wig',''],
['fQua,Off,Off,13g,1,Rot,Flo,13g,-3,Rot,Flo,13g,6,Rot,Flo','@CelloGiraffe'],
['fPy3,Off,Off,Cir,4,Rot,Reg,9go,1,Rad,Reg,10g,-3,Rad,Reg','@orrinpants'],
['Squ,1,Rot,Flo,Cir,-4,Rad,Reg,Oct,3,Rot,Flo,Off,Off','@hollow7549'],
['fPy3,Gri,Off,9go,-2,Rad,Flo,10g,1,Rot,Smo,Hex,1,Tra,Smo',''],
['fPy3,Off,Off,10g,3,Tra,Flo,Spi,2,Rot,Reg,Cir,1,Rot,Reg','@svcjunior5526'],
['12g,5,Rot,Flo,12g,1,Rad,Wig,Roc,-1,Off,Reg,Off,Off','@mutuio5841'],
['fPy3,Off,Poi,13g,-1,Rot,Smo,Hep,-2,Off,Flo,Spi,2,Off,Reg',''],
['11g,5,Rad,Smo,Hex,-1,Rot,Smo,9go,-1,Rad,Reg,Gri,Poi','@atomikiki'],
['fPyt,Gri,Off,Spi,3,Rot,Reg,Spi,-3,Tra,Reg','@Chagama9'],
['Hex,-1,Rad,Wig,Hex,-1,Rot,Wig,Tri,-1,Off,Wig,Gri,Poi',''],
['11g,5,Rad,Reg,Squ,-1,Off,Reg,11g,-1,Rot,Wig,Off,Off','@steamedeggeggegg'],
['Oct,1,Rot,Flo,Pen,-2,Rad,Reg,Spi,2,Rot,Reg,Off,Poi','@Novacozmo'],
['fQua,Gri,Off,12g,-1,Rad,Wig,Cir,3,Tra,Reg,Spi,2,Rot,Reg','@versusparker'],
['fPyt,Off,Poi,Hep,2,Rot,Wig,Cir,-4,Off,Reg',''],
['fQua,Gri,Poi,Roc,-1,Rad,Reg,Spi,4,Tra,Reg,13g,-4,Rot,Wig','@memeing_donkey'],
['Spi,1,Rot,Reg,Spi,4,Rad,Reg,Cir,-4,Rad,Reg,Gri,Poi','@refiredspace6930'],
['Cir,4,Rot,Reg,13g,3,Off,Flo,Hep,2,Rot,Smo,Off,Poi',''],
['fPy3,Gri,Poi,Pen,2,Rot,Reg,Hep,-2,Rad,Reg,Hep,3,Tra,Reg','@pvlchess'],
['Cir,-4,Rot,Reg,9go,4,Rot,Reg,Cir,-3,Rad,Reg,Gri,Poi','@MunawwarMusic'],
['fPy3,Gri,Poi,10g,1,Tra,Flo,Squ,1,Rad,Flo,Hex,-1,Rot,Reg',''],
['13g,1,Rad,Wig,13g,6,Rad,Wig,13g,-1,Rot,Flo,Off,Poi','@moretto6575'],
['fPy3,Gri,Poi,Oct,-1,Off,Wig,Oct,-3,Rot,Reg,Oct,1,Off,Wig','@cosmnik472'],
['fPyt,Gri,Poi,Pen,-1,Tra,Smo,Hex,1,Rot,Smo',''],
['Tri,-1,Rad,Wig,9go,1,Rad,Wig,Spi,3,Rot,Reg,Off,Off','@SmokeTranspicuators'],
['Oct,-3,Rot,Wig,12g,5,Rad,Reg,Cir,2,Off,Reg,Gri,Off','@16alpakas'],
['Hep,3,Off,Smo,12g,5,Rot,Flo,12g,-5,Rad,Flo,Gri,Poi',''],
['fPy3,Gri,Poi,Hex,1,Rad,Smo,Cir,-4,Off,Reg,13g,4,Rot,Smo','@slaydrik'],
['Tri,1,Off,Wig,Pen,2,Rad,Flo,Oct,-3,Rot,Smo,Off,Poi','@JunglinGuitarJourney'],
['Cir,-4,Rot,Reg,Spi,1,Rot,Reg,Spi,-3,Rot,Reg,Off,Off','@EnricoRodolico'],
['fPyt,Gri,Poi,9go,2,Rad,Reg,9go,-2,Rot,Smo',''],
['13g,1,Off,Reg,13g,1,Rot,Reg,13g,4,Rot,Smo,Gri,Poi','@yousseftamer4943'],
['13g,-6,Rad,Wig,13g,5,Rot,Wig,13g,3,Rad,Smo,Off,Off','@22vasudevajith2'],
['fPy3,Off,Poi,10g,3,Tra,Wig,10g,3,Rot,Smo,Pen,-2,Rot,Reg',''],
['10g,3,Off,Smo,Tri,1,Off,Smo,10g,-1,Rot,Smo,Gri,Poi','@Charred_Pickles'],
['Spi,4,Rot,Reg,Spi,-4,Rot,Reg,Spi,4,Rot,Reg,Off,Off','@joerivanlimpt9642'],
['Hex,-1,Off,Reg,11g,-4,Rot,Reg,Cir,3,Off,Reg,Off,Poi',''],
['Hex,1,Rot,Smo,Spi,4,Off,Reg,13g,-6,Off,Reg,Gri,Off','@halojack2904'],
['9go,-4,Off,Wig,12g,-1,Rot,Wig,12g,1,Rad,Smo,Off,Poi','@Guys-s5v'],
['fPy3,Gri,Off,Cir,-2,Rot,Reg,Oct,1,Rad,Flo,9go,-1,Rad,Smo',''],
['Tri,1,Rad,Reg,Cir,1,Rad,Reg,13g,-2,Rot,Flo,Gri,Poi','@cosmnik472'],
['10g,-1,Off,Reg,Squ,1,Rad,Reg,9go,-4,Rot,Reg,Off,Off','@evanurquhart9225'],
['Pen,-1,Rot,Smo,10g,1,Rot,Flo,Pen,-2,Rad,Smo,Off,Poi',''],
['Oct,-1,Rot,Flo,Cir,4,Rad,Reg,Tri,-1,Rot,Smo,Gri,Poi','@Nathan-rhino'],
['12g,-1,Rot,Wig,13g,-2,Off,Wig,11g,2,Rot,Flo,Off,Off','@a71ficial'],
['fPyt,Gri,Off,Spi,-2,Rad,Reg,Spi,3,Rad,Reg',''],
['Pen,-1,Off,Wig,Squ,-1,Rot,Smo,Spi,-1,Rot,Reg,Gri,Off','@lichenenrichedfrenchtoast'],
['11g,2,Rot,Smo,11g,4,Rad,Flo,11g,-5,Rot,Smo,Off,Poi','@Greenfire44'],
['12g,5,Rot,Reg,Cir,3,Off,Reg,Tri,1,Rad,Smo,Off,Poi',''],
['Cir,2,Rot,Reg,Hep,3,Rot,Wig,12g,-5,Rad,Flo,Gri,Poi','@jakobesparza'],
['Spi,-2,Rot,Reg,Hep,1,Rot,Reg,Hep,-3,Off,Smo,Gri,Poi','@camfunme'],
['fPy3,Gri,Poi,Hex,-1,Off,Smo,Hex,1,Rot,Smo,12g,-5,Rot,Smo',''],
['11g,-2,Rot,Wig,Hex,1,Rad,Flo,11g,4,Off,Reg,Gri,Off','@lukesquire263'],
['12g,-1,Rad,Reg,Pen,2,Rot,Reg,13g,6,Rad,Wig,Gri,Poi','@hdhejeje9681'],
['10g,3,Off,Smo,Tri,1,Rad,Smo,10g,-1,Off,Smo,Gri,Off',''],
['Pen,1,Rot,Smo,Cir,4,Rad,Reg,Hep,-2,Rot,Flo,Off,Poi','@R.B.'],
['Oct,1,Rot,Reg,Spi,1,Rad,Reg,12g,-1,Rot,Wig,Gri,Off','@bruh6942'],
['13g,2,Off,Flo,Tri,1,Rad,Smo,9go,1,Rot,Wig,Off,Poi','@wcodelyoko'],
['13g,1,Rot,Smo,13g,-3,Off,Reg,Cir,1,Rot,Reg,Off,Off','@lunaamora1794'],
];
