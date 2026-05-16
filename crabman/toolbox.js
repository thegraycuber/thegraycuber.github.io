/*####################################

              HTML handling

####################################*/

function hideElement(hiddenId) {
	document.getElementById(hiddenId).style.display = 'none';
}

var popupList = [];
var popdownList = [];
function hidePopups() {
	for (let p of popupList) {
		document.getElementById(p).style.display = 'none';
	}
	for (let p of popdownList) {
		document.getElementById(p).style.display = 'flex';
	}
	hideCanvas = false;
}

var mouseInMenu = false;

function hideHolder(holderType) {
	hidePopups();
	document.getElementById(holderType + '-holder').style.display = 'none';
	document.getElementById(holderType + '-hide').style.display = 'none';
	document.getElementById(holderType + '-show').style.display = 'flex';

	if (holderType == 'info') {
		let menuHide = document.getElementById('menu-hide');
		if(menuHide != null){
			document.getElementById('menu-hide').style.display = 'flex';
		}
	} 
	hideCanvas = false;
	if (typeof customToggleHolder == 'function'){
		customToggleHolder(holderType,'hide');
	}
}

function showHolder(holderType, displayType = 'flex') {
	hidePopups();
	document.getElementById(holderType + '-holder').style.display = displayType;
	document.getElementById(holderType + '-hide').style.display = 'flex';
	document.getElementById(holderType + '-show').style.display = 'none';

	if (holderType == 'info') {
		let menuHide = document.getElementById('menu-hide');
		if(menuHide != null){
			document.getElementById('menu-hide').style.display = 'none';
		}
		hideCanvas = true;
	} else {
		hideCanvas = false;
	}
	
	if (typeof customToggleHolder == 'function'){
		customToggleHolder(holderType,'show');
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);

	if (typeof setupLayout === 'function') {
		setupLayout();
	}
}

var regularFontTags = ['p', 'li', 'textarea'];
function setupFonts() {
	document.body.style.setProperty('font-family', 'AshkinsonBold_prod, Helvetica, sans-serif');
	for (let tag of regularFontTags) {
		for (let paragraph of document.getElementsByTagName(tag)) {
			paragraph.style.setProperty('font-family', 'AshkinsonRegular_000, Helvetica, sans-serif');
		}
	}
}

function copyHTML(id) {
	copyToClipboard(document.getElementById(id).outerHTML.replaceAll('"', "'"));
}

function copyToClipboard(text) {
	var dummy = document.createElement('textarea');
	document.body.appendChild(dummy);
	dummy.value = text;
	dummy.select();
	document.execCommand('copy');
	document.body.removeChild(dummy);
}

var copySuccessExpiration = 0;

function copyCode() {
	if (portrait) {

		if (document.getElementById('copy-holder').style.display != 'none') {
			document.getElementById('copy-holder').style.display = 'none';
			return;
		}
		hidePopups();
		document.getElementById('copy-holder').style.display = 'flex';
		document.getElementById('copy-code').innerHTML = settingsToCode();

	} else {
		hidePopups();

		copyToClipboard(settingsToCode());
		document.getElementById('copy-icon').style.display = 'none';
		document.getElementById('copy-success').style.display = 'flex';
		copySuccessExpiration = Date.now() + 1000;
	}
}

function pasteShow() {

	if (document.getElementById('paste-holder').style.display != 'none') {
		document.getElementById('paste-holder').style.display = 'none';
		return;
	}
	hidePopups();

	document.getElementById('paste-hide').style.display = 'none';
	document.getElementById('paste-holder').style.display = 'flex';
	document.getElementById('paste-code').value = '';
	document.getElementById('paste-note').style.color = 'var(--color-mono)';
	document.getElementById('paste-note').innerHTML = 'enter a code to change the settings';
}

