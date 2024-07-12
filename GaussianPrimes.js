win = [];
setting = 0;
gInts = [[]];
mkr = 0;
colors = [];
icons = [];
menuBox = [];
infoBox = [];
hoverBox = [];
messageBox = [];
targets = [];
black = 10;
white = 85;

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
	infoBox.Items.push(new textItem(0.4,'',0));
	infoBox.Items.push(new textItem(1,'No info written yet',px*0.16));
	infoBox.Items.push(new textItem(10,'',0));
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

class Target {
	
	constructor(id, radius) {
		this.Id = id;
		this.Active = false;
		this.Coeffs = [0,0];
		this.Coords = [0,0];
		this.Color = 0;
		this.Radius = radius;
		this.Bright = 0;
		this.Era = -1;
	}
	
	reached(){
		setting.Blocked = [];
		if (this.Era > -1){
			setting.newEra(this.Era);
		} else {this.random();}
	}
	
	show(){
		if (this.Active){
			this.Bright = (this.Bright + 0.05) % TWO_PI;
			fill(colors[this.Color][0],colors[this.Color][1],colors[this.Color][2]*(1+cos(this.Bright))*0.8 + (1-cos(this.Bright))*20);
			if (this.Id == 'star'){
				beginShape();
				vertex(this.Coords[0], this.Coords[1] - this.Radius);
				vertex(this.Coords[0] + this.Radius*0.24, this.Coords[1] - this.Radius*0.32);
				vertex(this.Coords[0] + this.Radius*0.95, this.Coords[1] - this.Radius*0.3);
				vertex(this.Coords[0] + this.Radius*0.38, this.Coords[1] + this.Radius*0.12);
				vertex(this.Coords[0] + this.Radius*0.59, this.Coords[1] + this.Radius*0.81);
				vertex(this.Coords[0], this.Coords[1] + this.Radius*0.5);
				vertex(this.Coords[0] - this.Radius*0.59, this.Coords[1] + this.Radius*0.81);
				vertex(this.Coords[0] - this.Radius*0.38, this.Coords[1] + this.Radius*0.15);
				vertex(this.Coords[0] - this.Radius*0.95, this.Coords[1] - this.Radius*0.3);
				vertex(this.Coords[0] - this.Radius*0.24, this.Coords[1] - this.Radius*0.32);
				vertex(this.Coords[0], this.Coords[1] - this.Radius);
				endShape(CLOSE);
			} else {
				strokeWeight(setting.sq*0.2);
				stroke(black);
				textSize(this.Radius);
				text(this.Id,this.Coords[0],this.Coords[1]);
				noStroke();
			}
		}
	}
	
	random(){
		var ranAssoc = getAssociate([(int(random()*36)+3)*(int(random()*2)*2-1),(int(random()*18)+3)*(int(random()*2)*2-1)]);
		while(gInts[ranAssoc[0]][ranAssoc[1]].Walkable <= 0 || gInts[ranAssoc[0]][ranAssoc[1]].IsLow[ranAssoc[2]] == 0 || (ranAssoc[0] < -26 && ranAssoc[1] < -15)){
			ranAssoc = getAssociate([(int(random()*36)+3)*(int(random()*2)*2-1),(int(random()*18)+3)*(int(random()*2)*2-1)]);
		}
		this.updateCoeffs(gInts[ranAssoc[0]][ranAssoc[1]].Coeffs[ranAssoc[2]]);
		this.Era = -1;
		
	}
	
	updateCoeffs(newCoeffs){
		this.Coeffs = newCoeffs;
		this.Coords = coeffToCoord(newCoeffs);
		var newAssoc = getAssociate(this.Coeffs);
		this.Color = gInts[newAssoc[0]][newAssoc[1]].Color[setting.ColorType][newAssoc[2]];
	}
}


function coordToCoeff(x_c, y_c) {
	return_coeff = [round((x_c - win[0]/2)/setting.sq), round(-(y_c - win[1]/2)/setting.sq)];
  return return_coeff;
}

function coeffToCoord(coeff_input) {
	return_coord = [coeff_input[0]*setting.sq + win[0]/2, -coeff_input[1]*setting.sq + win[1]/2];
  return return_coord;
}

function getAssociate(input_Assoc){
	if (input_Assoc[0] == 0 && input_Assoc[1] == 0){
		return [0,0,0];
	} else if (input_Assoc[0] >= 1 && input_Assoc[1] >= 0){
		return [input_Assoc[0],input_Assoc[1],0];
	} else if (input_Assoc[1] >= 1){
		return [input_Assoc[1],-input_Assoc[0],1];
	} else if (input_Assoc[0] < 0){
		return [-input_Assoc[0],-input_Assoc[1],2];
	} else {
		return [-input_Assoc[1],input_Assoc[0],3];
	}
}

function goodCoeff(checkCoeff){
	return abs(checkCoeff[0]) <= 50 && abs(checkCoeff[1]) <= 27 ;
}

function isOpen(coeffCheck){
	for(var block of setting.Blocked){
		if (block[0] == coeffCheck[0] && block[1] == coeffCheck[1]){
			return false;
		}
	}
	return true;
}

function keyPressed() {
	endScreenSaver()
  if ((keyCode === UP_ARROW || key == 'w' )&& mkr.Sitting) {
    mkr.Acc[1] += 0.2;
  } else if (keyCode === LEFT_ARROW || key == 'a') {
    mkr.Acc[0] -= 0.012;
  } else if (keyCode === RIGHT_ARROW || key == 'd') {
    mkr.Acc[0] += 0.012;
  }
}

function keyReleased() {
	endScreenSaver()
  if ((keyCode === LEFT_ARROW || key == 'a') && mkr.Acc[0] < 0) {
    mkr.Acc[0] = 0;
  } else if ((keyCode === RIGHT_ARROW || key == 'd') && mkr.Acc[0] > 0) {
    mkr.Acc[0] = 0;
  }
}

function multiplyC(a_mult,b_mult){
	var prod_Complex = [a_mult[0]*b_mult[0] - a_mult[1]*b_mult[1],a_mult[0]*b_mult[1] + a_mult[1]*b_mult[0]];
	if (goodCoeff(prod_Complex)){return prod_Complex;}
	else {return [];}
}

