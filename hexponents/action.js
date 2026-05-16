


function arrowHandlerCustom(clickedControl){
	hidePopups();
	
	if (clickedControl.id == 'arrow-ring'){
		crowConstant = crowList[clickedControl.index];
		generateHexPrimes();
		
	} else if (clickedControl.id == 'arrow-modulus'){
		modulus = [primeNorms[clickedControl.index][0],primeNorms[clickedControl.index][1]];
		processMod();
		generateOrbitOptions(primeNorms[clickedControl.index][2]);
		
	} else if (clickedControl.id == 'arrow-orbits'){
		orbits = orbitOptions[clickedControl.index];
		processOrbits();
		orbitColorSetup();
		
	}
}


function randomize(){
	hidePopups();
	
	controllers['arrow-ring'].randomize();
	controllers['arrow-modulus'].randomize();

	let newOrbits = floor((random()*(abs(hexNorm(modulus))**0.5))**2);
	let orbitIndex = orbitOptions.length-1;
	while (orbitOptions[orbitIndex] > newOrbits && orbitIndex > 0){
		orbitIndex--;
	}
	controllers['arrow-orbits'].giveIndex(orbitIndex);
}


var showBorders = true;
function toggleBorders(){
	hidePopups();
	
	document.getElementById('border-hex').classList.toggle('svg-front');
	document.getElementById('border-hex').classList.toggle('svg-half');
	showBorders = !showBorders;
	ticker = -PI;
}

var inverted = false;
function toggleInvert(){
	hidePopups();
	inverted = !inverted;
}


function iconChecks(){
	if (Date.now() > copySuccessExpiration){
		document.getElementById('copy-icon').style.display = 'flex';
		document.getElementById('copy-success').style.display = 'none';
		
	}
}


var produceList = ['raisins','apples','pears','oranges','craisins','grapes','peaches','apricots',
					'almonds','peanuts','cashews','cherries','strawberries','blueberries',
					'walnuts','plums','kiwis','pecans','hazelnuts','pistachios','blackberries',
					'currants','lemons','limes','grapefruits','raspberries'];

function settingsToCode(){
	return 'I woke up at 7:' + pre0(controllers['arrow-modulus'].index) + ' and ate ' + str(orbits) + ' ' + produceList[controllers['arrow-ring'].index];
}

function codeToSettings(inputCode){
	let codeWords = inputCode.split(' ');
	let unfound = true;
	while(unfound){
		if (codeWords.length < 8){
			return false;
		}
		if (codeWords[0] == 'woke'){
			unfound = false;
		} else {
			codeWords.splice(0,1);
		}
		
	}
	
	let crowIndex = produceList.indexOf(codeWords[7]);
	if (crowIndex == -1){
		return false;
	}
	controllers['arrow-ring'].giveIndex(crowIndex);

	let modIndex = int(codeWords[3].substring(2));
	if (isNaN(modIndex) || modIndex < 0 || modIndex >= controllers['arrow-modulus'].list.length){
		return false;
	}
	
	controllers['arrow-modulus'].giveIndex(modIndex);
	
	let orbitValue = int(codeWords[6]);
	for (let o = 0; o < orbitOptions.length; o++){
		if (orbitValue == orbitOptions[o]){
			controllers['arrow-orbits'].giveIndex(o);
			return true;
		}
	}
	return false;
}



function nextFavorite(){
	hidePopups();

	favoriteIndex = (favoriteIndex + 1)%favorites.length;
	codeToSettings(favorites[favoriteIndex][0]);
	
	if (favorites[favoriteIndex][1].length > 1){
		document.getElementById('submitted-note').style.display = 'inline';
		document.getElementById('submitted-note').innerHTML = 'submitted by ' + favorites[favoriteIndex][1];
	} else {
		document.getElementById('submitted-note').style.display = 'none';
	}
} 

