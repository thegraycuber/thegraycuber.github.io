
var indexToVerts = [0,3,4,5,6,7,8,-2];//,9,10,11
var rotationAngle = 0;

class Shape {
	constructor(vertices,step,type = 'regular') {
	
		this.vertices = vertices;
		this.step = parseInt(step);
		this.points = [];
		this.vertexIndices = [];
		this.closed = true;
		this.type = type;
		
		let angleStep = TWO_PI*step/resolution;
		
		if (vertices == 0){
			for (let p = 0; p < resolution; p++){
				this.points.push([cos(angleStep*p), sin(angleStep*p)]);
			}
			

		} else if (vertices == -2){
			
			this.closed = false;
			let pointMag = 0.2;
			let increment = 0.8/resolution;
			for (let p = 0; p < resolution; p++){
				this.points.push([pointMag*cos(angleStep*p), pointMag*sin(angleStep*p)]);
				pointMag += increment;
			}
			
			this.vertexIndices = [0,resolution-1];
			
		} else {
			
			let trueRes = resolution - (resolution % vertices);
			let vertexFreq = floor(trueRes / vertices);
			let angleStep = TWO_PI*step/trueRes;
	
			let phi = 0;
			
			for (let v = 0; v < vertices; v++){
				this.vertexIndices.push(v*vertexFreq);
			}
			
			if (type == 'smooth'){
				let increment = TWO_PI*vertices/trueRes;
				for (let p = 0; p < trueRes; p++){
					let pointMag = cos(phi)*0.15+0.85;
					this.points.push([pointMag*cos(angleStep*p), pointMag*sin(angleStep*p)]);
					phi = phi+increment;
				} 
				
			} else if (type == 'flower'){
				let increment = 2*vertices/trueRes;
				for (let p = 0; p < trueRes; p++){
					let pointMag = abs(1-phi)*0.6+0.4;
					this.points.push([pointMag*cos(angleStep*p), pointMag*sin(angleStep*p)]);
					phi = (phi+increment) % 2;
				} 
				
			} else {
				
				let theta = TWO_PI*abs(step)/vertices;
				let m = sin(theta)/(1 - cos(theta));
				let increment = TWO_PI*abs(step)/trueRes;
				
				for (let p = 0; p < trueRes; p++){
					let pointMag = abs(m/(sin(phi) + cos(phi)*m));
					this.points.push([pointMag*cos(angleStep*p), pointMag*sin(angleStep*p)]);

					phi += increment;
					if (phi >= theta){
						phi -= theta;
					}
				}
				
				if (type == 'wiggle'){
					phi = 0;
					increment = TWO_PI*vertices*3/trueRes;
					for (let p = 0; p < trueRes; p++){
						this.points[p][0] *= cos(phi)*0.06+0.94;
						this.points[p][1] *= cos(phi)*0.06+0.94;
						phi += increment;
					} 

				}
				
			} 
		}
		this.rotate(rotationAngle);
		
		// if (gameMode || this.vertices == 0){
		// 	iconBox.getItem('spin').Active = false;
		// } else {
		// 	iconBox.getItem('spin').Active = true;
		// }
	}
		
	rotate(angle){
		
		let trigs = [cos(angle), sin(angle)];
		
		for (let p = 0; p < this.points.length; p++){
			this.points[p] = multC(this.points[p],trigs);
		}
		
	}
	
	display(center,size){
		
		push();
		translate(center[0]+functionList[controllers['arrow-function'].index][2]*size,center[1]);
		
		beginShape();
		for (let pt of this.points){
			circle(pt[0]*size,-pt[1]*size,size*0.15);
		}
		endShape();
		
		pop();
		
	}
	
	displayOutput(displayColor, vertexColor, displayIdeal, displayFunction, adjust = 1){
		
		output = [[]];
		pOfShape(displayIdeal, this, displayFunction);

		onlyStroke(displayColor,0.3*adjust*circleWidth/scalar);
		beginShape();

		for (let out of output){
			for (let o = 0; o < out.length; o++){
				if (out[o].length > 0){
					vertex(out[o][0],-out[o][1]);
				} else {
					endShape();
					beginShape();
				}
			}
		}
		
		if (this.closed && displayFunction[0] != 'inv' && displayFunction[0] != 'sqrt'){
			endShape(CLOSE);
		} else {
			endShape();
		}

		onlyFill(vertexColor);
		for (let out = 0; out < output.length; out++){
			for (let o of this.trueIndices){
				if (displayFunction[0] == 'sqrt'){
					if (output[out][o[out]].length > 0){
						circle(output[out][o[out]][0], -output[out][o[out]][1], adjust*circleWidth/scalar);
					}
				} else if (output[out][o].length > 0){
					circle(output[out][o][0], -output[out][o][1], adjust*circleWidth/scalar);
				}
			}
		}
		
		
	}
	
}

