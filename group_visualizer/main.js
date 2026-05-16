

var autoZoom = true;
var processFrame = true;
var hideCanvas = false;

function draw(){
	
	background(palette.back);
	if (hideCanvas){
		return;
	}

	translate(origin.x,origin.y);
	scale(scalar,scalar);

	
	if (displayState != 2){

		if (displayState == 0){
			updatePhysics();	
		} else {
			innerOuter('auto');
		}

		onlyStroke(palette.front,0.2);
		for (var a = arrowElements.length -1; a > -1 ; a--){
			if (arrowElements[a] != -1){
				stroke(palette.accent[a]);
				G[arrowElements[a]].arrows(arrowTypes[a]);
			}
		}
		for (var e of G){
			e.display();
		}
		resetMatrix();

		mouseVec = pixelToPrincipal(createVector(mouseX,mouseY));
		for (let el of G){
			el.isWithin(mouseVec);
		}

	} else {
		showTable();
	}

	
	if (draggedElement > -1){
		G[draggedElement].pos = pixelToPrincipal(createVector(mouseX,mouseY));
	}
	
}


var canvas;
function setup() {
	
	morningRoutine('forest');

	yFlip = 1;
	
	textAlign(CENTER,CENTER);
	textFont(boldFont);
	setupFonts();

	
	generateGroupClasses();
	generateGroup();
	let orderList = ['1'];
	while (orderList.length + 1 < groupClasses.length){
		orderList.push(str(orderList.length+1));
	}

	let orderOptions = ['1'];
	for (let o = 2; o < groupClasses.length; o++){
		orderOptions.push(str(o));
	}
	Object.defineProperty(controllers,'arrow-order',{value: new Controller('arrow-order',orderOptions,0),enumerable:true});
	
	Object.defineProperty(controllers,'arrow-class',{value: new Controller('arrow-class',[''],0),enumerable:true});
	Object.defineProperty(controllers,'arrow-group',{value: new Controller('arrow-group',[''],0),enumerable:true});
	
	Object.defineProperty(controllers,'arrow-element',{value: new Controller('arrow-element',[''],0,'mono'),enumerable:true});
	Object.defineProperty(controllers,'arrow-type',{value: new Controller('arrow-type',[''],0,'mono'),enumerable:true});
	
	
	popupList = ['info-holder','info-hide'];
	popdownList = ['info-show','menu-hide'];

	randomize();
}



var portrait, unit;
function setupLayout(){
	portrait = width*5 < height*4;
	setDefaultOrigin();

	if (portrait){	
		scalar =  min(width,height-width*0.5)/(9*(gOrder**0.5));
	} else {
		scalar =  min(height,width-height*0.3)/(9*(gOrder**0.5));
	}
	
	origin = defaultOrigin.copy();

}

function setDefaultOrigin(){
	
	if (portrait){	
		defaultOrigin = createVector(width*0.5,height*0.5-width*0.25);
	} else {
		defaultOrigin = createVector(width*0.5+height*0.15,height*0.5);
	}
}