function divideC(a_div,b_div){
	var a_assoc = getAssociate(a_div);
	var b_assoc = getAssociate(b_div);
	//console.log(gInts[a_assoc[0]][a_assoc[1]].Factors,gInts[b_assoc[0]][b_assoc[1]].Factors);
	if (gInts[a_assoc[0]][a_assoc[1]].Factors.indexOf(gInts[b_assoc[0]][b_assoc[1]].Factors) > -1){
		return [(a_div[0]*b_div[0] + a_div[1]*b_div[1])/(b_div[0]**2 + b_div[1]**2),(a_div[1]*b_div[0] - a_div[0]*b_div[1])/(b_div[0]**2 + b_div[1]**2)];
	} else {return [];}
	
	
}

function showGrid(){
	if(setting.ShowGrid == 1){
		fill(0,0,black+10);
		for (var gl of setting.Gridlines) {
			rect(gl[0],gl[1],gl[2],gl[3]);
		}
	}
}

function fixedWalk(){
	for (var num of setting.Blocked){
		gInts[num[0]][num[1]].Walkable = 0;
	}
	if (setting.Makker && gInts[mkr.Assoc[0]][mkr.Assoc[1]].Walkable < 1){
		gInts[mkr.Assoc[0]][mkr.Assoc[1]].Walkable = 2;
	}
	if (targets[0].Active){
		var targAssoc = getAssociate(targets[0].Coeffs);
		gInts[targAssoc[0]][targAssoc[1]].Walkable = 1;
	}
}

function resetWalkability(walkValue){
	for (var gRow of gInts) {
		for (var gCol of gRow) {
			if(gCol.Walkable == walkValue){gCol.Walkable = (setting.Prime + gCol.IsPrime) % 2;}
		}
	}
	fixedWalk();
}

function giveWalkability(walkValue,factorString,avoid = -10){
	for (var gRow of gInts) {
		for (var gCol of gRow) {
			if (gCol.Factors.indexOf('(' + factorString + ')') > -1 && gCol.Walkable != avoid){
				gCol.Walkable = walkValue;
			}
		}
	}
	fixedWalk();
}

function endScreenSaver(){
	setting.MouseSS = [mouseX,mouseY,0];
	setting.Refresh = true;
	if (setting.ScreenSaver > -1){
		for (var gRow of gInts) {
			for (var gCol of gRow) {
				gCol.ScreenSaverShow = [true,true,true,true];
			}
		}
		menuBox.Items[menuBox.getIndex('displaying')].giveValue((setting.PreScreenSaver[0]+1)%2);
		menuBox.Items[menuBox.getIndex('colorScheme')].giveValue(setting.PreScreenSaver[1]);
		menuBox.Items[menuBox.getIndex('colorType')].giveValue(setting.PreScreenSaver[2]);
		setting.ColorSpeed = setting.PreScreenSaver[3];
	}
	setting.ScreenSaver = -1;
}

function mouseCheck(){
	var foundMouse = 0;
	for (var icon of icons){
		if(icon.Active > -1 && mouseX > icon.UpperLeft[0] && mouseX < icon.LowerRight[0] && mouseY > icon.UpperLeft[1] && mouseY < icon.LowerRight[1]){
			foundMouse++;
		}
	}
	foundMouse += menuBox.mouseInside();
	foundMouse += infoBox.mouseInside();
	foundMouse += hoverBox.mouseInside();
	foundMouse += messageBox.mouseInside();
	
	if (foundMouse > 0){return true;}
	else{return false;}
}

function walkabilityFactors(walkValue,mouseA){

	var currNorm = gInts[mouseA[0]][mouseA[1]].Norm;
	for (var fRow of gInts) {
		for (var fCol of fRow) {
			if(fCol.IsPrime == 1 && currNorm % fCol.Norm == 0){
				var f_idx = gInts[mouseA[0]][mouseA[1]].Factors.indexOf(fCol.Factors);
				if (f_idx > -1){
					fCol.Walkable = walkValue;
					while(f_idx > -1){
						currNorm = int(currNorm/fCol.Norm);
						f_add = gInts[mouseA[0]][mouseA[1]].Factors.substring(f_idx+1).indexOf(fCol.Factors);
						if (f_add == -1){f_idx = -1;}
						else {f_idx += 1 + f_add}
					}
				}
			}
			if (currNorm == 1){break;}
		}
		if (currNorm == 1){break;}
	}
	fixedWalk()
}

function cleanFlashers(){
	for (var flash = setting.Flashers.length -1; flash > -1; flash--){
		if (setting.Flashers[flash][5] == 1){
			setting.Flashers.splice(flash,1);
		}
	}
}

function tryMove(){
	if (setting.Moves > 0){
		setting.Moves -= 1;
		icons[2].DisplayChar[0] = setting.Moves;
	} else if (setting.Moves == 0){
		messageBox.Active = 1;
		messageBox.Items[messageBox.getIndex('message')].DisplayText = 'You are out of moves. Try restarting the level.';
		return false;
	}
	return true;
}

