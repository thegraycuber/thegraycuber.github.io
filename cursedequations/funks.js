var funk_shapes = [3,2,3];
var funk_codes = ['fQua','fPyt','fPy3'];
var active_funk = 0;

function quadratic(){
	
	for (var p = 0; p < resolution; p++){
		output_vertices.push(vertex_prep(p));
		
		let b_2 = c_sq(shapes[1].point);
		let ac4 = c_mult(c_mult(shapes[0].point,[4,0]),shapes[2].point);
		let disc = c_sub(b_2,ac4);
		
		var mag = (disc[0]**2+disc[1]**2)**0.25;
		var arg = atan2(disc[1],disc[0])/2;
		var disc_root = [mag*cos(arg),mag*sin(arg)];
		
		var denom = c_div([0.5,0],shapes[0].point);
		
		for (var out = 0; out < 2; out++){
			var numer = c_sub(disc_root,shapes[1].point);
			
			var result = c_mult(numer,denom);
			output[out].push(result);
	
			check_result_mag(result);
			disc_root = [-disc_root[0],-disc_root[1]];
		}
		
	}
}


function pythag(){
	
	for (var p = 0; p < resolution; p++){
		output_vertices.push(vertex_prep(p));
		
		var a2 = c_sq(shapes[0].point);
		var b2 = c_sq(shapes[1].point);
		
		var d2 = c_add(a2,b2);
		
		var mag = (d2[0]**2+d2[1]**2)**0.25;
		var arg = atan2(d2[1],d2[0])/2;

		var d = [mag*cos(arg),mag*sin(arg)];
		
		for (var out = 0; out < 2; out++){
			output[out].push(d);
			check_result_mag(d);
			d = [-d[0],-d[1]];
			
		}
		
	}
}


function pythag_3d(){
	for (var p = 0; p < resolution; p++){
		output_vertices.push(vertex_prep(p));
		
		var a2 = c_sq(shapes[0].point);
		var b2 = c_sq(shapes[1].point);
		var c2 = c_sq(shapes[2].point);
		
		var d2 = c_add(c_add(a2,b2),c2);
		
		var mag = (d2[0]**2+d2[1]**2)**0.25;
		var arg = atan2(d2[1],d2[0])/2;
		var d = [mag*cos(arg),mag*sin(arg)];
		
		for (var out = 0; out < 2; out++){
			output[out].push(d);
			check_result_mag(d);
			d = [-d[0],-d[1]];
			
		}
	}
}

function update_max_mag(){
	if (auto_zoom){
		if (max_mag != undefined){
			new_max_mag = min(50,new_max_mag**0.5)*0.1+max_mag*0.9;
			scalar = scalar*max_mag/new_max_mag;
		} else {
			scalar = scalar/new_max_mag;
		}
		max_mag = new_max_mag;
	} 
}

function check_result_mag(result){
	if (auto_zoom){
		var this_mag = result[0]**2+result[1]**2;
		if (this_mag > new_max_mag){
			new_max_mag = this_mag;
		}
	}
}

function vertex_prep(p){
	let vertex_index = -1;
	for (let s = 0; s < funk_shapes[active_funk]; s++){ 
		shapes[s].q = (shapes[s].q + 1) % resolution;
	
		if (shapes[s].isvertex[shapes[s].q] && vertex_index == -1){
			vertex_index = s;
		}
		
		let sh_mag = shapes[s].radius*shapes[s].mags[shapes[s].q];
		shapes[s].point = [sh_mag*cos(p*shapes[s].inc)+shapes[s].trans[0], sh_mag*sin(p*shapes[s].inc)+shapes[s].trans[1]];
	}
	return vertex_index;
}

function funk_prep(){
	for (let s = 0; s < funk_shapes[active_funk]; s++){
		shapes[s].inc = shapes[s].step*TWO_PI/resolution;
		shapes[s].q = shapes[s].start-1;
		
		let t_rad = sin(shapes[s].trans_rad_ang)*0.3;
		shapes[s].trans = [t_rad*cos(shapes[s].trans_ang),t_rad*sin(shapes[s].trans_ang)];
	}
}

