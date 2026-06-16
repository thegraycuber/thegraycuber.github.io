
var boldFont, regularFont;
function preload() {
	boldFont = loadFont('media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('media/AshkinsonRegular_000.ttf');
}


var canvas, unit;
function setup() {
	for (let k of Object.keys(palettes)){
		if (!paletteNames.includes(k)){
			unpackPalette(k);
		}
	}


	morningRoutine('sunset');

	if (paletteNames[paletteIndex] == 'custom') {
		let customPaletteCode = paletteToCode();
		setPaletteURL(customPaletteCode);
		customPaletteHistory.push(customPaletteCode);
		document.getElementById('custom-preset').style.display = 'flex';

	} else if (!defaultPalette) {
		setExistingPalette(paletteNames[paletteIndex]);
	}

	unit = min(width * 0.4, height * 0.3);
	previewIndex = floor(random() * previews.length);
	prepPreview();
	openPreview();
	textFont(boldFont);
	textAlign(CENTER, CENTER);


	document.body.style.setProperty('font-family', 'AshkinsonBold_prod, Helvetica, sans-serif');
	for (let para of document.getElementsByTagName('p')) {
		para.style.setProperty('font-family', 'AshkinsonRegular_000, Helvetica, sans-serif');
	}
	for (let para of document.getElementsByTagName('li')) {
		para.style.setProperty('font-family', 'AshkinsonRegular_000, Helvetica, sans-serif');
	}
	for (let para of document.getElementsByTagName('li')) {
		para.style.setProperty('font-family', 'AshkinsonRegular_000, Helvetica, sans-serif');
	}

	for (let pName of paletteNames) {
		palettes[pName].custom = false;
	}

}




var defaultPalette = true;
function prepPreview(direction = 1) {

	previewIndex = modulo(previewIndex + direction, previews.length);
	previewName = previews[previewIndex][0];

	if (defaultPalette) {
		changePalette(previews[previewIndex][2]);
	}

	if (previewName == 'fastest numbers') {
		fastestPrep();
	} else if (previewName == 'hexponents!') {
		hexponentPrep();
	} else if (previewName == 'visual groups') {
		visualGroupPrep();
	} else if (previewName == 'hypercomplex grapher') {
		hyperPrep();
	} else if (previewName == 'complex primes') {
		complexPrimePrep();
	} else if (previewName == 'cursed equations') {
		cursedPrep();
	}


	document.getElementById('preview-title').textContent = previewName.replace(' ', '\r\n');
	document.getElementById('preview-link').href = previews[previewIndex][1] + paletteSuffix;

	lastFrame = Date.now();
}


var previews = [
	['cursed equations', '/cursed_equations', 'electric'],
	['complex primes', '/quadratic_primes', 'sunset'],
	['fastest numbers', '/fast_numbers', 'dark'],
	// ['hypercomplex grapher','/hypercomplex_grapher','electric'],
	['hexponents!', '/hexponents', 'sunset'],
	['visual groups', '/group_visualizer', 'forest'],
];
var previewName, previewIndex, lastFrame;
var hidePreview = false;
var previewTimer = 0;

function draw() {

	background(palette.back);
	if (hidePreview) {
		return;
	}
	previewTimer += (Date.now() - lastFrame) / 8000;
	lastFrame = Date.now();
	if (previewTimer > 1) {
		previewTimer = 0;
		prepPreview();
	}
	translate(width / 2, height / 2 + min(width, height) * 0.06);

	if (previewName == 'fastest numbers') {
		fastestDraw();
	} else if (previewName == 'hexponents!') {
		hexponentDraw();
	} else if (previewName == 'visual groups') {
		visualGroupDraw();
	} else if (previewName == 'hypercomplex grapher') {
		hyperDraw();
	} else if (previewName == 'complex primes') {
		complexPrimeDraw();
	} else if (previewName == 'cursed equations') {
		cursedDraw();
	}

}


function corePaletteCustom() {
	sunset = [];
	for (var suns = 0; suns < sunlen / 3; suns++) {
		sunset.push(lerpColor(palette.alert, palette.mono, 3 * suns / sunlen));
	}
	for (suns = 0; suns < sunlen / 3; suns++) {
		sunset.push(lerpColor(palette.mono, palette.vivid, 3 * suns / sunlen));
	}
	for (suns = 0; suns < sunlen / 3; suns++) {
		sunset.push(lerpColor(palette.vivid, palette.alert, 3 * suns / sunlen));
	}

	for (let pName of paletteNames) {

		let presetSvg = document.getElementById(pName + '-preset');
		if (pName == paletteNames[paletteIndex]) {
			// presetSvg.style.borderStyle = 'solid';
			presetSvg.style.borderColor = palette.mono;
		} else {
			presetSvg.style.borderColor = 'transparent';
			// presetSvg.style.borderStyle = 'none';
		}

		presetSvg.style.background = palettes[pName].back;
		let presetChildren = presetSvg.children;
		presetChildren[0].style.fill = palettes[pName].front;
		presetChildren[1].style.fill = palettes[pName].mono;
		presetChildren[2].style.fill = palettes[pName].vivid;
		presetChildren[3].style.fill = palettes[pName].alert;

	}

	for (let pKey of paletteKeys) {
		document.getElementById('picker-' + pKey).value = colorToHex(palette[pKey]);
	}
}


