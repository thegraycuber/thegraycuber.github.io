
class sticker {
	constructor(pos, hex, size, rotate,edge = 0) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
		this.rotate = rotate;
		this.edge = edge;
	}
	display(moving = true) {
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



class YouTube {
	constructor(displaySize,radius,coords,link = '') {
		this.Size = displaySize;
		this.Radius = radius;
		this.Coords = coords;
		this.UpperLeft = [width/2+this.Coords[0]-displaySize[0]/2,height/2+this.Coords[1]-displaySize[1]/2];
		this.LowerRight = [width/2+this.Coords[0]+displaySize[0]/2,height/2+this.Coords[1]+displaySize[1]/2];
		this.Link = link;
	}
	showIcon(){
		noStroke();
		fill(colors[5]);
		rect(this.Coords[0],this.Coords[1],this.Size[0],this.Size[1],this.Radius);
		fill(colors[1]);
		beginShape();
		vertex(this.Coords[0]+this.Size[0]*0.16,this.Coords[1]);
		vertex(this.Coords[0]-this.Size[0]*0.12,this.Coords[1]-this.Size[1]*0.2);
		vertex(this.Coords[0]-this.Size[0]*0.12,this.Coords[1]+this.Size[1]*0.2);
		vertex(this.Coords[0]+this.Size[0]*0.16,this.Coords[1]);
		endShape();
	}
	clicked(){
		if(mouseX > this.UpperLeft[0] && mouseX < this.LowerRight[0] && mouseY > this.UpperLeft[1] && mouseY < this.LowerRight[1]){
			window.open(this.Link, '_blank');
		}
	}
}