function pasteEnter() {
	let successfulPaste = codeToSettings(document.getElementById('paste-code').value);
	if (successfulPaste) {
		document.getElementById('paste-holder').style.display = 'none';
	} else {
		document.getElementById('paste-hide').style.display = 'block';
		document.getElementById('paste-note').style.color = 'var(--color-alert)';
		document.getElementById('paste-note').innerHTML = 'invalid code';
	}

}

function nextFavorite() {
	hidePopups();

	favoriteIndex = (favoriteIndex + 1) % favorites.length;
	codeToSettings(favorites[favoriteIndex][0]);

	if (favorites[favoriteIndex][1].length > 1) {
		document.getElementById('submitted-note').style.display = 'inline';
		document.getElementById('submitted-note').innerHTML = 'submitted by ' + favorites[favoriteIndex][1];
	} else {
		document.getElementById('submitted-note').style.display = 'none';
	}
}

function dummy() {}

var controllers = {};
class Controller {
	constructor(id, list, index, textColor = 'front') {
		this.id = id;
		this.list = list;
		this.singular = false;
		this.disabled = false;
		this.object = document.getElementById(id);
		this.color = textColor;
		this.object.children[1].classList.add('svg-'+this.color);
		this.giveIndex(index, true);
	}

	giveIndex(indexValue, skipCustom = false, disabledOverride = false) {
		if (this.disabled && !disabledOverride){
			return;
		}
		this.index = indexValue;
		this.object.children[1].innerHTML = this.list[indexValue];
		if (typeof arrowHandlerCustom === 'function' && !skipCustom) {
			arrowHandlerCustom(this);
		}

		if (this.singular != this.list.length <= 1){
			this.singular = !this.singular;
			for (let arrowSvg of this.object.getElementsByTagName('svg')){
				arrowSvg.style.display = this.singular?'none':'block';
			}
		}
	}

	giveList(newList,newIndex = -1, skipCustom = false) {
		this.list = newList;

		if (newIndex == -1){
			newIndex = min(this.index, this.list.length-1);
		}
		this.giveIndex(newIndex,skipCustom);
	}

	setColor(textColor){
		if (this.disabled){
			this.color = textColor;
		} else {
			this.object.children[1].classList.toggle('svg-'+this.color);
			this.color = textColor;
			this.object.children[1].classList.toggle('svg-'+this.color);
		}
	}

	randomize() {
		this.giveIndex(floor(random(this.list.length)),false,true);
	}

	value() {
		return this.list[this.index];
	}

	disable(){
		if (this.disabled){
			return;
		}
		this.disabled = true;
		this.toggleArrows();
		this.object.children[1].classList.toggle('svg-'+this.color);
		this.object.children[1].classList.toggle('svg-backlight');
	}
	
	enable(){
		if (!this.disabled){
			return;
		}
		this.object.children[1].classList.toggle('svg-'+this.color);
		this.object.children[1].classList.toggle('svg-backlight');
		this.disabled = false;
		this.toggleArrows();
	}

	toggleArrows(){
		this.object.children[0].disabled = this.disabled;
		this.object.children[2].disabled = this.disabled;
		this.object.children[0].children[0].classList.toggle('svg-front');
		this.object.children[0].children[0].classList.toggle('svg-backlight');
		this.object.children[2].children[0].classList.toggle('svg-front');
		this.object.children[2].children[0].classList.toggle('svg-backlight');
	}
}

function arrowClicked(controllerKey, delta) {
	let ac = controllers[controllerKey];
	ac.giveIndex(modulo(ac.index + delta, ac.list.length));
}


/*####################################

              Controls

####################################*/


var origin, scalar, defaultOrigin, defaultScalar
var yFlip = -1;

function pixelToPrincipal(pixels){
	// principal = (pixel - origin)/scalar
	if (isHex){
		return p5.Vector.sub(pixels,origin).mult(1,yFlip).div(scalar*0.5,scalar*0.866);
	} else {
		return p5.Vector.sub(pixels,origin).mult(1,yFlip).div(scalar);
	}
}

