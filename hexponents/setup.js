
var crow_list = [-1,-2,-3,-5,-11,-17,28,27,25,24,23,22,19,18,17,15,14,13,10,9,8,7,5,4,3,1];
var produce_list = ['raisins','apples','pears','oranges','craisins','grapes','peaches','apricots',
					'almonds','peanuts','cashews','cherries','strawberries','blueberries',
					'walnuts','plums','kiwis','pecans','hazelnuts','pistachios','blackberries',
					'currants','lemons','limes','grapefruits','raspberries'];


var equivalence_classes;
var textBox, iconBox, helpBox, bigText, at_location, mobile;
function setup() {
	
	createCanvas(windowWidth, windowHeight);
	smooth();
	frameRate(30);
	rectMode(CENTER);
	textFont(mainFont);
	textAlign(CENTER, CENTER);
	
	origin = createVector(width/2, height/2);
	palette = new Palette('Sunset');
	palette_index = 1;
	orbit_color_setup();

	while (primes.length < 100){
		add_prime();
	}

	process_mod();
	process_orbits();

	
	paste_input = createInput('');
	paste_input.attribute("placeholder","enter code");
	paste_go = createButton("submit");
	paste_go.mousePressed(get_paste);

	
	mobile = width*1.4 < height;
	let pad;
	
	if (mobile) {	
		
		bigText = width * 0.05;
		pad = width*0.015;

		textBox = new Box([width*0.24,height-width*0.2],[width*0.4,width*0.36],pad);
	
		iconBox = new Box([width*0.72,height-width*0.2],[width*0.48,width*0.36],pad);
		let icon_size = [width*0.08,width*0.08];
		iconBox.Items.push(new Icon('copy',[width*0.57,height-width*0.28],icon_size));
		iconBox.Items.push(new Icon('paste',[width*0.72,height-width*0.28],icon_size));
		iconBox.Items.push(new Icon('info',[width*0.87,height-width*0.28],icon_size));
		iconBox.Items.push(new Icon('palette',[width*0.57,height-width*0.12],icon_size));
		iconBox.Items.push(new Icon('random',[width*0.72,height-width*0.12],icon_size));
		iconBox.Items.push(new Icon('hearts',[width*0.87,height-width*0.12],icon_size));

		helpBox = new Box([width*0.74,height-width*0.77],[width*0.44,width*0.7],pad);
		
		button_style(paste_input,palette.back,palette.front,true,width*0.5-bigText*8,bigText,bigText*16,bigText*1.4,bigText*0.8);
		button_style(paste_go,palette.front,palette.back,true,width*0.5-bigText*4,bigText*2.6,bigText*8,bigText*1.2,bigText*0.8);
			
		copy_text = createInput('');
		copy_text.attribute("value","enter code");
		copy_label = createButton('copy the code above');

		button_style(copy_text,palette.back,palette.front,true,width*0.5-bigText*8,bigText,bigText*16,bigText*1.4,bigText*0.8);
		button_style(copy_label,palette.front,palette.back,true,width*0.5-bigText*4,bigText*2.6,bigText*8,bigText*1.2,bigText*0.8);
			
		at_location = [width*0.5,height-width*0.4-bigText];
		
	} else {
		
		bigText = height * 0.03;
		pad = height * 0.01;

		textBox = new Box([height*0.15,height*0.12],[height*0.26,height*0.2],pad);

		let icon_wid = height*0.065;
		iconBox = new Box([icon_wid,height*0.61],[height*0.09,height*0.74],pad);
		let icon_size = [height*0.05,height*0.05];
		iconBox.Items.push(new Icon('random',[icon_wid,height*0.295],icon_size));
		iconBox.Items.push(new Icon('hearts',[icon_wid,height*0.40],icon_size));
		iconBox.Items.push(new Icon('copy',[icon_wid,height*0.505],icon_size));
		iconBox.Items.push(new Icon('paste',[icon_wid,height*0.61],icon_size));
		iconBox.Items.push(new Icon('download',[icon_wid,height*0.715],icon_size));
		iconBox.Items.push(new Icon('palette',[icon_wid,height*0.82],icon_size));
		iconBox.Items.push(new Icon('info',[icon_wid,height*0.925],icon_size));
		
		helpBox = new Box([height*0.26,height*0.78],[height*0.26,height*0.4],pad);
		
		button_style(paste_input,palette.back,palette.front,true,height*0.13,height*0.61-bigText*0.8,bigText*8,bigText*1.6,bigText);
		button_style(paste_go,palette.front,palette.back,false,height*0.15+bigText*8,height*0.61-bigText*0.8,bigText*4,bigText*1.6,bigText);

		at_location = [width*0.5,height-bigText*2];
	} 
	
	textBox.Items.push(new textItem(0.6,'',0));
	let ring_list = [];
	for (let crow = 0; crow < crow_list.length; crow++){
		ring_list.push('c² = c '+ (sign(crow_list[crow]) == 1? '+ ': '- ') + str(abs(crow_list[crow])));
	}
	textBox.Items.push(new arrowItem(1,ring_list,bigText,'ring'));

	
	textBox.Items.push(new textItem(1,'',0));
	// textBox.Items.push(new textItem(0.6,'mod',bigText*0.6));
	textBox.Items.push(new arrowItem(1,[],bigText,'mod',0,1));

	textBox.Items.push(new textItem(0.8,'',0));
	textBox.Items.push(new arrowItem(1,[],bigText,'orbits'));
	
	textBox.Items.push(new textItem(0.6,'',0));
	
	generate_hex_primes();

	

	let help_text = bigText*0.6;
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(1,'this page displays',help_text));
	helpBox.Items.push(new textItem(1.2,'hexponents',help_text*1.4));
	helpBox.Items.push(new textItem(1,'as shown in my video!',help_text,'help_link','https://youtu.be/8_WPBuYYz9M','bright'));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(2,'use the arrows to explore\ndifferent settings',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(4,'press the die to\nrandomize the settings,\nor the hearts to see\nmy favorite settings',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(5,'if you find something cool,\npress the copy button and\n paste it as a comment\non my video! i might\n add it to the favorites',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));

	
	textBox.giveSizes();
	helpBox.giveSizes();
	helpBox.setActive(false);

	fav = floor(random()*favorites.length);
	action('hearts');
}

var mainFont, regularFont;
function preload() {
	// mainFont = loadFont("AshkinsonBold_009.ttf");
	regularFont = loadFont("media/AshkinsonRegular_000.ttf");
	mainFont = loadFont("media/AshkinsonBold_prod.ttf"); //prod
}

