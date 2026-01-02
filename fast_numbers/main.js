
var number_values = ['','','','','','',''];
var number_names = ['','','','','','',''];
var number_equations = ['','','','','','',''];
var existing_number = -1;

var offset = 0;
var nonloaded = true;

function draw() {
	background(palette.back);	
	
	if (name_data.getRowCount() == 0){
		return;
	} else if (nonloaded){
		nonloaded = false;
		input_box.value('');
	}

	
	if (abs(offset) > 0.5){
		give_value(existing_number - round(offset));
		offset -= round(offset);
	} else {
		let test_number = parseInt(input_box.value());
		give_value(test_number);
	}

	
	if (scrolling && Date.now() - last_scroll > 50){
		scrolling = false;
	}
	if (panning && Date.now() - last_pan > 300){
		panning = false;
	}
	
	if (!panning && !scrolling){
		if (offset != 0){
			offset -= min(abs(offset),0.05)*sign(offset);
		}
		if (offset == 0){
			input_box.style("visibility", "visible");	
		}
	}
	
	translate(width*0.5,height*0.45);

	if (number_values[3] != ""){
		for (let n = 0; n < 7; n++){
			n_val = (n-3+offset);
			n_adjust = ((cos(PI*n_val/4)+1)/2)**2;
			n_mult = 0.6+n_adjust*0.4;
			n_y = name_gap*n_val*(0.8+n_adjust*0.4);
			n_index = floor(100-n_adjust*100)
			n_offsets = number_names[n].length > 20 ? [-n_mult*0.9,n_mult] : [-0.7*n_mult,0.6*n_mult];
	
			if (number_values[n] != ""){
				fill(palette.brights[n_index]);
				text_limited(number_values[n],-name_x,n_y,name_size*1.6*n_mult,name_width*n_mult);
				fill(palette.fronts[n_index]);
				text_limited(number_names[n],name_x,n_y+name_size*n_offsets[0],name_size*n_mult,name_width*n_mult);
				fill(palette.monos[n_index]);
				text_limited(number_equations[n],name_x,n_y+name_size*n_offsets[1],name_size*n_mult,name_width*n_mult);			
			}
		}
		
	} else {
		fill(palette.bright);
		text_limited('enter a whole number\nbetween 0 and 1 000 000',-name_x,-name_gap*0.5,name_size*0.6,name_width);
		fill(palette.front);
		text_limited('or press the die\nfor a random number',-name_size*2.4,height*0.55-name_size*4,name_size*0.6,name_width);
	}
	
	resetMatrix();
	iconBox.show();
	helpBox.show();

}


function give_value(test_number){
	
	if (!isNaN(test_number) && test_number > -1 && test_number <= 1000000){
		
		if (test_number != existing_number){
			existing_number = test_number;
			for (let n = 0; n < 7; n++){
				let test_index = test_number + n - 3;
				if (test_index > -1 && test_index <= 1000000){
					number_names[n] = name_decompress(name_data.getString(test_index,0));
					number_equations[n] = equation_decompress(name_data.getString(test_index,1));
					number_values[n] = str(test_index);
				} else {
					number_names[n] = '';
					number_equations[n] = '';
					number_values[n] = '';
				}
			}
		} 
		input_box.value(test_number);
		
	} else {
		existing_number = -1;
		for (let n = 0; n < 7; n++){
			number_names[n] = '';
			number_equations[n] = '';
			number_values[n] = '';
		}
	}

}
