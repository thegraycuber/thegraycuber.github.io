var palette, shapeBox, iconBox, labelBox, idealBox, mobileBox, grid;
var shape, target_shape, shape_size; 
var unit, circle_width, vert_width, main_items, mobile;
var resolution = 720;
var resolutions = [240,720,1440,2880,5040];


function preload() {
	
	mainFont = loadFont("media/AshkinsonBold_prod.ttf");
	mainBold = loadFont("media/AshkinsonBold_prod.ttf");
	thinFont = loadFont("media/AshkinsonRegular_000.ttf");
	
}
var mainBold;

function setup() {

	frameRate(30);
	start_time = millis();
	palette_index = palette_names.indexOf('Electric');
	palette = new Palette(palette_names[palette_index]);

	createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	rectMode(CENTER);
	textFont(mainFont);
	textAlign(CENTER, CENTER);
	noStroke();
	y_flip = createVector(1,-1);

	
	mobile = width*1.4 < height;
	let bigText, smallText, pad, gap;

	if (mobile) {	
		unit = width*0.3;
		bigText = width * 0.035;
		smallText = width * 0.025;
		pad = width*0.015;
		gap = 0.5;
		circle_width = width*0.012;
		vert_width = width*0.04;
		default_origin = createVector(width*0.5,height*0.5-width*0.32);
		grid = new Grid(0,height-width*0.67,width,0);
		
		shapeBox = new Box([width*0.27,height-width*0.48],[width*0.42,width*0.36],pad);
	
		iconBox = new Box([width*0.27,height-width*0.15],[width*0.42,width*0.24],pad);
		let icon_size = [width*0.07,width*0.07];
		iconBox.Items.push(new Icon('palette',[width*0.15,height-width*0.21],icon_size));
		iconBox.Items.push(new Icon('spin',[width*0.27,height-width*0.21],icon_size));
		iconBox.Items.push(new Icon('play',[width*0.39,height-width*0.21],icon_size,'play','bright'));
		iconBox.Items.push(new Icon('youtube',[width*0.15,height-width*0.09],icon_size,'youtube','front','https://www.youtube.com/@TheGrayCuber'));
		iconBox.Items.push(new Icon('random',[width*0.27,height-width*0.09],icon_size));
		iconBox.Items.push(new Icon('reset',[width*0.39,height-width*0.09],icon_size));
		
		shape_size = width*0.035;
		labelBox = new Box([width*0.73,height-width*0.61],[width*0.42,width*0.1],pad);
		labelBox.Items.push(new textItem(1,'      ²',width*0.05));
		labelBox.Items.push(new textItem(0.1,'',0));

		idealBox = new Box([width*0.73,height-width*0.485],[width*0.42,width*0.09],pad);
		idealBox.Items.push(new textItem(1,'i² = -1',width*0.05,'','','i'));		
		
		game_icons = [
			new Icon('restart',[ default_origin.x-height*0.17, default_origin.y + height*0.15],[height*0.1,height*0.05],'text_inv'),
			new Icon('free play',[ default_origin.x+height*0.018, default_origin.y + height*0.15],[height*0.14,height*0.05],'text_inv'),
			new Icon('exit',[ default_origin.x+height*0.18, default_origin.y + height*0.15],[height*0.08,height*0.05],'text_inv'),
		];
		
			mobileBox = new Box([width*0.73,height-width*0.22],[width*0.42,width*0.38],pad);
		
	} else {
		unit = min(height, width - height*0.34)* 0.33;
		bigText = height * 0.025;
		smallText = height * 0.0175;
		pad = height * 0.01;
		gap = 1;
		circle_width = height*0.008;
		vert_width = height*0.025;
		default_origin = createVector(width*0.5+height*0.11,height*0.5);
		grid = new Grid(0,height,width,0);

		shapeBox = new Box([height*0.14,height*0.44],[height*0.22,height*0.34],pad);
	
		iconBox = new Box([height*0.14,height*0.8],[height*0.22,height*0.34],pad);
		let icon_size = [height*0.05,height*0.05];
		iconBox.Items.push(new Icon('palette',[height*0.09,height*0.69],icon_size));
		iconBox.Items.push(new Icon('play',[height*0.19,height*0.69],icon_size,'play','bright'));
		iconBox.Items.push(new Icon('spin',[height*0.09,height*0.8],icon_size));
		iconBox.Items.push(new Icon('random',[height*0.19,height*0.8],icon_size));
		iconBox.Items.push(new Icon('youtube',[height*0.09,height*0.91],icon_size,'youtube','front','https://www.youtube.com/@TheGrayCuber'));
		iconBox.Items.push(new Icon('reset',[height*0.19,height*0.91],icon_size));
		
		shape_size = height*0.03;
		labelBox = new Box([height*0.14,height*0.08],[height*0.22,height*0.1],pad);
		labelBox.Items.push(new textItem(1,'      ²',height*0.045));
		labelBox.Items.push(new textItem(0.1,'',0));

		idealBox = new Box([height*0.14,height*0.20],[height*0.22,height*0.1],pad);
		idealBox.Items.push(new textItem(1,'i² = -1',height*0.04,'','','i'));		
		
		game_icons = [
			new Icon('restart',[ default_origin.x-height*0.17, default_origin.y + height*0.15],[height*0.1,height*0.05],'text_inv'),
			new Icon('free play',[ default_origin.x+height*0.018, default_origin.y + height*0.15],[height*0.14,height*0.05],'text_inv'),
			new Icon('exit',[ default_origin.x+height*0.18, default_origin.y + height*0.15],[height*0.08,height*0.05],'text_inv'),
		];
		
	} 
	
	scalar = unit;
	origin = default_origin.copy();
	shape = new Shape(0,1);
	
	main_items = [];
	

	let funks = [];
	for (let f of function_list){
		funks.push(f[0]);
	}
	
	shapeBox.Items.push(new textItem(0.6*gap,'',0));
	shapeBox.Items.push(new arrowItem(1,funks,bigText*1.2,'function',-1,0));
	main_items.push(shapeBox.Items[shapeBox.Items.length - 1]);
	shapeBox.Items.push(new textItem(1.2*gap,'',0));


	
	let shape_list = ['circle','triangle','square','pentagon','hexagon','heptagon','octagon','spiral'];//,'9gon','10gon','11gon'
	shapeBox.Items.push(new arrowItem(1,shape_list,bigText*1.2,'vertices',0,0,'mono'));
	main_items.push(shapeBox.Items[shapeBox.Items.length - 1]);
	shapeBox.Items.push(new textItem(0.4,'',0));

	shapeBox.Items.push(new arrowItem(1,['regular'],bigText,'type',0,0,'mono'));
	main_items.push(shapeBox.Items[shapeBox.Items.length - 1]);
	shapeBox.Items.push(new textItem(0.4,'',0));

	shapeBox.Items.push(new arrowItem(1,allowed_laps(shape.vertices),bigText,'step',0,0,'mono'));
	while(shapeBox.Items[shapeBox.Items.length-1].List[shapeBox.Items[shapeBox.Items.length-1].Index] != lap_text[shape.step]){
		shapeBox.Items[shapeBox.Items.length-1].Index += 1;
	}
	main_items.push(shapeBox.Items[shapeBox.Items.length - 1]);
	shapeBox.Items.push(new textItem(1.2*gap,'',0));


	shapeBox.Items.push(new arrowItem(1,['low res','mid res','hi res','super hi res','super duper hi res'],bigText,'resoution',-1,1, 'front'));
	shapeBox.Items.push(new textItem(0.6*gap,'',0));

	
	shapeBox.giveSizes();
	labelBox.giveSizes();
	idealBox.giveSizes();
	iconBox.getItem('reset').Active = false;
	
	randomize();
}
