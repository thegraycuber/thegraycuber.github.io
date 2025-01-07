
function scalar(a,beta){
	return([a*beta[0], a*beta[1]]);
}

function add(alpha,beta){
	return([alpha[0]+beta[0], alpha[1] + beta[1]]);
}

function ztoCoords(z,h_val=h){
	return([win[0]/2 + z[0]*px9/h_val, win[1]/2 - z[1]*px9/h_val]);
}

function coordsToZ(coordx,coordy){
	return([(coordx - win[0]/2)*h/px9, (- coordy + win[1]/2)*h/px9]);
}

function complex_str(z_str){
	str_out = str(round(z_str[0],1));
	i_val = round(z_str[1],1);
	if (i_val < 0){
		str_out += ' - ' + str(-i_val) + 'i';
	} else {
		str_out += ' + ' + str(i_val) + 'i';
	}
	return(str_out);
}

function mult(alpha,beta){
	return([alpha[0]*beta[0] - alpha[1]*beta[1], alpha[0]*beta[1] + alpha[1]*beta[0]]);
}

function gcd(gcda,gcdb){
	if(gcda < gcdb){
		var dummy = gcdb;
		gcdb = gcda;
		gcda = dummy;
	}
	
	var gcdr = gcda % gcdb;
	while (gcdr > 0){
		gcda = gcdb;
		gcdb = gcdr;
		gcdr = gcda % gcdb;
	}
	return(gcdb);
}

function avg(poly1,poly2,ratio){
	while (poly1.length < poly2.length){
		poly1.push(0);
	}
	while (poly1.length > poly2.length){
		poly2.push(0);
	}
	
	polyout = [];
	for (var polyterm = 0; polyterm < poly1.length; polyterm++){
		polyout.push(poly1[polyterm]*ratio + poly2[polyterm]*(1-ratio));
	}
	
	while(polyout[polyout.length-1] == 0){
		polyout.splice(polyout.length-1);
	}
	
	return(polyout);
}



function mouseCheck(){
	
	var foundMouse = 0;
	for (var icon of icons){
		if(icon.Active > -1 && mouseX > icon.UpperLeft[0] && mouseX < icon.LowerRight[0] && mouseY > icon.UpperLeft[1] && mouseY < icon.LowerRight[1]){
			foundMouse++;
		}
	}
	foundMouse += menuBox.mouseInside();
	
	if (foundMouse > 0){return true;}
	else{return false;}
}

	
function process_output(proc_poly,proc_next = [],display = false){
	
	var max_size = 0;
	var autozoom = menuBox.Items[menuBox.getIndex('Zoom')].Index;
	output_points = [];
	
	var rads = [[1,0],scalar(settings.radius,settings.rotation)];
	while (rads.length < proc_poly.length || rads.length < proc_next.length){
		rads.push(mult(rads[rads.length-1],rads[1]));	
	}
	
	for (var pt of points){

		var map = [proc_poly[0],0];
		for (var i = 1; i < proc_poly.length; i++){
			var i_term = mult(rads[i],pt[i]);
			i_term = scalar(proc_poly[i],i_term);
			map = add(map,i_term);
		}
		
		if (proc_next.length > 0){
			var map2 = [proc_next[0],0];
			for (i = 1; i < proc_next.length; i++){
				var i_2 = mult(rads[i],pt[i]);
				i_2 = scalar(proc_next[i],i_2);
				map2 = add(map2,i_2);
			}
			
			map = scalar(settings.animate_ratio,map);
			map2 = scalar(1-settings.animate_ratio,map2);
			map = add(map,map2);
		}
		
		output_points.push(map);
		
		if (max_size < map[0]**2 + map[1]**2){
			max_size = map[0]**2 + map[1]**2;
		}
	}
	
	max_size = max_size**0.5;
	if (display){
		for (var o_pt = 0; o_pt < output_points.length; o_pt++){
			output_points[o_pt] = [output_points[o_pt][0]/max_size,output_points[o_pt][1]/max_size];
		}
		h_out = 10;
		
		output_coords = [];
		for (var op of output_points){
			output_raw = ztoCoords(op,15);
			output_raw = add(output_raw,[settings.px*5.6,-settings.px*3.5]);
			output_coords.push(output_raw);
		}
		
		return(output_coords);
		
	} 
	
	if (menuBox.Items[menuBox.getIndex('Zoom')].Index == 0){
		h_out = max(h,h_factor*max_size);
		h = h_out;
	}

	return(output_points);
}

function points_to_coords(input_points,h_calc = h){

	output_coords = [];
	for (var ip of input_points){
		output_coords.push(ztoCoords(ip,h_calc));
	}
	//console.log(output_coords);
	return(output_coords);
}


function make_points(vertices = settings.vertices,steps = settings.step,volume = settings.point_count){
	
	if (vertices == 1){
		vertices = volume;
	}
	dots = [];
	
	var subvol = round(volume/vertices);
	var point_list = [[[1,0],[1,0]]];
	for (var expon = 2; expon < 50; expon++){
		point_list[point_list.length-1].push(mult(point_list[point_list.length-1][1],point_list[point_list.length-1][expon-1]));
	}
	
	for (var vert = 1; vert <= vertices; vert++){
		var next = [cos(2*PI*vert*steps/vertices),sin(2*PI*vert*steps/vertices)];
		var iter = [(-point_list[point_list.length-1][1][0] + next[0])/subvol,(-point_list[point_list.length-1][1][1] + next[1])/subvol];
		
		dots.push(point_list.length-1);
		for (var subpoint = 0; subpoint < subvol; subpoint++){
			point_list.push([[1,0],[point_list[point_list.length-1][1][0]+iter[0],point_list[point_list.length-1][1][1]+iter[1]]]);
			for (expon = 2; expon < 50; expon++){
				point_list[point_list.length-1].push(mult(point_list[point_list.length-1][1],point_list[point_list.length-1][expon-1]));
			}
		}
	}

	if (vertices == volume){
		dots = [0,int(volume/2)];
	}
	
	return point_list;
}