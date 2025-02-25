
var win = [];
var pxfact = 3;
var cube = [];
var boxes = [];
var rotx = -0.45;
var roty = -0.4;
//var w = 0;
var moveaxis = -1;
//var movefact = 0;
var moveang = 0;
var moveframes = 8;
var movedir = 0;
//var moves_to_push;
//var accy = 0;
//var counter = 0;
var curr_value = 1;
var n = 3;
var playalg = '';
var input_unit, mult_button, div_button, rand_button;
var state_alg = '';
var input_alg = '';
var input_val;
var curr_alg = '';
var last_input = '';
var input_machine = '';
var move_allowed = false;


function draw() {
	process_input();
	if (playalg.length > 0 && moveaxis == -1){
		keytoMove(playalg.substring(0,1));
		playalg = playalg.substring(1,playalg.length);
		if (playalg.length == 0){
			last_input = '';
		}
	}
	background(palette[0].back);

	translate(0,win[1]*0.05,0);
	push();
	rotateX(rotx);
	rotateY(roty);
	fill(palette[0].back);
	
	for (var boxy of boxes){
		boxy.display();
	}
	
	for (var sticky of cube){
		sticky.display();
	}
	
	if(moveaxis != -1){
		moveang += 1;
		moveportion = (-cos(PI*moveang/moveframes)+1)/4;
		if(moveaxis == 0){
			rotateX(movedir*movefact*moveportion*PI);
		}else if(moveaxis == 1){
			rotateY(movedir*movefact*moveportion*PI);
		}else{
			rotateZ(movedir*movefact*moveportion*PI);
		}
	}
	
	for (var boxy1 of boxes){
		boxy1.display(false);
	}
	
	for (var sticky1 of cube){
		sticky1.display(false);
	}

	
	if (moveang == moveframes){
			for (var boxy2 of boxes){
				boxy2.move();
			}

			for (var sticky2 of cube){
				sticky2.move();
			}
			moveang = 0;
			moveaxis = -1;
	}
	
	pop();
	
	translate(0,-win[1]*0.05,0);
	
	textFont(atkinsonBold);
	fill(palette[0].head);
	textMax("Mod 2424240 Calculator",0,-win[1]*0.43,0.035);
	
	fill(palette[0].front);
	if (playalg.length > 0){
		textMax("Calculating...",0,win[1]*0.38,0.04);
	} else {
		textMax("Current State: " + str(curr_value),0,win[1]*0.38,0.04);
		textFont(atkinsonRegular);
		textMax(curr_alg,0,win[1]*0.44,0.025);
	}
	textFont(atkinsonRegular);
	textMax(input_alg,0,-win[1]*0.23,0.025);
	YouTube.showIcon();
	Theme.showIcon();
	rand_button.showIcon();
}


function touchStarted(){
	YouTube.clicked();
	Theme.clicked();
	rand_button.clicked();
}

function touchMoved(event){
	event.preventDefault(); 
	
	var flip = -1
	if (rotx > PI / 2 && rotx < PI * 3 / 2) {
		flip = 1;
	}

	rotx = (rotx + TAU + (pmouseY - mouseY) * 0.01) % TAU;
	roty = (roty + TAU + (pmouseX - mouseX) * 0.01 * flip) % TAU;
}

