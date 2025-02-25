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


function touchStarted(){
	
	var isMove;
	endScreenSaver();
	
	if (mouseCheck()){
		menuBox.clicked();
		infoBox.clicked();
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

function touchMoved(event){
	event.preventDefault(); 
}