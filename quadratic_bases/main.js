

// var pageMode = 'edit';

var base = [1,2];
var baseRaw = [1,2];
var digits = [
	[[0,0]],[[1,0]],[[0,1]],[[-1,0]],[[0,-1]],
	];
var maxDigitCount = 5;


var displayLimit = 100000;
var dList = [];
var d = [-1,0];


var lastDisplay = 0;
var hideCanvas = false;


function draw(){

	iconChecks();

	if (dragged > -1){
		setDragged(addC(draggedSubFocus, focusPrincipal));
	}
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	
	
	grid.drawGrid();


	// if (pageMode == 'display'){
		
	translate(origin.x,origin.y);
	scale(scalar,-scalar);

	shapeStroke = constrain(log(defaultScalar/scalar)*0.2,0.1,0.5);
	shapeSize = 0.9-shapeStroke*0.8;
	
	displayLimit = ints.length;
	for (let i = displayLimit-1; i > -1; i--) {
		ints[i].show();
	}

	
	resetMatrix();
	grid.drawLabels();


	translate(origin.x,origin.y);
	scale(scalar,-scalar);
	
	for (let i = 0; i < digits.length; i++) {
		ints[i].show(i != dragged);
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

		// ints[dragged].show(false, dragged == digits.length);	

	// }

}


var canvas, grid;
var verticalUnit = 'k';
function setup() {

	morningRoutine('sunset');

	setupFonts();
	textFont(mainFont);
	textAlign(CENTER, CENTER);

	
	popupList = ['info-holder','info-hide','paste-holder','copy-holder','submitted-note'];
	popdownList = ['info-show','menu-hide'];

	
	for (let di = 0; di < 11; di++){
		dList.push(di);
	}
	for (let di = -10; di < 0; di++){
		dList.push(di);
	}
	
	let ringList = ['dual','split'];
	for (let dIndex = 2; dIndex < dList.length; dIndex++){
		ringList.push('O√'+str(dList[dIndex]));
	}
	ringList[ringList.length-1] = 'complex';
	ringList[ringList.length-3] = 'eisenstein';
	Object.defineProperty(controllers,'arrow-definition',{value: new Controller('arrow-definition',ringList,ringList.length-1)});
	Object.defineProperty(controllers,'arrow-limit',{value: new Controller('arrow-limit',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],maxDigitCount-1)});

	setupLayout();
	processInts();
	// favoriteIndex = floor(random(favorites.length));
	// nextFavorite();
}



var portrait;
function setupLayout(){
	portrait = width*5 < height*4;

	setOriginAndGrid();
	origin = defaultOrigin.copy();

	// if (pageMode == 'display'){
	// 	defaultScalar = min(width,height)*0.02;
	// 	scalar = defaultScalar;
	// 	scaleMin = max(height*0.5/((primeLimit/abs(d))**0.5),width*0.5/(primeLimit**0.5))
	// 	scaleMin = constrain(scaleMin,3,min(width,height)*0.01);
		
	// } else if (pageMode == 'edit'){
	// 	defaultScalar = min(width,height)*0.16;
	// 	scalar = defaultScalar;
	// 	scaleMin = max(height*0.075,width*0.075)
	// }
	
	defaultScalar = min(width,height)*0.16;
	scalar = defaultScalar;
	scaleMin = min(height*0.005,width*0.005)
	scaleMin = max(scaleMin,2);

}

function setOriginAndGrid(){

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');

	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?0:width*0.22));
		grid = new Grid(0,height-(menuHidden?0:width*0.4),width,0,width*0.008,true,'half','backlight');
		
	} else {
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		grid = new Grid((menuHidden?0:height*0.29),height,width,0,height*0.006,true,'half','backlight');
	}
}


var mainFont, regularFont;
function preload() {
	mainFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}



function corePaletteCustom(){

	let acc = [
		palette.front,
		palette.mono,
		palette.vivid,
		palette.alert
	]

	palette.base = [lerpColor(palette.back, palette.mono, 0.35)];
	for (let a of acc){
		palette.base.push(lerpColor(a,a,0));
	}
	for (let a of acc){
		palette.base.push(lerpColor(a,palette.front,0.5));
	}
	for (let a of acc){
		palette.base.push(lerpColor(a,palette.back,0.3));
	}

	palette.backtrans = color(red(palette.back),green(palette.back),blue(palette.back),0);

	for (let i of ints){
		i.setColor();
	}
}


