
var index_to_verts = [0,3,4,5,6,7,8,-2];//,9,10,11
var rotation_angle = 0;

class Shape {
	constructor(vertices,step,type = 'Regular') {
	
		this.vertices = vertices;
		this.step = step;
		this.points = [];
		this.vertex_indices = [];
		this.closed = true;
		this.type = type;
		
		let angle_step = TWO_PI*step/resolution;
		
		if (vertices == 0){
			for (let p = 0; p < resolution; p++){
				this.points.push([cos(angle_step*p), sin(angle_step*p)]);
			}
			
		// } else if (vertices == -1){
			
		// 	let phi = 0;
		// 	var rand1 = createVector(random(100),random(100));
		// 	var rand2 = createVector(random(-100),random(-100));
		// 	for (let p = 0; p < resolution; p++){
		// 		let point_mag = (noise(rand1.x+cos(phi)*2,rand1.y+sin(phi)*2)*0.6+noise(rand2.x+cos(phi)*5,rand2.y+sin(phi)*5)*0.2+0.5);
		// 		this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);
		// 		phi += abs(angle_step);
		// 	}
			
		} else if (vertices == -2){
			
			this.closed = false;
			let point_mag = 0.2;
			let increment = 0.8/resolution;
			for (let p = 0; p < resolution; p++){
				this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);
				point_mag += increment;
			}
			
			this.vertex_indices = [0,resolution-1];
			
		} else {
			
			let true_res = resolution - (resolution % vertices);
			let vertex_freq = floor(true_res / vertices);
			let angle_step = TWO_PI*step/true_res;
	
			let phi = 0;
			
			for (let v = 0; v < vertices; v++){
				this.vertex_indices.push(v*vertex_freq);
			}
			
			if (type == 'smooth'){
				let increment = TWO_PI*vertices/true_res;
				for (let p = 0; p < true_res; p++){
					let point_mag = cos(phi)*0.15+0.85;
					this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);
					phi = phi+increment;
				} 
				
			} else if (type == 'flower'){
				let increment = 2*vertices/true_res;
				for (let p = 0; p < true_res; p++){
					let point_mag = abs(1-phi)*0.6+0.4;
					this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);
					phi = (phi+increment) % 2;
				} 
				
			} else {
				
				let theta = TWO_PI*abs(step)/vertices;
				let m = sin(theta)/(1 - cos(theta));
				let increment = TWO_PI*abs(step)/true_res;
				
				for (let p = 0; p < true_res; p++){
					let point_mag = abs(m/(sin(phi) + cos(phi)*m));
					this.points.push([point_mag*cos(angle_step*p), point_mag*sin(angle_step*p)]);

					phi += increment;
					if (phi >= theta){
						phi -= theta;
					}
				}
				
				if (type == 'wiggle'){
					phi = 0;
					increment = TWO_PI*vertices*3/true_res;
					for (let p = 0; p < true_res; p++){
						this.points[p][0] *= cos(phi)*0.06+0.94;
						this.points[p][1] *= cos(phi)*0.06+0.94;
						phi += increment;
					} 

				}
				
			} 
		}
		
		this.rotate(rotation_angle);
		
		if (game_mode || this.vertices == 0){
			iconBox.getItem('spin').Active = false;
		} else {
			iconBox.getItem('spin').Active = true;
		}
	}
		
	rotate(angle){
		
		let trigs = [cos(angle), sin(angle)];
		
		for (let p = 0; p < this.points.length; p++){
			this.points[p] = c_mult(this.points[p],trigs);
		}
		
	}
	
	display(center,size){
		
		push();
		translate(center[0],center[1]);
		
		beginShape();
		for (let pt of this.points){
			circle(pt[0]*size,-pt[1]*size,size*0.15);
		}
		endShape();
		
		pop();
		
	}
	
	display_output(display_color, vertex_color, display_ideal, display_function, adjust = 1){
		
		output = [[]];
		p_of_shape(display_ideal, this, display_function);

		onlyStroke(display_color,adjust*circle_width/scalar);
		beginShape();

		for (let out of output){
			for (let o = 0; o < out.length; o++){
				// circle(out[o][0], -out[o][1], circle_width*2/scalar);
				if (out[o].length > 0){
					vertex(out[o][0],-out[o][1]);
				} else {
					endShape();
					beginShape();
				}
				// vertex(out[o][0]-out[o][1]/2,-out[o][1]/2);
			}
		}
		
		if (this.closed && display_function[0] != 'inv' && display_function[0] != 'sqrt'){
			endShape(CLOSE);
		} else {
			endShape();
		}

		onlyFill(vertex_color);
		for (let out = 0; out < output.length; out++){
			for (let o of this.true_indices){
				if (display_function[0] == 'sqrt'){
					if (output[out][o[out]].length > 0){
						circle(output[out][o[out]][0], -output[out][o[out]][1], adjust*vert_width/scalar);
					}
				} else if (output[out][o].length > 0){
					circle(output[out][o][0], -output[out][o][1], adjust*vert_width/scalar);
				}
			}
		}
		
		
	}
	
}

