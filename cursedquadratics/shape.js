
class Shape {
	constructor(vertices,step,rotation = 0, radius_theta = 0, type = 'Regular') {
	
		this.vertices = vertices;
		this.step = step;
		this.radius_theta = radius_theta;
		this.radius = 2**(sin(radius_theta)*2);
		this.mags = [];
		this.isvertex = [];
		this.rotation = rotation;
		this.start = round(this.rotation*resolution/TWO_PI);
		
		var p, increment;
		var phi = 0;
		
		if (vertices == 0){
			for (p = 0; p < resolution; p++){
				this.mags.push(1);
				this.isvertex.push(false);
			}
			
		} else if (vertices == -1){
			
			var rand1 = createVector(random(100),random(100));
			var rand2 = createVector(random(-100),random(-100));
			increment = TWO_PI/resolution;
			for (p = 0; p < resolution; p++){
				this.isvertex.push(false);
				this.mags.push(noise(rand1.x+cos(phi)*2,rand1.y+sin(phi)*2)*0.6+noise(rand2.x+cos(phi)*5,rand2.y+sin(phi)*5)*0.2+0.5);
				phi += increment;
			}
			
		} else if (vertices == -2){
			
			phi = 0.2;
			increment = 0.8/resolution;
			for (p = 0; p < resolution; p++){
				this.isvertex.push(false);
				this.mags.push(phi);
				phi += increment;
			}
			
		} else {
		
			var theta = TWO_PI*abs(step)/vertices;
			var m = sin(theta)/(1 - cos(theta));
			
			if (type == 'Smooth'){
				increment = TWO_PI*vertices/resolution;
				for (p = 0; p < resolution; p++){
					this.mags.push(cos(phi)*0.15+0.85);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % TWO_PI;
				} 
				
			} else if (type == 'Flower'){
				increment = 2*vertices/resolution;
				for (p = 0; p < resolution; p++){
					this.mags.push(abs(1-phi)*0.6+0.4);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % 2;
				} 
				
			} else {
				increment = TWO_PI*abs(step)/resolution;
				for (p = 0; p < resolution; p++){
					this.mags.push(abs(m/(sin(phi) + cos(phi)*m)));
					this.isvertex.push(phi < increment);

					phi += increment;
					if (phi >= theta){
						phi -= theta;
					}
				}
				
				if (type == 'Wiggle'){
					phi = 0;
					increment = TWO_PI*vertices*3/resolution;
					for (p = 0; p < resolution; p++){
						this.mags[p] *= cos(phi)*0.1+0.9;
						phi += increment;
					} 

				}
				
			} 
			
		}
		
		process = true;
	}
	
	rotate(angle){
		this.rotation = (angle+this.rotation) % TWO_PI;
		this.start = round(this.rotation*resolution/TWO_PI);
		process = true;
	}
	
	display(center,size){
		
		var increment = TWO_PI*this.step/resolution;
		var theta = -increment*this.start;
		size *= pow(this.radius,0.25);
		
		beginShape();
		for (var pt = 0; pt < resolution; pt++){
			
			//circle(center.x+cos(theta)*size*this.mags[pt],center.y+sin(theta)*size*this.mags[pt],pt_size);
			vertex(center.x+cos(theta)*size*this.mags[pt],center.y+sin(theta)*size*this.mags[pt]);
			
			theta += increment;
		}
		endShape();
		
	}
	
}


function reset_shapes(){
	for (var s of shapes){
		s.start = 0;
		s.radius_theta = 0;
		s.radius = 1;
		s.rotation = 0;
	}
}