function principalToPixel(principal){
	if (isHex){
		return p5.Vector.mult(principal,[scalar*0.5,scalar*0.866]).mult(1,yFlip).add(origin);
	} else {
		return p5.Vector.mult(principal,scalar).mult(1,yFlip).add(origin);
	}	
}

var principalPos, principalDist; // these track the values that should remain fixed by movement
function updateTouchInfo(){
	if (touches.length == 2){
		principalDist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
	} 
	if (touches.length <= 2){
		principalPos = pixelToPrincipal(focusPoint());
	}
}


function focusPoint(){
	if (touches.length == 0){ // Desktop - mouse is focus
		return createVector(mouseX,mouseY);
		
	} else if (touches.length == 1){ // Mobile - location of single touch is focus
		return createVector(touches[0].x,touches[0].y);
		
	} else if (touches.length == 2){ // Mobile - midpoint between two touches is focus
		return createVector((touches[0].x+touches[1].x)/2,(touches[0].y+touches[1].y)/2);
	}
}


/*####################################

              Misc

####################################*/


function morningRoutine(paletteName='electric'){

	canvas = createCanvas(innerWidth, innerHeight);
	smooth();
	frameRate(30);
	if (typeof setupLayout == 'function'){setupLayout()};

	rectMode(CENTER);
	strokeJoin(ROUND);
	ellipseMode(CENTER);
	noStroke();
	
	changePalette(paletteName);
	
	let currentUrl = window.location.href; 
	let urlPaletteIndex = currentUrl.indexOf('?palette:');
	if (urlPaletteIndex > -1){
		userPalette(currentUrl.substring(urlPaletteIndex+9),true);
	}
}




var superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
var subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

function superscriptInt(superVal, isExponent = true) {
	if (isExponent && superVal < 2) {
		return '';
	}
	if (superVal == 0) {
		return superscripts[0];
	}

	let superString = '';
	while (superVal > 0) {
		superString = superscripts[superVal % 10] + superString;
		superVal = int(superVal / 10);
	}
	return superString;
}


function textLimited(textValue, x, y, s, maxSize) {

	textSize(s);
	let tw = textWidth(textValue);
	if (tw > maxSize) {
		textSize(s * maxSize / tw);
	}

	text(textValue, x, y);
}

function textInBox(textValue, x, y, s, textColor, backColor, borderRadius = 0) {
	noStroke();
	textSize(s);
	fill(backColor);
	rect(x, y, textWidth(textValue) + s * 0.3, s * 1.3,borderRadius);

	fill(textColor);
	text(textValue, x, y);
}

function text2d(values, unit) {

	if (values[0] == 0) {
		if (values[1] == 0) {
			return '0';
		} else if (values[1] == 1) {
			return unit;
		} else if (values[1] == -1) {
			return '-' + unit;
		} else {
			return str(values[1]) + unit;
		}
	}

	let textOutput = str(values[0]);

	if (values[1] == 1) {
		return textOutput + ' + ' + unit;
	} else if (values[1] == -1) {
		return textOutput + ' - ' + unit;
	} else if (values[1] != 0) {
		if (values[1] >= 0) {
			return textOutput + ' + ' + str(values[1]) + unit;
		} else {
			return textOutput + ' - ' + str(abs(values[1])) + unit;
		}
	} else {
		return textOutput;
	}
}

function pre0(timeValue, returnLength = 2) {
	let rawString = '0' + str(timeValue);
	return rawString.substring(rawString.length - returnLength);
}

function nowString() {
	return pre0(year()) + pre0(month()) + pre0(day()) + '_' + pre0(hour()) + pre0(minute()) + pre0(second());
}

function drawTri(x, y, d) {
	triangle(x + d, y, x - d, y + d * 1.2, x - d, y - d * 1.2);
}

function drawVertTri(x, y, d) {
	triangle(x + d * 1.2, y - d, x * 1.2 - d, y - d, x, y + d);
}

