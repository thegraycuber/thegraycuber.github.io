
var fastest_info = [
	["6336","nineteen thousand eight\nthirds","19008 / 3"],
	["4802","fourteen squared\nsquared eighths","14 ² ² / 8"],
	["4272","six thousand\nminus twelve cubed","6000 - 12 ³"],
	["3250","thirteen thousand\nfourths","13000 / 4"],
	["2973","three thousand\nminus three cubed","3000 - 3 ³"],
	["2451","seventy squared halves\nplus one","70 ² / 2 + 1"],
	["1753","twelve cubed\nplus five squared","12 ³ + 5 ²"],
	["1536","three times\neight cubed","3 × 8 ³"],
	["1128","twelve times\nninety-four","12 × 94"],
	["775","five squared\ntimes thirty-one","5 ² × 31"],
];


var fastest_index;

function fastestPrep(){
	fastest_index = floor(random()*fastest_info.length);
}

function fastestDraw(){
	textSize(unit*0.3);
	fill(palette[0].bright);
	text(fastest_info[fastest_index][0],0,-unit*0.6);
	
	textSize(unit*0.1);
	fill(palette[0].medium);
	text("minimum syllables:",0,-unit*0.2);
	
	textSize(unit*0.16);
	fill(palette[0].front);
	text(fastest_info[fastest_index][1],0,unit*0.1);
	fill(palette[0].mono);
	text(fastest_info[fastest_index][2],0,unit*0.5);
}

