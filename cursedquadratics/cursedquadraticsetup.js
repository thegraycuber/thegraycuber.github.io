var palette, settingBox, shapeBox, shapes, output, output_vertices, label, shape_locs, shape_size;
var unit, circle_width, vert_width, rotation_angle, max_mag, mouse_data, grid;
var resolution = 840;
var activeShape = 2;
var auto_zoom = true;
var show_grid = false;
var show_vertices = true;

function preload() {
	
	openSans = loadFont("OpenSans-Bold.ttf");
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	
}


function setup() {
	palette = new Palette();
	palette.getColors('Electric');
	
	createCanvas(window.innerWidth, window.innerHeight);
	smooth();
	rectMode(CENTER);
	textFont(atkinsonBold);
	textAlign(CENTER, CENTER);
	noStroke();
	rotation_angle = [TWO_PI/840,TWO_PI/720,TWO_PI/600];
	y_flip = createVector(1,-1);
	
	shapes = [new Shape(4,1,0,0,'Regular'),new Shape(0,-1),new Shape(8,-3,0,0,'Flower')];
	// 5,2 0,-1 5,1
	// 7,2 0,-1 7,3
	// 3,1t 0,-1 13,-3r
	
	shapeBox = [];
	var mobile = width*1.4 < height;
	var bigText, smallText, s, lab_h, pad;
	
	if (mobile) {	
		unit = width*0.4;
		bigText = unit * 0.09;
		smallText = unit * 0.08;
		pad = unit*0.03;
		default_origin = createVector(width*0.5,height*0.5-unit*0.85);
		settingBox = new Box([width*0.74,height-unit*0.74],[width*0.21,unit*0.7],pad);
		for (s = 0; s < 3; s++){
			shapeBox.push(new Box([width*0.26,height-unit*0.74],[width*0.21,unit*0.7],pad));
		}
		
		lab_h = height-unit*1.5;
		unit = min(unit,0.4*(height-unit*1.7));
		lab_h -= unit*0.14;
		label = new Label(width*0.5,lab_h,width*0.9,unit*0.3,unit*0.2,pad);
		shape_locs = [createVector(width*0.5 - unit*0.83,lab_h),
								 createVector(width*0.5 - unit*0.13,lab_h),
								 createVector(width*0.5 + unit*0.47,lab_h)];
		shape_size = unit*0.0875;
		
		grid = new Grid(0,lab_h-unit*0.16,width,0);
		
	} else {
		unit = height * 0.35;
		bigText = unit * 0.065;
		smallText = unit * 0.05;
		pad = unit * 0.02;
		default_origin = createVector(width*0.5+unit*0.27,height*0.5);
		settingBox = new Box([unit*0.3,height*0.7475],[unit*0.26,height*0.24],pad);
		for (s = 0; s < 3; s++){
			shapeBox.push(new Box([unit*0.3,height*0.2525],[unit*0.26,height*0.24],pad));
		}
		
		grid = new Grid(unit*0.57,height,width,0);
		unit = min(unit,0.4*(width-unit*0.56));
		lab_h = height-unit*0.16;
		label = new Label(default_origin.x,lab_h,unit*1.8,unit*0.25,unit*0.18,pad);
		shape_locs = [createVector(default_origin.x - unit*0.73,lab_h),
								 createVector(default_origin.x - unit*0.12,lab_h),
								 createVector(default_origin.x + unit*0.41,lab_h)];
		shape_size = unit*0.075;
	
		
	}
	circle_width = unit/64;
	vert_width = unit/20;
	scalar = unit;
	origin = default_origin.copy();
	
	settingBox.Items.push(new textItem(0.6,'',0));
	settingBox.Items.push(new textItem(1,'Color',bigText));
	settingBox.Items.push(new arrowItem(1,['Electric','Sunset','Autumn','Dark','Light','Forest'],smallText,'color',0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'Resolution',bigText));
	settingBox.Items.push(new arrowItem(1,['420','840','1260','2520','5040'],smallText,'resoution',1));
	settingBox.Items.push(new textItem(0.8,'',0));

	settingBox.Items.push(new textItem(1,'Grid',bigText));
	settingBox.Items.push(new binaryItem(1,['On','Off'],smallText,'grid',1));
	settingBox.Items.push(new textItem(0.8,'',0));

	settingBox.Items.push(new textItem(1,'Auto Zoom',bigText));
	settingBox.Items.push(new binaryItem(1,['On','Off'],smallText,'autozoom',0));
	settingBox.Items.push(new textItem(0.8,'',0));

	settingBox.Items.push(new textItem(1,'Vertices',bigText));
	settingBox.Items.push(new binaryItem(1,['On','Off'],smallText,'show_vertices',0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(0.8,'About This Page',smallText,'','https://www.youtube.com/@TheGrayCuber'));
	settingBox.Items.push(new textItem(0.4,'',0));
	settingBox.giveSizes();
	
	
	var letters = ['A','B','C'];
	for (s = 0; s < 3; s++){
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		shapeBox[s].Items.push(new arrowItem(1,[letters[s],letters[s],letters[s]],bigText,'shape',0,s));
		shapeBox[s].Items.push(new textItem(0.6,'',0));

		shapeBox[s].Items.push(new textItem(1,'Shape',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Circle','Triangle','Square','Pentagon','Hexagon','Heptagon','Octagon','9gon','10gon','11gon','12gon','13gon','Rock','Spiral'],smallText,'vertices'));
		/*
		for (var vert = 3; vert <= 12; vert++){
			shapeBox[s].Items[shapeBox[s].Items.length - 1].List.push(str(vert));
		}
		*/
		if (shapes[s].vertices > 0){
			shapeBox[s].Items[shapeBox[s].Items.length - 1].Index = shapes[s].vertices - 2;
		}
		shapeBox[s].Items.push(new textItem(0.6,'',0));

		shapeBox[s].Items.push(new textItem(1,'Step Size',bigText));
		shapeBox[s].Items.push(new arrowItem(1,allowed_steps(shapes[s].vertices),smallText,'step'));

		while(shapeBox[s].Items[shapeBox[s].Items.length-1].List[shapeBox[s].Items[shapeBox[s].Items.length-1].Index] != str(shapes[s].step)){
			shapeBox[s].Items[shapeBox[s].Items.length-1].Index += 1;
		}
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].Items.push(new textItem(1,'Animation',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Off','Rotate','Radius'],smallText,'animation'));
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].Items.push(new textItem(1,'Shape Type',bigText));
		shapeBox[s].Items.push(new arrowItem(1,['Regular','Flower','Wiggle','Smooth'],smallText,'type'));
		shapeBox[s].Items.push(new textItem(0.6,'',0));
		
		shapeBox[s].giveSizes();
	}
	
	
	shapeBox[0].Items[shapeBox[0].getIndex('animation')].giveValue(1);
	shapeBox[2].Items[shapeBox[2].getIndex('animation')].giveValue(2);
	shapeBox[2].Items[shapeBox[2].getIndex('type')].giveValue(1);
	activeShape = 0;

	// 3,1t 0,-1 13,-3r
}