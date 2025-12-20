
var origin, scalar;

function touchStarted(){
	if (pasting){return;}
	textBox.clicked();
	iconBox.clicked();
	helpBox.clicked();
}


function action(id,index,value){

	invalid_text = '';
	
	if (id == 'palette'){	
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		orbit_color_setup();
		button_color(paste_input,palette.back,palette.front,true);
		button_color(paste_go,palette.front,palette.back,false);
		
	} else if (id == 'info'){
		helpBox.setActive(!helpBox.Active);
		
	} else if (id == 'ring'){
		
		crow_constant = crow_list[index];
		generate_hex_primes();
		
	} else if (id == 'mod'){
		
		modulus = [prime_norms[index][0],prime_norms[index][1]];
		process_mod();
		generate_orbit_options(prime_norms[index][2]);
		
	} else if (id == 'orbits'){
		
		orbits = orbit_options[index];
		process_orbits();
		orbit_color_setup();
		
	} else if (id == 'download'){
		save("Hexponents_" + now_string() + ".png");
		
	} else if (id == 'random'){

		textBox.getItem('ring').randomize(true);
		textBox.getItem('mod').randomize(true);

		let new_orbits = floor((random()*(hex_norm(modulus)**0.25))**4);
		let orbit_index = orbit_options.length-1;
		while (orbit_options[orbit_index] > new_orbits && orbit_index > 0){
			orbit_index--;
		}
		textBox.getItem('orbits').giveValue(orbit_index);
		
	} else if (id == 'copy'){
		copyToClipboard(settings_to_code());
		
	} else if (id == 'paste'){
		pasting = true;
		input_setup();
		
	} else if (id == 'hearts'){
		fav = (fav + 1)%favorites.length;
		code_to_settings(favorites[fav][0]);
		at_text = favorites[fav][1];
		at_ticker = 250;
	}
}

function settings_to_code(){
	return 'I woke up at 7:' + pre_0(textBox.getItem('mod').Index) + ' and ate ' + str(orbits) + ' ' + produce_list[textBox.getItem('ring').Index];
}

function code_to_settings(input_code){
	let code_words = input_code.split(' ');
	if (code_words.length < 9){
		return 'invalid code';
	}
	let crow_index = produce_list.indexOf(code_words[8]);
	if (crow_index == -1){
		return 'invalid code';
	}
	textBox.getItem('ring').giveValue(crow_index);

	let mod_index = int(code_words[4].substring(2));
	if (isNaN(mod_index) || mod_index < 0 || mod_index >= textBox.getItem('mod').List.length){
		return 'invalid code';
	}
	
	textBox.getItem('mod').giveValue(mod_index);
	
	let orbit_value = int(code_words[7]);
	for (let o = 0; o < orbit_options.length; o++){
		if (orbit_value == orbit_options[o]){
			textBox.getItem('orbits').giveValue(o);
			return '';
		}
	}
	return 'invalid code';
}



var pasting = false;
var paste_input, paste_go;
function input_setup(){
  paste_input.style("visibility", "visible");
  paste_go.style("visibility", "visible");
}


function button_style(button_in,back,front,input,x,y,w,h){
	let unit = 50;
  button_in.style("font-size", int(bigText) + "px");
  button_in.style("border-radius", int(bigText*0.4) + "px");
  button_in.size(w,h);
	button_in.position(x, y);
  button_in.style("visibility", "hidden");
	if (input){
  	button_in.style("border", int(bigText*0.1) + "px solid");
		button_in.addClass('hexponent_input');
	} else {
		button_in.addClass('hexponent_button');
	}
	button_color(button_in,back,front,input);
}

function button_color(button_in,back,front,input){
  button_in.style("background-color", back);
  button_in.style("color", front);
	if (input){
  	button_in.style("border-color", front);
	}
}

var invalid_text = '';
var invalid_tick;
function get_paste(){
	invalid_text = code_to_settings(paste_input.value());
	paste_input.value('');
	pasting = false;
	paste_input.style("visibility", "hidden");
	paste_go.style("visibility", "hidden");
	
	if (invalid_text.length > 0){
		invalid_tick = 50;
	}
}

var at_text;
var at_ticker = 0;
var fav = 0;
var favorites = [
	['I woke up at 7:02 and ate 3 pecans',''],
	['I woke up at 7:16 and ate 4 pears','@ymperal4663'],
	];

var origin, scalar;

function touchStarted(){
	if (pasting){return;}
	textBox.clicked();
	iconBox.clicked();
	helpBox.clicked();
}


