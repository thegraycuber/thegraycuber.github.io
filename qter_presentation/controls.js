

var fullscreen_count = 0;
var last_transition = 0;
function keyPressed(){

	let isControl = keyIsDown(17) || keyIsDown(91);
	
	if ([32, DOWN_ARROW, RIGHT_ARROW, 34].includes(keyCode)){
		if (keyIsDown(SHIFT) && isControl){
			slide = modules.length-2;
		} else if (isControl){
			slide = min(modules.length-1,slide+9);
		}
		next_slide();
		present_ticker = 0;
		last_transition = Date.now();
	} else if ([BACKSPACE, UP_ARROW, LEFT_ARROW, 33].includes(keyCode)){
		slide = max(0,slide-2);
		if (keyIsDown(SHIFT) && isControl){
			slide = 0;
		} else if (isControl){
			slide = max(0,slide-9);
		}
		next_slide();
		present_ticker = 0.99;
		last_transition = Date.now();
		
	} else if (keyCode == 122){
		fullscreen(true);

	} else if (key == '=' || key == '+'){
		document.getElementById('help-box').style.display = 'block';
	} else if (key == '-' || key == '_'){
		document.getElementById('help-box').style.display = 'none';
	}
	
}


function windowResized() {

	let wid = min(window.innerWidth,window.innerHeight*16/9);
	resizeCanvas(wid,wid*9/16+100);
	cam.setPosition(0,0,wid);
	default_scalar = wid/1920;
	default_origin = createVector(wid/2,wid*9/32+50);

	for (let view = 0; view < present_view.length; view++){
		present_view[view] = new PresentView(present_view[view].size, present_view[view].pos.x, present_view[view].pos.y);
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
