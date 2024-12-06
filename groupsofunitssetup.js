var icons = [];
var menuBox = [];
var hoverBox = [];
var palette;
var primes = [[2,[]]];
var bubbles = [];
var ticker = -1;
var coord_scale = 4;
var coord_adjust = 1;
var c = 4;
var coord_offset = [0,0];
var coord_gen = [20,20];
var mouseLoc = [];
var win;
var px = 0;
var max_speed = 250;
var mode = 'Auto Add';
var label = 'Full';
var lineMode = 'Simplified';
var autozoom = true;
var interference = false;
var info = true;
var info_index = -1;
var focus = 'All Integers';
var pow2 = [2,4,8,16];
var subscript = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
var clicked = -1;

function preload() {
	openSans = loadFont("OpenSans-Bold.ttf");
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
}


function setup() {
	
	white = color('#d6ddcc');
	createCanvas(windowWidth, windowHeight);
	win = [windowWidth,windowHeight];
	px = min(windowWidth/16,windowHeight/9);
	noStroke();
	textSize(16);
	bubbles.push(new Bubble(0,3,0,0,40));
	bubbles[0].checkRep();
	rectMode(CENTER);
	textAlign(CENTER,CENTER);

	
	
	textFont(atkinsonBold);
	
	palette = new Palette();
	palette.getColors('Forest');


	icons.push(new Icon('=',[px*0.4,px*0.36],px*0.3,[win[0]/2-px*7.2,win[1]/2-px*4],[0,0]));
	icons.push(new Icon('y',[px*0.4,px*0.28],px*0.4,[win[0]/2-px*6.5,win[1]/2-px*3.97],[0,0],'https://www.youtube.com/@TheGrayCuber'));
	
	var bigText = px*0.18;
	var smallText = px*0.14;
	menuBox = new Box([win[0]/2-px*6.3,win[1]/2],[px*1,px*3.5],px*0.1);
	menuBox.Items.push(new textItem(0.6,'',0));
	
	menuBox.Items.push(new textItem(1,'Color Scheme',bigText));
	menuBox.Items.push(new arrowItem(1,['Forest','Electric','Sunset','Light','Dark'],smallText,'Color'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Auto Zoom',bigText));
	menuBox.Items.push(new binaryItem(1.5,['On','Off'],smallText,'AutoZoom',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Mouse Interference',bigText));
	menuBox.Items.push(new binaryItem(1.5,['On','Off'],smallText,'Mouse',1));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Graph Mode',bigText));
	mode_index = menuBox.Items.length;
	menuBox.Items.push(new arrowItem(1,['Auto Add','Pause','Click to Add'],smallText,'Mode'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Speed',bigText));
	menuBox.Items.push(new sliderItem(1.6,smallText,[0,max_speed-10],'Speed',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Label Mode',bigText));
	label_index = menuBox.Items.length;
	menuBox.Items.push(new arrowItem(1,['Full','Shortened','Just Modulus','Just Cycles','None'],smallText,'Label'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Line Mode',bigText));
	menuBox.Items.push(new arrowItem(1.5,['Simplified','All Lines'],smallText,'Line'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Focus',bigText));
	menuBox.Items.push(new arrowItem(1.5,['All Integers','Related to Clicked','Multiple of Clicked','Factor of Clicked','Powers of 2','Abundant','Primes'],smallText,'Focus'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Info Box',bigText));
	menuBox.Items.push(new binaryItem(1.5,['On','Off'],smallText,'Info',0));
	menuBox.Items.push(new textItem(0.8,'',0));

	hoverBox = new Box([win[0]/2+px*6.2,win[1]/2+px*3],[px*1.2,px*1],px*0.1);
	hoverBox.Items.push(new textItem(1.5,'',bigText*2,'',openSans));
	hoverBox.Items.push(new textItem(1,'',bigText*1.2,'',openSans));
	hoverBox.Items.push(new textItem(1,'',bigText*1.2,'',openSans));
	hoverBox.Items.push(new textItem(1.5,'',bigText*2,'',openSans));
	hoverBox.Items.push(new textItem(0.5,'',0));
	hoverBox.giveSizes();
	hoverBox.Active = 1;
	
	menuBox.giveSizes();
	menuBox.Items[menuBox.getIndex('Speed')].giveValue(max_speed - 50);
	menuBox.Items[menuBox.getIndex('Label')].giveValue(1);
	

}


function arrowClick(id,listIndex,listValue){
/*

	var step_index = menuBox.getIndex('Step');
	var rot_index = menuBox.getIndex('Rotation');
	var rad_index = menuBox.getIndex('Radius');
	var seq_index = menuBox.getIndex('Sequence');
	*/
	if (id == '='){
		menuBox.Active = listIndex;

	} else if (id == 'Color'){
		palette.getColors(listValue);

	} else if (id == 'Speed'){
		ticker = max(ticker,listIndex-max_speed);

	} else if (id == 'Mode'){
		if (listValue == 'Auto Add'){
			menuBox.Items[menuBox.getIndex('Speed')].Active = true;
		} else {
			menuBox.Items[menuBox.getIndex('Speed')].Active = false;
		}
		mode = listValue;
	} else if (id == 'Label'){
		label = listValue;
	} else if (id == 'AutoZoom'){
		autozoom = listIndex == 0;
	} else if (id == 'Mouse'){
		interference = listIndex == 0;
	} else if (id == 'Info'){
		info = listIndex == 0;
	} else if (id == 'Line'){
		lineMode = listValue;
	} else if (id == 'Focus'){
		
		//clicked = -1;
		focus = listValue;	
		for (var bubby of bubbles){
			bubby.shade = true;
		}
		for (bubby of bubbles){
			bubby.checkShade();
		}
		for (bubby of bubbles){
			bubby.checkRep();
		}
	}   

}