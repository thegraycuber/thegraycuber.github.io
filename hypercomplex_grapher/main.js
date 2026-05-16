
var spinShape = true;
var hideCanvas = false;

function draw(){
	
	background(palette.back);
	if (hideCanvas){
		return;
	}


	updateIdeal();
	
	if (spinShape){
		let resAngle = PI/360;
		rotationAngle = (resAngle+rotationAngle)%TWO_PI;
		shape.rotate(resAngle);
		if (gameMode){
			targetShape.rotate(resAngle);
		}
	}
	
	translate(origin.x, origin.y);
	scale(scalar,scalar);
	if (!gameMode){
		// dual ideal parabola
		onlyStroke(palette.backlight,0.4*circleWidth/scalar);
		let prin0 = 2*(abs(origin.x/scalar)**0.5);
		let rabRange = [max(-origin.y/scalar,-prin0),min((height-origin.y)/scalar,prin0)];
		let rabStep = (rabRange[1] - rabRange[0])/100;
		beginShape();
		for (let b = rabRange[0]; b < rabRange[1]+2*rabStep; b += rabStep){
			let a = -(b**2)/4;
			vertex(a,b);
		}
		endShape();
	} else if (level < 12){

		let elapsed = (millis() - startTime)/1000;
		document.getElementById('time-ind').innerHTML = timeString(elapsed);
	}

	resetMatrix();
	grid.drawGrid();
	grid.drawLabels();

		
	
	translate(origin.x, origin.y);
	scale(scalar,scalar);
	if (gameMode && winTracker == 0){
		if (targetShape.vertices == shape.vertices && targetShape.step == shape.step && targetShape.type == shape.type){
			if (polynomial == targetPolynomial && abs(ideal[0]-targetIdeal[0])<0.05 && abs(ideal[1]-targetIdeal[1])< 0.05  ){
				winTracker = 0.001;
				iDragging = false;
			}
		}
		targetShape.displayOutput(palette.half, palette.half, targetIdeal, functionList[targetPolynomial][3]);	
	}
	
	
	if (winTracker > 0){
		winTracker += 0.3;		
		ideal = [...targetIdeal];
		targetShape.displayOutput(palette.vivid, palette.vivid, targetIdeal, functionList[targetPolynomial][3], 1 + 2*sin(winTracker));

		if (winTracker >= PI){
			level++;
			newTarget();	
		}
		
	} else if (winTracker < 0){
		ideal = [...targetIdeal];
		iDragging = false;
		targetShape.displayOutput(palette.vivid, palette.vivid, targetIdeal, functionList[targetPolynomial][3]);
		
	} else {
		shape.displayOutput(palette.front, palette.vivid, ideal, functionList[polynomial][3]);
	}
	

	resetMatrix();
	fill(palette.backdark);
	stroke(palette.backlight);
	strokeWeight(labelLayout[1]);
	rect(...labelLayout[0]);

	onlyFill(palette.mono);
	// shape.display(labelLayout[activeFunk],labelLayout[6]);
	shape.display(...labelLayout[3]);
	

	if (portrait && !iTouched && millis() - startTime > 3000){
		// get it to work. it doesn't need to be perfect code.
		let dragAlert = document.getElementById('drag-alert');
		dragAlert.style.display = 'inline';
		dragAlert.style.fontSize = str(3.6+cos(millis()/300)*0.4) + 'vw';
	}

	let iLoc = idealLocation(portrait);
	if (iLoc.length > 0){
		strokeWeight(circleWidth*0.15);
		stroke(palette.back);
		fill(palette.alert);
		circle(iLoc[0], iLoc[1], circleWidth*(portrait?1.25:1.75));
		if (!portrait){
			textSize(1.4*circleWidth);
			onlyFill(palette.back);
			text('i²', iLoc[0], iLoc[1]);			
			if (!iTouched && millis() - startTime > 3000){
				textInBox('drag me',iLoc[0],iLoc[1]-circleWidth*2.5, circleWidth*(1.7+cos(millis()/300)*0.2), palette.alert, palette.back);
			}
		}
	}

	
	
	// displayMessages();

}



/*
function setup() {

		gameIcons = [
			new Icon('restart',[ defaultOrigin.x-height*0.17, defaultOrigin.y + height*0.15],[height*0.1,height*0.05],'text_inv'),
			new Icon('free play',[ defaultOrigin.x+height*0.018, defaultOrigin.y + height*0.15],[height*0.14,height*0.05],'text_inv'),
			new Icon('exit',[ defaultOrigin.x+height*0.18, defaultOrigin.y + height*0.15],[height*0.08,height*0.05],'text_inv'),
		];
		
*/



var shape, targetShape, shapeSize, circleWidth; 
var grid, canvas;
var verticalUnit = 'i';

function setup() {
	 
	startTime = millis();

	morningRoutine('electric');
	setupFonts();

	textFont(mainFont);
	textAlign(CENTER, CENTER);
	

	shape = new Shape(0,1);


	let funks = [];
	for (let f of functionList){
		funks.push(f[1]);
	}
	Object.defineProperty(controllers,'arrow-function',{value: new Controller('arrow-function',funks,0),enumerable:true});

	let shapeList = ['circle','triangle','square','pentagon','hexagon','heptagon','octagon','spiral'];
	Object.defineProperty(controllers,'arrow-version',{value: new Controller('arrow-version',shapeList,0,'mono'),enumerable:true});
	Object.defineProperty(controllers,'arrow-step',{value: new Controller('arrow-step',['regular'],0,'mono'),enumerable:true});
	Object.defineProperty(controllers,'arrow-type',{value: new Controller('arrow-type',['1 lap'],0,'mono'),enumerable:true});
	

	popupList = ['info-holder','info-hide'];
	popdownList = ['info-show','arrow-function'];

	randomize();
	setIdeal([-0.3,-0.2]);
}

var portrait;
function setupLayout(){
	portrait = width*4 < height*3;

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');

	if (portrait){	
		circleWidth = width*0.03;
		defaultScalar = min(width,height-width*0.47)*0.32;
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?width*-0.05:width*0.23));
		grid = new Grid(0,height-(menuHidden?0:width*0.50),width,0,width*0.05,false,'label');

		labelLayout = [[width*0.5,0,width*0.6,width*0.28,width*0.03],
						   width*0.008,
						   width*0.003,
						[[width*0.5,width*0.065],width*0.04],
					 ];
		
	} else {
		circleWidth = height*0.02;
		defaultScalar = min(height,width-height*0.3)*0.25;
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		grid = new Grid((menuHidden?0:height*0.32),height,width,0,height*0.03,false,'label');

		labelLayout = [[width,height,height*0.7,height*0.18,height*0.02],
						   height*0.005,
						   height*0.0025,
						[[width-height*0.18,height*0.955],height*0.026],
					 ];
	}


	origin = defaultOrigin.copy();
	scalar = defaultScalar;

}


var mainFont, regularFont;
function preload() {
	mainFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}


function corePaletteCustom(){
	palette.label = lerpColor(color(palette.back),color(palette.mono),0.4);

	// palette.medium = lerpColor(palette.accent[1],palette.back,0.6);
	palette.backalpha = color(red(palette.back),green(palette.back),blue(palette.back),150);
	// palette.link = palette.mono;
}
