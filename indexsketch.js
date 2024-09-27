
var win = [];
var px = 0;
var todraw = true;


function preload() {
	gauss = loadImage("GaussImage.png")
	quadratic = loadImage("QuadraticImage.png")
	grapher = loadImage("GrapherImage.png")
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
		textSize(px*0.6);
		fill(220);
		text("TheGrayCuber's Pages",win[0]/2,win[1]/2-px*3);
		fill(80);
		rect(win[0]/2-px*5.3, win[1]/2,px*5,px*3.8,px*0.06);
		rect(win[0]/2, win[1]/2,px*5,px*3.8,px*0.06);
		rect(win[0]/2+px*5.3, win[1]/2,px*5,px*3.8,px*0.06);
		image (gauss, win[0]/2-px*5.3, win[1]/2,px*4.8,px*3.6);
		image (quadratic, win[0]/2, win[1]/2,px*4.8,px*3.6);
		image (grapher, win[0]/2+px*5.3, win[1]/2,px*4.8,px*3.6);
		fill(220);
		strokeWeight(px*0.1);
		stroke(20);
		text("Gaussian\nPrimes",win[0]/2-px*5.3, win[1]/2);
		text("Quadratic\nPrimes",win[0]/2, win[1]/2);
		text("Complex\nGrapher",win[0]/2+px*5.3, win[1]/2);
		todraw = false;
	}
}

function mouseClicked(){
	if(mouseY > win[1]/2-px*2.3 && mouseY < win[1]/2+px*2.3){
		if(mouseX > win[0]/2-px*7.7 && mouseX < win[0]/2-px*2.9){
			window.open('https://thegraycuber.github.io/gaussian.html', '_self');
		} else if(mouseX > win[0]/2-px*2.4 && mouseX < win[0]/2+px*2.4){
			window.open('https://thegraycuber.github.io/quadratic.html', '_self');
		} else if(mouseX > win[0]/2+px*2.9 && mouseX < win[0]/2+px*7.7){
			window.open('https://thegraycuber.github.io/grapher.html', '_self');
		}
	}
}