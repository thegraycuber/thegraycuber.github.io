
var origin, scalar;

function touchStarted(){
	at_ticker = min(at_ticker,at_text.length);
	if (pasting){return;}
	textBox.clicked();
	iconBox.clicked();
	helpBox.clicked();
}


function touchMoved(event){
	event.preventDefault(); 
}

function action(id,index,value){

	invalid_text = '';

	if (id == 'palette'){	
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		orbit_color_setup();
		button_color(paste_input,palette.back,palette.front,true);
		button_color(paste_go,palette.front,palette.back,false);
		if (mobile){
			button_color(copy_text,palette.back,palette.front,true);
			button_color(copy_label,palette.front,palette.back,false);
		}
		
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

		let new_orbits = floor((random()*(abs(hex_norm(modulus))**0.5))**2);
		let orbit_index = orbit_options.length-1;
		while (orbit_options[orbit_index] > new_orbits && orbit_index > 0){
			orbit_index--;
		}
		textBox.getItem('orbits').giveValue(orbit_index);
		
	} else if (id == 'copy'){
		if (mobile){
			if (iconBox.getItem('copy').Type == 'copy'){
				copy_text.style("visibility", "visible");
				copy_text.attribute("value",settings_to_code());
				copy_label.style("visibility", "visible");
				iconBox.getItem('copy').Type = 'play';
				return;
			}
		} else {
			copyToClipboard(settings_to_code());
			
		}
		
	} else if (id == 'paste'){
		pasting = true;
		input_setup();
		
	} else if (id == 'hexagon'){
		show_borders = !show_borders;
		ticker = -PI;
		
	} else if (id == 'hearts'){
		fav = (fav + 1)%favorites.length;
		code_to_settings(favorites[fav][0]);
		at_text = favorites[fav][1];
		at_ticker = 250;
	} 

	if (mobile){
		copy_text.style("visibility", "hidden");
		copy_label.style("visibility", "hidden");
		iconBox.getItem('copy').Type = 'copy';
	}
}

function core_icon_custom(icon_object, icon_color){
	if (icon_object.Type == 'hexagon'){
		if (show_borders){
			onlyStroke(icon_color,icon_object.Size[0]*0.1);
		} else {
			onlyStroke(palette.medium,icon_object.Size[0]*0.1);
		}
		hexagon(0,0,icon_object.Size[0]*0.45);
	} 
}

function settings_to_code(){
	return 'I woke up at 7:' + pre_0(textBox.getItem('mod').Index) + ' and ate ' + str(orbits) + ' ' + produce_list[textBox.getItem('ring').Index];
}

function code_to_settings(input_code){
	let code_words = input_code.split(' ');
	let unfound = true;
	while(unfound){
		if (code_words.length < 8){
			return 'invalid code';
		}
		if (code_words[0] == 'woke'){
			unfound = false;
		} else {
			code_words.splice(0,1);
		}
		
	}
	
	let crow_index = produce_list.indexOf(code_words[7]);
	if (crow_index == -1){
		return 'invalid code';
	}
	textBox.getItem('ring').giveValue(crow_index);

	let mod_index = int(code_words[3].substring(2));
	if (isNaN(mod_index) || mod_index < 0 || mod_index >= textBox.getItem('mod').List.length){
		return 'invalid code';
	}
	
	textBox.getItem('mod').giveValue(mod_index);
	
	let orbit_value = int(code_words[6]);
	for (let o = 0; o < orbit_options.length; o++){
		if (orbit_value == orbit_options[o]){
			textBox.getItem('orbits').giveValue(o);
			return '';
		}
	}
	return 'invalid code';
}


var copy_text, copy_label;
function button_style(button_in,back,front,input,x,y,w,h,text_height){
	button_in.style("font-size", int(text_height) + "px");
	button_in.style("border-radius", int(text_height*0.4) + "px");
	button_in.size(w,h);
	button_in.position(x, y);
	button_in.style("visibility", "hidden");
	if (input){
  	button_in.style("border", int(text_height*0.1) + "px solid");
		button_in.addClass('hexponent_input');
	} else {
		button_in.addClass('hexponent_button');
	}
	button_color(button_in,back,front,input);
}