class Icon {
	constructor(displayChar,displaySize,radius,coeffs,yoffset,clickFactor = 1,color = [white,white],inactive = 'X') {
		this.DisplayChar = [displayChar,inactive];
		this.Size = displaySize;
		this.Radius = radius;
		this.Coords = coeffToCoord(coeffs);
		this.UpperLeft = [this.Coords[0]-clickFactor*radius,this.Coords[1]-clickFactor*radius];
		this.LowerRight = [this.Coords[0]+clickFactor*radius,this.Coords[1]+clickFactor*radius];
		this.Active = 0;
		this.YOffset = yoffset;
		this.Era = 0;
		this.Time = 0;
		this.Color = color;
	}
	showIcon(){
		if (this.Active < 2){
			
			fill(this.Color[this.Active]);
			stroke(black);
			
			if (this.DisplayChar[this.Active] == '='){
				strokeWeight(setting.sq*0.2);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.1,this.Radius,this.Radius*0.8);
				rect(this.Coords[0],this.Coords[1]-this.Radius*0.04,this.Radius,this.Radius*0.01);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.24,this.Radius,this.Radius*0.01);
				
			} else if (this.DisplayChar[this.Active] == '<'){
				strokeWeight(setting.sq*0.2);
				fill(black);
				triangle(this.Coords[0]+this.Radius*0.1,this.Coords[1]-this.Radius*0.5,this.Coords[0]+this.Radius*0.1,this.Coords[1]+this.Radius*0.1,this.Coords[0]-this.Radius*0.3,this.Coords[1]-this.Radius*0.25);
				fill(white);
				circle(this.Coords[0],this.Coords[1]+this.Radius*0.1,this.Radius*0.8);
				fill(black);
				circle(this.Coords[0],this.Coords[1]+this.Radius*0.1,this.Radius*0.4);
				triangle(this.Coords[0]-this.Radius*0.1,this.Coords[1]-this.Radius*0.4,this.Coords[0]-this.Radius*0.1,this.Coords[1],this.Coords[0]-this.Radius*0.4,this.Coords[1]-this.Radius*0.2);
				noStroke();
				fill(white);
				triangle(this.Coords[0],this.Coords[1]-this.Radius*0.4,this.Coords[0],this.Coords[1],this.Coords[0]-this.Radius*0.3,this.Coords[1]-this.Radius*0.2);
			
			} else if (this.DisplayChar[this.Active] == 'u'){
				strokeWeight(setting.sq*0.2);
				fill(this.Color[this.Active]);
				circle(this.Coords[0],this.Coords[1]-this.Radius*0.15,this.Radius*0.5);
				fill(black);
				circle(this.Coords[0],this.Coords[1]-this.Radius*0.15,this.Radius*0.2);
				fill(this.Color[this.Active]);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.15,this.Radius*0.8,this.Radius*0.6,this.Radius*0.1);
				fill(black);
				noStroke();
				circle(this.Coords[0],this.Coords[1]+this.Radius*0.07,this.Radius*0.2);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.15,this.Radius*0.1,this.Radius*0.3,this.Radius*0.05);
			
			} else {
				strokeWeight(setting.sq*0.4);
				textSize(this.Size[this.Active]);
				text(this.DisplayChar[this.Active],this.Coords[0],this.Coords[1]+this.YOffset[this.Active]);
			}
			
			noStroke();
		}
	}
	clicked(){
		if(this.Active < 2 && mouseX > this.UpperLeft[0] && mouseX < this.LowerRight[0] && mouseY > this.UpperLeft[1] && mouseY < this.LowerRight[1] && this.DisplayChar[1] != 'n'){
			if (this.Active != '<'){
				this.Active = (this.Active + 1) % 2;
			}
			setting.arrowClick(this.DisplayChar[0],this.Active,'');
		}
	}
}

class Box {
	constructor(coeffs,radius,pad) {
		this.Items = [];
		this.Radius = radius;
		this.Coeffs = coeffs;
		this.Coords = coeffToCoord(this.Coeffs);
		this.UpperLeft = [this.Coords[0]-this.Radius[0],this.Coords[1]-this.Radius[1]];
		this.LowerRight = [this.Coords[0]+this.Radius[0],this.Coords[1]+this.Radius[1]];
		this.Pad = pad*1.1;
		this.Active = 0;
	}
	giveSizes(){
		var volume = 0;
		for (var item of this.Items){
			volume += item.Volume;
		}
		var run_vol = 0;
		for (item of this.Items){
			run_vol += item.Volume;
			var update_coords = [this.Coords[0],this.Coords[1] + this.Radius[1]*(run_vol/volume-1)];
			run_vol += item.Volume;
			var update_radius = [this.Radius[0],this.Radius[0]*item.Volume*2/volume];
			item.update(update_coords,update_radius);
		}
		
	}
	show(){
		if (this.Active == 1){
			fill(black+5);
			rect(this.Coords[0],this.Coords[1],this.Radius[0]*2+this.Pad,this.Radius[1]*2+this.Pad);
			fill(black);
			rect(this.Coords[0],this.Coords[1],this.Radius[0]*2,this.Radius[1]*2);
			for (var item of this.Items){
				item.show();
			}
		}
	}
	clicked(){
		if(this.mouseInside() == 1){
			for (var item of this.Items){
				if(item.Clickable && mouseY < item.Coords[1] + item.Radius[1] && mouseY > item.Coords[1] - item.Radius[1]){
					item.clicked();
				}
			}
		}
	}
	
	mouseInside(){
		if(this.Active == 1 && mouseX > this.UpperLeft[0] && mouseX < this.LowerRight[0] && mouseY > this.UpperLeft[1] && mouseY < this.LowerRight[1]){
			return 1;
		} else {return 0;}
	}
	
	getIndex(searchId){
		for (var checkId = 0; checkId < this.Items.length; checkId++){
			if (searchId == this.Items[checkId].Id){return checkId}
		}
		return -1;
	}
}

class arrowItem {
	constructor(volume,list,displaySize,id) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.Clickable = true;
		this.List = list;
		this.Index = 0;
		this.Size = displaySize;
		this.Id = id;
	}
	show(){
		fill(white);
		textSize(this.Size);
		text(this.List[this.Index],this.Coords[0],this.Coords[1]);
		triangle(this.Sides[0]-this.Size,this.Coords[1],this.Sides[0],this.Coords[1]-this.Size*0.5,this.Sides[0],this.Coords[1]+this.Size*0.5);
		triangle(this.Sides[1]+this.Size,this.Coords[1],this.Sides[1],this.Coords[1]-this.Size*0.5,this.Sides[1],this.Coords[1]+this.Size*0.5);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
		this.Sides = [this.Coords[0]-this.Radius[0]+this.Size*2,this.Coords[0]+this.Radius[0]-this.Size*2];
	}
	clicked(){
		if(mouseX > this.Sides[0]-this.Size*2 && mouseX < this.Sides[0]+this.Size){
			this.giveValue((this.List.length - 1 + this.Index) % this.List.length);
		} else if(mouseX < this.Sides[1] + this.Size*2 && mouseX > this.Sides[1]-this.Size){
			this.giveValue((1 + this.Index) % this.List.length);
		}
	}
	giveValue(indexVal){
		if (this.Index != indexVal){
			this.Index = indexVal;
			setting.arrowClick(this.Id,this.Index,this.List[this.Index]);
		}
	}
}

