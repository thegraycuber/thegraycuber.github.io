
var cube = [];
var w = 0;

var baseCubeColors = ['#c8caf4','#e1e485','#2cda9d','#8498ef','#f168a0','#ebad6b','#20213f']; // dark
var cubeColors;

function aux_setup() {
	resetCube();
}

function resetCube(){
	//create a 3x3 grid on all 6 faces, and a 3x3x3 grid of boxes inside
	w = 1/3;
	cube = [];
	for (var i = -w; i <= w; i += w){
		for (var j = -w; j <= w; j += w){
			cube.push(new sticker([i,-w*1.5,j],0,w*0.9,[1,0])); // white on U
			cube.push(new sticker([i,w*1.5,j],1,w*0.9,[1,0])); // yellow on D
			cube.push(new sticker([i,j,w*1.5],2,w*0.9,[0,0])); // green on F
			cube.push(new sticker([i,j,-w*1.5],3,w*0.9,[0,0])); // blue on B
			cube.push(new sticker([w*1.5,i,j],4,w*0.9,[0,1])); // red on R
			cube.push(new sticker([-w*1.5,i,j],5,w*0.9,[0,1])); // orange on L

			for (var k = -w; k <= w; k += w){
				cube.push(new sticker([i*0.99,j*0.99,k*0.99],6,w*0.99,[0,0],false)); // inner boxes
			}
		}
	}
}


function aux_draw() {
	if (typeof settings.alg == 'undefined'){return;}
	
	if (settings.setCube.length > 0){
		resetCube();
		while(settings.setCube.length > 0){
			keytoMove(settings.setCube.substring(0,1),true);
			settings.setCube = settings.setCube.substring(1,settings.setCube.length);
		}
	}
	
	if (settings.cube == 0){return;}

	cubeColors = [];
	for (let c of baseCubeColors){
		cubeColors.push(lerpColor(color(baseCubeColors[6]),color(c),settings.cube));
	}
	let auxScalar = height*0.3*settings.scalar;


	noStroke();

	push();
	scale(auxScalar);
	rotateX(settings.xAngle);
	rotateY(settings.yAngle);
	translate(settings.strafeX*cos(settings.yAngle),0,settings.strafeX*sin(settings.yAngle));
	translate(-settings.strafeZ*sin(settings.yAngle),0,settings.strafeZ*cos(settings.yAngle));
	translate(0,settings.strafeY,0);

	if (settings.alg.length > 0 && moveaxis == -1){
		keytoMove(settings.alg.substring(0,1));
		settings.alg = settings.alg.substring(1,settings.alg.length);
	} else if (moveaxis == -1 && settings.autoplay && mouse_state == 'presenting' && present_ticker == 1){

		next_slide();
	}

	for (var sticker of cube){
		sticker.display();
	}

	// if mid move, continue to process the move
	if(moveaxis != -1){
		moveang += 1;
		moveportion = PI*movedir*movefact*(-cos(PI*moveang/moveframes)+1)/4;
		if(moveaxis == 0){
			rotateX(moveportion);
		}else if(moveaxis == 1){
			rotateY(moveportion);
		}else{
			rotateZ(moveportion);
		}
	}
	
	// display the cubies and stickers that are mid move
	for (var stickermoving of cube){
		stickermoving.display(false);
	}

	// if the move is now done, handle by permanently moving the stickers
	if (moveang == moveframes){
		processMove();
	}
	
	pop();
}


var moveaxis = -1; // 0 for X, 1 for Y, 2 for Z, -1 for not moving
var movefact = 0; // adjust the direction, FUR are 1, BDL are -1
var moveang = 0; // current frame of move
var moveframes = 10; // total frames per move
var movedir = 0; // direction of move, 1 for normal, -1 for inverse


// process user input of UDRLFB moves
function keytoMove(keyValue, instantMove = false) {
	
	//don't allow movement if mid move already
	if (moveaxis != -1){
		return;
	}
	
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
  } else {
		return;
	}
	
	// get the direction of the move
	if (keyValue.toLowerCase() == keyValue){
		movedir = 1;
	} else{
		movedir = -1;
	}

	if (instantMove){
		processMove();
	}

}


function processMove(){
	for (var stickerupdate of cube){
		stickerupdate.move();
	}
	moveang = 0;
	moveaxis = -1;

}


class sticker {
	constructor(pos, hex, size, rotate, outer = true) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
		this.rotate = rotate;
		this.outer = outer; // there are outer stickers, and inner boxes which hide the back stickers
	}
	
	display(movement = true) {
		
		// if movement, display if the cube is moving (moveaxis != -1), and this sticker is far enough in that axis
		// if not movement, display if the cube is not moving, or if this sticker is not far enough in the move axis
		if (movement == (moveaxis == -1 || this.pos[moveaxis] * movefact < w*0.9)) {
			fill(cubeColors[this.hex]);
			translate(this.pos[0], this.pos[1], this.pos[2]);
			rotateX(this.rotate[0]*PI/2);
			rotateY(this.rotate[1]*PI/2);
			
			if (this.outer){
				rect(0, 0, this.size, this.size, this.size * 0.2);
			} else {
				box(this.size, this.size, this.size);	
			}
			
			rotateY(-this.rotate[1]*PI/2);
			rotateX(-this.rotate[0]*PI/2);
			translate(-this.pos[0], -this.pos[1], -this.pos[2]);
		}
	}
	
	// this part sucks. adjust the position and rotation of moved stickers
	move() {
		if (this.pos[moveaxis] * movefact >= w && this.outer) {
			
			if (moveaxis == 0){
				this.pos = [this.pos[0],-movefact*movedir*this.pos[2],movefact*movedir*this.pos[1]];
				this.rotate = [(1-this.rotate[0])*(1-this.rotate[1]),this.rotate[1]];
			} else if (moveaxis == 1){
				this.pos = [movefact*movedir*this.pos[2],this.pos[1],-movefact*movedir*this.pos[0]];
				this.rotate = [this.rotate[0],(1-this.rotate[0])*(1-this.rotate[1])];
			} else {
				this.pos = [-movefact*movedir*this.pos[1],movefact*movedir*this.pos[0],this.pos[2]];
				this.rotate = [this.rotate[1],this.rotate[0]];
			}
			
		}
	}
	
}
