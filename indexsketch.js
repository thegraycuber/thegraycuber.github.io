var win = [];
var  bpx = 0;
var todraw = true;


function preload() {
	gauss = loadImage("GaussImage.png")
	quadratic = loadImage("QuadraticImage.png")
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
}

function setup() {
	px = min(windowWidth/16,windowHeight/9);
	win = [windowWidth,windowHeight];
	createCanvas(windowWidth, windowHeight);
	noStroke();
	textFont(atkinsonBold);
	textAlign(CENTER,CENTER);
	rectMode(CENTER);
	imageMode(CENTER);
}

function draw() {
	if (todraw){
		background(10);
		textSize(px/2);
		fill(220);
		text("TheGrayCuber's Pages",win[0]/2,win[1]/2-px*3.5);
		fill(80);
		rect(win[0]/2-px*4, win[1]/2,px*6.2,px*4.7,px*0.06);
		rect(win[0]/2+px*4, win[1]/2,px*6.2,px*4.7,px*0.06);
		image (gauss, win[0]/2-px*4, win[1]/2,px*6,px*4.5);
		image (quadratic, win[0]/2+px*4, win[1]/2,px*6,px*4.5);
		fill(220);
		strokeWeight(px*0.08);
		stroke(20);
		text("Gaussian\nPrimes",win[0]/2-px*4, win[1]/2);
		text("Quadratic\nPrimes",win[0]/2+px*4, win[1]/2);
		todraw = false;
	}
}

function mouseClicked(){
	if(mouseY > win[1]/2-px*2.3 && mouseY < win[1]/2+px*2.3){
		if(mouseX > win[0]/2-px*7.1 && mouseX < win[0]/2-px*0.9){
			window.open('https://thegraycuber.github.io/gaussian.html', '_blank');
		} else if(mouseX > win[0]/2+px*0.9 && mouseX < win[0]/2+px*7.1){
			window.open('https://openprocessing.org/sketch/2297125', '_blank');
		}
	}
}