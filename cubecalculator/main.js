
var win = [];
var pxfact = 3;
var cube = [];
var cube2 = [];
var boxes = [];
var rotx = -0.45;
var roty = -0.4;
var w = 0;
var moveaxis = -1;
var movefact = 0;
var moveang = 0;
var moveframes = 8;
var movedir = 0;
var moves_to_push;
var accy = 0;
var counter = 0;
var curr_value = 1;
//#904e4e
var colors = ['#063a2a','#d6ddcc','#d8b801','#3fbd75','#449d9d','#af5757','#b88153']; //forest
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
	}
	background(colors[0]);

	push();
	rotateX(rotx);
	rotateY(roty);
	fill(colors[0]);
	
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
	
	//translate(0,0,px*10);
	fill(colors[3]);
	textMax("Mod 2424240 Calculator",0,-win[1]*0.43,0.035);
	
	fill(colors[1]);
	if (playalg.length > 0){
		textMax("Calculating...",0,-win[1]*0.33,0.04);
	} else {
		textMax("Current State: " + str(curr_value),0,-win[1]*0.37,0.04);
		textMax(curr_alg,0,-win[1]*0.3,0.025);
	}
	textMax(input_alg,0,win[1]*0.36,0.025);
	yt.showIcon();

}


function touchStarted(){
	yt.clicked();
}

