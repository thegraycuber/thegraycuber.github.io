


function getDistance(pointA, pointB){
	let delta = subC(pointA, pointB);
	return abs(delta[0]**2 + delta[1]**2)**0.5;
}

function getTost(tostPoint, focusPoints=points, focusweights=weights){

	tostValue = 0;
	for (let p = 0; p < focusPoints.length; p++){
		for (let q = 0; q < focusPoints[p].length; q++){
			tostValue += focusweights[p]*getDistance(focusPoints[p][q],tostPoint);
		}
	}
	return tostValue;
}

// function smoothPoints(){
// 	let reach = 100;
// 	let step = 12;

// 	let p0 = [...points[0]];

// 	let currentTosts = [];
// 	for (let k = 0; k < step; k++){
// 		currentTosts.push(getTost(angleC(TWO_PI*k/step)));
// 	}

// 	points[0] = addC(points[0],[-0.02,0]);
// 	let zontTosts = [];
// 	for (let k = 0; k < step; k++){
// 		zontTosts.push(getTost(angleC(TWO_PI*k/step)));
// 	}

// 	points[0] = addC(points[0],[0.02,-0.02]);
// 	let vertTosts = [];
// 	for (let k = 0; k < step; k++){
// 		vertTosts.push(getTost(angleC(TWO_PI*k/step)));
// 	}

// 	points[0] = addC(points[0],[0,0.02]);

// 	let currentStd = standardDev(currentTosts);
// 	let adder = [
// 		constrain(-(standardDev(zontTosts)-currentStd)/currentStd,-0.02,0.02),
// 		constrain(-(standardDev(vertTosts)-currentStd)/currentStd,-0.02,0.02),
// 	];
// 	points[0] = addC(points[0],adder);
// }

// function standardDev(stdValues){
// 	let meanValue = 0;
// 	for (let s of stdValues){
// 		meanValue += s;
// 	}
// 	meanValue /= stdValues.length;

// 	let stdDev = 0;
// 	for (let s of stdValues){
// 		stdDev += (s-meanValue)**2;
// 	}
// 	return (stdDev/stdValues.length)**0.5;
// }



const basicVert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;


const threellipseFrag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 origin;
uniform float scalar;

uniform vec4 back;
uniform vec4 mono;

uniform float distance;
uniform float bands;
uniform float gradient;

uniform int point_count;
uniform float points[60];
uniform float weights[30];

void main(){

	gl_FragColor = back;
	vec2 coordinate = (gl_FragCoord.xy-origin)/scalar;

	float tost = 0.0;
	float point_dist = 0.0;

	for (int i = 0; i < 30; ++i){
		if (i == point_count){break;}

		point_dist = length(coordinate - vec2(points[i*2],points[i*2+1]));
		tost += weights[i]*point_dist;
	}

	float lerpy = pow(sin(log(abs(distance-tost)*gradient+0.5)*2.0+2.8)*0.5+0.5,2.);

	gl_FragColor = mix(back,mono,floor(lerpy*bands)/bands);

}
`;


function colorToUniform(shader,colorKey){
	shader.setUniform(colorKey,
		 colorToVector(palette[colorKey])
	);
}
