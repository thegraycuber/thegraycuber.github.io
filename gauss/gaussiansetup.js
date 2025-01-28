
function preload() {
	data = loadTable('Gaussian1.3.csv', 'csv', 'header');
	gameData = loadTable('GameData1.18.csv', 'csv', 'header');
	atkinsonBold = loadFont("Atkinson-Hyperlegible-Bold-102.ttf");
	atkinsonRegular = loadFont("Atkinson-Hyperlegible-Regular-102.ttf");
	openSans = loadFont("OpenSans-Bold.ttf");
}

function setup() {
	var px = min(windowWidth/16,windowHeight/9);
	win = [windowWidth,windowHeight];
	createCanvas(windowWidth, windowHeight);
	noStroke();
	textFont(atkinsonBold);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	colorMode(HSL, 360, 100, 100);
	colors = colorScheme('Sunset');
	
	setting = new Settings(px*16 / 101);
	setting.IconBoxCoord = coeffToCoord([-43,25.5]);
	setting.makeGrid();
	
	icons.push(new Icon('=',[px*0.4,px*0.36],px*0.3,[-47,25.4],[0,0],0.8));
	icons.push(new Icon('?',[px*0.36,px*0.36],px*0.4,[-43,25.4],[0,0],0.6));
	icons.push(new Icon('0',[px*0.4,px*0.36],px*0.4,[-24,-25],[0,0],1,[white,white],'n'));
	icons.push(new Icon('<',[px*0.3,px*0.36],px*0.4,[-18,-25],[0,0],0.6));
	icons.push(new Icon('u',[px*0.3,px*0.36],px*0.4,[-12,-25],[0,0],0.6,[white,white*0.6],'u'));
	icons.push(new Icon('X',[px*0.4,px*0.36],px*0.4,[-8,-25],[0,0],0.6,[white,white*0.6]));
	icons.push(new Icon('/',[px*0.4,px*0.36],px*0.4,[-4,-25],[0,0],0.6,[white,white*0.6],'/'));
	
	var bigText = px*0.18;
	var smallText = px*0.14;
	menuBox = new Box([-43,7],[setting.sq*6,setting.sq*16],setting.sq);
	menuBox.Items.push(new textItem(0.6,'',0));
	menuBox.Items.push(new textItem(1,'Displaying',bigText));
	menuBox.Items.push(new binaryItem(1,['Prime','Composite'],smallText*0.9,'displaying',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Color Scheme',bigText));
	menuBox.Items.push(new arrowItem(1,['Sunset','Fire','Ice','Forest','Pastel','Dark Mode','Rainbow','Cotton Candy'],smallText,'colorScheme'));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Animation Type',bigText));
	menuBox.Items.push(new arrowItem(1,['Windmill','Radial','Spiral','Solid','Stripes','X','Noise'],smallText,'colorType'));
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
	menuBox.Items.push(new textItem(1,'Info Box',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'hoverbox',0));
	menuBox.Items.push(new textItem(0.8,'',0));
	menuBox.Items.push(new textItem(1,'Game Mode',bigText));
	menuBox.Items.push(new binaryItem(1,['On','Off'],smallText,'gamemode',1));
	menuBox.Items.push(new textItem(0.6,'',0));
	menuBox.giveSizes();
	
	infoBox = new Box([-43,8],[setting.sq*6,setting.sq*14],setting.sq);
	infoBox.Items.push(new textItem(6,'This page displays\nGaussian Primes.\n\nIf you are unfamiliar\n with the topic,\nI recommend viewing',px*0.15));
	infoBox.Items.push(new textItem(1,'this Brilliant page',px*0.15,'',white,atkinsonBold,'https://brilliant.org/wiki/gaussian-integers/'));
	infoBox.Items.push(new textItem(1,'or',px*0.15));
	infoBox.Items.push(new textItem(1,'my YouTube video.',px*0.15,'',white,atkinsonBold,'https://youtu.be/PkWY3fLy4oI'));
	infoBox.Items.push(new textItem(5,'\nHover your mouse over\na number to see\ninformation about it in\nthe lower left info box.',px*0.15));
	infoBox.Items.push(new textItem(3,'Hovering over a prime\nwill highlight its\nmultiples in white.',px*0.15));
	infoBox.Items.push(new textItem(4,'Hovering over a\n composite will highlight\nits prime factors\n in white.',px*0.15));
	infoBox.giveSizes();
	
	hoverBox = new Box([-39,-22],[setting.sq*11,setting.sq*5],setting.sq);
	hoverBox.Items.push(new textItem(1.5,'',bigText*2,'hovertext'));
	hoverBox.Items.push(new textItem(0.2,'',0));
	hoverBox.Items.push(new textItem(1,'',bigText,'factortitle'));
	hoverBox.Items.push(new textItem(0.2,'',0));
	hoverBox.Items.push(new textItem(0.6,'',smallText,'primefactorization',white*0.8));
	hoverBox.Items.push(new textItem(0.8,'',bigText*1.2,'factors',white,openSans));
	hoverBox.Items.push(new textItem(0.4,'',0));
	hoverBox.giveSizes();
	hoverBox.Active = 1;
	
	messageBox = new Box([0,25.5],[setting.sq*32,setting.sq*1.8],setting.sq);
	messageBox.Items.push(new textItem(1,'',bigText,'message'));
	messageBox.giveSizes();
	
	gInts[0].push(new Gauss(data,0));
	var d_idx = 1;
	for (var i = 1; i < 51; i++) {
		gInts.push([]);
		for (var j = 0; j < 51; j++) {
			gInts[i].push(new Gauss(data,d_idx));
			d_idx += 1;
		}
	}

	mkr = new Makker(0.3,setting.sq,[6,2]);

	targets.push(new Target('star',setting.sq*0.5));
	targets.push(new Target('',setting.sq*1.5));
	
	setting.newEra(0);
}