class textItem {
	constructor(volume,displayText,displaySize,id = '', color = white,font = atkinsonBold) {
		this.Volume = volume;
		this.Coords = [0,0]; 
		this.Clickable = false;
		this.DisplayText = displayText;
		this.Size = displaySize;
		this.Radius = [0,0];
		this.Id = id;
		this.Color = color;
		this.Font = font;
	}
	show(){
		textFont(this.Font);
		fill(this.Color);
		textSize(this.Size);
		text(this.DisplayText,this.Coords[0],this.Coords[1]);
		textFont(atkinsonBold);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
	}
}

class binaryItem {
	constructor(volume,list,displaySize,id,index) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.Clickable = true;
		this.List = list;
		this.Index = index;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
	}
	show(){
		fill(white-20);
		rect(this.Sides[this.Index],this.Coords[1],this.Radius[0]*0.9,this.Radius[1]*1.8,this.Size*0.5);
		textSize(this.Size);
		fill(black);
		text(this.List[this.Index],this.Sides[this.Index],this.Coords[1]);
		if (this.Active){fill(white);} else {fill(white*0.5);}
		text(this.List[(this.Index+1)%2],this.Sides[(this.Index+1)%2],this.Coords[1]);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
		this.Sides = [this.Coords[0]-this.Radius[0]*0.5,this.Coords[0]+this.Radius[0]*0.5];
	}
	clicked(){
		if(this.Active && mouseX > this.Coords[0]-this.Radius[0] && mouseX < this.Coords[0]){
			this.giveValue(0);
		} else if(this.Active && mouseX < this.Coords[0] + this.Radius[0] && mouseX > this.Coords[0]){
			this.giveValue(1);
		}
	}
	giveValue(indexVal){
		if (this.Index != indexVal){
			this.Index = indexVal;
			setting.arrowClick(this.Id,this.Index,this.List[this.Index]);
		}
	}
}

class Settings {
	constructor(sq) {
		this.Prime = 1;
		this.ColorType = 0;
		this.ColorSpeed = 1;
		this.sq = sq;
		this.IconBoxCoord = [];
		this.Labels = 1;
		this.ShowGrid = 0;
		this.Gridlines = [];
		this.Partial = [];
		this.Refresh = true;
		this.Makker = false;
		this.MouseCoeff = coordToCoeff([mouseX,mouseY]);
		this.HoverPause = 20;
		this.IsHovering = false;
		this.Era = 0;
		this.EraTimer = [];
		this.Flashers = [];
		this.ClickEra = -1;
		this.ScreenSaver = -1;
		this.MouseSS = [mouseX,mouseY,0];
		this.MultSS = 1;
		this.Units = ['(1)','(i)','(-1)','(-i)'];
		this.Blocked = [];
		this.Power = 'u';
		this.Restart = -1;
		this.Moves = -1;
	}
	
	arrowClick(id,listIndex,listValue){
		this.Refresh = true;
		if (id == 'colorScheme'){
			colors = colorScheme(listValue);
		} else if (id == 'colorType'){
			this.ColorType = listIndex;
		} else if (id == 'displaying'){
			this.Prime = (listIndex + 1) % 2;
			for (var i = 1; i < 51; i++) {
				for (var j = 0; j < 51; j++) {
					gInts[i][j].Walkable = (this.Prime + gInts[i][j].IsPrime) % 2;
				}
			}
			gInts[1][0].Walkable = 1;
			
		} else if (id == 'animate'){
			this.ColorSpeed = (listIndex + 1) % 2;
		} else if (id == 'labels'){
			this.Labels = (listIndex + 1) % 2;
		} else if (id == 'gridlines'){
			this.ShowGrid = (listIndex + 1) % 2;
		} else if (id == 'hoverbox'){
			hoverBox.Active = (listIndex + 1) % 2;
		} else if (id == '='){
			menuBox.Active = listIndex;
			if(menuBox.Active == 1 && infoBox.Active == 1){
				infoBox.Active = 0;
				icons[1].Active = 0;
			}
		} else if (id == '<'){
			this.Blocked = [];
			resetWalkability(2);
			resetWalkability(-1);
			this.newEra(this.Restart,2);
		}else if (id == '?'){
			infoBox.Active = listIndex;
			if(menuBox.Active == 1 && infoBox.Active == 1){
				menuBox.Active = 0;
				icons[0].Active = 0;
			}
			
		} else if (id == 'gamemode'){
			if (listIndex == 0){
				menuBox.Items[menuBox.getIndex('animate')].giveValue(1);
				menuBox.Items[menuBox.getIndex('displaying')].Active = false;
				menuBox.Items[menuBox.getIndex('animate')].Active = false;
				this.Makker = true;
				this.newEra(100);
			} else {
				this.newEra(1);
				menuBox.Items[menuBox.getIndex('animate')].giveValue(0);
				menuBox.Items[menuBox.getIndex('displaying')].Active = true;
				menuBox.Items[menuBox.getIndex('animate')].Active = true;
				this.Makker = false;
			}
			
		} else if (id == 'u'){
			this.Power = 'u';
			icons[4].Active = 0;
			icons[5].Active = max(1,icons[5].Active);
			icons[6].Active = max(1,icons[6].Active);
		} else if (id == 'X'){
			this.Power = 'X';
			icons[4].Active = 1;
			icons[5].Active = 0;
			icons[6].Active = max(1,icons[6].Active);
		} else if (id == '/'){
			this.Power = '/';
			icons[4].Active = 1;
			icons[5].Active = 1;
			icons[6].Active = 0;
		}
	}
	
	makeGrid(){
		for (var i = -50; i < 51; i += 10) {
			var vert_coords = coeffToCoord([i,0]);
			this.Gridlines.push([vert_coords[0],vert_coords[1],this.sq*0.2,this.sq*55]);
			var hor_coords = coeffToCoord([0,i]);
			this.Gridlines.push([hor_coords[0],hor_coords[1],this.sq*101,this.sq*0.2]);
		}
	}
	
	
	
