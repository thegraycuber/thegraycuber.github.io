
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	unit = min(width * 0.4, height * 0.3);
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
	document.getElementById('random-link').href = videoLinks[floor(random() * videoLinks.length)];
}

function movePreview(direction) {
	previewTimer = 0;
	prepPreview(direction);

}

var menuIcons = ['thumbnail', 'preview', 'palette', 'info'];
function clearViews(iconName) {

	for (let m of menuIcons) {
		if (m == iconName) {
			document.getElementById(iconName + '-icon').style.setProperty('background', 'var(--color-backlight)');
		} else {
			document.getElementById(m + '-holder').style.display = 'none';
			document.getElementById(m + '-icon').style.background = 'none';
		}
	}

	hidePreview = true;
}


function editPalette(colorType, colorValue) {
	defaultPalette = false;

	if (paletteNames[paletteIndex] != 'custom'){
		userPalette(paletteToCode());
	}

	palettes.custom[colorType] = color(colorValue);
	let customPaletteCode = paletteToCode();
	userPalette(customPaletteCode);
	setPaletteURL(customPaletteCode);
	if (customPaletteHistory.length == 1){
		toggle('undo');
	}
	customPaletteHistory.push(customPaletteCode);

	document.getElementById('custom-preset').style.display = 'flex';
}

function setExistingPalette(paletteKey) {
	defaultPalette = false;
	changePalette(paletteKey);
	setPaletteURL(paletteKey=='custom'?paletteToCode():paletteKey);
}

function toggleSpecialPalettes(expand){
	var shownExpanded = expand ? 'flex' : 'none';
	var shownCollapsed = expand ? 'none' : 'flex';
	document.getElementById('expand-icon').style.display = shownCollapsed;
	document.getElementById('collapse-icon').style.display = shownExpanded;

	let specialPalettes = document.getElementById('special-palette-holder').children;
	for (let sp = 1; sp < specialPalettes.length; sp++){
		specialPalettes[sp].style.display = shownExpanded;
	}

}

var customPaletteHistory = [];
function undoPaletteChange(){

	if (paletteNames[paletteIndex] != 'custom'){
		userPalette(customPaletteHistory[customPaletteHistory.length-1]);
		setPaletteURL(customPaletteHistory[customPaletteHistory.length-1]);
		return;
	}

	if (customPaletteHistory.length < 2){
		return;
	}

	if (customPaletteHistory.length > 1){
		customPaletteHistory.pop();
		userPalette(customPaletteHistory[customPaletteHistory.length-1]);
		setPaletteURL(customPaletteHistory[customPaletteHistory.length-1]);
	}

	if (customPaletteHistory.length == 1){
		toggle('undo');
	}
}

function toggle(iconName){
	hidePopups();
	for (let svgElement of document.getElementById('svg-' + iconName).children){
		svgElement.classList.toggle('svg-front');
		svgElement.classList.toggle('svg-half');
	}
}


function randomPalette(){

	if (paletteNames[paletteIndex] != 'custom'){
		userPalette(paletteToCode());
	}

	let inverted = (random(1.5) > 1);
	let mainHue = random(360);
	let hueGap = (floor(random(2))*2-1)*random(30,60);

	if (inverted){
		palettes.custom.front = color(...HSVtoRGB(mainHue,random(0.4,0.6),random(0.15,0.4)));
		palettes.custom.mono = color(...HSVtoRGB(mainHue,random(0.7,0.9),random(0.45,0.65)));
		palettes.custom.back = color(...HSVtoRGB(mainHue,random(0.05,0.3),random(0.75,0.95)));

		palettes.custom.vivid = color(...HSVtoRGB(mainHue+hueGap,random(0.6,0.85),random(0.45,0.65)));
		palettes.custom.alert = color(...HSVtoRGB(mainHue+hueGap*2,random(0.7,1.0),random(0.4,0.6)));

	} else {
		palettes.custom.front = color(...HSVtoRGB(mainHue,random(0.05,0.3),random(0.8,0.95)));
		palettes.custom.mono = color(...HSVtoRGB(mainHue,random(0.7,0.9),random(0.7,0.9)));
		palettes.custom.back = color(...HSVtoRGB(mainHue,random(0.55,0.7),random(0.05,0.3)));

		palettes.custom.vivid = color(...HSVtoRGB(mainHue+hueGap,random(0.6,0.85),random(0.7,0.9)));
		palettes.custom.alert = color(...HSVtoRGB(mainHue+hueGap*2,random(0.7,1.0),random(0.75,0.95)));
	}

	editPalette('back', palettes.custom.back);
}



var videoLinks = [
	'https://youtu.be/d6agN416onM', // imaginary bases
	'https://youtu.be/CmXStCPFbTg', // tetromino fractals
	'https://youtu.be/Bh7o_Q1O1NA', // base 10, with weird digits
	'https://youtu.be/Wnjd0SLXZgs', // say numbers slower
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
];
