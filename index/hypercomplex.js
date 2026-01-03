
var hyper_shape;
var hyper_ang = 0;
function hyperPrep(){
	hyper_shape = new HyperShape(floor(random()*5+4));
}

function hyperDraw(){
	scale(px*2,-px*2);
	
	if (mobile){
		hyper_ang += 0.04;
		hyper_ideal = [1.5*cos(hyper_ang*0.71), 1.5*cos(hyper_ang*0.47)];
		
	} else {
		hyper_ideal = [(mouseX-width/2)/scalar, -(mouseY-height/2)/scalar];
	}

	hyper_shape.rotate(PI/360);
	hyper_shape.display_output();
}

class HyperShape {
	constructor(vertices) {
	
		this.vertices = vertices;
		this.points = [];
		this.vertex_indices = [];
		
		let hyper_res = 720 - (720 % vertices);
		let vertex_freq = floor(hyper_res / vertices);
		let angle_step = TWO_PI/hyper_res;

		let phi = 0;

		for (let v = 0; v < vertices; v++){
			this.vertex_indices.push(v*vertex_freq);
		}

		let increment = TWO_PI*vertices/hyper_res;
		for (let p = 0; p < hyper_res; p++){
			let point_mag = cos(phi)*0.15+0.85;
			this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);
			phi = phi+increment;
		} 
	}
		
	rotate(angle){
		
		let trigs = [cos(angle), sin(angle)];
		
		for (let p = 0; p < this.points.length; p++){
			this.points[p] = c_mult(this.points[p],trigs);
		}
	}
	
	display_output(){
		
		noFill();
		stroke(palette[0].front);
		strokeWeight(0.08);//px*0.15
		beginShape();

		for (let p of this.points){
			let p2 = i_mult(p,p);
			let p3 = i_mult(p,p2);
			vertex(p3[0],-p3[1]);
		}
		
		endShape();
	
		noStroke();
		fill(palette[0].bright);
		for (let i of this.vertex_indices){
			let p = this.points[i];
			let p2 = i_mult(p,p);
			let p3 = i_mult(p,p2);
			circle(p3[0],-p3[1],0.25);
		}
		
		
	}
	
}


var hyper_ideal = [-1,0];
function i_mult(c_a,c_b){
	return [c_a[0]*c_b[0]+c_a[1]*c_b[1]*hyper_ideal[0],c_a[0]*c_b[1]+c_a[1]*c_b[0]+c_a[1]*c_b[1]*hyper_ideal[1]];
}

function c_mult(c_a,c_b){
	return [c_a[0]*c_b[0]-c_a[1]*c_b[1],c_a[0]*c_b[1]+c_a[1]*c_b[0]];
}