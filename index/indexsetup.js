var px,px2,ticker;
var logo_info = [['Gray',0.25,5,1,1.1,4.6,0.95],
								 ['The',0.15,3,0,0.9,2.92,0.95],
								 ['Cuber',0.35,3,2,0.9,6.95,0.99]];
var logo_rect;// = [[4.5,1.6,9,3.2,0,0,0.6,0.6]];
								 //[1.2,0.3,2.2,1.6,0,0.2,0.2,0.2]];
var palette = [];
var pages = [];
var p = 0;
var color_list = ['Current','Sunset','Electric','Forest'];
var intro_len = 16;
var primes = [2,3];
var primeswf = [[2,[]]];
var main_list = [];
var old_index = 3;
var sunset = [];
var sunlen = 120;
var ticker_add = 0.15;
var quad_colors;
var prod = true;
var imgs = [];
var buttons = [];
var plaque;

function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	buttons.push(loadImage('about/ColorYouTube.png'));
	buttons.push(loadImage('about/ColorGithub.png'));
}


function setup() {
	ticker = -intro_len;
	createCanvas(window.innerWidth, window.innerHeight, WEBGL);
	px = min(width/11,height/16);
	plaque = min(width,px*9);
	px2 = px**2;
	frameRate(30);
	imageMode(CENTER);
	rectMode(CENTER);
	
	for (var scheme of color_list){
		palette.push(new Palette(scheme));
	}
	palette[0].refresh(3,3);
	
	logo_rect = [[5.5*px,px,11*px,2*px,0,0,0.6*px,0.6*px],
							[width-5.5*px,height-1.4*px,11*px,2.8*px,0.6*px,0.6*px,0,0]];
	
	imgs.push(new Icon([window.innerWidth-px*7.5,window.innerHeight-px*0.8],px*1,0,'https://www.youtube.com/@TheGrayCuber','_blank'));
	imgs.push(new Icon([window.innerWidth-px*3.5,window.innerHeight-px*0.8],px*1,1,'https://github.com/thegraycuber','_blank'));
	update_imgs();
	
	textFont(atkinsonRegular);
	quad_colors = [color(160,132,220),color(242,199,111),color(229,104,110)];
	
	var links;
	if (prod){
		imgs.push(new Icon([window.innerWidth-px*5.5,window.innerHeight-px*0.8],px*0.36,2,'https://thegraycuber.github.io/about.html','_self'));
		links = ['https://thegraycuber.github.io/groupsofunits.html', //groups of units
								'https://thegraycuber.github.io/quadratic.html', //complex primes
								'https://thegraycuber.github.io/grapher.html', //complex grapher
								'https://thegraycuber.github.io/quadratic.html', //quadratic primes
								'https://thegraycuber.github.io/cubecalculator.html' //cube calculator
								];	
	} else {
		imgs.push(new Icon([window.innerWidth-px*5.5,window.innerHeight-px*0.8],px*0.36,2,'https://openprocessing.org/sketch/2499975','_self'));
		links = ['https://openprocessing.org/sketch/2434673', //groups of units
								'https://openprocessing.org/sketch/2287058', //complex primes
								'https://openprocessing.org/sketch/2350648', //complex grapher
								'https://openprocessing.org/sketch/2297125', //quadratic primes
								'https://openprocessing.org/sketch/2506513' //rubik's cube calculator
								];
	}
	
	pages.push(new Page("Rubik's Cube Calculator",'Forest',links[4]));
	pages.push(new Page('Complex Primes','Sunset',links[1]));
	pages.push(new Page('Groups of Units','Forest',links[0]));
	pages.push(new Page('Complex Grapher','Electric',links[2]));
	//pages.push(new Page('Quadratic Primes','Sunset',links[3]));
	
	var k;
	for (var l = 0; l < logo_info.length; l++){
		for (k = 4; k < logo_info[l].length; k++){
			logo_info[l][k] *= px;
		}
	}
	
	/*
	for (l = 0; l < logo_rect.length; l++){
		for (k = 0; k < logo_rect[l].length; k++){
			logo_rect[l][k] *= px;
		}
	}
	*/
	
	calculatorPrep();
}