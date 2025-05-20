var moveaxis = -1;
var movedir = 0;
var moveang = 0;
var moveframes = 12;
var cube, boxes, playalg;
var rotx = 0.43;
var roty = -0.65;
var cube_moves = ['u','U','d','D','l','L','r','R','f','F','b','B'];

function calculatorPrep(){
	var edge = 0;
	cube = [];
	boxes = [];
	w = max(px*0.8,height/12);
	for (var i = -w; i <= w*1.999; i += w){
		for (var j = -w; j <= w*1.999; j += w){
			cube.push(new sticker([i,-w*3/2,j],color('#d6ddcc'),w*0.9,[1,0],edge));
			cube.push(new sticker([i,w*3/2,j],'#d8b801',w*0.9,[1,0],edge));
			cube.push(new sticker([i,j,w*3/2],'#3fbd75',w*0.9,[0,0],edge));
			cube.push(new sticker([i,j,-w*3/2],'#449d9d',w*0.9,[0,0],edge));
			cube.push(new sticker([w*3/2,i,j],'#904e4e',w*0.9,[0,1],edge));
			cube.push(new sticker([-w*3/2,i,j],'#b88153',w*0.9,[0,1],edge));
	
			for (var k =  -w; k <=  w*1.99; k += w){
				boxes.push(new cubie([i*0.99,j*0.99,k*0.99],'#063a2a',w*0.99));
			}
			edge = 1 - edge;
		}
	}
	
	playalg = cube_moves[int(random(12))];
	/*
	for (let _ = 0; _ < 5; _++){
		keytoMove(cube_moves[int(random(12))]);
		makeMove();
	}
	*/
}

function calculatorDraw(){
	
	if (playalg.length > 0 && moveaxis == -1){
		keytoMove(playalg.substring(0,1));
		let new_move = cube_moves[int(random(12))];
		while (new_move.toUpperCase() == playalg.toUpperCase()) {
			new_move = cube_moves[int(random(12))];
		}
		playalg = new_move;
	}
	
	rotx += 0.04;
	roty += 0.01;
	
	
	rotateX(rotx);
	rotateY(roty);
	noStroke();
	
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
			makeMove();
	}

}

function makeMove(){
		for (var boxy2 of boxes){
			boxy2.move();
		}

		for (var sticky2 of cube){
			sticky2.move();
		}
		moveang = 0;
		moveaxis = -1;
}

function keytoMove(keyValue) {
	if (keyValue.toLowerCase() == 'u') {
		moveaxis = 1;
		movefact = -1;
  } else if (keyValue.toLowerCase() == 'd') {
		moveaxis = 1;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'r') {
		moveaxis = 0;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'l') {
		moveaxis = 0;
		movefact = -1;
  } else if (keyValue.toLowerCase() == 'f') {
		moveaxis = 2;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'b') {
		moveaxis = 2;
		movefact = -1;
  } 
	if (moveaxis == -1){
		return;
	}
	if (keyValue.toLowerCase() == keyValue){
		movedir = 1;
	}else{
		movedir = -1;
	}
}

class sticker {
	constructor(pos, hex, size, rotate,edge = 0) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
		this.rotate = rotate;
		this.edge = edge;
		//this.enter = page_trans*(1+1.5*random());
		//this.exit = page_time - page_trans*(1+1.5*random());
	}
	display(moving = true) {
		/*
		if (ticker < this.enter || ticker > this.exit){
			return;
		}
		*/
		if (moving == (moveaxis == -1 || this.pos[moveaxis] * movefact < w*0.9)) {
			fill(this.hex);
			translate(this.pos[0], this.pos[1], this.pos[2]);
			rotateX(this.rotate[0]*PI/2);
			rotateY(this.rotate[1]*PI/2);
			rect(0, 0, this.size, this.size, this.size * 0.2);
			rotateY(-this.rotate[1]*PI/2);
			rotateX(-this.rotate[0]*PI/2);
			translate(-this.pos[0], -this.pos[1], -this.pos[2]);
		}
	}
	move() {
		if (this.pos[moveaxis] * movefact >= w) {
			var moveout = movethem(this.pos,this.rotate);
			this.pos = moveout[0];
			this.rotate = moveout[1];
		}
	}
}

class cubie {
	constructor(pos, hex, size) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
	}
	display(moving = true) {
		if (moving == (moveaxis == -1 || this.pos[moveaxis] * movefact < w*0.8)) {
			fill(this.hex);
			translate(this.pos[0], this.pos[1], this.pos[2]);
			box(this.size, this.size, this.size);
			translate(-this.pos[0], -this.pos[1], -this.pos[2]);
		}
	}
	move() {
		if (this.pos[moveaxis] * movefact >= w) {
			var moveout = movethem(this.pos,[0,0,0]);
			this.pos = moveout[0];
			this.rotate = moveout[1];
		}
	}
}


function movethem(moveinput,rotateinput){
	if (moveaxis == 0){
		return([[moveinput[0],-movefact*movedir*moveinput[2],movefact*movedir*moveinput[1]],[(1-rotateinput[0])*(1-rotateinput[1]),rotateinput[1]]]);
	}else if(moveaxis == 1){
		return([[movefact*movedir*moveinput[2],moveinput[1],-movefact*movedir*moveinput[0]],[rotateinput[0],(1-rotateinput[0])*(1-rotateinput[1])]]);
	}else if(moveaxis == 2){
		return([[-movefact*movedir*moveinput[1],movefact*movedir*moveinput[0],moveinput[2]],[rotateinput[1],rotateinput[0]]]);
	}
}