function action(id,index,value){

	invalid_text = '';
	
	if (id == 'palette'){	
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		orbit_color_setup();
		button_color(paste_input,palette.back,palette.front,true);
		button_color(paste_go,palette.front,palette.back,false);
		
	} else if (id == 'info'){
		helpBox.setActive(!helpBox.Active);
		
	} else if (id == 'ring'){
		
		crow_constant = crow_list[index];
		generate_hex_primes();
		
	} else if (id == 'mod'){
		
		modulus = [prime_norms[index][0],prime_norms[index][1]];
		process_mod();
		generate_orbit_options(prime_norms[index][2]);
		
	} else if (id == 'orbits'){
		
		orbits = orbit_options[index];
		process_orbits();
		orbit_color_setup();
		
	} else if (id == 'download'){
		save("Hexponents_" + now_string() + ".png");
		
	} else if (id == 'random'){

		textBox.getItem('ring').randomize(true);
		textBox.getItem('mod').randomize(true);

		let new_orbits = floor((random()*(hex_norm(modulus)**0.25))**4);
		let orbit_index = orbit_options.length-1;
		while (orbit_options[orbit_index] > new_orbits && orbit_index > 0){
			orbit_index--;
		}
		textBox.getItem('orbits').giveValue(orbit_index);
		
	} else if (id == 'copy'){
		copyToClipboard(settings_to_code());
		
	} else if (id == 'paste'){
		pasting = true;
		input_setup();
		
	} else if (id == 'hearts'){
		fav = (fav + 1)%favorites.length;
		code_to_settings(favorites[fav][0]);
		at_text = favorites[fav][1];
		at_ticker = 250;
	}
}

function settings_to_code(){
	return 'I woke up at 7:' + pre_0(textBox.getItem('mod').Index) + ' and ate ' + str(orbits) + ' ' + produce_list[textBox.getItem('ring').Index];
}

function code_to_settings(input_code){
	let code_words = input_code.split(' ');
	if (code_words.length < 9){
		return 'invalid code';
	}
	let crow_index = produce_list.indexOf(code_words[8]);
	if (crow_index == -1){
		return 'invalid code';
	}
	textBox.getItem('ring').giveValue(crow_index);

	let mod_index = int(code_words[4].substring(2));
	if (isNaN(mod_index) || mod_index < 0 || mod_index >= textBox.getItem('mod').List.length){
		return 'invalid code';
	}
	
	textBox.getItem('mod').giveValue(mod_index);
	
	let orbit_value = int(code_words[7]);
	for (let o = 0; o < orbit_options.length; o++){
		if (orbit_value == orbit_options[o]){
			textBox.getItem('orbits').giveValue(o);
			return '';
		}
	}
	return 'invalid code';
}



var pasting = false;
var paste_input, paste_go;
function input_setup(){
  paste_input.style("visibility", "visible");
  paste_go.style("visibility", "visible");
}


function button_style(button_in,back,front,input,x,y,w,h){
	let unit = 50;
  button_in.style("font-size", int(bigText) + "px");
  button_in.style("border-radius", int(bigText*0.4) + "px");
  button_in.size(w,h);
	button_in.position(x, y);
  button_in.style("visibility", "hidden");
	if (input){
  	button_in.style("border", int(bigText*0.1) + "px solid");
		button_in.addClass('hexponent_input');
	} else {
		button_in.addClass('hexponent_button');
	}
	button_color(button_in,back,front,input);
}

function button_color(button_in,back,front,input){
  button_in.style("background-color", back);
  button_in.style("color", front);
	if (input){
  	button_in.style("border-color", front);
	}
}

var invalid_text = '';
var invalid_tick;
function get_paste(){
	invalid_text = code_to_settings(paste_input.value());
	paste_input.value('');
	pasting = false;
	paste_input.style("visibility", "hidden");
	paste_go.style("visibility", "hidden");
	
	if (invalid_text.length > 0){
		invalid_tick = 50;
	}
}

var at_text;
var at_ticker = 0;
var fav = 0;
var favorites = [
	['I woke up at 7:06 and ate 4 raisins',''],
	['I woke up at 7:04 and ate 48 peaches',''],
	['I woke up at 7:07 and ate 2 raisins',''],
	['I woke up at 7:06 and ate 88 cherries',''],
	['I woke up at 7:04 and ate 5 raisins',''],
	['I woke up at 7:03 and ate 3 craisins',''],
	['I woke up at 7:09 and ate 2 raspberries',''],
	['I woke up at 7:06 and ate 8 grapes',''],
	['I woke up at 7:05 and ate 9 peaches',''],
	['I woke up at 7:19 and ate 2 raisins',''],
	];