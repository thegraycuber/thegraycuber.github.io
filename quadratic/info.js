
var units = [];
var highlights = [];
var highlight_mode = 'prime factors';
let intro_info = true;
var info_integer = [];
var info_integer_true;


function set_info(){
	
	highlights = [];
	infoBox.getItem('info_factor').Color = 'mono';
	infoBox.getItem('factorization').Volume = 0.4;

	if (info_integer.length == 2){
		if (q_ints.length <= abs(info_integer[0])){
			info_integer = [];
			
		} else if (q_ints[abs(info_integer[0])].length <= abs(info_integer[1])){
			info_integer = [];

		} else {
			//set_modulus([...info_integer]);
			textBox.getItem('highlight_mode').Active = true;
			textBox.getItem('highlight_label').Active = true;
			
			intro_info = false;
			infoBox.Items[0].Volume = 0.6;
			infoBox.Items[infoBox.Items.length-1].Volume = 0.6;
			
			info_int = q_ints[abs(info_integer[0])][abs(info_integer[1])];
			if (is_hex){
				info_integer_true = [info_integer[0]/2,info_integer[1]/2];
			} else {
				info_integer_true = info_integer;
			}
			infoBox.getItem('info_name').DisplayText = q_int_text(info_integer_true);
			if (q_ints[abs(info_integer[0])][abs(info_integer[1])].type == 'x'){
				infoBox.getItem('info_factor').DisplayText = 'norm exceeds\nprocessing limit';
				infoBox.getItem('info_factor').Color = 'red';
				infoBox.getItem('factorization').DisplayText = '';
				infoBox.getItem('factorization').Volume = 0;
				
			} else {
				infoBox.getItem('info_factor').DisplayText = q_factorize(info_integer_true);
				infoBox.getItem('factorization').DisplayText = 'factorization';

				if (highlight_mode == 'multiples'){
					if (abs(info_int.norm) > 1){
						highlight_multiples(info_integer_true);
					}
				}
				
			}
			infoBox.getItem('info_type').DisplayText = type_key[info_int.type];
			infoBox.getItem('info_norm').DisplayText = 'norm ' + str(info_int.norm);

			if (['f','n'].includes(infoBox.getItem('info_factor').DisplayText.substring(0,1))){
				infoBox.getItem('info_factor').Volume = 2;
			}
			
			infoBox.giveSizes();
			return;
			
		}
	} 
	if (intro_info){
		return;
	}
	
	textBox.getItem('highlight_mode').Active = false;
	textBox.getItem('highlight_label').Active = false;
	infoBox.getItem('info_name').DisplayText = '';
	infoBox.getItem('info_type').DisplayText = '';
	infoBox.getItem('info_norm').DisplayText = '';
	infoBox.getItem('info_factor').DisplayText = '';
	infoBox.getItem('factorization').DisplayText = '';
	
}

function check_info(){
	if (helpBox.Active){
		return 'hide';
	} else {
		return 'info';
	}
}


function highlight_multiples(h_int){

	let h_perp = is_hex ? q_mult(h_int,[-0.5,0.5]) : q_mult(h_int,[0,1]);

	let upwards = [nearest_multiple(vector_to_array(pixel_to_principal(default_origin)),h_int)];
	let extreme_points = [
		vector_to_array(pixel_to_principal(grid.grid_min)),
		vector_to_array(pixel_to_principal(grid.grid_max)),
		vector_to_array(pixel_to_principal(createVector(grid.grid_min.x,grid.grid_max.y))),
		vector_to_array(pixel_to_principal(createVector(grid.grid_max.x,grid.grid_min.y)))
	];

	let extremes = [];
	for (let ep of extreme_points){
		ep_intercept = lil_combo_thing(ep,h_perp);
		extremes = extremes.length == 0 ?  [ep_intercept,ep_intercept] : [min(ep_intercept,extremes[0]),max(ep_intercept,extremes[1])];
	}

	let current_intercept;
	let ep_sign = sign(lil_combo_thing(h_int,h_perp));
	for (let h_sign = -1; h_sign < 2; h_sign += 2){
		let current_integer = [...upwards[0]];
		do {
			current_integer = c_add(current_integer, c_scale(h_sign,h_int));
			upwards.push([...current_integer]);
			current_intercept = lil_combo_thing(current_integer,h_perp);
		}
		while ( current_intercept*ep_sign*h_sign < extremes[(h_sign*ep_sign+1)/2]*h_sign*ep_sign);
	}
	extremes = [];
	for (let ep of extreme_points){
		ep_intercept = lil_combo_thing(ep,h_int);
		if (extremes.length == 0){
			extremes = [ep_intercept,ep_intercept];
		} else {
			extremes = [min(ep_intercept,extremes[0]),max(ep_intercept,extremes[1])];
		}
		
	}

	ep_sign = sign(lil_combo_thing(h_perp,h_int));
	for (let u = upwards.length - 1; u > -1; u--){
		for (let h_sign = -1; h_sign < 2; h_sign += 2){
			let current_integer = [...upwards[u]];
			do {
				current_integer = c_add(current_integer, c_scale(h_sign,h_perp));
				upwards.push([...current_integer]);
				current_intercept = lil_combo_thing(current_integer,h_int);
			}
			while (current_intercept*ep_sign*h_sign < extremes[(h_sign+1)/2]*h_sign);
		}
	}

	for (let u of upwards){
		highlights.push([u[0]*(is_hex?2:1),u[1]*(is_hex?2:1)]);
	}	
}


function lil_combo_thing(point, line_base){
	return point[1]*line_base[0]-point[0]*line_base[1];
}

function nearest_multiple(a,b){
	let b_norm = q_norm(b);
	let unscaled = q_mult(a,[b[0],-b[1]]);
	let rounded_div = [round(unscaled[0]/b_norm),round(unscaled[1]/b_norm)];
	return q_mult(rounded_div,b);
}