function button_color(button_in,back,front,input){
	button_in.style("background-color", back);
	button_in.style("color", front);
	button_in.style("text_color", front);
	if (input){
		button_in.style("border-color", front);
	}
}

var pasting = false;
var paste_input, paste_go;
function input_setup(){
  paste_input.style("visibility", "visible");
  paste_go.style("visibility", "visible");
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
['I woke up at 7:06 and ate 4 raisins',''],//solid 4
	['I woke up at 7:12 and ate 1680 pecans','@tima_soft'],//bands
	['I woke up at 7:04 and ate 2 blueberries','@snadsnad-g7o'],//cool 2
	['I woke up at 7:04 and ate 48 peaches',''],//lines and diam's
	['I woke up at 7:19 and ate 165 peaches','@arcie.lastname'], //slow rift
	['I woke up at 7:04 and ate 2 walnuts','@WPawnToE4'], // tire tracks
	['I woke up at 7:41 and ate 58 raisins','@adamvagenknecht'], // hex arms
	['I woke up at 7:07 and ate 2 raisins',''],//smallest legs
	['I woke up at 7:53 and ate 166 raisins','@leandeflorin'],//triangle glitch
	['I woke up at 7:33 and ate 194 apples',''],//kerchoo
	['I woke up at 7:38 and ate 138 grapes','@Kaitte'],//bertzai canyon 
	['I woke up at 7:06 and ate 88 cherries',''],//holy lattice
	['I woke up at 7:04 and ate 5 raisins',''],//zul man
	['I woke up at 7:00 and ate 4 limes','@ismaelmartinez8639'],//triple lattice
	['I woke up at 7:14 and ate 736 raisins','@radical4033'],//triangle dishes
	['I woke up at 7:16 and ate 39 almonds','@BrainrottedMinor'],//boxes
	['I woke up at 7:09 and ate 2 raspberries',''],//squatties
	['I woke up at 7:08 and ate 168 hazelnuts','@memeing_donkey'], //diamond fields
	['I woke up at 7:12 and ate 2 blackberries','@leandeflorin'], //large 2
	['I woke up at 7:06 and ate 8 grapes',''],//laser
	['I woke up at 7:39 and ate 47 grapes','@DJruslan4ic'],//cool oval patterns
	['I woke up at 7:14 and ate 276 strawberries','@unapersonarandom2763'],//energy diamonds
	['I woke up at 7:19 and ate 2 raisins',''],//za
	['I woke up at 7:35 and ate 191 pears','@tylerdoesdumbstuff'], //gradients with lines
	['I woke up at 7:12 and ate 140 raisins',''],//layers
	['I woke up at 7:42 and ate 388 grapefruits','@quocphong6588'], //blades
	['I woke up at 7:13 and ate 552 blackberries','@T0mPlayes'], //bands over noise
	['I woke up at 7:09 and ate 3 kiwis','@MatteoDolcin-ye8xm'],//huge mosaic
	['I woke up at 7:31 and ate 2 raisins',''],//very wiggly dartboards
	['I woke up at 7:05 and ate 90 peanuts','@memeing_donkey'], //overlapping directions 
	['I woke up at 7:03 and ate 3 grapefruits','@manalu-asya'],//hedges
	['I woke up at 7:44 and ate 249 oranges','@snadsnad-g7o'], // wide bolts over stripes
	['I woke up at 7:35 and ate 2 raisins',''],//wiggly dartboards with moons
	['I woke up at 7:07 and ate 6 raisins','@beta_electron'], //pyramids
	['I woke up at 7:34 and ate 112 cashews','@noahniederklein8038'],//ants
	['I woke up at 7:37 and ate 221 apples',''],//cubes
	['I woke up at 7:39 and ate 55 raisins',''],//wiggler
	['I woke up at 7:23 and ate 90 pears','@Kaitte'],//sliced scales
	['I woke up at 7:14 and ate 552 cashews',''], //holy argyle
	['I woke up at 7:22 and ate 67 hazelnuts','@tHe_faNum-taXer'], //gradient bands
	];
