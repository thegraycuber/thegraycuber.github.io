

var fullscreen_count = 0;
var last_transition = 0;
function keyPressed(){

	// if (settings.autoplay){return;}
	if (Date.now() < last_transition + 500){
		return;
	}
	if ([32, DOWN_ARROW, RIGHT_ARROW, 34].includes(keyCode)){
		if (keyIsDown(SHIFT)){
			slide = min(modules.length-1,slide+9);
		} else if (keyIsDown(69)){
			slide = modules.length-1;
		}
		next_slide();
		present_ticker = 0;
		last_transition = Date.now();
	} else if ([BACKSPACE, UP_ARROW, LEFT_ARROW, 33].includes(keyCode)){
		slide = max(0,slide-2);
		if (keyIsDown(SHIFT)){
			slide = max(0,slide-9);
		} else if (keyIsDown(69)){
			slide = 0;
		}
		next_slide();
		present_ticker = 0.99;
		last_transition = Date.now();
		
	} else if (keyCode == 122){
		fullscreen(true);
		fullscreen_count = 1;
	}
	
}


var origin, default_origin, default_scalar, mouseVec;
var scalar = 1; 

var active_modules = []; //this should be kept in order
var single_active;
var mouse_saved = [];
var mouse_state = 'free';

var allow_controls = false;
var click_time = 0;


function pixel_to_principal(pixels){
	return p5.Vector.sub(pixels,origin).div(scalar);
}

function principal_to_pixel(principal){
	return p5.Vector.mult(principal,scalar).add(origin);
}
