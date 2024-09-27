
function preload() {
	openSans = loadFont("OpenSans-Bold.ttf");
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	var px = min(windowWidth/16,windowHeight/9);
	settings = new Settings(px);
	
	rectMode(CENTER);
	textFont(atkinsonBold);
	textSize(windowHeight/16);
	textAlign(CENTER,CENTER);
	
	palette = new Palette();
	palette.getColors('Electric');
	win = [windowWidth,windowHeight];
	settings.makeGrid();

	
	points = make_points();
	
	icons.push(new Icon('=',[px*0.4,px*0.36],px*0.3,[win[0]/2-px*7.5,win[1]/2-px*4],[0,0]));
	
	var bigText = px*0.18;
	var smallText = px*0.14;
	menuBox = new Box([win[0]/2-px*6.6,win[1]/2+px*0.4],[px*1,px*3.8],px*0.1);
	menuBox.Items.push(new textItem(0.6,'',0));
	
	menuBox.Items.push(new textItem(1,'Color Scheme',bigText));
	menuBox.Items.push(new arrowItem(1,['Electric','Winter','Spring','Summer','Autumn','Forest','Love','Sunset'],smallText,'Color'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Animate',bigText));
	menuBox.Items.push(new arrowItem(1,['Off','Rotation','Trace','Radius','Function'],smallText,'Animate'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Shape',bigText));
	menuBox.Items.push(new arrowItem(1,['Circle','Digon','Triangle','Square','Pentagon','Hexagon','Heptagon','Octagon','Nonagon','Decagon'],smallText,'Shape'));
	for (var vertice_count = 11; vertice_count <= 32; vertice_count++){
		menuBox.Items[menuBox.Items.length - 1].List.push(str(vertice_count)+'gon');
	}
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Step Size',bigText));
	menuBox.Items.push(new arrowItem(1,['1'],smallText,'Step'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Function Type',bigText));
	menuBox.Items.push(new arrowItem(1,['Powers of x','Custom','Cyclotomics','Inverse Cyclos','Sin Maclaurin','Cos Maclaurin','Exp Maclaurin','Chebyshev T','Chebyshev U','Fibonacci'],smallText,'Function'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Function',bigText));
	menuBox.Items.push(new arrowItem(1,['1'],bigText,'Sequence',openSans));
	for (var seq_val = 2; seq_val <= 20; seq_val++){
		menuBox.Items[menuBox.Items.length - 1].List.push(str(seq_val));
	}
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Input',bigText));
	menuBox.Items.push(new arrowItem(1,['Off','On','Display'],smallText,'Input'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Points',bigText));
	menuBox.Items.push(new arrowItem(1,['Off','Input','Output','Both'],smallText,'Points'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Resolution',bigText));
	menuBox.Items.push(new arrowItem(1,['60','120','360','840','1440','2520','5040'],smallText,'Resolution'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Rotation',bigText));
	menuBox.Items.push(new sliderItem(1.6,smallText,[0,6.283185307],'Rotation',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Radius',bigText));
	menuBox.Items.push(new arrowItem(1,['1','π/2','2','e','3','π','4','3π/2','5','2π','1/5','1/4','1/3','1/e','1/2'],smallText,'Radius'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Zoom',bigText));
	menuBox.Items.push(new arrowItem(1,['Auto','Scroll'],smallText,'Zoom'));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.Items.push(new textItem(1,'Gridlines',bigText));
	menuBox.Items.push(new binaryItem(1.5,['On','Off'],smallText,'Gridlines',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	
	menuBox.giveSizes();

	
	menuBox.Items[menuBox.getIndex('Shape')].giveValue(4);
	menuBox.Items[menuBox.getIndex('Function')].giveValue(2);
	menuBox.Items[menuBox.getIndex('Sequence')].giveValue(2);
	menuBox.Items[menuBox.getIndex('Input')].giveValue(1);
	menuBox.Items[menuBox.getIndex('Function')].giveValue(0);
	menuBox.Items[menuBox.getIndex('Animate')].giveValue(1);
	menuBox.Items[menuBox.getIndex('Resolution')].giveValue(2);
}