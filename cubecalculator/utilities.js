
function inverse(inv_input){
	
	var int_output = 1;
	for (var mp = 0; mp < powers.length; mp++){
		int_output = (int_output*powers[mp][3][inv_input%powers[mp][0]]) % 2424240;
	}
	
	return int_output;
}

function inverseAlg(alg_input){
	
	var alg_output = alg_input.split('').reverse();
	
	for (var alg_move = 0; alg_move < alg_output.length; alg_move++){
		if (alg_output[alg_move] == alg_output[alg_move].toLowerCase()){
			alg_output[alg_move] = alg_output[alg_move].toUpperCase()
		} else {
			alg_output[alg_move] = alg_output[alg_move].toLowerCase()
		}
	}
	
	return alg_output.join('');
}

function userAlg(machine_alg){
	user_alg = '';
	for (var m = 0; m < machine_alg.length; m++){
		if (m < machine_alg.length - 1 && machine_alg.charAt(m) == machine_alg.charAt(m+1)){
			user_alg += machine_alg.charAt(m).toUpperCase() + "2" + " ";
			m += 1;
		} else if (machine_alg.charAt(m).toUpperCase() == machine_alg.charAt(m)){
			user_alg += machine_alg.charAt(m).toUpperCase() + " ";
		} else {
			user_alg += machine_alg.charAt(m).toUpperCase() + "'" + " ";
		}
	}
	return user_alg;
}

function keytoMove(keyValue) {
	if (moveaxis != -1){
		return;
	}
	if (keyValue.toLowerCase() == 'u') {
		moveaxis = 1;
		movefact = -1;
  } else if (keyValue.toLowerCase() == 'd') {
		moveaxis = 1;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'r') {
		moveaxis = 0;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'l') {
		moveaxis = 0;
		movefact = -1;
  } else if (keyValue.toLowerCase() == 'f') {
		moveaxis = 2;
		movefact = 1;
  } else if (keyValue.toLowerCase() == 'b') {
		moveaxis = 2;
		movefact = -1;
  } 
	if (moveaxis == -1){
		return;
	}
	if (keyValue.toUpperCase() == keyValue){
		movedir = 1;
	}else{
		movedir = -1;
	}
}

function mouseDragged() {
	var flip = -1
	if (rotx > PI / 2 && rotx < PI * 3 / 2) {
		flip = 1;
	}

	rotx = (rotx + TAU + (pmouseY - mouseY) * 0.01) % TAU;
	roty = (roty + TAU + (pmouseX - mouseX) * 0.01 * flip) % TAU;
}

function movethem(moveinput,rotateinput){
	if (moveaxis == 0){
		return([[moveinput[0],-movefact*movedir*moveinput[2],movefact*movedir*moveinput[1]],[(1-rotateinput[0])*(1-rotateinput[1]),rotateinput[1]]]);
	}else if(moveaxis == 1){
		return([[movefact*movedir*moveinput[2],moveinput[1],-movefact*movedir*moveinput[0]],[rotateinput[0],(1-rotateinput[0])*(1-rotateinput[1])]]);
	}else if(moveaxis == 2){
		return([[-movefact*movedir*moveinput[1],movefact*movedir*moveinput[0],moveinput[2]],[rotateinput[1],rotateinput[0]]]);
	}
}

function button_style(button_in,back,front,input,x,y,w,h,fontsize){
  button_in.style("font-size", int(win[1]*fontsize) + "px");
  button_in.style("border-radius", int(win[1]*0.01) + "px");
  button_in.style("background-color", back);
  button_in.style("color", front);
  button_in.size(win[1]*w, win[1]*h);
	button_in.position(win[0]*0.5+win[1]*x, win[1]*y);
	if (input){
  	button_in.style("border", int(win[1]*0.004) + "px solid");
  	button_in.style("border-color", front);
		button_in.addClass('calc_input');
	} else {
		button_in.addClass('calc_button');
	}
}

function rand_unit(){
	rand = 1;
	for (var pow of powers){
		pow_rand = 0;
		while (pow[3][pow_rand] == 0){
			pow_rand = int(random()*pow[3].length);
		}
		rand = rand*pow[3][pow_rand]%2424240;
	}
	return rand;
}



function play_mult(){
	play_alg(true);
}
function play_div(){
	play_alg(false);
}
function give_rand(){
	input_unit.value(rand_unit());
}

function play_alg(multiply){
	if (isNaN(input_val) || playalg.length > 0 || !move_allowed){
		return;
	}
	update_allowed(false);
	var compressed_alg;
	var input_inv = inverse(input_val);
	if (multiply)	{
		compressed_alg = input_machine;
		curr_value = curr_value*input_val % 2424240;
	} else {
		compressed_alg = inverseAlg(input_machine);
		curr_value = curr_value*input_inv % 2424240;
	}
	curr_alg = userAlg(getAlg(curr_value));
	playalg = compressed_alg;
	
}

function process_input(){
	if (input_unit.value() == last_input){
		return;
	}
	last_input = input_unit.value();
	if (last_input == ''){
		input_alg = '';
		update_allowed(false);
		return;
	}
	input_val = parseInt(last_input);
	if (isNaN(input_val)){
		input_alg = 'Please enter a number.';
		update_allowed(false);
		return;
	} 
	input_val = (input_val%2424240+2424240)%2424240;
	is_unit = -1;
	for (var pow of powers){
		if (input_val % pow[1] == 0){
			is_unit = pow[1];
			break;
		}
	}
	
	if (is_unit != -1){
		input_alg = 'Not a Unit. ' + str(is_unit) + ' divides both '+ str(input_val) + ' and 2424240.';
		update_allowed(false);
		return;
	}
	update_allowed(true);
	input_machine = getAlg(input_val);
	input_alg = userAlg(compressed_alg);
}

function getAlg(value_to_get){
	var input_inv = inverse(value_to_get);
	var data_row = 0;
	while (alg_list.getNum(data_row,0) != input_inv && alg_list.getNum(data_row,0) != value_to_get){
		data_row += 1;
	}
	compressed_alg = alg_list.getString(data_row,1);
	for (var comp = alg_compress.getRowCount()-1; comp > -1; comp--){
		compressed_alg = compressed_alg.replaceAll(alg_compress.getString(comp,0),alg_compress.getString(comp,1));
	}
	if (alg_list.getNum(data_row,0) != value_to_get){
		compressed_alg = inverseAlg(compressed_alg);
	}
	return compressed_alg;
}

function textMax(textValue,x,y,trysize){
	textSize(win[1]*trysize);
	tw = textWidth(textValue);
	if (tw > win[0]*0.9){
		textSize(win[1]*trysize*win[0]*0.9/tw);
	}
	text(textValue,x,y);
}

function update_allowed(new_value){
	if (new_value == move_allowed){
		return;
	}
	move_allowed = new_value;
	if (move_allowed && playalg.length == 0){
		mult_button.style("background-color", palette[0].front);
		div_button.style("background-color", palette[0].front);
	} else {
		mult_button.style("background-color", palette[0].backlight);
		div_button.style("background-color", palette[0].backlight);
	}
}