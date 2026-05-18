
var boldFont, regularFont;
function preload() {
	boldFont = loadFont('media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('media/AshkinsonRegular_000.ttf');
}


var canvas, unit;
function setup() {

	morningRoutine('sunset');

	if (paletteNames[paletteIndex]=='custom'){
		setPaletteURL(paletteToCode());
	} else if (!defaultPalette){
		setExistingPalette(paletteNames[paletteIndex]);
	}

	unit = min(width*0.4,height*0.3);
	previewIndex = floor(random()*previews.length);
	prepPreview();
	openPreview();
	textFont(boldFont);
	textAlign(CENTER,CENTER);

	
	document.body.style.setProperty('font-family','AshkinsonBold_prod, Helvetica, sans-serif');
	for (let para of document.getElementsByTagName('p')){
		para.style.setProperty('font-family','AshkinsonRegular_000, Helvetica, sans-serif');
	}
	for (let para of document.getElementsByTagName('li')){
		para.style.setProperty('font-family','AshkinsonRegular_000, Helvetica, sans-serif');
	}
	for (let para of document.getElementsByTagName('li')){
		para.style.setProperty('font-family','AshkinsonRegular_000, Helvetica, sans-serif');
	}

	for (let pName of paletteNames){
		palettes[pName].custom = false;
	}
	
}



var defaultPalette = true;
function prepPreview(direction = 1){
		
	previewIndex = modulo(previewIndex+direction,previews.length);
	previewName = previews[previewIndex][0];

	if (defaultPalette){
		changePalette(previews[previewIndex][2]);
	}
	
	if (previewName == 'fastest numbers'){
		fastestPrep();
	} else if (previewName == 'hexponents!'){
		hexponentPrep();
	} else if (previewName == 'visual groups'){
		visualGroupPrep();
	} else if (previewName == 'hypercomplex grapher'){
		hyperPrep();
	} else if (previewName == 'complex primes'){
		complexPrimePrep();
	} else if (previewName == 'cursed equations'){
		cursedPrep();
	}
	
	
	document.getElementById('preview-title').textContent = previewName.replace(' ','\r\n');
	document.getElementById('preview-link').href = previews[previewIndex][1] + paletteSuffix;
	
	lastFrame = Date.now();
}


var previews = [
	['cursed equations','/cursed_equations','electric'],
	['complex primes','/quadratic_primes','sunset'],
	['fastest numbers','/fast_numbers','dark'],
	// ['hypercomplex grapher','/hypercomplex_grapher','electric'],
	['hexponents!','/hexponents','sunset'],
	['visual groups','/group_visualizer','forest'],
];
var previewName, previewIndex, lastFrame;
var hidePreview = false;
var previewTimer = 0;

function draw() {

	background(palette.back);
	if (hidePreview){
		return;
	}
	previewTimer += (Date.now()-lastFrame)/8000;
	lastFrame = Date.now();
	if (previewTimer > 1){
		previewTimer = 0;
		prepPreview();
	}
	translate(width/2,height/2+min(width,height)*0.06);
	
	if (previewName == 'fastest numbers'){
		fastestDraw();
	} else if (previewName == 'hexponents!'){
		hexponentDraw();
	} else if (previewName == 'visual groups'){
		visualGroupDraw();
	} else if (previewName == 'hypercomplex grapher'){
		hyperDraw();
	} else if (previewName == 'complex primes'){
		complexPrimeDraw();
	} else if (previewName == 'cursed equations'){
		cursedDraw();
	}
	
}


function editPalette(colorType, colorValue){
	defaultPalette = false;
	
	let pName = paletteNames[paletteIndex];
	palettes[pName].custom = true;
	palettes[pName][colorType] = color(colorValue);
	changePalette(pName);
	setPaletteURL(paletteToCode());
}

function setExistingPalette(paletteKey){
	defaultPalette = false;
	changePalette(paletteKey);
	setPaletteURL(paletteKey);
}


function corePaletteCustom(){
	sunset = [];
	for(var suns = 0; suns < sunlen/3; suns++){
		sunset.push(lerpColor(palette.alert,palette.mono,3*suns/sunlen));
	}
	for(suns = 0; suns < sunlen/3; suns++){
		sunset.push(lerpColor(palette.mono,palette.vivid,3*suns/sunlen));
	}
	for(suns = 0; suns < sunlen/3; suns++){
		sunset.push(lerpColor(palette.vivid,palette.alert,3*suns/sunlen));
	}
	
	for (let pName of paletteNames){
		if (pName == 'custom'){
			continue;
		}
		let presetSvg = document.getElementById(pName + '-preset');
		if (pName == paletteNames[paletteIndex]){
			presetSvg.style.borderStyle = 'solid';
			presetSvg.style.borderColor = palette.mono;
		} else {
			// presetSvg.style.borderColor = '#00000000';
			presetSvg.style.borderStyle = 'none';
		}

		presetSvg.style.background = palettes[pName].back;
		let presetChildren = presetSvg.children;
		presetChildren[0].style.fill = palettes[pName].front;
		presetChildren[1].style.fill = palettes[pName].mono;
		presetChildren[2].style.fill = palettes[pName].vivid;
		presetChildren[3].style.fill = palettes[pName].alert;
	}

	for (let pKey of paletteKeys){
		document.getElementById('picker-' + pKey).value = colorToHex(palette[pKey]);
	}
}

function movePreview(direction){
	previewTimer = 0;
	prepPreview(direction);
	
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	unit = min(width*0.4,height*0.3);	
}

function openThumbnails() {
	clearViews('thumbnail');
	document.getElementById('thumbnail-holder').style.display = 'flex';
}

function openPreview() {
	clearViews('preview');
	document.getElementById('preview-holder').style.display = 'flex';
	
	hidePreview = false;
	previewTimer = 1;
}

function openPalette() {
	clearViews('palette');
	document.getElementById('palette-holder').style.display = 'flex';
}


function openInfo() {
	clearViews('info');
	document.getElementById('info-holder').style.display = 'flex';
	document.getElementById('random-link').href = videoLinks[floor(random()*videoLinks.length)];
}

var menuIcons = ['thumbnail','preview','palette','info'];
function clearViews(iconName){

	for (let m of menuIcons){
		if (m == iconName){
			document.getElementById(iconName + '-icon').style.setProperty('background','var(--color-backlight)');
		} else {
			document.getElementById(m + '-holder').style.display = 'none';
			document.getElementById(m + '-icon').style.background = 'none';
		}
	}
	
	hidePreview = true;
}






var videoLinks = [
	'https://youtu.be/1sPAwCZYXDA', // world to the world doesn't work
	'https://youtu.be/n4UuEJ9jFUE', // apply a function to the world
	'https://youtu.be/AGh5LM7Jmfk', // math on the globe
	'https://youtu.be/148N796Qy3g', // rectangles have outies
	'https://youtu.be/Vhf6n9_f9RA', // symmetries of symmetries
	'https://youtu.be/iHrXpLDcICo', // say numbers EVEN faster
	'https://youtu.be/Ff8qIBUu4wM', // say numbers faster
	'https://youtu.be/8_WPBuYYz9M', // hexponents
	'https://youtu.be/tcwFd8JbzQY', // patterns of complex powers
	'https://youtu.be/iK1gV0J6EOo', // double modular
	'https://youtu.be/t5iYCJOXD0A', // i is a set
	'https://youtu.be/u3xg7tLN-1M', // graphing duals
	'https://youtu.be/_gzlOJKwFok', // ladle update
	'https://youtu.be/um_Ewx4X-mI', // 4d complex dual
	'https://youtu.be/rDHHETIZqlk', // split complex
	'https://youtu.be/P9ApmHdPZeI', // i = sqrt(-i)
	'https://youtu.be/x2Zc4gjG2TA', // skilled cheese546
	'https://youtu.be/tGCqP2ytP14', // group theory 1-7
	'https://youtu.be/2v1H_xTfGyw', // group theory 8-15
	'https://youtu.be/__ncJR7x_sY', // cursed pythag
	'https://youtu.be/XGQ_GoV71RE', // prime polynomials
	'https://youtu.be/OCgv0v_HHUA', // 7 is only prime
	'https://youtu.be/iLkOBkWUDkM', // shapes as exponents
	'https://youtu.be/ocDnfeFAsCg', // cursed quadratic
	'https://youtu.be/ZDFsl7fqGtM', // complex roots
	'https://youtu.be/dYj0rPQeRkA', // cube is calculator
	'https://youtu.be/_KInQ1aTLRk', // pentagon cubed
	'https://youtu.be/PkWY3fLy4oI', // complex primes
	'https://youtu.be/s15ut3iDyAQ', // eisenstein primes
	'https://youtu.be/OuCvn8q4aNw', // natural log of novem
	'https://youtu.be/MjL1nOy7oFI', // spelling numbers
]
