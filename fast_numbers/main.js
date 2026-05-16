
var existingNumber = -1;

var offset = 0;
var nonloaded = true;
var hideCanvas = false;
var unprocessed = true;

function draw(){
	
	if (hideCanvas){
		return;
	}

	if (nameData.getRowCount() == 0){
		return;
	} else if (nonloaded){
		nonloaded = false;
		inputBox.value = '';
		document.getElementById('input-alert').style.display = 'inline';
	}
	
	if (inputBox.value == "0" && offset > 0.4){
		offset = 0.4;
		scrolling = false;
		panning = false;
		blockScroll = Date.now();
	} else if (inputBox.value == "1000000" && offset < -0.4){
		offset = -0.4;
		scrolling = false;
		panning = false;
		blockScroll = Date.now();
	}
	
	if (abs(offset) > 0.5){
		giveValue(constrain(existingNumber - round(offset),0,1000000));
		offset -= round(offset);
	} else {
		let testNumber = parseInt(inputBox.value);
		giveValue(testNumber);
	}

	
	if (scrolling && Date.now() - lastScroll > 100){
		scrolling = false;
	}
	if (panning && Date.now() - lastPan > 300){
		panning = false;
	}
	
	if (!panning && !scrolling){
		if (offset != 0){
			offset -= min(abs(offset),0.05)*sign(offset);
		}
		if (offset == 0){
			inputBox.style.borderColor = 'var(--color-vivid)';		
		}
	}
	

	if (inputBox.value != "" || unprocessed){

		for (let n = 0; n < 7; n++){
			let nHolder = document.getElementById('number-holder-'+str(n));

			nVal = (n-3+offset);
			nAdjust = (cos(PI*nVal/4)+1)/2;
			nHolder.style.opacity = nAdjust**2;

			nY = 40+14*(0.8+nAdjust*0.4)*nVal;
			nHolder.style.top = str(nY) + 'vh';
		}
		unprocessed = false;
	} 
	
}

var inputBox = {
	value: ''
};
function setup() {

	morningRoutine('dark');


	if (window.location.href.includes("fast_numbers/nl")){
		dict = 'nl';
		setVersion('original');
	} else {
		popupList = ['info-holder','info-hide'];
		popdownList = ['info-show','main-holder'];
	}
	
	if (window.location.href.includes("mode=ance")){
		document.getElementById('version-select').value = 'ance';
		setVersion('ance');
	} else if (window.location.href.includes("mode=serious")){
		document.getElementById('version-select').value = 'serious';
		setVersion('serious');
	} else {
		setVersion('original');
	}

	textFont(mainBold);
	textAlign(CENTER,CENTER);
	regularFontTags = ['p', 'li', 'textarea','h3'];
	setupFonts();
	
	inputBox = document.getElementById('number-input');
	inputBox.style.setProperty('font-family', 'AshkinsonBold_prod, Helvetica, sans-serif');
	document.getElementById('version-select').style.setProperty('font-family', 'AshkinsonBold_prod, Helvetica, sans-serif');
	
	scalar = 1;
	yFlip = 1;
	origin = createVector(0,0);
}


var mainBold, regularFont, nameData;
function preload(){
	mainBold = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
}