var lapText = ['','1 lap','2 laps','3 laps','4 laps','5 laps','6 laps'];
function allowedLaps(vertices){
	
	steps = [];
	var step;
	
	if (vertices == -1 || vertices == 0){
		return ['1 lap']; 
		
	} else if (vertices == -2){
		for (step = 1; step <= 3; step++){
				steps.push(lapText[step]);	
		}
		
	} else {
		for (step = 1; step < vertices/2; step++){
			if (step != 0 && gcd(vertices,abs(step)) == 1){
				steps.push(lapText[step]);
			}
		}
	}
	return steps;
	
}



/*################################################################################

							FUNCTIONS

###############################################################################*/

var polynomial = 0;
var functionList = [
	// ['x', '', 0, [0,1]],
	['x²', '      ²', -0.1, [0,0,1]],
	['x³', '      ³', -0.1, [0,0,0,1]],
	['x⁴', '      ⁴', -0.1, [0,0,0,0,1]],
	['x⁵', '      ⁵', -0.1, [0,0,0,0,0,1]],
	// ['x⁶', '      ⁶', 0, [0,0,0,0,0,0,1]],
	// ['x⁷', '      ⁷', 0, [0,0,0,0,0,0,0,1]],
	// ['phi3', '      ⁵', 0, [1,1,1]],
	// ['phi6', '      ⁵', 0, [1,-1,1]],
	// ['phi5', '      ⁵', 0, [1,1,1,1,1]],
	// ['phi12', '      ⁵', 0, [1,0,-1,0,1]],
	// ['phi15', '      ⁵', 0, [1,-1,0,1,-1,1,0,-1,1]],
	// ['neck4', '      ⁵', 0, [0,0,-1,0,1]],
	// ['neck6', '      ⁵', 0, [0,1,-1,0,0,-1,0,0,0,0,1]],
	
	['sine', 'sin(     )', 1.1, [0,1,0,-1/6,0,1/120,0,-1/5040,0,1/362880]],
	['cosine', 'cos(     )', 1.25, [1,0,-1/2,0,1/24,0,-1/720,0,1/40320]],
	['tangent', 'tan(     )', 1.15, [0,1,0,1/3,0,2/15,0,17/315,0,62/2835,0,1382/155925]],
	['exponential', 'exp(     )', 1.3, [1,1,1/2,1/6,1/24,1/120,1/720,1/5040,1/40320,1/362880]],
	['square root', '√     ', 0.6, ['sqrt']],
	['inverse', '      ⁻¹', -0.2, ['inv']],
]; 


function idealLocation(mobileLocation){
	// if (mobileLocation){
	// 	let xPerc = (ideal[0]*scalar+origin.x-defaultOrigin.x)/scalar;
	// 	let yPerc = (-ideal[1]*scalar+origin.y-defaultOrigin.y)/scalar;
	// 	if (abs(xPerc) > 1.05 || abs(yPerc) > 1.05){
	// 	return [];
	// 	}
	// 	return [];//addC(dot(scaleC(0.4,[xPerc,yPerc]),mobileBox.Size),mobileBox.Coords);
	// } else {
		return [ideal[0]*scalar+origin.x, -ideal[1]*scalar+origin.y];
	// }
}


function iMult(cA,cB,pIdeal){
	return [cA[0]*cB[0]+cA[1]*cB[1]*pIdeal[0],cA[0]*cB[1]+cA[1]*cB[0]+cA[1]*cB[1]*pIdeal[1]];
}


var output;
function pOfShape(pIdeal, inputShape, displayFunction){
	
	if (displayFunction[0] == 'inv'){
		inputShape.trueIndices = [];
		lastSig = [];
		let ySlopes = quadratic(1, pIdeal[1], -pIdeal[0]);
		if (ySlopes.length == 0){
			asymptotes = [];
		} else {
			asymptotes = [atan2(1,ySlopes[0]),atan2(1,ySlopes[1])];
		}
		invDist = width*5/scalar;
		
	} else if (displayFunction[0] == 'sqrt'){
		inputShape.trueIndices = [];
		output = [[],[],[],[]];
		lastM = [[1,0],[1,0]];
	} else {
		inputShape.trueIndices = [...inputShape.vertexIndices];
		
	}
	
	for (var p = 0; p < inputShape.points.length; p++){
		pOfPoint(inputShape.points[p], pIdeal, displayFunction, p, inputShape);
	}
}


