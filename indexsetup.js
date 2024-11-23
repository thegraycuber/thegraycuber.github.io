var px,ticker;
var logo_info = [['Gray',0.25,5,1,1,0.15,-0.1],['The',0.15,3,0,0.7,0.25,-0.8],['Cuber',0.35,3,2,0.7,0.25,0.72]];
var palette = [];
var pages = [];
var p = 1;
var color_list = ['Current','Sunset','Electric'];
var intro_len = 16;
var primes = [2,3];
var main_list = [];
var old_index = 1;
var sunset = [];
var sunlen = 120;
var ticker_add = 0.15;
var quad_colors;

function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
}


function setup() {
	ticker = -intro_len;
	createCanvas(windowWidth, windowHeight);
	px = min(width/16,height/16);
	frameRate(30);
	rectMode(CENTER);
	
	for (var scheme of color_list){
		palette.push(new Palette(scheme));
	}
	palette[0].refresh(1,1);
	
	textFont(atkinsonRegular);
	quad_colors = [color(242,199,111),color(229,104,110),color(160,132,220)];
		
	pages.push(new Page('Complex Primes','Sunset','https://thegraycuber.github.io/gaussian.html'));
	pages.push(new Page('Quadratic Primes','Sunset','https://thegraycuber.github.io/quadratic.html'));
	pages.push(new Page('Complex Grapher','Electric','https://thegraycuber.github.io/grapher.html'));

	makeQuad(0,0);
	makeQuad(1,1);
	makeQuad(2,2);
}