var elData, genData;
var boldFont, regularFont;
function preload() {
	boldFont = loadFont('/media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('/media/AshkinsonRegular_000.ttf');
	
	genData = loadTable('group_generators_015.csv', 'csv', 'header');
	elData = loadTable('group_labels_015.csv', 'csv', 'header');
}


function corePaletteCustom(){
	// palette.label = lerpColor(color(palette.back),color(palette.mono),0.4);
	// plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),200);
	// plt.dark = color(int(red(plt.back)*0.75),int(green(plt.back)*0.75),int(blue(plt.back)*0.75));
	// plt.medium = lerpColor(plt.back,plt.front,0.3);
	// plt.accent0 = plt.accent[0];
	// plt.accent1 = plt.accent[1];
	// plt.accent2 = plt.accent[2];
	
}



/*
function setup() {
	
	textFont(mainFont);

	
	arrowBoxes = [];
	icons = [];
	mobile = width*1.4 < height;
	var headText, infoText, s, labH, pad;
	
	if (mobile) {	
		unit = width*0.4;
		headText = unit * 0.08;
		infoText = unit * 0.12;
		pad = unit*0.03;
		defaultOrigin = createVector(width*0.5,height*0.5-unit*0.85);
		settingBox = new Box([width*0.615,height-unit*0.77],[width*0.36,unit*1.4],pad);
		for (let a = 0; a < 3; a++){
			arrowBoxes.push(new Box([width*0.22,height-unit*0.77],[width*0.36,unit*1.4],pad));
		}
		
		rowHeight = width*0.9;
		iconBox = new Box([rowHeight,height-unit*0.77],[width*0.14,unit*1.4],pad);
		iconBox.Items.push(new Icon('movement',[rowHeight,height-unit*1.25],[width*0.07,width*0.07],'play'));
		iconBox.Items.push(new Icon('palette',[rowHeight,height-unit*0.92],[width*0.07,width*0.07]));
		iconBox.Items.push(new Icon('random',[rowHeight,height-unit*0.6],[width*0.07,width*0.07]));
		iconBox.Items.push(new Icon('download',[rowHeight,height-unit*0.28],[width*0.07,width*0.07]));

		let iconSize = [height*0.06,height*0.06];
		rowHeight = height-unit*1.32;
		displayBox = new Box([width*0.615,rowHeight],[width*0.36,unit*0.2],pad,true);
		displayBox.Items.push(new Icon('display_mode',[width*0.51,rowHeight],iconSize,0));
		displayBox.Items.push(new Icon('display_mode',[width*0.615,rowHeight],iconSize,1));
		displayBox.Items.push(new Icon('display_mode',[width*0.72,rowHeight],iconSize,2));
		
		arrowBox = new Box([width*0.22,rowHeight],[width*0.36,unit*0.2],pad,true);
		arrowBox.Items.push(new Icon('arrow_active',[width*0.12,rowHeight],iconSize,0,'accent0'));
		arrowBox.Items.push(new Icon('arrow_active',[width*0.225,rowHeight],iconSize,1,'accent1'));
		arrowBox.Items.push(new Icon('arrow_active',[width*0.33,rowHeight],iconSize,2,'accent2'));
		
	} else {
		unit = height * 0.35;
		headText = unit * 0.05;
		infoText = unit * 0.1;
		pad = unit * 0.02;
		defaultOrigin = createVector(width*0.5+unit*0.27,height*0.5);

		settingBox = new Box([unit*0.35,height*0.765],[unit*0.6,height*0.42],pad);
		for (let a = 0; a < 3; a++){
			arrowBoxes.push(new Box([unit*0.35,height*0.32],[unit*0.6,height*0.44],pad));
		}
		iconBox = new Box([unit*0.35,height*0.05],[unit*0.6,height*0.07],pad);
		let rowHeight = height*0.05;
		iconBox.Items.push(new Icon('movement',[unit*0.14,rowHeight],[height*0.03,height*0.03],'play'));
		iconBox.Items.push(new Icon('palette',[unit*0.28,rowHeight],[height*0.03,height*0.03]));
		iconBox.Items.push(new Icon('random',[unit*0.43,rowHeight],[height*0.03,height*0.03]));
		iconBox.Items.push(new Icon('download',[unit*0.57,rowHeight],[height*0.03,height*0.03]));

		let iconSize = [height*0.06,height*0.06];
		rowHeight = height*0.6;
		displayBox = new Box([unit*0.35,rowHeight],[unit*0.6,height*0.08],pad,true);
		displayBox.Items.push(new Icon('display_mode',[unit*0.17,rowHeight],iconSize,0));
		displayBox.Items.push(new Icon('display_mode',[unit*0.36,rowHeight],iconSize,1));
		displayBox.Items.push(new Icon('display_mode',[unit*0.54,rowHeight],iconSize,2));
		
		rowHeight = height*0.15;
		arrowBox = new Box([unit*0.35,rowHeight],[unit*0.6,height*0.08],pad,true);
		arrowBox.Items.push(new Icon('arrow_active',[unit*0.17,rowHeight],iconSize,0,'accent0'));
		arrowBox.Items.push(new Icon('arrow_active',[unit*0.36,rowHeight],iconSize,1,'accent1'));
		arrowBox.Items.push(new Icon('arrow_active',[unit*0.54,rowHeight],iconSize,2,'accent2'));
	}
	circleWidth = unit/64;
	vertWidth = unit/20;
	//scalar = unit;
	origin = defaultOrigin.copy();
	
	
	settingBox.Items.push(new textItem(2.5,'',0));

	settingBox.Items.push(new textItem(1,'order',headText));
	settingBox.Items.push(new arrowItem(1,orderList,infoText,'order',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'class',headText));
	settingBox.Items.push(new arrowItem(1,['a'],infoText,'class',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	settingBox.Items.push(new textItem(1,'group',headText));
	settingBox.Items.push(new arrowItem(1,['a'],infoText,'group',-1,0));
	settingBox.Items.push(new textItem(0.8,'',0));
	
	// settingBox.Items.push(new textItem(0.8,'about this page',infoText,'','https://youtu.be/ocDnfeFAsCg'));
	// settingBox.Items.push(new textItem(0.4,'',0));
	
	var arrowLabels = ['focus 1','focus 2','focus 3'];
	for (a = 0; a < 3; a++){
		
		arrowBoxes[a].Items.push(new textItem(2.4,'',0));
		
		arrowBoxes[a].Items.push(new arrowItem(1,['0','1','2'],infoText,'arrow_element',a,arrowElements[a],'accent'+str(a)));
		arrowBoxes[a].Items.push(new textItem(0.8,'',0));
		
		arrowBoxes[a].Items.push(new textItem(1,'type',headText,'type_head'));
		arrowBoxes[a].Items.push(new arrowItem(1,['left operate','right operate','conjugate'],infoText,'arrow_type',a));
		arrowBoxes[a].Items.push(new textItem(0.6,'',0));
		
		arrowBoxes[a].Items.push(new textItem(1,'strength',headText,'strength_head'));
		arrowBoxes[a].Items.push(new sliderItem(1.2,headText,[0,1],'arrow_strength',arrowStrengths[a]**0.5,a));
		arrowBoxes[a].Items.push(new textItem(0.8,'',0));
		
		arrowBoxes[a].giveSizes();
	}
	
	settingBox.giveSizes();
	
	settingBox.getItem('order').giveValue(19);
	settingBox.getItem('class').giveValue(4);
	settingBox.getItem('group').giveValue(0);
	
	arrowBoxes[0].getItem('arrow_element').giveValue(1);
	arrowBoxes[1].getItem('arrow_element').giveValue(5);
	arrowElements[2] = -1;
	displayState = 1;
}


*/