	newEra(eraValue, reset = 0){
		
		if(reset < 1){
			for (var i = 2; i < icons.length; i++){
				icons[i].Active = 2;
			}
			this.Moves = -1;
		}
	
		this.Era = eraValue;
		this.Refresh = true;
		messageBox.Active = 0;
		targets[0].Active = 0;
		targets[1].Active = 0;
		this.Flashers = [];
		this.EraTimer = [];
		this.ClickEra = -1;
		
		var step = 0;
		var continuestep = true;
		while (continuestep){
			
			if (gameData.getNum(step,0) > this.Era){continuestep = false;}
			if (gameData.getNum(step,0) == this.Era){
				if (gameData.getString(step,1) == 'Message'){
					messageBox.Active = 1;
					messageBox.Items[messageBox.getIndex('message')].DisplayText = gameData.getString(step,2).replace('%n','\n');
				} else if (gameData.getString(step,1) == 'Timer'){
					this.EraTimer = [0,gameData.getNum(step,2),gameData.getNum(step,3)];
				} else if (gameData.getString(step,1) == 'Makker'){
					mkr.setPosition([gameData.getNum(step,2),gameData.getNum(step,3)]);
				} else if (gameData.getString(step,1) == 'Displaying'){
					menuBox.Items[menuBox.getIndex('displaying')].giveValue(gameData.getNum(step,2));
				} else if (gameData.getString(step,1) == 'Target'){
					targets[gameData.getNum(step,6)].Id = gameData.getString(step,4);
					targets[gameData.getNum(step,6)].Active = true;
					targets[gameData.getNum(step,6)].updateCoeffs([gameData.getNum(step,2),gameData.getNum(step,3)]);
					targets[gameData.getNum(step,6)].Era = gameData.getNum(step,5);
				} else if (gameData.getString(step,1) == 'RandomStar'){
					targets[0].Active = true;
					targets[0].random();
				} else if (gameData.getString(step,1) == 'FlashingBox'){
					var boxCoords = coeffToCoord([gameData.getNum(step,2),gameData.getNum(step,3)]);
					this.Flashers.push([boxCoords[0],boxCoords[1],gameData.getNum(step,4)*this.sq,gameData.getNum(step,5)*this.sq,0,0]);
				} else if (gameData.getString(step,1) == 'Click'){
					this.ClickEra = gameData.getNum(step,2);
				} else if (gameData.getString(step,1) == 'Block'){
					gInts[gameData.getNum(step,2)][gameData.getNum(step,3)].Walkable = 0;
					this.Blocked.push([gameData.getNum(step,2),gameData.getNum(step,3)]);
				} else if (gameData.getString(step,1) == 'Restart'){
					icons[3].Active = 0;
					this.Restart = gameData.getNum(step,2);
				} else if (gameData.getString(step,1) == 'Moves'){
					this.Moves = gameData.getNum(step,2);
					icons[2].DisplayChar[0] = this.Moves;
					icons[2].Active = 0;
				} else if (gameData.getString(step,1) == 'Power'){
					this.Power = 'u';
					icons[2].Active = 0;
					icons[4].Active = 0;
					for (i = 5; i <= gameData.getNum(step,2)+1; i++){
						icons[i].Active = 1;
					}
				} 
				
				
			}
			step++;
		}
		
		if (reset == 2){
			resetWalkability(2);
		}
		fixedWalk();
	}
	
}

function colorScheme(schemeId){
	var color_output = [];
	var c;
	
	if (schemeId == 'Rainbow'){
		for (c = 0; c < 360; c++){
			color_output.push([c,60,60]);
		}
	} else if (schemeId == 'Fire'){color_output = gradient([[0,70,50],[60,80,60]],2);
	} else if (schemeId == 'Ice'){color_output = gradient([[200,60,60],[210,30,70],[230,70,70]],2);
	} else if (schemeId == 'Sunset'){ color_output = gradient([[50,75,75],[10,85,75],[350,80,70],[330,50,60],[280,40,55],[250,40,55],[280,40,55],[330,50,60],[350,80,70],[10,85,75]],1);
	} else if (schemeId == 'Pastel'){color_output = gradient([[0,70,85],[50,85,85],[150,85,85],[205,85,80],[270,85,85]],1);
	} else if (schemeId == 'Cotton Candy'){ color_output = gradient([[190,50,70],[190,50,70],[265,35,80],[320,40,70],[320,40,70],[265,35,80]],2);
	} else if (schemeId == 'Dark Mode'){ color_output = gradient([[210,30,40],[255,25,40]],2);
	} else if (schemeId == 'Forest'){ color_output = gradient([[130,45,35],[90,70,40],[130,50,35],[80,45,35],[130,45,30],[150,35,50]],1);
	
	}
	
	return color_output;
}

function gradient(gradSteps,repeats){
	var grad_output = [];
	var start_len = gradSteps.length;
	for (var rep = 1; rep < repeats; rep++){
		for (var step = 0; step < start_len; step++){
			gradSteps.push(gradSteps[step]);
		}
	}
	var jumps = int(360/gradSteps.length);

	for (var g = 0; g < gradSteps.length; g++){
		var gn = (g + 1) % gradSteps.length;
		var glig = gradSteps[g][2] ** 2;
		var gnlig = gradSteps[gn][2] ** 2;
		var ghue = gradSteps[g][0];
		if (ghue + 360 - gradSteps[gn][0] < gradSteps[gn][0] - ghue){
			ghue += 360
		} else if (ghue - gradSteps[gn][0] > gradSteps[gn][0] - ghue + 360){
			ghue -= 360
		} 
		for (var jump = 0; jump < jumps; jump++){
			var jump2 = jump ** 1.5;
			var jinv2 = (jumps - jump) ** 1.5;
			var jump_hue = int(360+(ghue*jinv2+gradSteps[gn][0]*jump2)/(jump2+jinv2))%360;
			var jump_sat = int((gradSteps[g][1]*jinv2+gradSteps[gn][1]*jump2)/(jump2+jinv2));
			var jump_lig = int(((glig*jinv2+gnlig*jump2)/(jump2+jinv2))**0.5);
			grad_output.push([jump_hue,jump_sat,jump_lig]);
			
		}
	}
	return grad_output;
}

