
function preload() {
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	openSans = loadFont("OpenSans-Bold.ttf");
	data = loadTable('2dInts-1.4.csv', 'csv', 'header');
	if (prod){
		zoomdata = loadTable('2dZoomData.csv', 'csv', 'header');
	}
}

function setup() {
	var px = max(window.innerWidth/16,window.innerHeight/9);
	win = [window.innerWidth,window.innerHeight];
	createCanvas(window.innerWidth, window.innerHeight);
	noStroke();
	textFont(atkinsonBold);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	colorMode(HSL, 360, 100, 100);
	colors = colorScheme('Sunset');
	colorsF = colorFactor('Sunset');
	
	setting = new Settings(px*16 / 101);
	setting.IconBoxCoord = coeffToCoord([-43,25.5]);
	setting.makeGrid();
	var origin = createVector(-win[0]/(2*setting.sq),win[1]/(2*setting.sq));
	/*
	icons.push(new Icon('=',[px*0.4,px*0.36],px*0.3,[-47,25.4],[0,0]));
	icons.push(new Icon('?',[px*0.36,px*0.36],px*0.4,[-43,25.4],[0,0]));
	*/
	icons.push(new Icon('=',[px*0.4,px*0.36],px*0.3,[origin.x+3,origin.y-2],[0,0]));
	icons.push(new Icon('?',[px*0.36,px*0.36],px*0.4,[origin.x+7,origin.y-2],[0,0]));
	var bigText = px*0.18;
	var smallText = px*0.14;
	//menuBox = new Box([-43,5],[setting.sq*6,setting.sq*18],setting.sq);
	menuBox = new Box([origin.x+7,origin.y-25],[setting.sq*6,setting.sq*20],setting.sq);
	menuBox.Items.push(new textItem(0.6,'',0));
	menuBox.Items.push(new textItem(1,'Ring',bigText));
	menuBox.Items.push(new arrowItem(1,setting.RingNames,smallText,'ring'));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Displaying',bigText));
	menuBox.Items.push(new binaryItem(1,['Prime','Composite'],smallText*0.9,'displaying',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Color Scheme',bigText));
	menuBox.Items.push(new arrowItem(1,['Sunset','Fire','Ice','Forest','Pastel','Dark Mode','Rainbow','Cotton Candy'],smallText,'colorScheme'));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Animation Type',bigText));
	menuBox.Items.push(new arrowItem(1,['Argument','Norm','Spiral','Solid','Stripes','X','Noise','Factor'],smallText,'colorType'));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Animate',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'animate',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Labels',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'labels',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Gridlines',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'gridlines',1));
	menuBox.Items.push(new textItem(0.8,'',0));
	if(prod){
		menuBox.Items.push(new textItem(1,'Zoom Out',bigText));
		menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'zoomout',1));
		menuBox.Items.push(new textItem(0.8,'',0));
	}
	menuBox.Items.push(new textItem(1,'Hover Display',bigText));
	menuBox.Items.push(new arrowItem(1,['Factors/Multiples','Associates'],smallText,'hover'));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Info Box',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'hoverbox',0));
	menuBox.Items.push(new textItem(0.6,'',0));
	menuBox.giveSizes();
	
	//infoBox = new Box([-43,7],[setting.sq*6,setting.sq*16],setting.sq);
	infoBox = new Box([origin.x+7,origin.y-21],[setting.sq*6,setting.sq*16],setting.sq);
	infoBox.Items.push(new textItem(6,'This page displays\nQuadratic Primes.\n\nIf you are unfamiliar\n with the topic,\nI recommend viewing\none of the following:',px*0.15));
	infoBox.Items.push(new textItem(1,'this OEIS page',px*0.15,'',white,atkinsonBold,'https://oeis.org/wiki/Quadratic_integer_rings'));
	infoBox.Items.push(new textItem(1,'or',px*0.15));
	infoBox.Items.push(new textItem(1,'my video series.',px*0.15,'',white,atkinsonBold,'https://www.youtube.com/playlist?list=PLRcOL8MUr-pcIbez7ZRalqnSmYvLT00Fd'));
	infoBox.Items.push(new textItem(5,'\nHover your mouse over\na number to see\ninformation about it in\nthe lower left info box.',px*0.15));
	infoBox.Items.push(new textItem(3,'Hovering over a prime\nwill highlight its\nmultiples in white.',px*0.15));
	infoBox.Items.push(new textItem(4,'Hovering over a\n composite will highlight\nits prime factors\n in white.',px*0.15));
	infoBox.giveSizes();
	
	//hoverBox = new Box([-39,-21],[setting.sq*11,setting.sq*6],setting.sq);
	hoverBox = new Box([-origin.x-12,7-origin.y],[setting.sq*11,setting.sq*6],setting.sq);
	hoverBox.Items.push(new textItem(1.5,'',bigText*2,'hovertext',white,openSans));
	hoverBox.Items.push(new textItem(0.2,'',0));
	hoverBox.Items.push(new textItem(1,'',bigText,'factortitle'));
	hoverBox.Items.push(new textItem(0.2,'',0));
	hoverBox.Items.push(new textItem(0.6,'',smallText,'primefactorization',white*0.8));
	hoverBox.Items.push(new textItem(1.2,'',bigText,'factors',white,openSans));
	hoverBox.Items.push(new textItem(0.4,'',0));
	hoverBox.giveSizes();
	hoverBox.Active = 1;
	
}