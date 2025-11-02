

var polynomial = 0;

var function_list = [
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

var output;
function p_of_shape(p_ideal, input_shape, display_function){
	
	if (display_function[0] == 'inv'){
		input_shape.true_indices = [];
		last_sig = [];
		let y_slopes = quadratic(1, p_ideal[1], -p_ideal[0]);
		if (y_slopes.length == 0){
			asymptotes = [];
		} else {
			asymptotes = [atan2(1,y_slopes[0]),atan2(1,y_slopes[1])];
		}
		inv_dist = width*5/scalar;
		
	} else if (display_function[0] == 'sqrt'){
		input_shape.true_indices = [];
		output = [[],[],[],[]];
		last_m = [[1,0],[1,0]];
	} else {
		input_shape.true_indices = [...input_shape.vertex_indices];
		
	}
	
	for (var p = 0; p < input_shape.points.length; p++){
		p_of_point(input_shape.points[p], p_ideal, display_function, p, input_shape);
	}
}

 /*
 
x = mm + ann
y = 2mn + bnn
(y/n - bn) / 2 = m

x = (yy/4nn - yb/2 + bbnn/4 + ann)

//assumes n != 0 
*/


// var root_list;
var last_m;
function p_of_point(point, p_ideal, display_function, p, input_shape){
	
	if (display_function[0] == 'inv'){
		let p_inv = [];
		if (point[1] == 0){
			p_inv = [0.5/point[0],0];
		} else {
			let y_inv = p_ideal[0]*point[1] - p_ideal[1]*point[0] - point[0]**2/point[1];
			if (y_inv == 0){
				output[0].push(p_inv);
				return;
			}
			p_inv = [-0.5*(point[0]/point[1]+p_ideal[1])/y_inv, 0.5/y_inv];	
		}
		
		let p_inv_sig = inv_sig(p_inv);
		if (asymptotes.length > 0 && last_sig.length > 0){
			if (last_sig[0] != p_inv_sig[0] || last_sig[1] != p_inv_sig[1]){
				let point_dist = (output[0][output[0].length-1][0]-p_inv[0])**2 + (output[0][output[0].length-1][1]-p_inv[1])**2
				if (point_dist > 16){
					output[0].push([last_sig[1]*cos(asymptotes[last_sig[0]])*inv_dist, last_sig[1]*sin(asymptotes[last_sig[0]])*inv_dist]);
					output[0].push([]);
					output[0].push([p_inv_sig[1]*cos(asymptotes[p_inv_sig[0]])*inv_dist, p_inv_sig[1]*sin(asymptotes[p_inv_sig[0]])*inv_dist]);
					
				}
			}	
		}
		
		if (p_inv[0]**2 + p_inv[1]**2 > 0){
			last_sig = p_inv_sig;
		} else {
			last_sig = [];
		}
	
		if (input_shape.vertex_indices.includes(p)){
			input_shape.true_indices.push(output[0].length);
		}
		output[0].push(p_inv);
		return;
		
		
	} else if (display_function[0] == 'sqrt'){
		// ASSUMES point[1] != 0
		let n2 = quadratic(p_ideal[0]+p_ideal[1]**2/4, -point[1]*p_ideal[1]/2 - point[0], point[1]**2/4);
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
					let m = (point[1]/n-p_ideal[1]*n)/2;
					
					if (last_m[ni][1] != sign(m)){
						output[ni].push([]);
						output[ni+2].push([]);
					}
					last_m[ni][1] = sign(m);
					
					output[ni].push([m,n]);
					output[ni+2].push([-m,-n]);	
				} else {
					output[ni].push([]);
					output[ni+2].push([]);
				}
			}
		}
		
		if (input_shape.vertex_indices.includes(p)){
			input_shape.true_indices.push([output[0].length-1,output[1].length-1,output[2].length-1,output[3].length-1]);
		}
		return;
	}
	
		
	let out_pos = [0,0];
	let curr_power = [1,0];
	
	for (let coeff of display_function){
		out_pos = c_add(c_scale(coeff,curr_power), out_pos);
		curr_power = i_mult(curr_power, point, p_ideal);
	}
	output[0].push(out_pos);
}


var last_sig, asymptotes, inv_dist;
function inv_sig(p_inv){
	
	let p_inv_ang = atan2(p_inv[1],p_inv[0]);
	let asym_d = [modulo(p_inv_ang-asymptotes[0]+PI/2,PI)-PI/2,modulo(p_inv_ang-asymptotes[1]+PI/2,PI)-PI/2];

	if (abs(asym_d[0]) < abs(asym_d[1])){
		return [0,sign(p_inv[1])];
	} else {
		return [1,sign(p_inv[1])];
	}
}