class Makker {
	constructor(radius, squarew, start_pos) {
		this.Radius = radius;
		this.DrawRadius = radius * squarew * 2;
		this.Pos = start_pos;
		this.Round = [round(this.Pos[0]), round(this.Pos[1])];
		this.Coords = coeffToCoord(this.Pos);
		this.Vel = [0, 0];
		this.Acc = [0, -0.005];
		this.Assoc = getAssociate(this.Round);
		this.Sitting = false;
	}

	Go() {
		this.Vel[0] = min(max(this.Vel[0] + this.Acc[0], -0.5), 0.5);
		this.Vel[1] = min(max(this.Vel[1] + this.Acc[1], -0.5), 0.5);
		this.Acc[1] = -0.005;
		
		if (round(this.Vel[0],4) != 0 || this.Vel[1] != this.Acc[1] || this.Sitting == false) {

			this.Sitting = false;
			var vel_sign = [0, 0];
			if (this.Vel[0] > 0) {
				vel_sign[0] = 1
			} else if (this.Vel[0] < 0) {
				vel_sign[0] = -1
			}
			if (this.Vel[1] > 0) {
				vel_sign[1] = 1
			} else if (this.Vel[1] < 0) {
				vel_sign[1] = -1
			}
			var new_pos = [max(min(this.Pos[0] += this.Vel[0],50),-50), max(min(this.Pos[1] += this.Vel[1],27),-27.5 + this.Radius)];

			var vert_edge = [new_pos[0], new_pos[1] + vel_sign[1] * this.Radius];
			var vert_round = [round(vert_edge[0]), round(vert_edge[1])];
			
			if (vert_round != this.Round && vel_sign[1] != 0) {
				var vert_assoc = getAssociate(vert_round);
				if (gInts[vert_assoc[0]][vert_assoc[1]].Walkable <= 0) {
					if (vel_sign[1] == 1) {
						new_pos[1] -= vert_edge[1] + 0.499 - floor(vert_edge[1] + 0.5);
					} else {
						new_pos[1] -= vert_edge[1] - 0.499 - ceil(vert_edge[1] - 0.5);
					}
					this.Vel[1] = this.Vel[1] * 0.4;
				}
			}


			var hor_edge = [new_pos[0] + vel_sign[0] * this.Radius, new_pos[1]];
			var hor_round = [round(hor_edge[0]), round(hor_edge[1])];
			if (hor_round != this.Round && vel_sign[0] != 0) {
				var hor_assoc = getAssociate(hor_round);
				if (gInts[hor_assoc[0]][hor_assoc[1]].Walkable <= 0) {
					if (vel_sign[0] == 1) {
						new_pos[0] -= hor_edge[0] + 0.499 - floor(hor_edge[0] + 0.5);
					} else {
						new_pos[0] -= hor_edge[0] - 0.499 - ceil(hor_edge[0] - 0.5);
					}
					this.Vel[0] = this.Vel[0] * 0.4;
				}
			}

			this.Vel[0] = this.Vel[0] * 0.9;
			this.Pos = new_pos;
			this.Round = [round(this.Pos[0]), round(this.Pos[1])];
			this.Coords = coeffToCoord(this.Pos);
			this.Assoc = getAssociate(this.Round);
			
			for (var targ of targets){
				if (this.Round[0] == targ.Coeffs[0] && this.Round[1] == targ.Coeffs[1] && targ.Active){
					targ.reached();
				}
			}
				//this.PrimeMode = gInts[this.Assoc[0]][this.Assoc[1]].IsPrime;

				if (round(this.Pos[1] + 0.5 - this.Radius, 2) == this.Round[1]) {
					var below_assoc = getAssociate([this.Round[0], this.Round[1] - 1]);
					
					if (gInts[below_assoc[0]][below_assoc[1]].Walkable <= 0 || this.Round[1] == -27) {
						this.Sitting = true;

					}
				}
		}
		if (this.Sitting) {
			this.Vel[1] = 0;
		}
		var myGInt = gInts[this.Assoc[0]][this.Assoc[1]];
		var a = this.Assoc[2];
		fill(colors[myGInt.Color[setting.ColorType][a]][0], colors[myGInt.Color[setting.ColorType][a]][1], int(colors[myGInt.Color[setting.ColorType][a]][2] * 0.5) + 50);
		circle(this.Coords[0], this.Coords[1], this.DrawRadius);
		setting.Partial.push([this.Round[0] - 1, this.Round[1] + 1, this.Round[0] + 1, this.Round[1] - 1]);
	}
	
	setPosition(posArr){
		this.Pos = posArr;
		this.Round = [round(this.Pos[0]), round(this.Pos[1])];
		this.Coords = coeffToCoord(this.Pos);
		this.Assoc = getAssociate(this.Round);
		this.Sitting = false;
		this.Vel = [0, 0];
	}
}

