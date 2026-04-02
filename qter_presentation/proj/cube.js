

/*
todo - finish slideshow

make cube turns based on actual timer

*/


var cube = [];
var edges = [];
var w = 0;
var n;

var baseCubeColors = ['#c8caf4','#e1e485','#2cda9d','#8498ef','#f168a0','#ebad6b','#20213f']; // dark
var cubeColors;

var lastFrameCube;
function aux_setup() {
	resetCube();
	lastFrameCube = Date.now();
	edgesSet([0,0,3,2]);
}

function edgesSet(e){
	
	edges = [
		new sticker([0,-w*1.501,-w*1.001],e[0],w*0.9,[1,0]),
		new sticker([0,-w*1.501,w*1.001],e[1],w*0.9,[1,0]),
		new sticker([0,-w*1.001,-w*1.501],e[2],w*0.9,[0,0]),
		new sticker([0,-w*1.001,w*1.501],e[3],w*0.9,[0,0]),
	];
	movetype = 'q';
}

function resetCube(){
	//create a 3x3 grid on all 6 faces, and a 3x3x3 grid of boxes inside
	w = 1/3;
	cube = [];

	// n = 3;
	// let startSize = -w*(n-1)/2;
	// let endSize = w*(n-0.999)/2;
	// let fullSize = w*n/2;
	
	// for (var i = startSize; i <= endSize; i += w){
	// 	for (var j = startSize; j <= endSize; j += w){
	// 		cube.push(new sticker([i,-fullSize,j],0,w*0.9,[1,0])); // white on U
	// 		cube.push(new sticker([i,fullSize,j],1,w*0.9,[1,0])); // yellow on D
	// 		cube.push(new sticker([i,j,fullSize],2,w*0.9,[0,0])); // green on F
	// 		cube.push(new sticker([i,j,-fullSize],3,w*0.9,[0,0])); // blue on B
	// 		cube.push(new sticker([fullSize,i,j],4,w*0.9,[0,1])); // red on R
	// 		cube.push(new sticker([-fullSize,i,j],5,w*0.9,[0,1])); // orange on L
	// 	}
	// }


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
	let frameGap = Date.now()-lastFrameCube;
	lastFrameCube = Date.now();
	if (typeof settings.alg == 'undefined'){return;}
	
	if (settings.setCube.length > 0){
		resetCube();
		moveaxis = -1;
		while(settings.setCube.length > 0){
			keytoMove(settings.setCube.substring(0,1),true);
			settings.setCube = settings.setCube.substring(1);
		}
	}

	if (settings.setEdges.length > 0){
		edgesSet(settings.setEdges);
		movetype='q';
		settings.setEdges = [];
	}
	
	if (settings.cube == 0){return;}

	let lerpBy = [
		settings.cube*(settings.fadeToShow?0.4:1),
		settings.cube*(0.4+0.6*(settings.fadeToShow?present_ticker:1-present_ticker)),
		settings.cube*(settings.fadeToShow?1:0.4),
		settings.cube*(1-0.6*(settings.fadeToShow?present_ticker:1-present_ticker)),
	];

	cubeColors = [];
	for (let l of lerpBy){
		for (let c of baseCubeColors){
			cubeColors.push(lerpColor(color(baseCubeColors[6]),color(c),l));
		}
	}
	// if (settings.faded.length > 0){
	// 	for (let c = 0; c < 7; c++){
	// 		cubeColors.push(lerpColor(color(baseCubeColors[6]),cubeColors[c],settings.fade));
	// 	}
	// }
	let auxScalar = wid**1.9*0.0004*settings.scalar;


	noStroke();

	push();
	scale(auxScalar);
	rotateX(settings.xAngle);
	rotateY(settings.yAngle);
	translate(settings.strafeX*cos(settings.yAngle),0,settings.strafeX*sin(settings.yAngle));
	translate(-settings.strafeZ*sin(settings.yAngle),0,settings.strafeZ*cos(settings.yAngle));
	translate(0,settings.strafeY,0);

	
	// fill(palette.back);
	// box(w*n*0.9999,w*n*0.9999,w*n*0.9999);

	if (settings.alg.length > 0 && moveaxis == -1 && movetype == 'q'){
		keytoMove(settings.alg.substring(0,1));
		settings.alg = settings.alg.substring(1,settings.alg.length);
	} else if (moveaxis == -1 && settings.autoplay && mouse_state == 'presenting' && present_ticker == 1){
		next_slide();
	}

	for (let sticker of cube){
		sticker.display();
	}

	// if mid move, continue to process the move
	if(moveaxis != -1){
		moveang = min(moveang+(frameGap)*0.025,10);
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
	for (let stickermoving of cube){
		stickermoving.display(false);
	}

	if (settings.edges){
		
		if (movetype != 'q'){
			moveang = min(moveang+(frameGap)*0.01,10);
			if (movetype == 'w' || movetype == 'y'){
				settings.edgeY = map(moveang,0,10,0,PI);
				settings.blueScale = 1+constrain(sin(settings.edgeY),0,0.4);
				settings.greenScale = settings.blueScale;
				settings.edgeY = constrain(settings.edgeY*1.6-0.3*PI,0,PI) + (movetype == 'y' ? PI : 0);
			} else if (movetype == 'x'){
				settings.blueAng = map(moveang,0,10,0,PI);
				settings.blueScale = 1+constrain(sin(settings.blueAng),0,0.8)*0.5;
				settings.blueAng = constrain(settings.blueAng*1.6-0.3*PI,0,PI);
			} else if (movetype == 'z'){
				settings.greenAng = map(moveang,0,10,0,PI);
				settings.greenScale = 1+constrain(sin(settings.greenAng),0,0.8)*0.5;
				settings.greenAng = constrain(settings.greenAng*1.6-0.3*PI,0,PI);
			}
		}

		if (settings.blueAng > 3.14 && settings.blueScale < 1.001){
			let b0 = edges[0].hex;
			edges[0].hex = edges[2].hex; 
			edges[2].hex = b0; 
			settings.blueAng = 0;
			moveang = 10;
		}
		if (settings.greenAng > 3.14 && settings.greenScale < 1.001){
			let b0 = edges[1].hex;
			edges[1].hex = edges[3].hex; 
			edges[3].hex = b0; 
			settings.greenAng = 0;
			moveang = 10;
		}

		for (let s = 0; s < 4; s++){
			let smod = s%2;
			edges[s].display(true,smod,
				smod==0?settings.blueAng:settings.greenAng,
				smod==0?settings.blueScale:settings.greenScale,
				smod==0?-PI/4:-PI/4);
		}
	
	}		/*
	"cube":1,
	"fadeToShow":true,
	"edges":true,
	"strafeX":0,
	"yAngle":-0.4,
	"scalar":1,
	"alg":"1234"

	*/


	// if the move is now done, handle by permanently moving the stickers
	if (moveang >= moveframes){
		processMove();
	}

	
	pop();
	
}


var moveaxis = -1; // 0 for X, 1 for Y, 2 for Z, -1 for not moving
var movefact = 0; // adjust the direction, FUR are 1, BDL are -1
var moveang = 0; // current frame of move
var moveframes = 10; // total frames per move
var movedir = 0; // direction of move, 1 for normal, -1 for inverse
var movetype = 'q';


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
		movetype = keyValue;
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
	movetype = 'q';

}