var favoriteIndex = 0;
var favorites = [
	['I woke up at 7:06 and ate 4 raisins',''],//solid 4
	['I woke up at 7:12 and ate 1680 pecans','@tima_soft'],//bands
	['I woke up at 7:04 and ate 2 blueberries','@snadsnad-g7o'],//cool 2
	['I woke up at 7:04 and ate 48 peaches',''],//lines and diam's
	['I woke up at 7:19 and ate 165 peaches','@arcie.lastname'], //slow rift
	['I woke up at 7:04 and ate 2 walnuts','@WPawnToE4'], // tire tracks
	['I woke up at 7:41 and ate 58 raisins','@adamvagenknecht'], // hex arms
	['I woke up at 7:07 and ate 2 raisins',''],//smallest legs
	['I woke up at 7:14 and ate 368 cashews','@CrisjanAlt'],//ghost bands
	['I woke up at 7:53 and ate 166 raisins','@leandeflorin'],//triangle glitch
	['I woke up at 7:33 and ate 194 apples',''],//kerchoo
	['I woke up at 7:38 and ate 138 grapes','@Kaitte'],//bertzai canyon 
	['I woke up at 7:06 and ate 88 cherries',''],//holy lattice
	['I woke up at 7:04 and ate 5 raisins',''],//zul man
	['I woke up at 7:00 and ate 4 limes','@ismaelmartinez8639'],//triple lattice
	['I woke up at 7:14 and ate 736 raisins','@radical4033'],//triangle dishes
	['I woke up at 7:16 and ate 39 almonds','@BrainrottedMinor'],//boxes
	['I woke up at 7:09 and ate 2 raspberries',''],//squatties
	['I woke up at 7:08 and ate 168 hazelnuts','@memeing_donkey'], //diamond fields
	['I woke up at 7:12 and ate 2 blackberries','@leandeflorin'], //large 2
	['I woke up at 7:06 and ate 8 grapes',''],//laser
	['I woke up at 7:39 and ate 47 grapes','@DJruslan4ic'],//cool oval patterns
	['I woke up at 7:14 and ate 276 strawberries','@unapersonarandom2763'],//energy diamonds
	['I woke up at 7:19 and ate 2 raisins',''],//za
	['I woke up at 7:35 and ate 191 pears','@tylerdoesdumbstuff'], //gradients with lines
	['I woke up at 7:12 and ate 140 raisins',''],//layers
	['I woke up at 7:42 and ate 388 grapefruits','@quocphong6588'], //blades
	['I woke up at 7:13 and ate 552 blackberries','@T0mPlayes'], //bands over noise
	['I woke up at 7:09 and ate 3 kiwis','@MatteoDolcin-ye8xm'],//huge mosaic
	['I woke up at 7:31 and ate 2 raisins',''],//very wiggly dartboards
	['I woke up at 7:05 and ate 90 peanuts','@memeing_donkey'], //overlapping directions 
	['I woke up at 7:03 and ate 3 grapefruits','@manalu-asya'],//hedges
	['I woke up at 7:44 and ate 249 oranges','@snadsnad-g7o'], // wide bolts over stripes
	['I woke up at 7:35 and ate 2 raisins',''],//wiggly dartboards with moons
	['I woke up at 7:07 and ate 6 raisins','@beta_electron'], //pyramids
	['I woke up at 7:34 and ate 112 cashews','@noahniederklein8038'],//ants
	['I woke up at 7:37 and ate 221 apples',''],//cubes
	['I woke up at 7:39 and ate 55 raisins',''],//wiggler
	['I woke up at 7:23 and ate 90 pears','@Kaitte'],//sliced scales
	['I woke up at 7:06 and ate 2 cherries','@SpacePuff-xs8gw'],//super hex
	['I woke up at 7:14 and ate 552 cashews',''], //holy argyle
	['I woke up at 7:22 and ate 67 hazelnuts','@tHe_faNum-taXer'], //gradient bands
];