class Gauss {
	constructor(data,data_index,sq) {
		this.Norm = data.getNum(data_index,2);
		this.Arg = data.getNum(data_index,3);
		this.IsPrime = data.getNum(data_index,4);
		this.Desc = [data.getString(data_index,5),
								data.getString(data_index,6),
								data.getString(data_index,7),
								data.getString(data_index,8)];
		this.Factors = data.getString(data_index,9);
		this.FactorA = data.getNum(data_index,11);
		this.Walkable = (this.IsPrime + 1) % 2;
		this.Coeffs = [[data.getNum(data_index,0),data.getNum(data_index,1)]]
		this.IsLow = [abs(this.Coeffs[0][1])<28];
		this.ScreenSaverShow = [true,true,true,true];
		for (var g = 0; g < 3; g++){
			this.Coeffs.push([-this.Coeffs[g][1],this.Coeffs[g][0]]);
			this.IsLow.push(abs(this.Coeffs[g+1][1])<28);
		}
		
		this.Coords = [];
		this.Color = [[],[],[],[],[],[],[]];
		var normColor = int(this.Norm/9)%360;
		var argColor = int(this.Arg * 180/PI);
		
		for (g = 0; g < 4; g++){
			this.Coords.push(coeffToCoord(this.Coeffs[g]));
			this.Color[0].push(argColor+g*90);
			this.Color[1].push(normColor);
			this.Color[2].push((argColor+g*90-normColor+360) % 360);
			this.Color[3].push(0);
			this.Color[4].push(int((this.Coeffs[g][0]+this.Coeffs[g][1]+240)*2.25)%360);
			this.Color[5].push(((abs(this.Coeffs[g][0])-abs(this.Coeffs[g][1])+160)*3)%360);
			this.Color[6].push(int(noise(this.Coeffs[g][0]/16+75,this.Coeffs[g][1]/16+120)*360));
		}
		
		this.Type = 'Composite';
		if (this.Desc[0] == 1){this.Type = 'Unit';}
		else if (this.Desc[0] == 0){this.Type = 'Zero';}
		else if (this.IsPrime == 1){this.Type = 'Prime';}
		
	}
	
	showAll() {
		var a;
		if (this.Walkable != 1 && this.Walkable != 2){
			var lightMult = 1;
			var lightAdd = 0;
			if (setting.ScreenSaver > -1){
				lightMult = (1 - cos(setting.ScreenSaver*PI/360))*0.4+0.2;
				for (a = 0 ; a < 4; a++){
					if (setting.ScreenSaver == setting.MultSS[1] + setting.MultSS[0]*this.Color[setting.ColorType][a]){this.ScreenSaverShow[a] = true;} 
					else if (setting.ScreenSaver - 360 == setting.MultSS[1] + setting.MultSS[0]*this.Color[setting.ColorType][a]){this.ScreenSaverShow[a] = false;}
				}
			//} else if (this.Walkable == 2){
				//lightMult = 0.35;
			} else if (this.Walkable == -1){
				lightMult = 0.6;
			} else if (this.Walkable == -2){
				lightAdd = 85;
				lightMult = 0.12;
			} 
			
			for (a = 0 ; a < 4; a++){
				if (this.IsLow[a] && this.ScreenSaverShow[a]){
					fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],lightAdd + colors[this.Color[setting.ColorType][a]][2]*lightMult);
					rect(this.Coords[a][0], this.Coords[a][1], setting.sq, setting.sq);
				}
			}
			
		}
	}
	
	showOutline(a) {
		noFill();
		strokeWeight(setting.sq*0.25);
		stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],colors[this.Color[setting.ColorType][a]][2]*0.6+40);
		rect(this.Coords[a][0], this.Coords[a][1], setting.sq*1.2, setting.sq*1.25);
		noStroke();
	}
	
	showLabel(){
		
		strokeWeight(setting.sq*0.2);
		textSize(setting.sq*1.2);
			
		for (var a = 0 ; a < 4; a++){
			if (this.IsLow[a]){
				if(setting.Prime == 1){
					fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],int(colors[this.Color[setting.ColorType][a]][2]*0.4)+60);
					stroke(black);
				}else{
					fill(black);
					stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],int(colors[this.Color[setting.ColorType][a]][2]*0.4)+60);
				}
				text(this.Desc[a],this.Coords[a][0],this.Coords[a][1]);
			}
		}
		noStroke();
	}
}


