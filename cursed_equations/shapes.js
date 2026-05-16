
var shapeVersions = ['circle','triangle','square','pentagon','hexagon','heptagon','octagon',
 '9gon','10gon','11gon','12gon','13gon','rock','spiral'];
var indexToVerts = [0,3,4,5,6,7,8,9,10,11,12,13,-1,-2];

class Shape {
	constructor(vertices,step,rotation = 0, radiusTheta = 0, type = 'regular', animation = 'off') {
	
		this.vertices = vertices;
		this.step = step;
		this.type = type;
		this.radiusTheta = radiusTheta;
		this.radius = 2**(sin(radiusTheta)*2);
		this.mags = [];
		this.isvertex = [];
		this.rotation = rotation;
		this.start = round(this.rotation*resolution/TWO_PI);
		this.transRadAng = 0;
		this.transAng = 0;
		this.animation = animation;
		
		let p, increment;
		let phi = 0;
		
		if (vertices == 0){
			for (p = 0; p < resolution; p++){
				this.mags.push(1);
				this.isvertex.push(false);
			}
			
		} else if (vertices == -1){
			
			let rand1 = createVector(random(100),random(100));
			let rand2 = createVector(random(-100),random(-100));
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
			this.isvertex[0] = true;
			this.isvertex[this.isvertex.length - 1] = true;
			
		} else {
		
			let theta = TWO_PI*abs(step)/vertices;
			let m = sin(theta)/(1 - cos(theta));
			
			if (type == 'smooth'){
				increment = TWO_PI*vertices/resolution;
				for (p = 0; p < resolution; p++){
					this.mags.push(cos(phi)*0.15+0.85);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % TWO_PI;
				} 
				
			} else if (type == 'flower'){
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
				
				if (type == 'wiggle'){
					phi = 0;
					increment = TWO_PI*vertices*3/resolution;
					for (p = 0; p < resolution; p++){
						this.mags[p] *= cos(phi)*0.1+0.9;
						phi += increment;
					} 

				}
				
			} 
			
		}
		
		processFrame = true;
	}
	
	rotate(angle){
		
		this.rotation = (angle+this.rotation) % TWO_PI;
		this.start = round(this.rotation*resolution/TWO_PI);
		processFrame = true;
	}
	
	display(center,size){
		
		push();
		translate(this.trans[0]*size,this.trans[1]*size);
		
		let increment = TWO_PI*this.step/resolution;
		let theta = increment*this.start;
		size *= pow(this.radius,0.25);
		
		beginShape();
		for (let pt = 0; pt < resolution; pt++){
			vertex(center.x+cos(theta)*size*this.mags[pt],center.y+sin(theta)*size*this.mags[pt]);
			theta += increment;
		}
		endShape();
		pop();
		
	}

	reset(){
		this.start = 0;
		this.radiusTheta = 0;
		this.radius = 1;
		this.rotation = 0;
		this.transAng = 0;
		this.transRadAng = 0;
		
	}
	
}


// function resetShapes(){
// 	for (let s of shapes){
// 	}
// }


function allowedSteps(vertices){
	
	let steps = [];
	
	if (vertices == -1){
		return ['-1','1']; 
		
	} else if (vertices <= 0){
		for (let step = -4; step <= 4; step++){
			if (step != 0){
				steps.push(str(step));	
			}
		}
		
	} else {
		for (let step = -int((vertices-1)/2); step < vertices/2; step++){
			if (step != 0 && gcd(vertices,abs(step)) == 1){
				steps.push(str(step));
			}
		}
	}
	return steps;
	
}

var funkShapes = [3,2,3];
var funkCodes = ['fqua','fpyt','fpy3'];
var funkText = ['     x² +      x +      = 0','√(      ² +       ²)','√(      ² +       ² +       ²)'];
var activeFunk = 0;