// var rootList;
var lastM;
function pOfPoint(point, pIdeal, displayFunction, p, inputShape){
	
	if (displayFunction[0] == 'inv'){
		let pInv = [];
		if (point[1] == 0){
			pInv = [0.5/point[0],0];
		} else {
			let yInv = pIdeal[0]*point[1] - pIdeal[1]*point[0] - point[0]**2/point[1];
			if (yInv == 0){
				output[0].push(pInv);
				return;
			}
			pInv = [-0.5*(point[0]/point[1]+pIdeal[1])/yInv, 0.5/yInv];	
		}
		
		let pInvSig = invSig(pInv);
		if (asymptotes.length > 0 && lastSig.length > 0){
			if (lastSig[0] != pInvSig[0] || lastSig[1] != pInvSig[1]){
				let pointDist = (output[0][output[0].length-1][0]-pInv[0])**2 + (output[0][output[0].length-1][1]-pInv[1])**2
				if (pointDist > 16){
					output[0].push([lastSig[1]*cos(asymptotes[lastSig[0]])*invDist, lastSig[1]*sin(asymptotes[lastSig[0]])*invDist]);
					output[0].push([]);
					output[0].push([pInvSig[1]*cos(asymptotes[pInvSig[0]])*invDist, pInvSig[1]*sin(asymptotes[pInvSig[0]])*invDist]);
					
				}
			}	
		}
		
		if (pInv[0]**2 + pInv[1]**2 > 0){
			lastSig = pInvSig;
		} else {
			lastSig = [];
		}
	
		if (inputShape.vertexIndices.includes(p)){
			inputShape.trueIndices.push(output[0].length);
		}
		output[0].push(pInv);
		return;
		
		
	} else if (displayFunction[0] == 'sqrt'){
		// ASSUMES point[1] != 0
		let n2 = quadratic(pIdeal[0]+pIdeal[1]**2/4, -point[1]*pIdeal[1]/2 - point[0], point[1]**2/4);
		// 0 = n^4 (a+bb/4) + n^2 (-yb/2-x) + yy/4

		//.  yb/2 + x   comp.  xyb + xx - ayy 
		
		//(y/n - bn) / 2 = m
		if (n2.length == 0){
			output[0].push([]);
			output[1].push([]);
			output[2].push([]);
			output[3].push([]);
			return;
		} else {
			if(round(n2[0],3) == round(n2[1],3)){
				n2[1] = -1;
			}
			for (let ni = 0; ni < 2; ni++){
				if (n2[ni] > 0){
					let n = n2[ni]**0.5;
					let m = (point[1]/n-pIdeal[1]*n)/2;
					
					if (lastM[ni][1] != sign(m)){
						output[ni].push([]);
						output[ni+2].push([]);
					}
					lastM[ni][1] = sign(m);
					
					output[ni].push([m,n]);
					output[ni+2].push([-m,-n]);	
				} else {
					output[ni].push([]);
					output[ni+2].push([]);
				}
			}
		}
		
		if (inputShape.vertexIndices.includes(p)){
			inputShape.trueIndices.push([output[0].length-1,output[1].length-1,output[2].length-1,output[3].length-1]);
		}
		return;
	}
	
		
	let outPos = [0,0];
	let currPower = [1,0];
	
	for (let coeff of displayFunction){
		outPos = addC(scaleC(coeff,currPower), outPos);
		currPower = iMult(currPower, point, pIdeal);
	}
	output[0].push(outPos);
}


var lastSig, asymptotes, invDist;
function invSig(pInv){
	
	let pInvAng = atan2(pInv[1],pInv[0]);
	let asymD = [modulo(pInvAng-asymptotes[0]+PI/2,PI)-PI/2,modulo(pInvAng-asymptotes[1]+PI/2,PI)-PI/2];

	if (abs(asymD[0]) < abs(asymD[1])){
		return [0,sign(pInv[1])];
	} else {
		return [1,sign(pInv[1])];
	}
}
