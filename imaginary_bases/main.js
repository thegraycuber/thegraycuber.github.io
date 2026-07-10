
var base = [-1,2];
var baseRaw = [-1,2];
var digits = [
	[[0,0]],[[1,0]],[[0,1]],[[-1,0]],[[0,-1]],
	];
var maxDigitCount = 5;

var d = [-1,0];
var dList = [-1,-3];


var lastFrame;
var hideCanvas = false;
var toProcess = false;

function draw(){
	iconChecks();

	if (scalarLerp < 2){
		scalarLerp = min(1, scalarLerp + (Date.now()-lastFrame)/1000);
		lerpValue = sin((scalarLerp-0.5)*PI)/2+0.5;
		scalar = lerp(...scalarValues,lerpValue);
		origin = p5.Vector.lerp(originValues[0],originValues[1],lerpValue);

		if (scalarLerp == 1){
			scalarLerp = 2;
		}
	}
	lastFrame = Date.now();


	if (dragged > -1){
		setDigit(addC(draggedSubFocus, focusPrincipal), dragged);
	}
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	if (toProcess){
		processInts(dragged == -1);
		toProcess = false;
	}
	
	grid.drawGrid();

	translate(origin.x,origin.y);
	scale(scalar,-scalar);

	shapeStroke = constrain(log(defaultScalar/scalar)*0.2,0.1,0.5);
	shapeSize = 0.9-shapeStroke*0.8;
	
	for (let i = ints.length-1; i > -1; i--) {
		ints[i].show();
	}
	
	resetMatrix();
	grid.drawLabels();


	translate(origin.x,origin.y);
	scale(scalar,-scalar);
	
	for (let i = 0; i < digits.length; i++) {
		if (i == dragged){continue;}
		ints[i].show(true);
	}

	if (dragged > 0 && dragged < digits.length){
		ints[dragged].show(false);
	}

	push();
	translate(...baseRaw);

	fill(palette.front);
	stroke(palette.back);
	strokeWeight(0.08);
	circle(0,0,0.8);

	scale(1,-1);
	onlyFill(palette.back);
	if (dragged < digits.length){
		let labelValue = text2d(roundC(base,1),verticalUnit);
		textLimited('base\n'+labelValue,0,0,0.3,0.5);
	} else {
		textLimited('base\n',0,0,0.3,0.5);
	}
	pop();


}	  


var canvas;
var grid = {
	visible:true
}; 	
function setup() {

	morningRoutine('sunset');

	setupFonts();
	textFont(mainFont);
	textAlign(CENTER, CENTER);

	
	popupList = ['info-holder','info-hide','paste-holder','copy-holder','submitted-note'];
	popdownList = ['info-show','menu-hide'];

	
	// for (let di = 0; di < 11; di++){
	// 	dList.push(di);
	// }
	// for (let di = -10; di < 0; di++){
	// 	dList.push(di);
	// }
	
	// let ringList = ['dual','split'];
	// for (let dIndex = 2; dIndex < dList.length; dIndex++){
	// 	ringList.push('O√'+str(dList[dIndex]));
	// }
	// ringList[ringList.length-1] = 'complex';
	// ringList[ringList.length-3] = 'eisenstein';
	// Object.defineProperty(controllers,'arrow-definition',{value: new Controller('arrow-definition',['imaginary','iωaginary'],0)});
	Object.defineProperty(controllers,'arrow-limit',{value: new Controller('arrow-limit',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],maxDigitCount-1)});
	Object.defineProperty(controllers,'arrow-color',{value: new Controller('arrow-color',['aggregate','leading digit','1st digit','2nd digit','3rd digit','4th digit','5th digit'],0)});
	
	lastFrame = Date.now();
	setupLayout();
	favoriteIndex = floor(random(favorites.length));
	nextFavorite();


}



var portrait;
var deleteLimit;
function setupLayout(){
	portrait = width*5 < height*4;

	setOriginAndGrid();
	origin = defaultOrigin.copy();
	
	defaultScalar = min(width*1.5,height*0.6)*0.10;
	scalar = defaultScalar;
	scaleMin = 1;

}

function setOriginAndGrid(){

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');

	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?0:width*0.22));
		deleteLimit = height-(menuHidden?0:width*0.51);
		grid = new Grid(0,deleteLimit,width,0,width*0.008,true,'half','backlight',grid.visible);

	} else {
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		deleteLimit = (menuHidden?0:height*0.3);
		grid = new Grid(deleteLimit,height,width,0,height*0.006,true,'half','backlight',grid.visible);
	}
}


var mainFont, regularFont;
function preload() {
	mainFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}



function corePaletteCustom(){


	palette.backtrans = color(red(palette.back),green(palette.back),blue(palette.back),0);

	setPaletteBase();
	for (let i of ints){
		i.setColor();
	}

}


function setPaletteBase(){

	if (digits.length <= 8){
		palette.base = [
			lerpColor(palette.back, palette.mono, 0.5),
			palette.front,
			palette.mono,
			palette.vivid,
			palette.alert,
			lerpColor(palette.mono,palette.front,0.4),
			lerpColor(palette.vivid,palette.front,0.4),
			lerpColor(palette.alert,palette.front,0.4),
		];

	} else {
		palette.base = [lerpColor(palette.back, palette.mono, 0.5)];

		// let maxMag = 0;
		// let digMags = [0];
		// for (let dig = 1; dig < digits.length; dig++){
		// 	let newDigMag = isHex?digits[dig][0][0]**2+digits[dig][0][1]**2-digits[dig][0][0]*digits[dig][0][1]:normC(digits[dig][0]);
		// 	newDigMag = newDigMag**0.5;
		// 	maxMag = max(maxMag,newDigMag);
		// 	digMags.push(newDigMag);
		// }

		for (let dig = 1; dig < digits.length; dig++){
			let digArg = isHex?atan2(digits[dig][0][1]*0.866,digits[dig][0][0]-digits[dig][0][1]*0.5):atan2(digits[dig][0][1],digits[dig][0][0]);
			digArg = digArg*3/PI;
			let digColor;
			let digLerp = modulo(digArg,1);
			if (digArg < -2){
				digColor = lerpColor(palette.front,palette.alert,digLerp);
			} else if (digArg < -1){
				digColor = lerpColor(palette.alert,palette.front,digLerp);
			} else if (digArg < 0){
				digColor = lerpColor(palette.front,palette.mono,digLerp);
			} else if (digArg < 1){
				digColor = lerpColor(palette.mono,palette.front,digLerp);
			} else if (digArg < 2){
				digColor = lerpColor(palette.front,palette.vivid,digLerp);
			} else if (digArg < 3){
				digColor = lerpColor(palette.vivid,palette.front,digLerp);
			} else {
				digColor = palette.front;
			} 
			// let newDigMag = isHex?digits[dig][0][0]**2+digits[dig][0][1]**2-digits[dig][0][0]*digits[dig][0][1]:normC(digits[dig][0]);
			// let sizeLerp = 1/(1+0.1*newDigMag);
			// palette.base.push(lerpColor(palette.base[0], digColor, sizeLerp));
			palette.base.push( digColor);
			// palette.base.push(lerpColor(palette.base[0], digColor, digMags[dig]/maxMag));
		}
	}
}