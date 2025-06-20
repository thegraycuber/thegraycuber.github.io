var palette, icons, pages, logo_shapes, logo_words, asteroids, icon_a;
var logo_os, home_os, preview_os;
var px, px2, corner_ang;
var pg = -1;

var color_list = ['Current','Sunset','Electric','Forest'];
//var main_list = [];
var ticker = 0;
var prod = false;

function preload() {
	atkinsonBold = loadFont("media/Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("media/Atkinson-Hyperlegible-Regular-102.ttf");
}


function setup() {
	createCanvas(window.innerWidth, window.innerHeight, WEBGL);
	
	px = min(width/10,height/16);
	px2 = px**2;
	unit = px*5;
	scalar = px*5;
	origin = createVector(0,0);
	corner_ang = atan2(height,width);
	icon_ang = random()*TWO_PI;
	//plaque = min(width,px*9);
	
	frameRate(30);
	imageMode(CENTER);
	rectMode(CENTER);
	textFont(atkinsonBold);
	
	
	logo_os = new Offset(createVector(-px,-px));
	home_os = new Offset(createVector(0,0));
	preview_os = new Offset(createVector(0,0));
	
	
	logo_shapes = [];
	logo_shapes.push(new LogoItem('pent',[0,0],px,0.5,1.1));
	logo_shapes.push(new LogoItem('pentb',[0,0],px*1.2,0,0.6));
	logo_shapes.push(new LogoItem('tri1',[0,0],px,0,0.6));
	logo_shapes.push(new LogoItem('tri2',[0,0],px,1.1,1.6));
	
	logo_words = [];
	logo_words.push(new LogoItem('The',[px*0.5,-px*1.8],px*0.6,0,0.6));
	logo_words.push(new LogoItem('Gray',[px*0.4,-px*1.08],px,0.5,1.1));
	logo_words.push(new LogoItem('Cuber',[px*0.5,px*-0.3],px*0.6,1,1.6));
	
	
	

	pages = [];
	pages.push(new Page("Cursed Equations",'Electric','https://thegraycuber.github.io/cursedequations.html'));
	pages.push(new Page('Complex Primes','Sunset','https://thegraycuber.github.io/quadratic.html'));
	pages.push(new Page("Rubik's Cube Calculator",'Forest','https://thegraycuber.github.io/cubecalculator.html'));
	pages.push(new Page('Complex Grapher','Electric','https://thegraycuber.github.io/grapher.html'));
	pages.push(new Page('Groups of Units','Forest','https://thegraycuber.github.io/groupsofunits.html'));
	
	
	icon_rad = px*6.5;
	icons = [];
	icon_maker = [];
	let icon_paths = ['cursed','gaussian','cube','grapher','units'];
	for (let ic = 0; ic < pages.length; ic++){
		icon_maker.push([[0,0],px*1.2,loadImage("media/icon_"+icon_paths[ic]+".png"),pages[ic].title]);
	}
	
	icon_maker.push([[1.5*px,px],px*0.9,loadImage('media/icon_kofi.png'),'https://ko-fi.com/thegraycuber','_blank']);
	icon_maker.push([[0.1*px,px],px*0.9,loadImage('media/icon_openprocessing.png'),'https://openprocessing.org/user/448907','_blank']);
	icon_maker.push([[-1.3*px,px],px*0.9,loadImage('media/icon_youtube.png'),'https://www.youtube.com/@TheGrayCuber','_blank']);
	//icon_maker.push([[0.6*px,px],px*0.8,loadImage('icon_github1.png'),'https://github.com/thegraycuber','_blank']);
	
	for (let im of icon_maker){
		icons.push(new Icon(im[0], im[1], im[2], im[3], im[4]));
	}
	icon_a = 0;
	
	
	palette = [];		
	for (var scheme of color_list){
		palette.push(new Palette(scheme));
	}
	let rand_color = int(1+random()*3);
	color_trans = [rand_color,rand_color,1];
	
	palette[0].refresh();
	asteroids = [];
	
}
