
var ideal = [-1,0];
var targetIdeal, targetPolynomial;
var level, startTime, levelStart, winTime, winTracker, gameIcons;
var gameMode = false;
var hasWon = 0;
var winTracker = 0;

var iDragging = false;
var iTouched = false;


function startGame(){
	document.getElementsByTagName('game-menu')[0].style.display = 'flex';
	document.getElementsByTagName('icon-menu')[0].style.display = 'none';
	document.getElementById('end-game-options').style.display = 'none';

	level = 0;
	gameMode = true;
	startTime = millis();
	resetLayout();
	if (!spinShape){
		toggle('spin');
	}
	newTarget();

	for (let c of Object.keys(controllers)){
		controllers[c].disable();
	}
}

function endGame(){
	gameMode = false;
	document.getElementsByTagName('game-menu')[0].style.display = 'none';
	document.getElementsByTagName('icon-menu')[0].style.display = 'flex';
	document.getElementById('end-game-options').style.display = 'none';

	winTracker = 0;
	randomize();

	for (let c of Object.keys(controllers)){
		controllers[c].enable();
	}
}


function setGameMessages(){

	document.getElementById('level-ind').innerHTML = str(level) + '/12';

	let gameMessage = document.getElementById('game-message');
	if (level == 0){
		gameMessage.innerHTML = 'move i² to match the target shape';
		
	} else if (level == 5){
		gameMessage.innerHTML = 'now you must also match the function';

	} else if (level == 9){
		gameMessage.innerHTML = 'now you must also match the input shape';

	} else if (level == 12){
		gameMessage.innerHTML = 'you win!';

		winTime = millis() - startTime;
		let elapsed = winTime/1000;
		document.getElementById('time-ind').innerHTML =  timeString(elapsed);
		winTracker = -1;
		hasWon = 1;
		document.getElementById('end-game-options').style.display = 'flex';

		for (let c of Object.keys(controllers)){
			controllers[c].disable();
		}

	} else {
		gameMessage.style.visibility = 'hidden';
		return;
	}

	gameMessage.style.visibility = 'visible';
}

function timeString(elapsed){
	return pre0(str(floor(elapsed/60))) + ':' + pre0(str(floor(elapsed)%60));
}

function newTarget(){
	setGameMessages();
	if (level==12){
		return;
	}
	levelStart = millis();
	winTracker = 0;
	randomize();
	targetIdeal = [...ideal];
	if (level >= 5 && level < 100){
		targetPolynomial = polynomial;	
		controllers['arrow-function'].enable();
	}
	if (level >= 9 && level < 100){
		targetShape = new Shape(shape.vertices, shape.step, shape.type);
		controllers['arrow-version'].enable();
		controllers['arrow-type'].enable();
		controllers['arrow-step'].enable();
	}
	
	randomize(true);
	// btw, i dislike cilantro.
	if (level < 5 || level >= 100){
		targetPolynomial = polynomial;
	}
	if (level < 9 || level >= 100){
		targetShape = new Shape(shape.vertices, shape.step, shape.type);
	}
	
	while (abs(targetIdeal[0]-ideal[0]) < 0.3 || abs(targetIdeal[1]-ideal[1]) < 0.3){
		ideal = [round(random()*2-1,2),round(random()*2-1,2)];
	}
}