var isHex = false;
class Grid {
	constructor(xMin, yMin, xMax, yMax, sizer, adjust = false, labelColor = 'mono', gridColor = 'backlight') {
		this.gridMin = createVector(xMin, yMin);
		this.gridMax = createVector(xMax, yMax);
		this.wid = createVector(abs(xMax - xMin), abs(yMax - yMin));
		this.mid = createVector(0.5 * (xMax + xMin), 0.5 * (yMax + yMin));
		this.visible = true;
		this.sizer = sizer;
		this.adjust = adjust;
		this.labelColor = labelColor;
		this.gridColor = gridColor;
	}

	drawGrid() {
		if (!this.visible) {
			return;
		}
		rectMode(CENTER);

		this.minPrin = pixelToPrincipal(this.gridMin.copy());
		this.maxPrin = pixelToPrincipal(this.gridMax.copy());
		let scaleValue = min((this.maxPrin.x - this.minPrin.x) / 5, (this.maxPrin.y - this.minPrin.y) / 8);
		this.scaleLog = floor(log(scaleValue) / log(10))
		let scaleMag = 10 ** this.scaleLog;
		let scaleAdjusted = scaleValue / scaleMag;
		if (scaleAdjusted > 3.5) {
			scaleValue = scaleMag * 10;
			this.scaleLog += 1;
		} else if (scaleAdjusted > 2) {
			scaleValue = scaleMag * 5;
		} else {
			scaleValue = scaleMag * 2;
		}
		let scaleVec = createVector(scaleValue, scaleValue * (isHex ? 0.866 : 1));
		this.scaleLog = max(0, -this.scaleLog);

		onlyStroke(palette[this.gridColor], this.sizer * 0.16 * (this.adjust ? scalar ** 0.5 : 1));

		let xValue = floor(this.maxPrin.x / scaleVec.x * (isHex ? 0.5 : 1)) * scaleVec.x;
		let xLine = xValue * scalar + origin.x;
		let yValue = floor(this.maxPrin.y / (scaleVec.y) * (isHex ? 0.866 : 1)) * scaleVec.y;
		let yLine = -yValue * scalar + origin.y;

		let pixels = p5.Vector.mult(scaleVec, scalar);

		let xExtend = 0;
		if (isHex) {
			xLine += modulo((this.wid.y / 2 - origin.y) * 0.5774, pixels.x) + pixels.x;
			xExtend = -pixels.y * 1.1547;
			xValue -= round((this.wid.y / 2 - origin.y) * 0.5774 / pixels.x - 1) * scaleVec.x;
		}

		this.labels = [
			[],
			[]
		];

		while (xLine > this.gridMin.x + xExtend) {
			this.drawLine(xLine, this.mid.y, 0, this.wid.y);
			xLine -= pixels.x;
			this.labels[0].push(xValue);
			xValue -= scaleVec.x;
		}

		while (yLine < this.gridMin.y) {
			this.drawLine(this.mid.x, yLine, this.wid.x, 0);
			yLine += pixels.y;
			this.labels[1].push(yValue);
			yValue -= scaleVec.y;
		}

	}

	drawLine(xCenter, yCenter, xWid, yWid) {
		if (isHex && xWid == 0) {
			line(xCenter - yWid * 0.5774, yCenter - yWid, xCenter + yWid * 0.5774, yCenter + yWid);
		} else {
			rect(xCenter, yCenter, xWid, yWid);
		}
	}

