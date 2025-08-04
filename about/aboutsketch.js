var bucket_min = [];
var points = [];
var adder = [0.0005,0.0005];
var adjust_counter = 6;
var adjust_wait = false;
var icon_coords = [[-0.4,-0.2],[-0.4,0],[-0.4,0.2],[0.4,-0.2],[0.4,0],[0.4,0.2]];
var icon_mobile = [[-0.2,-0.46],[0,-0.46],[0.2,-0.46],[-0.2,0.46],[0,0.46],[0.2,0.46]];
var icon_sizes = [0.08,0.08,0.08,0.08,0.08,0.08];
var imgs = [];
var masks = [];
var random_add = 0;
var size_mult = 1;
var win;

function preload() {
	mainFont = loadFont("media/AshkinsonBold_003.ttf");
	for (var img = 1; img < color_list.length; img++){
		masks.push(loadImage('media/icon_' + color_list[img].toLowerCase() + '.png'));	
	}

}

function setup() {
	clean_info();
	frameRate(30);
	textFont(mainFont);
	textAlign(CENTER,CENTER);
	imageMode(CENTER);
	for (var scheme of color_list){
		palette.push(new Palette(scheme));
	}
	palette[0].refresh(0,0);
	bucket_min = [-0.5,-0.47,-0.25,0.25,0.47];
	
	color_noise = createVector(random()*2000,random()*2000);
	color_move = random()*2000;
	color_a = createVector(random()*2000,random()*2000);
	color_v = createVector(random()*2000,random()*2000);
	createCanvas(window.innerWidth, window.innerHeight);
	win = [window.innerWidth/2,window.innerHeight/2];
	background(palette[0].back[2]);
	px = min(window.innerWidth,window.innerHeight);
	if (window.innerWidth*1.1 < window.innerHeight){
		px*= min(1.3,0.9*window.innerHeight/window.innerWidth);
		icon_coords = icon_mobile;
	}
	for (var img = 0; img < color_list.length-1; img++){
		imgs.push(new Icon(icon_coords[img],px,img+1,px*icon_sizes[img]));
	}
	imgs.push(new Icon([0,0.3],px,7,px*0.08));
	update_imgs();
	noStroke();
	for(x = 0; x < window.innerWidth; x += px/60){
		for(y = 0; y < window.innerHeight; y += px/60){
			points.push(new Point(x,y,px/60));
		}	
	}
}

function draw() {

	random_add = 0.002;
	
	if(adjust_counter >= 0){
		
		random_add = 0.002 + sin(adjust_counter)*0.125;
		
		adjust_counter+=PI/8;
		palette[0].refresh(curr_color,new_color,(1-cos(adjust_counter))/2,sin(adjust_counter));
		background(palette[0].backalpha);
		update_info(adjust_counter);
		update_imgs();
		if(adjust_counter > PI){
			random_add = 0.05;
			adjust_counter = -1;
			curr_color = new_color;
		}
		
		
	}
	
	color_move += 0.0005;
	color_a.add(adder);
	color_v.add([noise(color_a.x)*0.012-0.005,noise(color_a.y)*0.012-0.005]);
	
	noStroke();
	for(var p of points){
		if (random() < random_add){
			p.display();
		}
	}
	translate(win[0],win[1]);
	strokeWeight(px*0.005);
	stroke(palette[0].back[2]);
	fill(palette[0].accent2);
	textSize(px*0.04);
	text(textValues[1],0,-px*0.25);
	fill(palette[0].accent1);
	text(textValues[0],0,-px*0.35);
	textSize(px*0.03);
	text(textValues[2],0,-px*0.20);
	text(textValues[3],0,-px*0.08);
	for (var t = 4; t < 8; t++){
		text(textValues[t],0,px*(t*0.04-0.12));
	}
	for (var i of imgs){
		i.check();
		i.display();
	}
}



function update_imgs(){
	
	var flat = make_solid(palette[0].backlight);
	for (var img = 0; img < 6; img++){
		imgs[img].img.copy(flat,0,0,1,1,0,0,200,200);
		imgs[img].img.mask(masks[img]);		
	}
}

function make_solid(solid_color){
	let solid = createImage(1,1);
	solid.loadPixels();
	solid.pixels[0] = red(solid_color);
	solid.pixels[1] = green(solid_color);
	solid.pixels[2] = blue(solid_color);
	solid.pixels[3] = 255;
	solid.updatePixels();
	return solid;
}

function touchStarted(){
	for (var i = 6; i < imgs.length; i++)	{
		if(imgs[i].check(true)){
			window.open('https://thegraycuber.github.io/', '_self');
		}
	}	
}
