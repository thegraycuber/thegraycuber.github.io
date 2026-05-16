

function createPaletteDisplays(paletteList){

	let paletteListKeys = Object.keys(paletteList);
	for (let plk of paletteListKeys){

		let p = paletteList[plk];
		let paletteDisplay = document.createElement('div');

		let outerString = '<div class="container palette-display" style="background-color: ' + colorToHex(p.back) + '; color: ' + colorToHex(p.front) + '" >';
		
		for (let k of paletteKeys){
			if (k == 'back'){
				continue;
			}

			outerString += '<p class="palette-color" style="background-color: ' + colorToHex(p[k]) + '; color: ' + colorToHex(p.back) + '" >' + k + '</p>';
		}

		outerString += '</div>';
			
		document.getElementById('palette-holder').appendChild(paletteDisplay);
		paletteDisplay.outerHTML = outerString;
	}
	
}

function paletteToCode(paletteInput){
	let paletteCode = '';
	for (let k of paletteKeys){
		paletteCode += paletteInput[k] +'-';
	}

	return paletteCode.substring(0,paletteCode.length-1);
}

function setup(){
	createPaletteDisplays(palettes);
	
	changePalette('sunset');

	let settingString = 'M '

	for (let i = 1; i < 25; i++){
		let dist = ((int((i+1)/2)%2)==1)? 40 : 28;
		settingString += str(round(50+dist*cos((i+0.5)*TWO_PI/24),2));
		settingString += ' ' + str(round(50+dist*sin((i+0.5)*TWO_PI/24),2)) + ' L ';
	}
	console.log(settingString);
	
	// createPaletteDisplays(customPalettes);

	// console.log(paletteToCode(customPalettes.mirage));

	// for (let a = 0.4; a < 1.06; a+=0.2){
	// console.log(colorToHex(lerpColor(palette.mono,palette.front,a)));
	// }

	// console.log(colorToHex(palette.backlight));
	// console.log(colorToHex(palette.backdark));
	// console.log(colorToHex(palette.gray));
}
