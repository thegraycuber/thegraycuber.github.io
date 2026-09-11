


function getDistance(pointA, pointB){
	let delta = subC(pointA, pointB);
	return abs(delta[0]**2 + delta[1]**2)**0.5;
}

function getPointCount(){
	let pointAmount = 0;
	for (let p of points){
		pointAmount += p.length;
	}
	return pointAmount;
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

function prepareVectors(){
	pointVec = [];
	weightVec = [];
	for (let p = 0; p < points.length; p++){
		for (let q = 0; q < points[p].length; q++){
			pointVec.push(...points[p][q]);	
			weightVec.push(weights[p]);
		}
	}
}

function updateRepeats(p, q, r = -1){
	let repeat = (r == -1) ? points[p].length : r;
	let diff = subC(points[p][q], center);
	let spinner = angleC(TWO_PI/repeat);
	for (let k = 1; k < repeat; k++){
		diff = multC(spinner,diff);
		points[p][modulo(q+k,repeat)] = [...addC(diff,center)];
	}
}


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
precision highp float;
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