function draw() {
	
	if (mouseX == setting.MouseSS[0] && mouseY == setting.MouseSS[1]){
		setting.MouseSS[2]++;
	} else {
		endScreenSaver()
	}
	
	var newMouse = coordToCoeff(mouseX,mouseY);
	var mouseA = getAssociate(setting.MouseCoeff);
	
	if (setting.MouseSS[2] == 3000){
		setting.ScreenSaver = 719;
		setting.PreScreenSaver = [setting.Prime,menuBox.Items[menuBox.getIndex('colorScheme')].Index,menuBox.Items[menuBox.getIndex('colorType')].Index,setting.ColorSpeed];
		setting.ColorSpeed = 2;
		
	} else if (setting.ScreenSaver == -1) {
	
		setting.Time = setting.Time + 1;
		if (setting.EraTimer.length > 0){
			setting.EraTimer[0] += 1;
			if (setting.EraTimer[0] == setting.EraTimer[1]){
				var newEraVal = setting.EraTimer[2];
				setting.EraTimer = [];
				setting.newEra(newEraVal,1);
			}
		}

		if (setting.MouseCoeff[0] != newMouse[0] || setting.MouseCoeff[1] != newMouse[1]){
			setting.MouseCoeff = newMouse;
			setting.Time = 0;
			if (setting.IsHovering){
				resetWalkability(-1);
				resetWalkability(-2);
				for (var hoveritem of hoverBox.Items){hoveritem.DisplayText = '';}
				setting.Refresh = true;
				setting.IsHovering = false;
			}
			cleanFlashers();
		} else if (setting.Time == setting.HoverPause && goodCoeff(newMouse) && mouseCheck() == false && isOpen(mouseA)){
			
			hoverBox.Items[hoverBox.getIndex('hovertext')].DisplayText = gInts[mouseA[0]][mouseA[1]].Desc[mouseA[2]];
			hoverBox.Items[hoverBox.getIndex('factortitle')].DisplayText = gInts[mouseA[0]][mouseA[1]].Type + '       Norm ' + gInts[mouseA[0]][mouseA[1]].Norm;
			hoverBox.Items[hoverBox.getIndex('primefactorization')].DisplayText = 'Prime Factorization:'
			hoverBox.Items[hoverBox.getIndex('factors')].DisplayText = setting.Units[(gInts[mouseA[0]][mouseA[1]].FactorA + mouseA[2]) % 4] + ' ' + gInts[mouseA[0]][mouseA[1]].Factors;

			if(gInts[mouseA[0]][mouseA[1]].IsPrime == 0){
				walkabilityFactors(-2,mouseA);
			} else if(setting.Power == 'u' && setting.Prime == 0 && setting.Moves != 0){
				giveWalkability(-1,gInts[mouseA[0]][mouseA[1]].Desc[0],2); 
				
			} else if(setting.Power == 'X' && setting.Prime == 0 && setting.Moves != 0){
				var multGoTo = multiplyC(mkr.Round,newMouse);
				if (multGoTo.length > 0){
					multCoords = coeffToCoord(multGoTo);
					//console.log(multCoords);
					setting.Flashers.push([multCoords[0],multCoords[1],setting.sq,setting.sq,0,1]);
				}
				
			} else if(setting.Power == '/' && setting.Prime == 0 && setting.Moves != 0){
				var divGoTo = divideC(mkr.Round,newMouse);
				if (divGoTo.length > 0){
					divCoords = coeffToCoord(divGoTo);
					setting.Flashers.push([divCoords[0],divCoords[1],setting.sq,setting.sq,0,1]);
				}
			} else if(setting.Makker == false) {
				giveWalkability(-2,gInts[mouseA[0]][mouseA[1]].Desc[0]);
			}
			
			setting.Refresh = true;
			setting.IsHovering = true;
		}
	}
		
	for (var dummy = 0; dummy < setting.ColorSpeed; dummy++){
		colors.push(colors[0]);
		colors.splice(0,1);
	}
		
	var gRow, gCol;
	if(setting.ColorSpeed > 0 || setting.Refresh || setting.ScreenSaver > -1){
		
		background(black);
	
		for (gRow of gInts) {
			for (gCol of gRow) {
				gCol.showAll(setting.sq);
			}
		}
		setting.Refresh = false;
		
	} else {
		for (var part of setting.Partial){
			fill(black);
			var ul = coeffToCoord([part[0]-0.5,part[1]+0.5]);
			var dr = coeffToCoord([part[2]+0.5,part[3]-0.5]);
			rect((ul[0]+dr[0])*0.5,(ul[1]+dr[1])*0.5,dr[0]-ul[0],dr[1]-ul[1])
			for (var i = part[0]; i <= part[2]; i++) {
				for (var j = part[3]; j <= part[1]; j++) {
					var ijAssoc = getAssociate([i,j]);
					if (goodCoeff([i,j])){gInts[ijAssoc[0]][ijAssoc[1]].showAll(setting.sq);}
				}
			}
		}
	}
	
	setting.Partial = [];
	
	if (setting.ScreenSaver > -1){
		setting.ScreenSaver += 1;
		if (setting.ScreenSaver == 720){
			setting.MultSS = [int(random(0,2))*2-1];
			setting.MultSS.push(-180*(setting.MultSS-1));
			menuBox.Items[menuBox.getIndex('displaying')].giveValue(int(random()*1.5+0.5));
			var colorindexes = [menuBox.getIndex('colorScheme'),menuBox.getIndex('colorType')];
			var colorlengths = [menuBox.Items[colorindexes[0]].List.length,menuBox.Items[colorindexes[1]].List.length]
			menuBox.Items[colorindexes[0]].Index = 5;
			while(menuBox.Items[colorindexes[0]].Index == 5 ||  menuBox.Items[colorindexes[1]].Index == 3){
				menuBox.Items[colorindexes[0]].giveValue(int(random()*colorlengths[0]));
				menuBox.Items[colorindexes[1]].giveValue(int(random()*colorlengths[1]));
			}
			setting.ScreenSaver = 0;
			for (gRow of gInts) {
				for (gCol of gRow) {
					gCol.ScreenSaverShow = [false,false,false,false];
				}
			}
		}
		
	} else {
		
		showGrid();
		if(setting.Labels == 1){
			for (var f = 0; f < 46; f += 5) {
				gInts[f][0].showLabel(setting.sq);
			}
		}

		if(setting.IsHovering){gInts[mouseA[0]][mouseA[1]].showOutline(mouseA[2]);}

		if (setting.Makker){mkr.Go();}
		for (var targ of targets){
			targ.show();
		}
		
		for (var icon of icons){
			icon.showIcon();
		}
		
		for (var flash of setting.Flashers){
			flash[4] = (flash[4] + 0.05) % TWO_PI;
			stroke((1+cos(flash[4]))*40+10);
			strokeWeight(setting.sq*0.3);
			noFill();
			rect(flash[0],flash[1],flash[2],flash[3]);
			noStroke();
		}
		
		menuBox.show();
		infoBox.show();
		hoverBox.show();
		messageBox.show();
		
		
	
	}
}


function mouseClicked(){
	
	var isMove;
	endScreenSaver();
	
	if (mouseCheck()){
		menuBox.clicked();
		for (var icon of icons){
			icon.clicked();
		}
	} else {
	
		cleanFlashers();
		var mouseC = coordToCoeff(mouseX,mouseY);
		var mouseA = getAssociate(mouseC);
		if (goodCoeff(mouseC)){

			if (gInts[mouseA[0]][mouseA[1]].IsPrime == 1 && isOpen(mouseA) && setting.Prime == 0 && setting.Makker){
				setting.Refresh = true;
				resetWalkability(2);
				resetWalkability(-1);
				mkr.Sitting = false;

				if(setting.Power == 'u'){
					isMove = tryMove();
					if (isMove){giveWalkability(2,gInts[mouseA[0]][mouseA[1]].Desc[0]); }
				} else if(setting.Power == 'X'){
					var multGoTo = multiplyC(mkr.Round,mouseC);
					if (multGoTo.length > 0){
						isMove = tryMove();
						if (isMove){
							mkr.setPosition(multGoTo);
							fixedWalk();
						}
					} else {
						messageBox.Active = 1;
						messageBox.Items[messageBox.getIndex('message')].DisplayText = 'Multiplicaiton out of range. Try another prime.';
					}
				} else {
					var divGoTo = divideC(mkr.Round,mouseC);
					if (divGoTo.length > 0){
						isMove = tryMove();
						if (isMove){
							mkr.setPosition(divGoTo);
							fixedWalk();
						}
					} else {
						messageBox.Active = 1;
						messageBox.Items[messageBox.getIndex('message')].DisplayText = 'That prime does not divide your location. Try another.';
					}
				}

			}
		} 	
	}
	
	if (setting.ClickEra != -1){setting.newEra(setting.ClickEra,1)}
}




