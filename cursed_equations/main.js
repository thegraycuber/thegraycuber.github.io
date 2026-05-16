
var shapes, output, outputVertices;

var autoZoom = true;
var showVertices = true;
var processFrame = true;
var hideCanvas = false;

function draw(){

	iconChecks();
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	grid.drawGrid();
	grid.drawLabels();

	translate(origin.x,origin.y);
	scale(scalar,-scalar);


	for (let s = 0; s < shapes.length; s++){
		if (shapes[s].animation == 'rotate'){
			shapes[s].rotate(rotationAngle[s]);
		} else if (shapes[s].animation == 'radius'){
			shapes[s].radiusTheta += rotationAngle[s]*2;
			shapes[s].radius = 2**(sin(shapes[s].radiusTheta)*2);
			processFrame = true;
		} else if (shapes[s].animation == 'translate'){
			shapes[s].transAng += 2.23*rotationAngle[s];
			shapes[s].transRadAng += 3.07*rotationAngle[s];
			processFrame = true;
		}
	}


	if (processFrame){
		output = [[],[]];
		outputVertices = [];

		prepFunk();	
		applyFunk();
		updateMaxMag(); 
		processFrame = false;
	}

	
	onlyFill(palette.front);
	for (let out of output){
		for (let o = 0; o < out.length; o++){
			if (showVertices && outputVertices[o] != -1){
				continue;
			}
			circle(out[o][0],-out[o][1],6/scalar);
		}
	}

	
	if (showVertices){
		for (let s = 2; s > -1; s--){
			for (let out of output){
				for (let o = 0; o < out.length; o++){
					if (outputVertices[o] == s){
						fill(palette.accent[s]);
						circle(out[o][0],-out[o][1],15/scalar);
					}
				}
			}
		}
	}

	resetMatrix();
	fill(palette.backdark);
	stroke(palette.backlight);
	strokeWeight(labelLayout[4]);
	rect(...labelLayout[3]);
	strokeWeight(labelLayout[5]);
	for (var sh = 0; sh < funkShapes[activeFunk]; sh++){
		stroke(palette.accent[sh]);
		shapes[sh].display(labelLayout[activeFunk][sh],labelLayout[6]);
	}

}

var rotationAngle;
var canvas;
function setup() {
	
	morningRoutine('electric');

	textFont(boldFont);
	setupFonts();
	
	noStroke();
	rotationAngle = [TWO_PI/960,TWO_PI/840,TWO_PI/720];
	
	
	shapes = [new Shape(4,1),new Shape(3,1),new Shape(7,-2)];

	Object.defineProperty(controllers,'arrow-version',{value: new Controller('arrow-version',shapeVersions,1,'vivid'),enumerable:true});
	Object.defineProperty(controllers,'arrow-step',{value: new Controller('arrow-step',[''],0,'vivid'),enumerable:true});
	Object.defineProperty(controllers,'arrow-animation',{value: new Controller('arrow-animation',['off','rotate','radius','translate'],0,'vivid'),enumerable:true});
	Object.defineProperty(controllers,'arrow-type',{value: new Controller('arrow-type',[''],0,'vivid'),enumerable:true});
	
	Object.defineProperty(controllers,'arrow-function',{value: new Controller('arrow-function',funkText,0),enumerable:true});
	
	favoriteIndex = floor(random(favorites.length));
	nextFavorite();

	popupList = ['paste-holder','copy-holder','info-holder','submitted-note','info-hide'];
	popdownList = ['info-show','arrow-function','menu-hide'];

		
}


var portrait;
var verticalUnit = 'i';
var shapeBox, miniShapes;
function setupLayout(){
	portrait = width*5 < height*4;
	setDefaultOrigin();

	if (portrait){	
		defaultScalar = min(height * 0.35 - width*0.26, width*0.4);

		// this is pretty bad, sorry
		let miniHeight = width*0.05;
		labelLayout = [[createVector(width*0.28,miniHeight),
							 createVector(width*0.47,miniHeight),
							 createVector(width*0.63,miniHeight)],
							
							 [createVector(width*0.42,miniHeight),
							 createVector(width*0.59,miniHeight)],
							
							 [createVector(width*0.33,miniHeight),
							 createVector(width*0.51,miniHeight),
							 createVector(width*0.69,miniHeight)],
					 
							[width*0.5,0,width*1.1,width*0.22,width*0.03],
						   width*0.006,
						   width*0.003,
						   width*0.025
					 ];

	} else {	
		defaultScalar = min(width * 0.4 - height*0.15,height*0.4);
		shapeBox = [width,height,height*0.94,height*0.16,height*0.02];

		// this is pretty bad, sorry
		let miniHeight = height*0.96;
		labelLayout = [[createVector(width-height*0.373,miniHeight),
							 createVector(width-height*0.257,miniHeight),
							 createVector(width-height*0.156,miniHeight)],
							
							 [createVector(width-height*0.283,miniHeight),
							 createVector(width-height*0.18,miniHeight)],
							
							 [createVector(width-height*0.333,miniHeight),
							 createVector(width-height*0.233,miniHeight),
							 createVector(width-height*0.125,miniHeight)],
					 
							[width,height,height*0.94,height*0.16,height*0.02],
						   height*0.005,
						   height*0.0025,
						   height*0.018
					 ];
	}

	origin = defaultOrigin.copy();
	scalar = defaultScalar;

}

function setDefaultOrigin(){

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');
	
	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?width*-0.05:width*0.24));
		grid = new Grid(0,height-(menuHidden?0:width*0.50),width,width*0.08,width*0.05,false,'label');
		
	} else {
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		grid = new Grid((menuHidden?0:height*0.32),height,width,0,height*0.035,false,'label');
	}
}


var boldFont, regularFont;
function preload() {
	boldFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}


function corePaletteCustom(){
	palette.label = lerpColor(color(palette.back),color(palette.mono),0.4);
}


