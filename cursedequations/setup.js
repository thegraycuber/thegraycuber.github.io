var palette, settingBox, shapeBox, iconBox, labelBox, shapes, shape_locs, shape_size, output, output_vertices, main_items;
var unit, circle_width, vert_width, rotation_angle, max_mag, new_max_mag, mouse_data, grid, mobile, invalid_tick, at_location;
var resolution = 840;
var activeShape = 0;
var auto_zoom = true;
var show_grid = false;
var show_vertices = true;
var show_label = true;
var invalid_text = '';
var at_text = '';
var at_ticker = 0;

function preload() {
	mainFont = loadFont("media/AshkinsonBold_003.ttf");
	thinFont = loadFont("media/AshkinsonRegular_000.ttf");
	
}


function setup() {
	frameRate(30);

	palette_index = palette_names.indexOf('Electric');
	palette = new Palette(palette_names[palette_index]);

	createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	rectMode(CENTER);
	textFont(mainFont);
	textAlign(CENTER, CENTER);
	noStroke();
	rotation_angle = [TWO_PI/960,TWO_PI/840,TWO_PI/720];
	y_flip = createVector(1,-1);

	paste_input = createInput('');
	paste_input.attribute("placeholder","Enter Code");
	paste_go = createButton("Submit");
	paste_go.mousePressed(get_paste);
	
	shapes = [new Shape(0,1),new Shape(0,1),new Shape(0,1)];
	shapeBox = [];
	icons = [];
	mobile = width*1.4 < height;
	var bigText, smallText, s, lab_h, pad;
	
	
	if (mobile) {	
		unit = width*0.4;
		bigText = unit * 0.09;
		smallText = unit * 0.08;
		pad = unit*0.03;
		default_origin = createVector(width*0.5,height*0.5-unit*0.85);
		settingBox = new Box([width*0.62,height-unit*0.74],[width*0.19,unit*0.7],pad);
		for (s = 0; s < 3; s++){
			shapeBox.push(new Box([width*0.22,height-unit*0.74],[width*0.19,unit*0.7],pad));
		}
		iconBox = new Box([width*0.9,height-unit*0.74],[width*0.07,unit*0.7],pad);
		iconBox.Items.push(new Icon('rand',[width*0.08,width*0.08],width*0.005,[width*0.9,height-unit*1.22]));
		iconBox.Items.push(new Icon('heart',[width*0.08,width*0.08],width*0.005,[width*0.9,height-unit*0.88]));
		iconBox.Items.push(new Icon('copy',[width*0.08,width*0.08],width*0.006,[width*0.9,height-unit*0.54]));
		iconBox.Items.push(new Icon('paste',[width*0.08,width*0.08],width*0.006,[width*0.9,height-unit*0.2]));
		
		lab_h = height-unit*1.5;
		unit = min(unit,0.4*(height-unit*1.7));
		lab_h -= unit*0.14;
		labelBox = new Box([width*0.5,lab_h],[width*0.47,unit*0.15],pad);
		let funk_texts = ['     x² +      x +      = 0','√(     ² +      ²)','√(     ² +      ² +      ²)'];
		labelBox.Items.push(new arrowItem(1,funk_texts,unit*0.2,'function'));
		at_location = createVector(default_origin.x,lab_h-unit*0.25,unit*0.12);
		
		shape_locs = [[createVector(default_origin.x - unit*0.8,lab_h),
								 createVector(default_origin.x - unit*0.12,lab_h),
								 createVector(default_origin.x + unit*0.46,lab_h)],
									
								 [createVector(default_origin.x - unit*0.27,lab_h),
								 createVector(default_origin.x + unit*0.32,lab_h)],
									
								 [createVector(default_origin.x - unit*0.56,lab_h),
								 createVector(default_origin.x + unit*0.02,lab_h),
								 createVector(default_origin.x + unit*0.6,lab_h)]];
		shape_size = unit*0.1;
		
		grid = new Grid(0,lab_h-unit*0.16,width,0);
		
		button_style(paste_input,palette.back,palette.front,true,default_origin.x-unit*0.9,unit*0.1,1.8,0.2,0.14,0.02);
		button_style(paste_go,palette.front,palette.back,false,default_origin.x-unit*0.3,unit*0.4,0.6,0.2,0.14,0.02);
		
		
	} else {
		unit = height * 0.35;
		bigText = unit * 0.065;
		smallText = unit * 0.05;
		pad = unit * 0.02;
		default_origin = createVector(width*0.5+unit*0.27,height*0.5);

		settingBox = new Box([unit*0.35,height*0.77],[unit*0.3,height*0.22],pad);
		for (s = 0; s < 3; s++){
			shapeBox.push(new Box([unit*0.35,height*0.31],[unit*0.3,height*0.22],pad));
		}
		iconBox = new Box([unit*0.35,height*0.04],[unit*0.3,height*0.03],pad);
		iconBox.Items.push(new Icon('rand',[height*0.035,height*0.035],height*0.002,[unit*0.14,height*0.04]));
		iconBox.Items.push(new Icon('heart',[height*0.035,height*0.035],height*0.002,[unit*0.29,height*0.04]));
		iconBox.Items.push(new Icon('copy',[height*0.035,height*0.035],height*0.003,[unit*0.43,height*0.04]));
		iconBox.Items.push(new Icon('paste',[height*0.035,height*0.035],height*0.003,[unit*0.57,height*0.04]));

		grid = new Grid(0,height,width,0);
		unit = min(unit,0.4*(width-unit*0.62));
		lab_h = height-unit*0.16;
		labelBox = new Box([default_origin.x,lab_h],[unit*0.92,unit*0.125],pad);
		labelBox.Items.push(new arrowItem(1,['     x² +      x +      = 0','√(      ² +       ²)','√(      ² +       ² +       ²)'],unit*0.14,'function'));
		at_location = createVector(default_origin.x,lab_h-unit*0.2,unit*0.08);

		shape_locs = [[createVector(default_origin.x - unit*0.56,lab_h),
								 createVector(default_origin.x - unit*0.08,lab_h),
								 createVector(default_origin.x + unit*0.32,lab_h)],
									
								 [createVector(default_origin.x - unit*0.2,lab_h),
								 createVector(default_origin.x + unit*0.25,lab_h)],
									
								 [createVector(default_origin.x - unit*0.43,lab_h),
								 createVector(default_origin.x + unit*0.02,lab_h),
								 createVector(default_origin.x + unit*0.46,lab_h)]];
		shape_size = unit*0.07;
	
		button_style(paste_input,palette.back,palette.front,true,unit*0.06,unit*0.06,0.8,0.12,0.08,0.01,0.05);
		button_style(paste_go,palette.front,palette.back,false,unit*0.92,unit*0.08,0.4,0.12,0.08,0,0.05);
		
		
	}
	circle_width = unit/64;
	vert_width = unit/20;
	scalar = unit;
	origin = default_origin.copy();
	
	main_items = [];
	main_items.push(labelBox.Items[0]);
	
	settingBox.Items.push(new textItem(0.6,'',0));
	settingBox.Items.push(new textItem(1,'Color',bigText));
	settingBox.Items.push(new arrowItem(1,palette_names,smallText,'color',0,palette_index));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'Resolution',bigText));
	settingBox.Items.push(new arrowItem(1,['420','840','1260','2520','5040'],smallText,'resoution',-1,1));
	settingBox.Items.push(new textItem(0.8,'',0));

	//settingBox.Items.push(new textItem(1,'Grid',bigText));
	settingBox.Items.push(new binaryItem(1,['Grid','Off'],smallText,'grid',1));
	main_items.push(settingBox.Items[settingBox.Items.length - 1]);
	settingBox.Items.push(new textItem(0.8,'',0));

	//settingBox.Items.push(new textItem(1,'Auto Zoom',bigText));
	settingBox.Items.push(new binaryItem(1,['Scale','Off'],smallText,'autozoom',0));
	settingBox.Items.push(new textItem(0.8,'',0));

	//settingBox.Items.push(new textItem(1,'Vertices',bigText));
	settingBox.Items.push(new binaryItem(1,['Points','Off'],smallText,'show_vertices',0));
	main_items.push(settingBox.Items[settingBox.Items.length - 1]);
	settingBox.Items.push(new textItem(0.8,'',0));
	
	//settingBox.Items.push(new textItem(1,'Vertices',bigText));
	settingBox.Items.push(new binaryItem(1,['Label','Off'],smallText,'label',0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(0.8,'About This Page',smallText,'','https://youtu.be/ocDnfeFAsCg'));
	settingBox.Items.push(new textItem(0.4,'',0));
	
	var letters = ['A','B','C'];
	for (s = 0; s < 3; s++){
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		shapeBox[s].Items.push(new arrowItem(1,[letters[s],letters[s],letters[s]],bigText,'shape',-1,0,s));
		shapeBox[s].Items.push(new textItem(0.6,'',0));

		shapeBox[s].Items.push(new textItem(1,'Shape',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Circle','Triangle','Square','Pentagon','Hexagon','Heptagon','Octagon','9gon','10gon','11gon','12gon','13gon','Rock','Spiral'],smallText,'vertices',s));
		main_items.push(shapeBox[s].Items[shapeBox[s].Items.length - 1]);
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		

		shapeBox[s].Items.push(new textItem(1,'Step Size',bigText));
		shapeBox[s].Items.push(new arrowItem(1,allowed_steps(shapes[s].vertices),smallText,'step',s));

		while(shapeBox[s].Items[shapeBox[s].Items.length-1].List[shapeBox[s].Items[shapeBox[s].Items.length-1].Index] != str(shapes[s].step)){
			shapeBox[s].Items[shapeBox[s].Items.length-1].Index += 1;
		}
		main_items.push(shapeBox[s].Items[shapeBox[s].Items.length - 1]);
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].Items.push(new textItem(1,'Animation',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Off','Rotate','Radius','Translate'],smallText,'animation',s));
		main_items.push(shapeBox[s].Items[shapeBox[s].Items.length - 1]);
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].Items.push(new textItem(1,'Shape Type',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Regular'],smallText,'type',s));
		main_items.push(shapeBox[s].Items[shapeBox[s].Items.length - 1]);
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].giveSizes();
	}
	
	settingBox.giveSizes();
	labelBox.giveSizes(1.16);
	labelBox.Items[0].Size*=0.6;
	
	//input_settings('Squ,1,Rot,Reg,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi');
	randomize();
}
