var alg_list;
var alg_compress;
var cycles = 
		[[13,1]];
var powers = [
	[37,37,[1,2]],
	[13,13,[1,2]],
	[7,7,[1,3]],
	[5,5,[1,2]],
	[9,3,[1,2]],
	[16,2,[1],[0,1,0,2121211,0,606061,0,303031,0,1212121,0,909091,0,1818181,0,1515151]]
];
var YouTube, Theme;
var palette = [];

function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	//openSans = loadFont("OpenSans-Regular.ttf");
	
	alg_compress = loadTable('cubecalculator/n_alg_compress.csv');//cubecalculator/
}


function setup() {
	
	alg_list = loadTable('cubecalculator/n_alg.csv', 'csv');//, 'header');
	palette.push(new Palette('#063a2a','#d6ddcc',['#d6ddcc','#d8b801','#3fbd75','#449d9d','#af5757','#b88153'],'#3fbd75','#095a44'));
	palette.push(new Palette('#292929','#bbb',['#bbb','#999','#777','#222','#575757','#373737'],'#797979','#4f4f4f'));
	palette.push(new Palette('#2f3052','#d8d9ff',['#d8d9ff','#e1e485','#2cda9d','#8498f0','#d86f9a','#e4b37f'],'#8498f0','#434c72'));
	//palette.push(new Palette('#2a2b2e','#6b7b86',['#6b7b86','#7c765b','#465541','#435168','#72454e','#6f5949'],'#6f5949'));
	palette.push(new Palette('#e4e4e4','#94a0b4',['#bac4cc','#ecdd90','#99df92','#accdff','#eeb5cf','#dac2f3'],'#eeb5cf','#d6d4df','#e4e4e4'));
	
	px = windowHeight / (9 * pxfact);
	w = px*8/n;
	win = [windowWidth, windowHeight];
	createCanvas(windowWidth, windowHeight, WEBGL);
	rectMode(CENTER);
	frameRate(24);
	textFont(atkinsonRegular);
	textAlign(CENTER,CENTER);
	background(palette[0].back);
	noStroke();
	
	
	input_unit = createInput('');
	input_unit.attribute("placeholder","Enter a Unit");
	mult_button = createButton("Multiply");
	mult_button.mousePressed(play_mult);
	div_button = createButton("Divide");
	div_button.mousePressed(play_div);
	button_input_setup();
	
	var edge = 0;
	for (var i = -(n-1)/2; i <= (n-0.999)/2; i += 1){
		for (var j = -(n-1)/2; j <= (n-0.999)/2; j += 1){
			cube.push(new sticker([i,-n/2,j],0,0.9,[1,0],edge));
			cube.push(new sticker([i,n/2,j],1,0.9,[1,0],edge));
			cube.push(new sticker([i,j,n/2],2,0.9,[0,0],edge));
			cube.push(new sticker([i,j,-n/2],3,0.9,[0,0],edge));
			cube.push(new sticker([n/2,i,j],4,0.9,[0,1],edge));
			cube.push(new sticker([-n/2,i,j],5,0.9,[0,1],edge));
			
			for (var k =  -(n-1)/2; k <=  (n-0.999)/2; k += 1){
				boxes.push(new cubie([i*0.99,j*0.99,k*0.99],palette[0].back,0.99));
			}
			edge = 1 - edge;
		}
	}
	
	for (var mod_power = 0; mod_power < powers.length-1; mod_power++){
		
		var mp = 1;
		while(powers[mod_power][2][mp] != 1){
			powers[mod_power][2].push( (powers[mod_power][2][1]*powers[mod_power][2][mp]) % powers[mod_power][0]);
			mp+=1;
		}
		
		powers[mod_power].push([0,1]);
		
		var others_0 = int(2424240/powers[mod_power][0]);

		var curr_others = others_0;
		while(curr_others < 2424240){
			var curr_mod = (curr_others+1) % powers[mod_power][0];
			mp = powers[mod_power][2][powers[mod_power][2].length - 1 - powers[mod_power][2].indexOf(curr_mod)];

			while (powers[mod_power][3].length <= mp){
				powers[mod_power][3].push(0);
			}
			powers[mod_power][3][mp] = curr_others+1;
			curr_others += others_0;
		}
		
	}
	
}

function button_input_setup(){
	var allowed_color = palette[0].backlight;
	if (move_allowed){
		allowed_color = palette[0].front;
	}
	if (width > height){
		button_style(input_unit,palette[0].back,palette[0].front,true,-0.14,0.135,0.24,0.04,0.03,0.003);
	} else {
		button_style(input_unit,palette[0].back,palette[0].front,true,-0.14,0.135,0.22,0.03,0.03,0.004);
	}
	button_style(mult_button,allowed_color,palette[0].back,false,-0.14,0.2,0.11,0.03,0.018);
	button_style(div_button,allowed_color,palette[0].back,false,0,0.2,0.11,0.03,0.018);
	YouTube = new Icon('yt',[win[1]*0.05,win[1]*0.035],win[1]*0.015,[win[1]*0.18,win[1]*0.31],'https://youtu.be/Dq4z--4pVFY');
	Theme = new Icon('th',[win[1]*0.035,win[1]*0.035],win[1]*0.0025,[-win[1]*0.18,win[1]*0.31]);
	rand_button = new Icon('die',[win[1]*0.04,win[1]*0.04],win[1]*0.0025,[win[1]*0.15,-win[1]*0.3425]);
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight); 
	px = windowHeight / (9 * pxfact);
	w = px*8/n;
	win = [windowWidth, windowHeight];
	button_input_setup();
}