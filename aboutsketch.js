var bucket_min = [];
var points = [];
var color_v, color_a, color_noise, color_theta, color_move;
var adder = [0.0005,0.0005];
var palette = [];
var adjust_counter = 6;
var adjust_wait = false;
var curr_color = 3;
var new_color = 3;
var color_list = ['Current','Sunset','Electric','Forest','Autumn','Dark','Light','YouTube','Github'];
var icon_coords = [[-0.4,-0.2],[-0.4,0],[-0.4,0.2],[0.4,-0.2],[0.4,0],[0.4,0.2],[-0.12,0.3],[0.12,0.3]];
var icon_mobile = [[-0.2,-0.46],[0,-0.46],[0.2,-0.46],[-0.2,0.46],[0,0.46],[0.2,0.46],[-0.12,0.3],[0.12,0.3]];
var icon_sizes = [0.08,0.08,0.08,0.08,0.08,0.08,0.06,0.06];
var imgs = [];
var masks = [];
var random_add = 0;
var size_mult = 1;
var textValues = [	
	"Hi, I'm Asher",
	"Math is beautiful.",
	"I love to study and experiment with it.",
	"I create videos about the interesting\n things that I learn and find, and write\n programs to make cool visualizations.",
	"",
	"",
	"",
	""
];
var winw, winh;
var links = ['https://www.youtube.com/@TheGrayCuber','https://github.com/thegraycuber','https://thegraycuber.github.io/'];
var link_types = ['_blank', '_blank', '_self'];

function preload() {
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	openSans = loadFont("OpenSans-Regular.ttf");
	for (var img = 1; img < color_list.length; img++){
		masks.push(loadImage('Color' + color_list[img] + '.png'));	
	}
	
}

function setup() {
	clean_info();
	frameRate(30);
	textFont(atkinsonRegular);
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
	createCanvas(windowWidth, windowHeight);
	background(palette[0].back[2]);
	px = min(windowWidth,windowHeight);
	winw = windowWidth;
	winh = windowHeight;
	if (winw*1.1 < winh){
		px*= min(1.3,0.9*winh/winw);
		icon_coords = icon_mobile;
	}
	for (var img = 0; img < color_list.length-1; img++){
		imgs.push(new Icon(icon_coords[img],px,img+1,px*icon_sizes[img]));
	}
	imgs.push(new Icon([0,0.3],px,9,px*0.06));
	update_imgs();
	noStroke();
	for(x = 0; x < windowWidth; x += px/60){
		for(y = 0; y < windowHeight; y += px/60){
			points.push(new Point(x-windowWidth/2,y-windowHeight/2,px/60));
		}	
	}
}

function draw() {

	random_add = 0.002;
	if (abs(winw - windowWidth) > 1 || abs(winh - windowHeight) > 1){
		background(palette[0].back[2]);
		winw = windowWidth;
		winh = windowHeight;
		random_add = 0.125;
	}
	translate(windowWidth/2,windowHeight/2);
	
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
	
	var flat = createImage(1,1);
	flat.loadPixels();
	flat.pixels[0] = red(palette[0].backlight);
	flat.pixels[1] = green(palette[0].backlight);
	flat.pixels[2] = blue(palette[0].backlight);
	flat.pixels[3] = 255;
	flat.updatePixels();
	for (var img = 0; img < 6; img++){
		imgs[img].img.copy(flat,0,0,1,1,0,0,533,533);
		imgs[img].img.mask(masks[img]);		
	}
	flat.loadPixels();
	flat.pixels[0] = red(palette[0].accent3);
	flat.pixels[1] = green(palette[0].accent3);
	flat.pixels[2] = blue(palette[0].accent3);
	flat.pixels[3] = 255;
	flat.updatePixels();
	for (img = 6; img < 8; img++){
		imgs[img].img.copy(flat,0,0,1,1,0,0,533,533);
		imgs[img].img.mask(masks[img]);		
	}
}

function mousePressed(){
	for (var i = 6; i < imgs.length; i++)	{
		var test_click = imgs[i].check(true);
		if(test_click){
			window.open(links[imgs[i].index - 7], link_types[imgs[i].index - 7]);
		}
	}	
}
