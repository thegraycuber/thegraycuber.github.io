
var crowList = [-1,-2,-3,-5,-11,-17,28,27,25,24,23,22,19,18,17,15,14,13,10,9,8,7,5,4,3,1];

var modulus = [11,0]; 
var orbits = 3; 
var crowConstant = -1; 

var ticker = -3.14;
var highlight = 0;
var lastDisplay = 0;
var hideCanvas = false;

function draw(){
	iconChecks();
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	
	translate(origin.x,origin.y);
	scale(scalar,-scalar);

	if (showBorders){
		ticker = ticker+(Date.now()-lastDisplay)*0.003;
		lastDisplay = Date.now();
		if (ticker > PI){
			ticker = -PI;
			highlight = (highlight + 1) % orbits;
		}

		strokeFill = -cos(ticker)*0.5+0.5;
		highlightFill = cos(ticker)*0.25+0.75;
		radiusLerp = -cos(ticker)*0.06+0.45;
	}
	//draw the hexagons

	for (let c of Object.keys(equivalenceClasses)){
		if (c == '0;0'){continue;}

		let radius;
		if (inverted){
			let strokeLerp = (showBorders && (equivalenceClasses[c].orbit == highlight))?strokeFill:1;
			stroke(lerpColor(palette.back,palette.orbits[equivalenceClasses[c].orbit],strokeLerp));
			strokeWeight(0.16*(strokeLerp));
			radius = (showBorders && (equivalenceClasses[c].orbit == highlight))?0.87-radiusLerp:0.36;
			let fillLerp = (showBorders && (equivalenceClasses[c].orbit == highlight))?highlightFill:0.5;
			fill(lerpColor(palette.back,palette.orbits[equivalenceClasses[c].orbit],fillLerp));
		} else {
			radius = (showBorders && (equivalenceClasses[c].orbit == highlight))?radiusLerp:0.51;
			onlyFill(palette.orbits[equivalenceClasses[c].orbit]);

		}
		

		// let fillLerp = (showBorders && (equivalenceClasses[c].orbit == highlight))?highlightFill:0.7;
		// onlyFill(lerpColor(palette.back,palette.orbits[equivalenceClasses[c].orbit],fillLerp));
		// onlyFill(lerpColor(palette.back,palette.orbits[equivalenceClasses[c].orbit],fillLerp));
		// strokeWeight(0.16);
		for (let hex of equivalenceClasses[c].hexes){
			hexagon(hex[0],hex[1],radius);
		}
	}

}

var highlightFill = 0;
var strokeFill = 0;
var radiusLerp = 0;


var equivalenceClasses;
var canvas;
function setup() {

	morningRoutine('sunset');

	let ringList = [];
	for (let crow = 0; crow < crowList.length; crow++){
		ringList.push('c² = c '+ (sign(crowList[crow]) == 1? '+ ': '- ') + str(abs(crowList[crow])));
	}
	Object.defineProperty(controllers,'arrow-ring',{value: new Controller('arrow-ring',ringList,1,'mono')});
	Object.defineProperty(controllers,'arrow-modulus',{value: new Controller('arrow-modulus',[''],0,'mono')});
	Object.defineProperty(controllers,'arrow-orbits',{value: new Controller('arrow-orbits',[''],0,'mono')});

	while (primes.length < 100){
		addPrime();
	}
	processMod();
	processOrbits();
	generateHexPrimes();	


	setupFonts();
	
	favoriteIndex = floor(random(favorites.length));
	nextFavorite();
	
	popupList = ['paste-holder','copy-holder','info-holder','submitted-note','info-hide'];
	popdownList = ['info-show','menu-hide'];
}


var portrait;
function setupLayout(){
	portrait = width*4 < height*3;
	origin = createVector(width/2, height/2);
	scalar = 0.4*min(width,height)/max(abs(hexNorm(modulus))**0.5,8);

}


var boldFont, regularFont;
function preload() {
	boldFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}




// pick a good color scheme depending on the number of orbits
function orbitColorSetup(){

	palette.halfdark = lerpColor(palette.half,palette.back,0.8);

	if (orbits <= 2){
		palette.orbits = [palette.mono, palette.halfdark];
		
	} else if (orbits <= 6){
		palette.orbits = [palette.vivid,palette.halfdark,palette.mono,palette.front,palette.half,palette.alert];
		
	} else if (orbits <= 8){
		palette.orbits = [palette.front,palette.vivid,palette.alert];
		for (let c = 3; c < orbits; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,(c-3)/(orbits-3)));
		}
	} else {
		palette.orbits = [];
		for (let c = 0; c < orbits; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,c/orbits));
		}
	}
}


function corePaletteCustom(){
	orbitColorSetup();
}