function prepFunk(){
	
	for (let s = 0; s < funkShapes[activeFunk]; s++){
		shapes[s].inc = shapes[s].step*TWO_PI/resolution;
		shapes[s].q = shapes[s].start-1;
		
		let tRad = sin(shapes[s].transRadAng)*0.3;
		shapes[s].trans = [tRad*cos(shapes[s].transAng),tRad*sin(shapes[s].transAng)];
	
	}
}

	
function applyFunk(){
	maxMag = 0;

	if (funkCodes[activeFunk] == 'fqua'){
		
		for (let p = 0; p < resolution; p++){
			outputVertices.push(prepVertices(p));
			
			let b2 = squareC(shapes[1].point);
			let ac4 = multC(multC(shapes[0].point,[4,0]),shapes[2].point);
			let disc = subC(b2,ac4);
			
			let mag = (disc[0]**2+disc[1]**2)**0.25;
			let arg = atan2(disc[1],disc[0])/2;
			let discRoot = [mag*cos(arg),mag*sin(arg)];
			
			let denom = divC([0.5,0],shapes[0].point);
			
			for (let out = 0; out < 2; out++){
				let numer = subC(discRoot,shapes[1].point);
				
				let result = multC(numer,denom);
				output[out].push(result);
		
				checkResultMag(result);
				discRoot = [-discRoot[0],-discRoot[1]];
			}
			
		}

		
	} else if (funkCodes[activeFunk] == 'fpyt'){
		
		for (let p = 0; p < resolution; p++){
			outputVertices.push(prepVertices(p));
			
			let a2 = squareC(shapes[0].point);
			let b2 = squareC(shapes[1].point);
			
			let d2 = addC(a2,b2);
			
			let mag = (d2[0]**2+d2[1]**2)**0.25;
			let arg = atan2(d2[1],d2[0])/2;
	
			let d = [mag*cos(arg),mag*sin(arg)];
			// d = scaleC(PI,multC(d,shapes[0].point));
			
			for (let out = 0; out < 2; out++){
				// output[out].push(d);
				let res = addC(d,scaleC(PI,a2));
				output[out].push(res);
				checkResultMag(res);
				d = [-d[0],-d[1]];
			}
			
		}
		
	} else if (funkCodes[activeFunk] == 'fpy3'){
	
		for (let p = 0; p < resolution; p++){
			outputVertices.push(prepVertices(p));
			
			let a2 = squareC(shapes[0].point);
			let b2 = squareC(shapes[1].point);
			let c2 = squareC(shapes[2].point);
			
			let d2 = addC(addC(a2,b2),c2);
			
			let mag = (d2[0]**2+d2[1]**2)**0.25;
			let arg = atan2(d2[1],d2[0])/2;
			let d = [mag*cos(arg),mag*sin(arg)];
			
			for (let out = 0; out < 2; out++){
				output[out].push(d);
				checkResultMag(d);
				d = [-d[0],-d[1]];
				
			}
		}
	}


		
}


var magLerp = 1;
var maxMag;
function updateMaxMag(){
	if (autoZoom){
		scalar = lerp(scalar,defaultScalar/maxMag**0.5,magLerp);
		origin = p5.Vector.lerp(origin,defaultOrigin,magLerp);
	} 
	magLerp = lerp(magLerp,0.06,0.06);
}

function checkResultMag(result){
	if (autoZoom){
		let thisMag = result[0]**2+result[1]**2;
		if (thisMag > maxMag){
			maxMag = thisMag;
		}
	}
}

function prepVertices(p){
	let vertexIndex = -1;
	for (let s = 0; s < funkShapes[activeFunk]; s++){ 
		shapes[s].q = (shapes[s].q + 1) % resolution;
	
		if (shapes[s].isvertex[shapes[s].q] && vertexIndex == -1){
			vertexIndex = s;
		}
		
		let shMag = shapes[s].radius*shapes[s].mags[shapes[s].q];
		shapes[s].point = [shMag*cos(p*shapes[s].inc)+shapes[s].trans[0], shMag*sin(p*shapes[s].inc)+shapes[s].trans[1]];

	}
	return vertexIndex;
}

