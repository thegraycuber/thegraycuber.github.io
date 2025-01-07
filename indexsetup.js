var px,px2,ticker;
var logo_info = [['Gray',0.25,5,1,1,0.15,-0.1],['The',0.15,3,0,0.7,0.25,-0.8],['Cuber',0.35,3,2,0.7,0.25,0.72]];
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

function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	buttons.push(loadImage('ColorYouTube.png'));
	buttons.push(loadImage('ColorGithub.png'));
}


function setup() {
	ticker = -intro_len;
	createCanvas(windowWidth, windowHeight);
	px = min(width/16,height/16);
	px2 = px**2;
	frameRate(30);
	imageMode(CENTER);
	rectMode(CENTER);
	
	for (var scheme of color_list){
		palette.push(new Palette(scheme));
	}
	palette[0].refresh(3,3);
	
	imgs.push(new Icon([windowWidth/2-px*2.4,windowHeight-px*2],px*1.2,0,'https://www.youtube.com/@TheGrayCuber','_blank'));
	imgs.push(new Icon([windowWidth/2+px*2.4,windowHeight-px*2],px*1.2,1,'https://github.com/thegraycuber','_blank'));
	//imgs.push(new Icon([windowWidth/2,windowHeight-px*2],px*1.5,2,'https://thegraycuber.github.io/about.html','_self'));
	imgs.push(new Icon([windowWidth/2,windowHeight-px*2],px*0.5,2,'https://openprocessing.org/sketch/2499975','_self'));
	update_imgs();
	
	textFont(atkinsonRegular);
	quad_colors = [color(160,132,220),color(242,199,111),color(229,104,110)];
	
	var links;
	if (prod){
		links = ['https://thegraycuber.github.io/groupsofunits.html', //groups of units
								'https://thegraycuber.github.io/gaussian.html', //complex primes
								'https://thegraycuber.github.io/grapher.html', //complex grapher
								'https://thegraycuber.github.io/quadratic.html' //quadratic primes
								];	
	} else {
		links = ['https://openprocessing.org/sketch/2434673', //groups of units
								'https://openprocessing.org/sketch/2287058', //complex primes
								'https://openprocessing.org/sketch/2350648', //complex grapher
								'https://openprocessing.org/sketch/2297125' //quadratic primes
								];
	}
	
	pages.push(new Page('Groups of Units','Forest',links[0]));
	pages.push(new Page('Complex Primes','Sunset',links[1]));
	pages.push(new Page('Complex Grapher','Electric',links[2]));
	pages.push(new Page('Quadratic Primes','Sunset',links[3]));

}