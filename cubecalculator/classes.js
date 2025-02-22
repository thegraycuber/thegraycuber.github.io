class sticker {
	constructor(pos, hex, size, rotate, edge = 0) {
		this.pos = pos;
		this.hex = hex;
		this.size = size;
		this.rotate = rotate;
		this.edge = edge;
	}
	display(moving = true) {
		if (moving == (moveaxis == -1 || this.pos[moveaxis] * movefact < 0.9)) {
			fill(palette[0].colors[this.hex]);
			translate(this.pos[0]*w, this.pos[1]*w, this.pos[2]*w);
			rotateX(this.rotate[0] * PI / 2);
			rotateY(this.rotate[1] * PI / 2);
			rect(0, 0, this.size*w, this.size*w, this.size*w * 0.2);
			rotateY(-this.rotate[1] * PI / 2);
			rotateX(-this.rotate[0] * PI / 2);
			translate(-this.pos[0]*w, -this.pos[1]*w, -this.pos[2]*w);
		}
	}
	move() {
		if (this.pos[moveaxis] * movefact >= 1) {
			var moveout = movethem(this.pos, this.rotate);
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
		if (moving == (moveaxis == -1 || this.pos[moveaxis] * movefact < 0.8)) {
			fill(palette[0].back);
			translate(this.pos[0]*w, this.pos[1]*w, this.pos[2]*w);
			box(this.size*w, this.size*w, this.size*w);
			translate(-this.pos[0]*w, -this.pos[1]*w, -this.pos[2]*w);
		}
	}
	move() {
		if (this.pos[moveaxis] * movefact >= 1) {
			var moveout = movethem(this.pos, [0, 0, 0]);
			this.pos = moveout[0];
			this.rotate = moveout[1];
		}
	}
}



class Icon {
	constructor(type, displaySize, radius, coords, link = '') {
		this.Type = type;
		this.Size = displaySize;
		this.Radius = radius;
		this.Coords = coords;
		this.UpperLeft = [width / 2 + this.Coords[0] - displaySize[0] / 2, height / 2 + this.Coords[1] - displaySize[1] / 2];
		this.LowerRight = [width / 2 + this.Coords[0] + displaySize[0] / 2, height / 2 + this.Coords[1] + displaySize[1] / 2];
		this.Link = link;
	}
	showIcon() {
		if (this.Type == 'yt') {
			noStroke();
			fill(palette[0].colors[4]);
			rect(this.Coords[0], this.Coords[1], this.Size[0], this.Size[1], this.Radius);
			fill(palette[0].play);
			beginShape();
			vertex(this.Coords[0] + this.Size[0] * 0.16, this.Coords[1]);
			vertex(this.Coords[0] - this.Size[0] * 0.12, this.Coords[1] - this.Size[1] * 0.2);
			vertex(this.Coords[0] - this.Size[0] * 0.12, this.Coords[1] + this.Size[1] * 0.2);
			vertex(this.Coords[0] + this.Size[0] * 0.16, this.Coords[1]);
			endShape();
		} else if (this.Type == 'th') {
			noFill();
			strokeWeight(this.Radius);
			stroke(palette[0].colors[2]);
			circle(this.Coords[0], this.Coords[1] - this.Size[0] * 0.18, this.Size[0] * 0.64);
			circle(this.Coords[0] + this.Size[0] * 0.17, this.Coords[1] + this.Size[0] * 0.09, this.Size[0] * 0.64);
			circle(this.Coords[0] - this.Size[0] * 0.17, this.Coords[1] + this.Size[0] * 0.09, this.Size[0] * 0.64);
			noStroke();
		} else {
			noFill();
			stroke(palette[0].front);
			strokeWeight(this.Radius);
			beginShape();
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]-this.Size[1]*0.5);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0], this.Coords[1]+this.Size[1]*0.5);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0], this.Coords[1]+this.Size[1]*0.5);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			endShape();
			ellipse(this.Coords[0], this.Coords[1]-this.Size[1]*0.25,this.Size[0]*0.06, this.Size[1]*0.04);
			ellipse(this.Coords[0]-this.Size[0]*0.28, this.Coords[1]+this.Size[1]*0.025,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]-this.Size[0]*0.15, this.Coords[1]+this.Size[1]*0.2,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]+this.Size[0]*0.31, this.Coords[1]-this.Size[0]*0.015,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.23, this.Coords[1]+this.Size[1]*0.12,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.14, this.Coords[1]+this.Size[1]*0.26,this.Size[0]*0.03, this.Size[1]*0.05);
			noStroke();
		}
	}
	clicked() {
		if (mouseX > this.UpperLeft[0] && mouseX < this.LowerRight[0] && mouseY > this.UpperLeft[1] && mouseY < this.LowerRight[1]) {
			if (this.Type == 'yt') {
				window.open(this.Link, '_blank');
			} else if (this.Type == 'th') {
				palette.push(palette[0]);
				palette.splice(0, 1);
				button_input_setup();
			} else {
				give_rand();
			}
		}

	}
}


class Palette {
	constructor(back, front, colors, head, backlight, play = '') {
		this.back = back;
		this.backlight = backlight;
		this.front = front;
		this.colors = colors;
		this.head = head;
		if (play == '') {
			this.play = this.front;
		} else {
			this.play = play;
		}
	}
}