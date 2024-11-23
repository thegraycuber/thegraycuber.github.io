
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