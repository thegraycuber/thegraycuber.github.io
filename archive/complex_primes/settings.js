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