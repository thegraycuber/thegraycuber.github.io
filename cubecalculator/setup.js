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
var yt;

function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	//openSans = loadFont("OpenSans-Regular.ttf");
	
	alg_list = loadTable('n_alg.csv', 'csv');//, 'header');
	alg_compress = loadTable('n_alg_compress.csv');//, 'csv', 'header');
}


function setup() {
	
	px = windowHeight / (9 * pxfact);
	w = px*8/n;
	win = [windowWidth, windowHeight];
	createCanvas(windowWidth, windowHeight, WEBGL);
	rectMode(CENTER);
	frameRate(24);
	textFont(atkinsonBold);
	textAlign(CENTER,CENTER);
	background(colors[0]);
	noStroke();
	
	
	yt = new YouTube([win[1]*0.05,win[1]*0.035],win[1]*0.015,[win[1]*0.18,win[1]*0.42],'https://www.youtube.com/watch?v=dYj0rPQeRkA');
	
	input_unit = createInput('');
	input_unit.attribute("placeholder","Enter a Unit");
	button_style(input_unit,colors[0],colors[1],true,-0.12,0.78,0.24,0.04,0.03);
	mult_button = createButton("Multiply");
	mult_button.mousePressed(play_mult);
	button_style(mult_button,colors[1],colors[0],false,-0.21,0.9,0.1,0.04,0.02);
	div_button = createButton("Divide");
	div_button.mousePressed(play_div);
	button_style(div_button,colors[1],colors[0],false,-0.09,0.9,0.1,0.04,0.02);
	rand_button = createButton("Random");
	rand_button.mousePressed(give_rand);
	button_style(rand_button,colors[1],colors[0],false,0.03,0.9,0.1,0.04,0.02);
	
	var edge = 0;
	for (var i = -w*(n-1)/2; i <= w*(n-0.999)/2; i += w){
		for (var j = -w*(n-1)/2; j <= w*(n-0.999)/2; j += w){
			cube.push(new sticker([i,-w*n/2,j],colors[1],w*0.9,[1,0],edge));
			cube.push(new sticker([i,w*n/2,j],colors[2],w*0.9,[1,0],edge));
			cube.push(new sticker([i,j,w*n/2],colors[3],w*0.9,[0,0],edge));
			cube.push(new sticker([i,j,-w*n/2],colors[4],w*0.9,[0,0],edge));
			cube.push(new sticker([w*n/2,i,j],colors[5],w*0.9,[0,1],edge));
			cube.push(new sticker([-w*n/2,i,j],colors[6 ],w*0.9,[0,1],edge));
			
			for (var k =  -w*(n-1)/2; k <=  w*(n-0.999)/2; k += w){
				boxes.push(new cubie([i*0.99,j*0.99,k*0.99],colors[0],w*0.99));
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
