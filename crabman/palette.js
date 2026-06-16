

var palette;
var paletteIndex = 0;
var paletteNames = ['forest','sunset','dark','paper','pastel','electric'];
var paletteKeys = ['front','back','mono','vivid','alert'];
// vivid is my goto wordle starting word btw ^

function changePalette(scheme = ''){

	let root = document.documentElement;
	
	if (scheme.length > 0){
		paletteIndex = paletteNames.indexOf(scheme);
	} else {
		paletteIndex = (paletteIndex+1)%paletteNames.length;
	}
	palette = palettes[paletteNames[paletteIndex]];

	for (let k of paletteKeys){
		palette[k] = color(palette[k]);
		root.style.setProperty('--color-' + k, palette[k]);
	}

	palette.dark = lightness(palette.back) < lightness(palette.mono);

	palette.half = lerpColor(color(palette.back),color(palette.mono),0.6);
	palette.backdark = lerpColor(palette.back,color(palette.dark?'#000':palette.mono),palette.dark?0.2:0.1);
	palette.backlight = lerpColor(palette.back,color(palette.dark?palette.mono:'#fff'),palette.dark?0.1:0.2);
	palette.gray = lerpColor(palette.mono,color(palette.dark?'#aaa':'#888'),0.8);
	
	root.style.setProperty('--color-half', palette.half);
	root.style.setProperty('--color-backdark', palette.backdark);
	root.style.setProperty('--color-backlight', palette.backlight);
	root.style.setProperty('--color-gray', palette.gray);

	palette.accent = [palette.vivid,
		palette.mono,
		palette.alert
	];

	if (typeof corePaletteCustom === 'function'){
		corePaletteCustom();
	}
}


function unpackPalette(pName){

	let uPalette = palettes[pName];

	let pCode = uPalette.code.split('-');
	for (let k = 0; k < paletteKeys.length; k++){
		let pKey = paletteKeys[k];
		uPalette[pKey] = color(pCode[k]);
	}
	paletteNames.push(pName);

}

var paletteSuffix = '';
function userPalette(paletteString,initial=false){
	let customColors = paletteString.split('-');
	console.log(customColors);

	if (Object.keys(palettes).includes(customColors[0])){
		if (!paletteNames.includes(customColors[0])){
			unpackPalette(customColors[0]);
		}
		changePalette(customColors[0]);
		setPaletteURL(customColors[0],initial);
		defaultPalette = false;
		return;

	} else if (customColors.length < 5){
		return;
	}

	palettes.custom = {};
	for (let k = 0; k < 5; k++){
		palettes.custom[paletteKeys[k]] = customColors[k];
	}
	if (!(paletteNames.includes('custom'))){
		paletteNames.push('custom');
	}

	changePalette('custom');
	setPaletteURL(paletteToCode(),initial);
	defaultPalette = false;
}

function paletteToCode(){
	let paletteString = '';
	for (let k of paletteKeys){
		paletteString += colorToHex(palette[k]) + '-';
	}
	return paletteString.substring(0,paletteString.length-1);
}

function setPaletteURL(paletteCode,initial){
	paletteSuffix = '?palette:' + paletteCode;

	let thisHref = window.location.href.substring(0,20);
	for (let a of document.getElementsByTagName('a')){
		if (a.href.substring(0,20) == thisHref){
			a.href = updateRefPalette(a.href);
		}
	}
	if (!initial){
		window.history.replaceState(null,'',updateRefPalette(window.location.href));
	
	}
}

function updateRefPalette(urlValue){

	let huhIndex = urlValue.indexOf('?');
	return ((huhIndex==-1) ? urlValue : urlValue.substring(0,huhIndex)) + paletteSuffix;
}

var palettes = {
	electric:{
		front: '#bbdbf3',
		back: '#110a5d',
		mono: '#23d2e8',
		vivid: '#d7f75b',
		alert: '#e185dc'
	},
	sunset:{
		front: '#dcd8f1',
		back: '#2b1752',
		mono: '#bc7ff5',
		vivid: '#f2c76f',
		alert: '#e5686e'
	},
	forest:{
		front: '#d6ddcb',
		back: '#063a2a',
		mono: '#3fbd75',
		vivid: '#d8b801',
		alert: '#ee8060'
	},
	dark:{
		front: '#c8caf4',
		back: '#20213f',
		mono: '#768FFF',//'#8498ef',
		vivid: '#2cda9d',
		alert: '#f168a0'
	},
	pastel:{
		front: '#5b2a7d',
		back: '#dfc8f1',
		mono: '#9a63d9',
		vivid: '#5184d2',
		alert: '#c353a0'
	},
	paper:{
		front: '#663F00',
		back: '#e9d8c6',
		mono: '#bf7853',
		vivid: '#ad588b',
		alert: '#729C0E'
	},

	contrast:{
		code: "#FFFFFF-#000000-#00FFFF-#FFFF00-#FF00FF"
	},

}




function onlyStroke(inputColor, inputWeight){
	noFill();
	stroke(inputColor);
	strokeWeight(inputWeight);
}

function onlyFill(inputColor){
	noStroke();
	fill(inputColor);
}

function copyColor(colorToCopy){
	return color(red(colorToCopy),green(colorToCopy),blue(colorToCopy));
}

function colorToHex(colorToConvert){
	return '#' + hex(int(red(colorToConvert))).substring(6) + hex(int(green(colorToConvert))).substring(6) + hex(int(blue(colorToConvert))).substring(6);
}

function HSVtoRGB(hue,sat,val){
	let chroma = val*sat;
	let hueRegion = modulo(hue,360)/60;
	let secondary = chroma * (1-abs(hueRegion%2-1));

	let rawRGB;
	if (hueRegion < 1){
		rawRGB = [chroma, secondary, 0];
	} else if (hueRegion < 2){
		rawRGB = [secondary, chroma, 0];
	} else if (hueRegion < 3){
		rawRGB = [0, chroma, secondary];
	} else if (hueRegion < 4){
		rawRGB = [0, secondary, chroma];
	} else if (hueRegion < 5){
		rawRGB = [secondary, 0, chroma];
	} else {
		rawRGB = [chroma, 0, secondary];
	}

	let adjust = val - chroma;
	return [
		round((rawRGB[0]+adjust)*255),
		round((rawRGB[1]+adjust)*255),
		round((rawRGB[2]+adjust)*255)
	];
}
		
/*
OTHER PALETTES (SPINNING TOY SECRET):

#FFFFFF-#000000-#00FFFF-#FFFF00-#FF00FF // contrast
#000000-#FFFFFF-#0000FF-#00CC00-#CC0000 // tsartnoc
#F1BCD8-#61074B-#E63F8B-#CD6BFD-#FFF055 // plum
#18A50F-#AFE0F0-#355BD3-#D6A307-#E2446E // toy
#C7F0D1-#0C5A4E-#1AFDAF-#B489FF-#FD88BE // sea

*/