	drawLabels() {
		if (!this.visible) {
			return
		}
		
		textAlign(CENTER, CENTER);

		let textSizeValue = this.sizer * (this.adjust ? 1.6 * scalar ** 0.3 : 1);
		textSize(textSizeValue);
		stroke(palette.back);
		strokeWeight(textSizeValue * 0.2);
		fill(palette[this.labelColor]);

		for (let xLab of this.labels[0]) {
			var xText = round(xLab, this.scaleLog);

			let xPix = principalToPixel(createVector(xLab * (isHex ? 2 : 1), 0));
			let variances = [this.gridMax.y + textSizeValue * 1.5 - xPix.y, this.gridMin.y - textSizeValue * 1.5 - xPix.y];

			if (variances[0] <= 0 && variances[1] >= 0) {
				text(xText, xPix.x, xPix.y);
			} else if (variances[0] > 0 && isHex) {
				text(xText, xPix.x + variances[0] * 0.5 / 0.866, xPix.y + variances[0]);
			} else if (isHex) {
				text(xText, xPix.x + variances[1] * 0.5 / 0.866, xPix.y + variances[1]);
			} else {
				text(xText, xPix.x, xPix.y + constrain(0, variances[0], variances[1]));
			}

		}

		for (let yLab of this.labels[1]) {

			if (yLab == 0) {
				continue;
			}

			let yText, yPix;
			if (isHex) {
				yText = text2d([0, round(yLab / 0.866, this.scaleLog)], verticalUnit);
				yPix = principalToPixel(createVector(-yLab / 0.866, yLab / 0.866));
			} else {
				yText = text2d([0, round(yLab, this.scaleLog)], verticalUnit);
				yPix = principalToPixel(createVector(0, yLab));
			}

			yPix.x = constrain(yPix.x, this.gridMin.x + textWidth(yText) * 0.5 + textSizeValue, this.gridMax.x - textWidth(yText) * 0.5 - textSizeValue);
			text(yText, yPix.x, yPix.y);
		}

	}

}

/*####################################

              Math

####################################*/

function scaleC(c, a) {
	return [c * a[0], c * a[1]];
}

function addC(a, b) {
	return [a[0] + b[0], a[1] + b[1]];
}

function subC(a, b) {
	return [a[0] - b[0], a[1] - b[1]];
}

function multC(a, b) {
	return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}

function divC(a, b) {
	return multC(a, invC(b));
}

function invC(a) {
	let aNorm = normC(a);
	if (aNorm == 0) {
		return (100000000, 100000000);
	}
	return [a[0] / aNorm, -a[1] / aNorm];
}

function normC(a) {
	return a[0] ** 2 + a[1] ** 2;
}

function squareC(a) {
	return [a[0] ** 2 - a[1] ** 2, 2 * a[0] * a[1]];
}

function gcd(a, b) {

	if (a < b) {
		c = a;
		a = b;
		b = c;
	}

	r = a % b;
	while (r != 0) {
		a = b;
		b = r;
		r = a % b;
	}
	return b;
}

function modulo(a, b) {
	return (a % b + b) % b;
}

function sign(signInput) {
	if (signInput == 0) {
		return 0;
	} else if (signInput < 0) {
		return -1;
	} else {
		return 1;
	}
}

function vectorToArray(vectorInput, hasZ = false) {
	if (hasZ) {
		return [vectorInput.x, vectorInput.y, vectorInput.z];
	}
	return [vectorInput.x, vectorInput.y];
}

function arrayToVector(arrayInput) {
	return createVector(...arrayInput);
}

function quadratic(a, b, c) {
	let discrim = b ** 2 - 4 * a * c;
	if (discrim < 0) {
		return [];
	} else {
		let discRoot = discrim ** 0.5;
		return [(-b + discRoot) / (2 * a) * sign(a), (-b - discRoot) / (2 * a) * sign(a)];
	}
}

var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
var primeLimit = 10000;

function addPrime() {
	let testPrime = primes[primes.length - 1];

	while (testPrime < primeLimit) {
		testPrime += 2;
		let testIsPrime = true;
		let maxFactor = testPrime ** 0.5 + 0.01;
		for (let testFactor of primes) {
			if (testFactor > maxFactor) {
				break;
			}
			if (testPrime % testFactor == 0) {
				testIsPrime = false;
				break;
			}
		}

		if (testIsPrime) {
			primes.push(testPrime);
			return;
		}
	}
}