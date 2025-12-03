
var tgs_present_speed = 0.04;
var image_list = [
	'primes_break/fermat_000.png',
	'primes_break/lame_000.png',
	'primes_break/liouville_000.png',
	'primes_break/speech_right_001.png',
	'primes_break/speech_left_001.png',
	'primes_break/Wiles_000.png',
	'primes_break/UFD_000.png',
	'primes_break/quadratic_qr_000.png',
];

var origin, scalar;
function setup() {
	palette = new Palette('Sunset');
	frameRate(30);
	
	createCanvas(windowWidth, windowHeight);
	
	tgs_setup(1);

	origin = createVector(width/2, height/2);
	scalar = round(height/50);
	
	draw_origin = createVector(width/2,height/2);
	
	z_noise = random()*1000;
	for (let i = 0; i < 20; i++){
		add_prime();
	}
	generate_squares(100);
	reset_D();
	slide_data = loadJSON('primes_break/primes_break_017.json');
}



var D = -1;
var scale_min = 3;

function draw() {

	background(palette.back);

	if ([78,81,89,90].includes(slide)){
		
		process_limit = 40;
		
		translate(origin.x, origin.y);
		scale(scalar,scalar);
	
		for (let i = 0; i < 2; i++){
			palette.gradient.push(palette.gradient[0]);
			palette.gradient.splice(0,1);
		}
	
		let direc_maxes;
		if (is_hex){
			direc_maxes = [floor(height/(scalar*0.866))+3, floor(2*width/scalar)+3];
		} else {
			direc_maxes = [floor(height/scalar)+3, floor(width/scalar)+3];
		}
		let spiral_maxes = [min(...direc_maxes),max(...direc_maxes)];
		direc_maxes.push(...direc_maxes);
		
		let spiral_size = 0;
		let direc = 3;
		let start_int = pixel_to_principal(draw_origin);
		let re = round(start_int.x);
		let im = round(start_int.y);
	
		noStroke();
		while (spiral_size < spiral_maxes[1]){
			direc = (direc + 1)%4;
			if (spiral_direction[direc][1] == 0){
				spiral_size++;
			}
	
			if (spiral_size > direc_maxes[direc]){
				re += spiral_direction[direc][0]*spiral_size;
				im += spiral_direction[direc][1]*spiral_size;
				continue;
			}
		
			for (let i = 0; i < min(spiral_size,spiral_maxes[0]); i++){
	
				process_int(re, im);
				re += spiral_direction[direc][0];
				im += spiral_direction[direc][1];
			}
		}
	}
	
	tgs_display();
}

function core_color_custom(plt){
	tgs_color(plt);
	
	plt.gradient = [];
	for (let clr = 0; clr < 120; clr++){
		plt.gradient.push(lerpColor(plt.mono,plt.bright,clr/120));
	}
	for (let clr = 0; clr < 120; clr++){
		plt.gradient.push(lerpColor(plt.bright,plt.red,clr/120));
	}
	
	for (let clr = 0; clr < 120; clr++){
		plt.gradient.push(lerpColor(plt.red,plt.mono,clr/120));
	}
}


var last_transition = 0;
function keyPressed(){
	if (Date.now() < last_transition + 500){
		return;
	}
	
	if ([32, DOWN_ARROW, RIGHT_ARROW, 34].includes(keyCode)){
		if (keyIsDown(SHIFT)){
			slide = min(modules.length-1,slide+9);
		} else if (keyIsDown(69)){
			slide = modules.length-1;
		}
		tgs_next_slide();
		present_ticker = 0;
		last_transition = Date.now();
	} else if ([BACKSPACE, UP_ARROW, LEFT_ARROW, 33].includes(keyCode)){
		slide = max(0,slide-2);
		if (keyIsDown(SHIFT)){
			slide = max(0,slide-9);
		} else if (keyIsDown(69)){
			slide = 0;
		}
		tgs_next_slide();
		present_ticker = 0.99;
		last_transition = Date.now();
	}
	
}

var mainBold;
function preload() {
	mainBold = loadFont("media/AshkinsonBold_prod.ttf");
}

function pixel_to_principal(pixels){
	// principal = (pixel - origin)/scalar
	if (is_hex){
		return p5.Vector.sub(pixels,origin).div(scalar*0.5,-scalar*0.866);
	} else {
		return p5.Vector.sub(pixels,origin).div(scalar,-scalar);
	}
}

var process_limit;
var spiral_direction = [
	[1,0],
	[0,1],
	[-1,0],
	[0,-1]
]
