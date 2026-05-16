

var D = -1;
var scaleMin = 3;
var lastFrame, colorMillis;


var hideCanvas = false;

function draw(){

	// iconChecks();
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	
	processLimit = 200;
	
	let viewLimit = max(primeLimit**0.5,height/(2*scaleMin)+10);
	origin.x = constrain(origin.x,width-viewLimit*scalar,viewLimit*scalar);
	viewLimit = max((primeLimit/abs(D))**0.5,height/(2*scaleMin)+10);
	origin.y = constrain(origin.y,height-viewLimit*scalar,viewLimit*scalar);
	
	
	// updateOrigin();
	grid.drawGrid();
	translate(origin.x, origin.y);
	scale(scalar,scalar);

	colorMillis -= lastFrame;
	lastFrame = Date.now();
	colorMillis += lastFrame;
	while (colorMillis > 0){
		palette.gradient.push(palette.gradient[0]);
		palette.gradient.splice(0,1);

		if (highlights.length > 0 && highlightMode == 'prime factors'){
			palette.primeHighlight.push(palette.primeHighlight[0]);
			palette.primeHighlight.splice(0,1);
		} else if (highlights.length > 0 && highlightMode == 'multiples'){
			palette.multipleHighlight.push(palette.multipleHighlight[0]);
			palette.multipleHighlight.splice(0,1);
		}
		colorMillis -= 15;
	}
	
	let direcMaxes;
	if (isHex){
		direcMaxes = [floor(grid.wid.y/(scalar*0.866))+3, floor(2*grid.wid.x/scalar)+3];
	} else {
		direcMaxes = [floor(grid.wid.y/scalar)+3, floor(grid.wid.x/scalar)+3];
	}
	let spiralMaxes = [min(...direcMaxes),max(...direcMaxes)];
	direcMaxes.push(...direcMaxes);
	
	let spiralSize = 0;
	let direc = 3;
	let startInt = pixelToPrincipal(defaultOrigin);
	let re = round(startInt.x);
	let im = round(startInt.y);

	noStroke();
	while (spiralSize < spiralMaxes[1]){
		direc = (direc + 1)%4;
		if (spiralDirection[direc][1] == 0){
			spiralSize++;
		}

		if (spiralSize > direcMaxes[direc]){
			re += spiralDirection[direc][0]*spiralSize;
			im += spiralDirection[direc][1]*spiralSize;
			continue;
		}
		
		for (let i = 0; i < min(spiralSize,spiralMaxes[0]); i++){

			processInt(re, im);
			re += spiralDirection[direc][0];
			im += spiralDirection[direc][1];
		}
	}


	if (highlights.length > 0 && highlightMode != 'off'){
		if (highlightMode == 'prime factors'){
			onlyFill(palette.primeHighlight[0]);
		} else {
			onlyFill(palette.multipleHighlight[0]);
		}
		for (let h of highlights){
			intShape(...h);
		}
	}
	
	if (infoInteger.length == 2){
		onlyStroke(palette.back,0.4);
		intShape(...infoInteger);
		onlyStroke(palette.front,0.22);
		intShape(...infoInteger);
	}
	

	resetMatrix();
	grid.drawLabels();
}

// function updateOrigin(){
// 	origin = p5.Vector.lerp(origin,defaultOrigin,0.05);
// }

var processLimit;
var spiralDirection = [
	[1,0],
	[0,1],
	[-1,0],
	[0,-1]
]



var grid, canvas;
function setup() {
	 
	morningRoutine('sunset');
	
	// let currentUrl = window.location.href; // PROD
	// if (currentUrl.includes('D=')){
	// 	D = int(currentUrl.substring(currentUrl.indexOf('D=')+2));
	// }

	setupFonts();
	textFont(mainFont);
	textAlign(CENTER, CENTER);
	
	lastFrame = Date.now();
	colorMillis = 0;

	
	zNoise = random()*1000;
	primeLimit = 250000;
	generateSquares(100);

	

	let ringList = ['gaussian','O√-2','eisenstein'];
	for (let dIndex = 3; dIndex < DList.length; dIndex++){
		ringList.push('O√'+str(DList[dIndex]));
	}
	Object.defineProperty(controllers,'arrow-ring',{value: new Controller('arrow-ring',ringList,0)});
	Object.defineProperty(controllers,'arrow-highlight',{value: new Controller('arrow-highlight',['prime factors','multiples','off'],0,'mono')});
	controllers['arrow-highlight'].disable();
	
	popupList = ['info-holder','info-hide'];
	popdownList = ['info-show','menu-hide'];

	resetD();
	background(palette.back);
	setupLayout(true);
	
}

var portrait;
function setupLayout(resetDesc = false){
	portrait = width*5 < height*4;

	setOriginAndGrid();
	defaultScalar = min(width,height)*0.02;
	origin = defaultOrigin.copy();
	scalar = defaultScalar;

	scaleMin = max(height*0.5/((primeLimit/abs(D))**0.5),width*0.5/(primeLimit**0.5))
	scaleMin = constrain(scaleMin,3,min(width,height)*0.01);

	if (resetDesc){
		let descMenu = document.getElementsByTagName('desc-menu')[0];
		if (portrait){
			descMenu.innerHTML = '<p>swipe and pinch <br>to explore</p><p class="svg-mono">tap a cell <br>for more info</p>';
		} else {
			descMenu.innerHTML = '<p>drag and scroll <br>to explore</p><p class="svg-mono">click a cell <br>for more info</p>';

		}
	} 

}

function setOriginAndGrid(){

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');

	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?0:width*0.22));
		grid = new Grid(0,height-(menuHidden?0:width*0.4),width,0,width*0.012,true,'label','grid');
		
	} else {
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		grid = new Grid((menuHidden?0:height*0.29),height,width,0,height*0.008,true,'label','grid');
	}
}



var mainFont, regularFont;
function preload() {
	mainFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}


function corePaletteCustom(){
	palette.label = lerpColor(color(palette.back),color(palette.front),0.9);
	palette.grid = lerpColor(color(palette.back),color(palette.mono),0.3);
	
	palette.backtrans = color(red(palette.back),green(palette.back),blue(palette.back),0);
	palette.backalpha = color(red(palette.back),green(palette.back),blue(palette.back),1);
	palette.undefined = lerpColor(palette.mono,palette.back,0.85);

	palette.gradient = [];
	let gradientInputs = ['mono','vivid','mono','alert','mono'];
	for (let g = 0; g < gradientInputs.length-1; g++){
		for (let clr = 0; clr < 90; clr++){
			palette.gradient.push(lerpColor(palette[gradientInputs[g]],palette[gradientInputs[g+1]],clr/90));
		}
	}
	
	palette.primeHighlight = [];
	palette.multipleHighlight = [];
	for (let theta = 0; theta < 120; theta++){
		let lerpy = cos(theta*TWO_PI/120)*0.5+0.5;
		palette.primeHighlight.push(lerpColor(palette.back,palette.backtrans,lerpy));
		palette.multipleHighlight.push(lerpColor(palette.back,palette.front,lerpy));
	}
	
}
