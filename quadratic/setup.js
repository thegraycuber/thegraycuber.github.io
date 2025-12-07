
var textBox, iconBox, infoBox, helpBox, grid, hideRect;

function setup() {

	palette_index = palette_names.indexOf('Sunset');
	palette = new Palette(palette_names[palette_index]);

	createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	frameRate(30);
	rectMode(CENTER);
	textFont(mainFont);
	textAlign(CENTER, CENTER);
	
	last_frame = Date.now();
	color_millis = 0;

	
	z_noise = random()*1000;
	prime_limit = 250000;
	generate_squares(100);

	
	let mobile = width*1.4 < height;
	let bigText, pad, info_text;
	
	if (mobile) {	
		
		bigText = width * 0.05;
		pad = width*0.015;
		default_origin = createVector(width*0.5,height*0.5-width*0.32);
		grid = new Grid(0,height-width*0.64,width,0);
		hideRect = [width*0.5,height-width*0.31,width,width*0.65];

		textBox = new Box([width*0.26,height-width*0.4],[width*0.44,width*0.4],pad);
	
		iconBox = new Box([width*0.5,height-width*0.1],[width*0.92,width*0.13],pad);
		let icon_size = [width*0.07,width*0.07];
		iconBox.Items.push(new Icon('palette',[width*0.12,height-width*0.1],icon_size));
		iconBox.Items.push(new Icon('grid',[width*0.27,height-width*0.1],icon_size));
		iconBox.Items.push(new Icon('reset',[width*0.42,height-width*0.1],icon_size));
		iconBox.Items.push(new Icon('random',[width*0.58,height-width*0.1],icon_size));
		iconBox.Items.push(new Icon('download',[width*0.74,height-width*0.1],icon_size));
		iconBox.Items.push(new Icon('info',[width*0.88,height-width*0.1],icon_size));
		
		infoBox = new Box([width*0.74,height-width*0.4],[width*0.44,width*0.4],pad);
		info_text = ['swipe and pinch','to explore','tap a number\nfor more info'];

		helpBox = new Box([width*0.74,height-width*1.02],[width*0.44,width*0.76],pad);
		
	} else {
		
		bigText = height * 0.03;
		pad = height * 0.01;
		default_origin = createVector(width*0.5+height*0.13,height*0.5);
		grid = new Grid(height*0.24,height,width,0);
		hideRect = [height*0.12,height*0.5,height*0.27,height];

		textBox = new Box([height*0.13,height*0.18],[height*0.22,height*0.3],pad);
	
		iconBox = new Box([height*0.13,height*0.5],[height*0.22,height*0.3],pad);
		let icon_size = [height*0.05,height*0.05];
		iconBox.Items.push(new Icon('palette',[height*0.08,height*0.4],icon_size));
		iconBox.Items.push(new Icon('grid',[height*0.18,height*0.4],icon_size));
		iconBox.Items.push(new Icon('reset',[height*0.08,height*0.5],icon_size));
		iconBox.Items.push(new Icon('random',[height*0.18,height*0.5],icon_size));
		iconBox.Items.push(new Icon('download',[height*0.08,height*0.6],icon_size));
		iconBox.Items.push(new Icon('info',[height*0.18,height*0.6],icon_size));
		
		infoBox = new Box([height*0.13,height*0.82],[height*0.22,height*0.3],pad);
		info_text = ['drag and scroll','to explore','click a number\nfor more info'];
		
		helpBox = new Box([height*0.42,height*0.5],[height*0.26,height*0.46],pad);
	} 

	origin = default_origin.copy();
	scalar = min(width,height)*0.02;

	
	textBox.Items.push(new textItem(0.6,'',0));
	let ring_list = ['gaussian','O√-2','eisenstein'];
	for (let d_index = 3; d_index < D_list.length; d_index++){
		ring_list.push('O√'+str(D_list[d_index]));
	}
	textBox.Items.push(new arrowItem(1,ring_list,bigText,'ring'));
	textBox.Items.push(new textItem(0.8,'i² = -1',bigText*0.8,'ring_rule'));
	
	textBox.Items.push(new textItem(1,'',0));
	textBox.Items.push(new textItem(0.6,'color mode',bigText*0.6));
	textBox.Items.push(new arrowItem(1,['solid','noise','norm','x'],bigText*0.8,'color_mode',0,1));
	
	textBox.Items.push(new textItem(0.8,'',0));
	textBox.Items.push(new textItem(0.6,'highlight mode',bigText*0.6,'highlight_label'));
	textBox.Items[textBox.Items.length - 1].Active = false;
	textBox.Items.push(new arrowItem(1,['prime factors','multiples','off'],bigText*0.8,'highlight_mode'));
	textBox.Items[textBox.Items.length - 1].Active = false;
	
	textBox.Items.push(new textItem(0.6,'',0));

	
	infoBox.Items.push(new textItem(0,'',0));
	infoBox.Items.push(new textItem(1.2,'',bigText*1.2,'info_name','','bright'));
	infoBox.Items.push(new textItem(0.2,'',0));
	infoBox.Items.push(new textItem(0.8,info_text[0],bigText*0.8,'info_type'));
	infoBox.Items.push(new textItem(0.8,info_text[1],bigText*0.8,'info_norm'));
	infoBox.Items.push(new textItem(0.6,'',0));
	infoBox.Items.push(new textItem(0.4,'',bigText*0.6,'factorization','','mono'));
	infoBox.Items.push(new textItem(1.6,info_text[2],bigText*0.8,'info_factor','','mono'));
	infoBox.Items.push(new textItem(1.6,'',0));

	let help_text = bigText*0.6;
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(2,'This page displays primes\nin the quadratic integers.',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(5,'These are 2-dimensional\nsystems of numbers. One\ndimension is real integers,\nand the other is spanned\nby the root of a certain\nquadratic polynomial.',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(3,'The behavior of the\nsystem depends on the\nchoice of polynomial.',help_text));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(1,'Learn more from:',help_text));
	helpBox.Items.push(new textItem(1,'my video series',help_text,'help_video','https://youtube.com/playlist?list=PLRcOL8MUr-pd3lhx2Ak0AxExiZctsNpMH&si=mv_Cxzr-E6ekAf1f','bright'));
	helpBox.Items.push(new textItem(1,'OEIS',help_text,'help_oeis','https://oeis.org/wiki/Quadratic_integer_rings','mono'));
	helpBox.Items.push(new textItem(1,'Wikipedia',help_text,'help_wikipedia','https://en.wikipedia.org/wiki/Quadratic_integer','red'));
	helpBox.Items.push(new textItem(0.6,'',0));

	
	textBox.giveSizes();
	infoBox.giveSizes();
	helpBox.giveSizes();
	helpBox.setActive(false);
	
	reset_D();
	
	//set_modulus([8,3]);
	
	background(palette.back);
	
}

var mainFont;
function preload() {
	// mainFont = loadFont("AshkinsonBold_009.ttf");
	mainFont = loadFont("media/AshkinsonBold_prod.ttf"); //prod
}
