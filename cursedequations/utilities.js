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

function action(id,index,value,s){
	var vst;
	
	if (id == 'shape'){
		activeShape = index;
		for (var box of shapeBox){
			box.Items[box.getIndex('shape')].Index = index;
		}
	} else if (id == 'vertices'){
		
		var step_item = shapeBox[s].Items[shapeBox[s].getIndex('step')];
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
		vst = shape_info(shapeBox[s]);
		
		var type_item = shapeBox[s].Items[shapeBox[s].getIndex('type')];
		if (index_to_verts[index] > 0){
			type_item.List = ['Regular','Flower','Wiggle','Smooth'];
		} else {
			type_item.List = ['Regular'];
			type_item.giveValue(0);
		}
		shapes[s] = new Shape(index_to_verts[index],vst[1],shapes[s].rotation,shapes[s].radius_theta,vst[2]);
		
	} else if (id == 'step'){
	
		vst = shape_info(shapeBox[s]);
		shapes[s] = new Shape(vst[0],int(value),shapes[s].rotation,shapes[s].radius_theta,vst[2]);
		
	} else if (id == 'type'){
		
		vst = shape_info(shapeBox[s]);
		shapes[s] = new Shape(vst[0],vst[1],shapes[s].rotation,shapes[s].radius_theta,value);
		
	} else if (id == 'resoution'){
		resolution = int(value);
		for (s = 0; s < 3; s++){
			vst = shape_info(shapeBox[s]);
			shapes[s] = new Shape(vst[0],vst[1],shapes[s].rotation,shapes[s].radius_theta,vst[2]);
			
		}
		
	} else if (id == 'autozoom'){
		
		if (value == 'Off'){
			auto_zoom = false;
		} else {
			auto_zoom = true;
			origin = default_origin.copy();
			process = true;
			scalar = unit/max_mag;
		}
		
	} else if (id == 'grid'){		
		show_grid = index == 0;
		
	} else if (id == 'show_vertices'){		
		show_vertices = index == 0;
		
	} else if (id == 'color'){	
		palette.getColors(value);
		button_color(paste_input,palette.back,palette.front,true);
		button_color(paste_go,palette.front,palette.back,false);

	} else if (id == 'label'){	
		show_label = index == 0;
		
	} else if (id == 'function'){	
		active_funk = index;
		activeShape = activeShape % funk_shapes[active_funk];
		
		let shp_i = shapeBox[0].getIndex('shape');
		for (let sb of shapeBox){
			sb.Items[shp_i].Index = activeShape;
			while (sb.Items[shp_i].List.length < funk_shapes[active_funk]){
				sb.Items[shp_i].List.push(sb.Items[shp_i].List[0]);
			}
			sb.Items[shp_i].List.splice(funk_shapes[active_funk],sb.Items[shp_i].List.length-funk_shapes[active_funk]);
			
		}
		
	}
}

function allowed_steps(vertices){
	
	steps = [];
	var step;
	
	if (vertices == -1){
		return ['-1','1']; 
		
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

function c_add(c_a,c_b){
	return [c_a[0]+c_b[0],c_a[1]+c_b[1]];
}

function c_sub(c_a,c_b){
	return [c_a[0]-c_b[0],c_a[1]-c_b[1]];
}

function c_mult(c_a,c_b){
	return [c_a[0]*c_b[0]-c_a[1]*c_b[1],c_a[0]*c_b[1]+c_a[1]*c_b[0]];
}

function c_div(c_a,c_b){
	let div_mag = 1 / (c_b[0]**2 + c_b[1]**2);
	return [(c_a[0]*c_b[0]+c_a[1]*c_b[1])*div_mag,(-c_a[0]*c_b[1]+c_a[1]*c_b[0])*div_mag];
}

function c_sq(c_a){
	return [c_a[0]*c_a[0]-c_a[1]*c_a[1],2*c_a[0]*c_a[1]];
}