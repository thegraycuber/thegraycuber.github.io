

var points = [
	[[1,0],[-0.5,0.866],[-0.5,-0.866]],
	[[1.4,0.7],[-1.4,-0.7]],
];
var weights = [-0.6,0.9];
var pointVec, weightVec;

var border = [2,0];
var center = [0,0];
var bands = 6;
var gradient = 20;
var radius = 0.18;

var hideCanvas = false;
var lastFrame;

function draw(){

	clear();

	iconChecks();
	if (hideCanvas){
		return;
	}

	if (draggingItem()){
		setPoint(addC(draggedSubFocus, focusPrincipal), dragged);
		document.body.style.cursor = 'grabbing';
	} else if (!mouseOverMenu() && getMousePoint()[1]>-1){
		document.body.style.cursor = 'grab';
	} else {
		document.body.style.cursor = 'default';
	}
	
	if (movement){
		let moveAmount = Date.now() - lastFrame;
		for (let p = 0; p < points.length; p++){
			let multer = angleC(moveAmount*0.0005*sin(noise(p*1000+Date.now()*0.0001)*TWO_PI));
			for (let q = 0; q < points[p].length; q++){
				points[p][q] = addC(multC(multer,subC(points[p][q],center)),center);
			}
		}
	}
	lastFrame = Date.now();

	if (balancing){
		let balanceLerp = min((Date.now()-balanceStart)*0.001,1);

		for (let p = 0; p < weights.length; p++){
			weights[p] = lerp(...balanceValues[p],balanceLerp);
		}

		balancing = balanceLerp < 1;
	}
	// smoothPoints();

	shaderCanvas.shader(ellipseShader);

	colorToUniform(ellipseShader,"back");
	colorToUniform(ellipseShader,"mono");

	if (isFirefox){
		ellipseShader.setUniform("origin", [origin.x,height-origin.y]);
		ellipseShader.setUniform("scalar", scalar);
	} else {
		ellipseShader.setUniform("origin", [origin.x/2,(2*defaultOrigin.y-origin.y)/2]);
		ellipseShader.setUniform("scalar", scalar*2);
	}

	let distance = getTost(border,points,weights);
	ellipseShader.setUniform("distance", distance);
	ellipseShader.setUniform("bands", bands);
	ellipseShader.setUniform("gradient", gradient/(getPointCount()**0.5));

	prepareVectors();
	ellipseShader.setUniform("points", pointVec);
	ellipseShader.setUniform("point_count", weightVec.length);
	ellipseShader.setUniform("weights", weightVec);

	shaderCanvas.rect(0, 0, width, height);
	resetShader();

	image(shaderCanvas,0,0,width,height);

	translate(origin.x,origin.y);
	scale(scalar,-scalar);

	stroke(palette.back);
	for (let p = points.length-1; p > -1; p--){
		let pointSize = weightToSize(p);
		strokeWeight(0.1*pointSize);

		for (let q = 0; q < points[p].length; q++){
			fill(weights[p]>0?palette.front:palette.alert);
			circle(...points[p][q],pointSize);	
			if (p == selected[0]){
				fill(palette.back);
				circle(...points[p][q],0.4*pointSize);	
			}
		}
	}


	strokeWeight(radius*0.1);
	fill(palette.mono);
	circle(...border,radius);	


	noStroke();
	fill(palette.back);
	rect(...center,radius*0.4,radius,radius*0.4);	
	rect(...center,radius,radius*0.4,radius*0.4);	
	fill(palette.vivid);
	rect(...center,radius*0.18,radius*0.8,radius*0.18);	
	rect(...center,radius*0.8,radius*0.18,radius*0.18);	

}

var canvas, shaderCanvas;
var ellipseShader, isFirefox;
function setup() {

	morningRoutine('electric',false);

	principalPos = createVector(0,0);

	popupList = ['info-holder','info-hide'];
	popdownList = ['info-show','menu-hide'];

	Object.defineProperty(controllers,'arrow-repetition',{value: new Controller('arrow-repetition',[...repetitionList],0)});
	
	setupLayout();
	setupFonts();

	prepareVectors();
	disablePointEdit();
	lastFrame = Date.now();

	isFirefox = (navigator.userAgent.search('Firefox') > -1);

	randomize(10);
}



var portrait;
function setupLayout(){
	portrait = width*5 < height*4;

	setOriginAndGrid();
	origin = defaultOrigin.copy();
	
	defaultScalar = min(width*1.5,height*0.6)*0.13;
	scalar = defaultScalar;
	scaleMin = 1;

	shaderCanvas = createGraphics(width, height, WEBGL);
	ellipseShader = new p5.Shader(this.renderer, basicVert, threellipseFrag);

}

function setOriginAndGrid(){

	let menuHolder = document.getElementById('menu-holder');
	let menuHidden = (window.getComputedStyle(menuHolder).display == 'none');

	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-(menuHidden?0:width*0.2));
		menuLimit = height-(menuHidden?0:width*0.4);

	} else {
		defaultOrigin = createVector(width*0.5+(menuHidden?0:height*0.15),height*0.5);
		menuLimit = (menuHidden?0:height*0.3);
	}
}

var mainFont, regularFont;
function preload() {
	mainFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}