class sticker {
	constructor(pos, hex, size, rotate, outer = true) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
		this.rotate = rotate;
		this.outer = outer; // there are outer stickers, and inner boxes which hide the back stickers
		this.index = cube.length;
	}
	
	display(movement = true, edge = -1, edgeAng = 0, edgeScale = 1, twistAng = 0) {
		
		if (settings.edges && [27,45,29,30].includes(this.index)){return;}
		// if movement, display if the cube is moving (moveaxis != -1), and this sticker is far enough in that axis
		// if not movement, display if the cube is not moving, or if this sticker is not far enough in the move axis
		if (movement == (moveaxis == -1 || this.pos[moveaxis] * movefact < w*0.9)) {
			
			push();
			if (edge != -1){
				rotateX(twistAng);
				rotateY(edgeAng);
				rotateX(-twistAng);
				fill(cubeColors[this.hex+14]);
				rotateY(settings.edgeY);

				let e = (edgeScale-1)*0.3;
				translate(this.pos[0]*e, this.pos[1]*e, this.pos[2]*e);
				scale(edgeScale-e/2);

			} else if (settings.faded.includes(this.index)){
				fill(cubeColors[this.hex+14]);
			} else if (settings.toFaded.includes(this.index)){
				fill(cubeColors[this.hex+7]);
			} else if (settings.fromFaded.includes(this.index)){
				fill(cubeColors[this.hex+21]);
			} else {
				fill(cubeColors[this.hex]);
			}
	
			translate(this.pos[0], this.pos[1], this.pos[2]);
			rotateX(this.rotate[0]*PI/2);
			rotateY(this.rotate[1]*PI/2);
			
			if (this.outer){
				rect(0, 0, this.size, this.size, this.size * 0.2);
			} else {
				box(this.size, this.size, this.size);	
			}
			pop();
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
