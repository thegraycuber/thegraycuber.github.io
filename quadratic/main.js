

var D = -1;
var scale_min = 3;
var last_frame, color_millis;

function draw() {

	process_limit = 200;
	
	let view_limit = max(prime_limit**0.5,height/(2*scale_min)+10);
	origin.x = constrain(origin.x,width-view_limit*scalar,view_limit*scalar);
	view_limit = max((prime_limit/abs(D))**0.5,height/(2*scale_min)+10);
	origin.y = constrain(origin.y,height-view_limit*scalar,view_limit*scalar);
	


	// if (modulus_powers){
	// 	process_equiv_class();
		
	// } else {

	background(palette.back);
	
	grid.draw_grid();
	translate(origin.x, origin.y);
	scale(scalar,scalar);

	color_millis -= last_frame;
	last_frame = Date.now();
	color_millis += last_frame;
	while (color_millis > 0){
		if (color_mode != 0){
			palette.gradient.push(palette.gradient[0]);
			palette.gradient.splice(0,1);
		}
		if (highlights.length > 0 && highlight_mode == 'prime factors'){
			palette.prime_highlight.push(palette.prime_highlight[0]);
			palette.prime_highlight.splice(0,1);
		} else if (highlights.length > 0 && highlight_mode == 'multiples'){
			palette.multiple_highlight.push(palette.multiple_highlight[0]);
			palette.multiple_highlight.splice(0,1);
		}
		color_millis -= 15;
	}
	
	let direc_maxes;
	if (is_hex){
		direc_maxes = [floor(grid.wid.y/(scalar*0.866))+3, floor(2*grid.wid.x/scalar)+3];
	} else {
		direc_maxes = [floor(grid.wid.y/scalar)+3, floor(grid.wid.x/scalar)+3];
	}
	let spiral_maxes = [min(...direc_maxes),max(...direc_maxes)];
	direc_maxes.push(...direc_maxes);
	
	let spiral_size = 0;
	let direc = 3;
	let start_int = pixel_to_principal(default_origin);
	let re = round(start_int.x);
	let im = round(start_int.y);

	noStroke();
	while (spiral_size < spiral_maxes[1]){
		direc = (direc + 1)%4;
		if (spiral_direction[direc][1] == 0){
			spiral_size++;
		}

		if (spiral_size > direc_maxes[direc]){
			re += spiral_direction[direc][0]*spiral_size;
			im += spiral_direction[direc][1]*spiral_size;
			continue;
		}
		
		for (let i = 0; i < min(spiral_size,spiral_maxes[0]); i++){

			process_int(re, im);
			re += spiral_direction[direc][0];
			im += spiral_direction[direc][1];
		}
	}


	if (highlights.length > 0 && highlight_mode != 'off'){
		if (highlight_mode == 'prime factors'){
			onlyFill(palette.prime_highlight[0]);
		} else {
			onlyFill(palette.multiple_highlight[0]);
		}
		for (let h of highlights){
			int_shape(...h);
		}
	}
	
	if (info_integer.length == 2){
		onlyStroke(palette.back,0.4);
		int_shape(...info_integer);
		onlyStroke(palette.front,0.22);
		int_shape(...info_integer);
	}
	
	//}

	resetMatrix();
	grid.draw_labels();
	onlyFill(palette.back);
	rect(...hideRect);
	
	textBox.show();
	iconBox.show();
	infoBox.show();
	helpBox.show();
}

var process_limit;
var spiral_direction = [
	[1,0],
	[0,1],
	[-1,0],
	[0,-1]
]

