
var el_data, gen_data;
function preload(){
	mainFont = loadFont('media/AshkinsonBold_prod.ttf');
	
	gen_data = loadTable('group_visualizer/group_generators_013.csv', 'csv', 'header');
	el_data = loadTable('group_visualizer/group_labels_012.csv', 'csv', 'header');
}

var palette, arrowBoxes, settingBox, iconBox, arrowBox, displayBox, unit;

var G;
var G_order = 8;
var G_class = 0;
var G_group = 1;
var gen = [];
var gen_rules = [];

var arrow_elements = [1,4,3];
var arrow_types = [0,0,0];
var arrow_strengths = [0.25,0.04,0.01];
var active_arrow = 0;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	palette_index = palette_names.indexOf('Forest');
	palette = new Palette(palette_names[palette_index]);
	noStroke();
	smooth();
	
	origin = createVector(width/2,height/2);
	scalar = min(width,height)/(6*(G_order**0.5));
	ellipseMode(CENTER);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	textFont(mainFont);

	
	generate_group_classes();
	generate_group();
	let order_list = ['1'];
	while (order_list.length + 1 < group_classes.length){
		order_list.push(str(order_list.length+1));
	}
	
	
	arrowBoxes = [];
	icons = [];
	mobile = width*1.4 < height;
	var headText, infoText, s, lab_h, pad;
	
	if (mobile) {	
		unit = width*0.4;
		headText = unit * 0.08;
		infoText = unit * 0.12;
		pad = unit*0.03;
		default_origin = createVector(width*0.5,height*0.5-unit*0.85);
		settingBox = new Box([width*0.615,height-unit*0.77],[width*0.18,unit*0.7],pad);
		for (let a = 0; a < 3; a++){
			arrowBoxes.push(new Box([width*0.22,height-unit*0.77],[width*0.18,unit*0.7],pad));
		}
		
		row_height = width*0.9;
		iconBox = new Box([row_height,height-unit*0.77],[width*0.07,unit*0.7],pad);
		iconBox.Items.push(new Icon('movement',[width*0.07,width*0.07],width*0.006,[row_height,height-unit*1.25]));
		iconBox.Items.push(new Icon('palette',[width*0.06,width*0.06],width*0.0065,[row_height,height-unit*0.92]));
		iconBox.Items.push(new Icon('rand',[width*0.08,width*0.08],width*0.006,[row_height,height-unit*0.6]));
		iconBox.Items.push(new Icon('save_image',[width*0.08,width*0.08],width*0.007,[row_height,height-unit*0.28]));

		row_height = height-unit*1.32;
		displayBox = new Box([width*0.615,row_height],[width*0.18,unit*0.1],pad,true);
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[width*0.51,row_height],0));
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[width*0.615,row_height],1));
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[width*0.72,row_height],2));
		
		arrowBox = new Box([width*0.22,row_height],[width*0.18,unit*0.1],pad,true);
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[width*0.12,row_height],0));
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[width*0.225,row_height],1));
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[width*0.33,row_height],2));
		
	} else {
		unit = height * 0.35;
		headText = unit * 0.05;
		infoText = unit * 0.1;
		pad = unit * 0.02;
		default_origin = createVector(width*0.5+unit*0.27,height*0.5);

		settingBox = new Box([unit*0.35,height*0.765],[unit*0.3,height*0.21],pad);
		for (let a = 0; a < 3; a++){
			arrowBoxes.push(new Box([unit*0.35,height*0.32],[unit*0.3,height*0.22],pad));
		}
		iconBox = new Box([unit*0.35,height*0.05],[unit*0.3,height*0.035],pad);
		let row_height = height*0.05;
		iconBox.Items.push(new Icon('movement',[height*0.03,height*0.03],height*0.003,[unit*0.14,row_height]));
		iconBox.Items.push(new Icon('palette',[height*0.028,height*0.028],height*0.0025,[unit*0.28,row_height]));
		iconBox.Items.push(new Icon('rand',[height*0.032,height*0.032],height*0.0022,[unit*0.43,row_height]));
		iconBox.Items.push(new Icon('save_image',[height*0.035,height*0.035],height*0.003,[unit*0.57,row_height]));
		
		row_height = height*0.6;
		displayBox = new Box([unit*0.35,row_height],[unit*0.3,height*0.04],pad,true);
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[unit*0.17,row_height],0));
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[unit*0.36,row_height],1));
		displayBox.Items.push(new Icon('display_mode',[height*0.03,height*0.03],height*0.003,[unit*0.54,row_height],2));
		
		row_height = height*0.15;
		arrowBox = new Box([unit*0.35,row_height],[unit*0.3,height*0.04],pad,true);
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[unit*0.17,row_height],0));
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[unit*0.36,row_height],1));
		arrowBox.Items.push(new Icon('arrow_active',[height*0.03,height*0.03],height*0.003,[unit*0.54,row_height],2));
	}
	circle_width = unit/64;
	vert_width = unit/20;
	//scalar = unit;
	origin = default_origin.copy();
	
	
	settingBox.Items.push(new textItem(2.5,'',0));

	settingBox.Items.push(new textItem(1,'order',headText));
	settingBox.Items.push(new arrowItem(1,order_list,infoText,'order',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'class',headText));
	settingBox.Items.push(new arrowItem(1,['a'],infoText,'class',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'group',headText));
	settingBox.Items.push(new arrowItem(1,['a'],infoText,'group',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	// settingBox.Items.push(new textItem(1,'display mode',headText));
	// settingBox.Items.push(new arrowItem(1,['physics','diagram','table'],infoText,'display_mode',-1,0));
	// settingBox.Items.push(new textItem(0.8,'',0));
	
	// settingBox.Items.push(new textItem(0.8,'about this page',infoText,'','https://youtu.be/ocDnfeFAsCg'));
	// settingBox.Items.push(new textItem(0.4,'',0));
	
	var arrow_labels = ['focus 1','focus 2','focus 3'];
	for (a = 0; a < 3; a++){
		
		arrowBoxes[a].Items.push(new textItem(2.4,'',0));
		/*
		arrowBoxes[a].Items.push(new textItem(0.6,'',0));
		arrowBoxes[a].Items.push(new arrowItem(1,[arrow_labels[a],arrow_labels[a],arrow_labels[a]],infoText*0.8,'arrow',a,0,a));
		arrowBoxes[a].Items.push(new textItem(0.6,'',0));

		arrowBoxes[a].Items.push(new binaryItem(1,['on','off'],headText*1.4,'arrow_active',0,a));
		arrowBoxes[a].Items.push(new textItem(0.8,'',0));
	*/
		//arrowBoxes[a].Items.push(new textItem(0.8,'',0));
		arrowBoxes[a].Items.push(new arrowItem(1,['0','1','2'],infoText,'arrow_element',a,arrow_elements[a],a));
		arrowBoxes[a].Items.push(new textItem(0.8,'',0));
		
		arrowBoxes[a].Items.push(new textItem(1,'type',headText,'type_head'));
		arrowBoxes[a].Items.push(new arrowItem(1,['left operate','right operate','conjugate'],infoText,'arrow_type',a));
		arrowBoxes[a].Items.push(new textItem(0.6,'',0));
		
		arrowBoxes[a].Items.push(new textItem(1,'strength',headText,'strength_head'));
		arrowBoxes[a].Items.push(new sliderItem(1.2,headText,[0,1],'arrow_strength',arrow_strengths[a]**0.5,a));
		arrowBoxes[a].Items.push(new textItem(0.8,'',0));
		
		arrowBoxes[a].giveSizes();
	}
	
	settingBox.giveSizes();
	
	settingBox.getItem('order').giveValue(7);
	settingBox.getItem('class').giveValue(1);
	settingBox.getItem('group').giveValue(0);
	
	//arrowBoxes[2].getItem('arrow_active').giveValue(1);
	arrow_elements[2] = -1;
}
