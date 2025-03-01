function gcd(a,b){
	
	if (a < b){
		c = a;
		a = b;
		b = c;
	}
	
	r = a%b;
	while (r != 0){
		a = b;
		b = r;
		r = a%b;
	}
	return b;
}

function quadratic(){
	
	var new_max_mag = 0;
	
	output = [[],[]];
	output_vertices = [];
	var inc_b2 = shapes[1].step*2*TWO_PI/resolution;
	var inc_b = shapes[1].step*TWO_PI/resolution;
	var inc_ac = (shapes[0].step+shapes[2].step)*TWO_PI/resolution;
	var inc_a = shapes[0].step*TWO_PI/resolution;
	var last_arg = 0;
	var rad02 = shapes[0].radius*shapes[2].radius;
	var rad11 = shapes[1].radius**2;
	var q = [shapes[0].start-1,shapes[1].start-1,shapes[2].start-1];
	
	for (var p = 0; p < resolution; p++){
		
		var vertex_index = -1;
		for (var qindex = 0; qindex < 3; qindex++){
			q[qindex] += 1;
			if (q[qindex] == resolution){
				q[qindex] = 0;
			}
			if (shapes[qindex].isvertex[q[qindex]] && vertex_index == -1){
				vertex_index = qindex;
			}
		}
		output_vertices.push(vertex_index);
		
		var b2 = [rad11*(shapes[1].mags[q[1]]**2)*cos(p*inc_b2),rad11*(shapes[1].mags[q[1]]**2)*sin(p*inc_b2)];
		var ac = [rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*cos(p*inc_ac),rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*sin(p*inc_ac)];
		var disc = [b2[0]-4*ac[0],b2[1]-4*ac[1]];
		//console.log(b2);
		
		var mag = (disc[0]**2+disc[1]**2)**0.25;
		var arg = atan2(disc[1],disc[0])/2;
		
		var a_inv2 = [cos(p*inc_a)/(2*shapes[0].mags[q[0]]*shapes[0].radius),-sin(p*inc_a)/(2*shapes[0].mags[q[0]]*shapes[0].radius)];
		for (var out = 0; out < 2; out++){
			var numer = [mag*cos(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*cos(p*inc_b),mag*sin(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*sin(p*inc_b)];
			var result = [numer[0]*a_inv2[0]-numer[1]*a_inv2[1],numer[0]*a_inv2[1]+numer[1]*a_inv2[0]];
			output[out].push(result);
	
			if (auto_zoom){
				var this_mag = pow(result[0],2)+pow(result[1],2);
				if (this_mag > new_max_mag){
					new_max_mag = this_mag;
				}
			}
			
		}
		
	}
	
	if (auto_zoom){
		new_max_mag = (new_max_mag**0.5);
		if (max_mag != undefined){
			scalar = scalar*max_mag/new_max_mag;
		} else {
			scalar = scalar/new_max_mag;
		}
		max_mag = new_max_mag;
	} 
	
}

function action(id,index,value){
	
	var vst;
	if (id == 'shape'){
		activeShape = index;
		for (var box of shapeBox){
			box.Items[box.getIndex('shape')].Index = index;
		}
	} else if (id == 'vertices'){
		
		var step_item = shapeBox[activeShape].Items[shapeBox[activeShape].getIndex('step')];
		var step = int(step_item.List[step_item.Index]);
		step_item.List = allowed_steps(index_to_verts[index]);
		if (step > 0){
			step_item.Index = step_item.List.length-1;
			while(int(step_item.List[step_item.Index]) > step){
				step_item.Index--;
			}
		} else {
			step_item.Index = 0;
			while(int(step_item.List[step_item.Index]) < step){
				step_item.Index++;
			}
		}
		vst = shape_info(shapeBox[activeShape]);
		
		var type_item = shapeBox[activeShape].Items[shapeBox[activeShape].getIndex('type')];
		if (index_to_verts[index] > 0){
			type_item.List = ['Regular','Flower','Wiggle','Smooth'];
		} else {
			type_item.List = ['Regular'];
			type_item.giveValue(0);
		}
		shapes[activeShape] = new Shape(index_to_verts[index],vst[1],shapes[activeShape].rotation,shapes[activeShape].radius_theta,vst[2]);
		
	} else if (id == 'step'){
	
		vst = shape_info(shapeBox[activeShape]);
		shapes[activeShape] = new Shape(vst[0],int(value),shapes[activeShape].rotation,shapes[activeShape].radius_theta,vst[2]);
		
	} else if (id == 'type'){
		
		vst = shape_info(shapeBox[activeShape]);
		shapes[activeShape] = new Shape(vst[0],vst[1],shapes[activeShape].rotation,shapes[activeShape].radius_theta,value);
		
	} else if (id == 'resoution'){
		resolution = int(value);
		for (var s = 0; s < 3; s++){
			vst = shape_info(shapeBox[s]);
			shapes[s] = new Shape(vst[0],vst[1],shapes[s].rotation,shapes[s].radius_theta,vst[2]);
			
		}
		
	} else if (id == 'autozoom'){
		
		if (value == 'On'){
			auto_zoom = true;
			origin = default_origin.copy();
			process = true;
			scalar = unit/max_mag;
		} else {
			auto_zoom = false;
		}
		
	} else if (id == 'grid'){		
		show_grid = index == 0;
		
	} else if (id == 'show_vertices'){		
		show_vertices = index == 0;
		
	} else if (id == 'color'){	
		palette.getColors(value);
		
	}
}

function allowed_steps(vertices){
	
	steps = [];
	var step;
	
	if (vertices == -1){
		return [-1,1]; 
		
	} else if (vertices <= 0){
		for (step = -4; step <= 4; step++){
			if (step != 0){
				steps.push(str(step));	
			}
		}
		
	} else {
		for (step = -int((vertices-1)/2); step < vertices/2; step++){
			if (step != 0 && gcd(vertices,abs(step)) == 1){
				steps.push(str(step));
			}
		}
	}
	return steps;
	
}

var index_to_verts = [0,3,4,5,6,7,8,9,10,11,12,13,-1,-2];

function shape_info(box){
	var vert_item = box.Items[box.getIndex('vertices')];
	var step_item = box.Items[box.getIndex('step')];
	var type_item = box.Items[box.getIndex('type')];
	return([index_to_verts[vert_item.Index],int(step_item.List[step_item.Index]),type_item.List[type_item.Index]]);
}
