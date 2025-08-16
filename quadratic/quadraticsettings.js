class Settings {
	constructor(sq) {
		this.Prime = 1;
		this.ColorType = 0;
		this.ColorSpeed = 1;
		this.sq = sq;
		this.IconBoxCoord = [];
		this.Labels = 1;
		this.ShowGrid = 0;
		this.ShowAssoc = 0;
		this.ZoomOut = 0;
		this.DataRows = 2022;
		this.Gridlines = [];
		this.MouseCoeff = [0,0];
		this.HoverPause = 12;
		this.IsHovering = false;
		this.Refresh = true;
		this.Era = 0;
		this.EraTimer = [];
		this.UnitsText = [];
		this.LabelShow = [[true,true],[],[true,true,true,true],[],[true,false,true,true,false,true]];
		this.PreW = 0;
		this.W = 0;
		if (prod){
			this.WVals = [-1,-2,-3,-7,-11,-19,-43,-67,-163, 17, 33, 41, 57, 73, 89, 97, 113, 129, 137, 3, 11, 19, 43, 59, 67, 83, 107, 131, 139,
				 5, 13, 21, 29, 37, 53, 61, 69, 77, 93, 101, 109, 133, 141, 149, 6, 14, 22, 38, 46, 62, 86, 94, 118, 134, 7, 23, 31, 47, 71, 103, 127, 2];
		}else{
			this.WVals = [-1,-2,-3];
		}
		this.WAssocs = [4,2,6];
		this.WUnitInv = [[0,-1],[-1,0],[0.5,-0.5]];
		this.WUnit = [[0,1],[-1,0],[0.5,0.5]];
		this.WY = [1,1,1.732051];
		this.YMax = [27,27,15.5];
		this.GridMult = [1,1,0.5];
		this.RingNames = ['Gaussian','O(√-2)','Eisenstein']
		
		for (var widx = 3; widx < this.WVals.length; widx++){
			if((this.WVals[widx] % 4 + 4) % 4 == 1){
				this.WY.push(1.73205);
				this.YMax.push(15.5);
				this.GridMult.push(0.5);
			} else{
				this.WY.push(1);
				this.YMax.push(27);
				this.GridMult.push(1);
			}
			this.WAssocs.push(2);
			this.WUnitInv.push([-1,0]);
			this.WUnit.push([-1,0]);
			this.RingNames.push('O(√' + str(this.WVals[widx]) + ')');
		}
	}
	
	arrowClick(id,listIndex,listValue){
		
		setting.Refresh = true;
		if (id == 'colorScheme'){
			palette = new Palette(listValue);
			colors = colorScheme();
			colorsLite = colorScheme(0.9);
			colorsF = colorFactor();

		} else if (id == 'colorType'){
			this.ColorType = listIndex;
			if (listIndex == 7){
				menuBox.Items[menuBox.getIndex('displaying')].Active = false;
			} else {
				menuBox.Items[menuBox.getIndex('displaying')].Active = true;
			}
			
		} else if (id == 'ring'){
			this.PreW = listIndex;
			tableLoad();
			
		} else if (id == 'displaying'){
			this.Prime = (listIndex + 1) % 2;
			for (var iRow of ints) {
				if (abs(iRow.Norm) > 1) {
					iRow.Walkable = (this.Prime + iRow.IsPrime) % 2;
				}
			}
			
		} else if (id == 'hover'){
			this.ShowAssoc = listIndex;
		}else if (id == 'animate'){
			this.ColorSpeed = (listIndex + 1) % 2;
		} else if (id == 'labels'){
			this.Labels = (listIndex + 1) % 2;
		} else if (id == 'gridlines'){
			this.ShowGrid = (listIndex + 1) % 2;
		} else if (id == 'hoverbox'){
			hoverBox.Active = (listIndex + 1) % 2;
		} else if (id == 'zoomout'){
			
			this.ZoomOut = (listIndex + 1) % 2;
			if(listIndex == 1){
				menuBox.Items[menuBox.getIndex('displaying')].Active = true;
				menuBox.Items[menuBox.getIndex('colorType')].Active = true;
				menuBox.Items[menuBox.getIndex('animate')].Active = true;
				menuBox.Items[menuBox.getIndex('labels')].Active = true;
				menuBox.Items[menuBox.getIndex('gridlines')].Active = true;
				menuBox.Items[menuBox.getIndex('hover')].Active = true;
				menuBox.Items[menuBox.getIndex('hoverbox')].Active = true;
			} else {
				menuBox.Items[menuBox.getIndex('colorType')].Active = false;
				menuBox.Items[menuBox.getIndex('colorType')].giveValue(3);
				menuBox.Items[menuBox.getIndex('animate')].Active = false;
				menuBox.Items[menuBox.getIndex('animate')].giveValue(1);
				menuBox.Items[menuBox.getIndex('labels')].Active = false;
				menuBox.Items[menuBox.getIndex('labels')].giveValue(1);
				menuBox.Items[menuBox.getIndex('gridlines')].Active = false;
				menuBox.Items[menuBox.getIndex('gridlines')].giveValue(1);
				menuBox.Items[menuBox.getIndex('hover')].Active = false;
				menuBox.Items[menuBox.getIndex('hoverbox')].Active = false;
				menuBox.Items[menuBox.getIndex('hoverbox')].giveValue(1);
				menuBox.Items[menuBox.getIndex('displaying')].Active = false;
				menuBox.Items[menuBox.getIndex('displaying')].giveValue(0);
			}
			
		} else if (id == '='){
			menuBox.Active = listIndex;
			if(menuBox.Active == 1 && infoBox.Active == 1){
				infoBox.Active = 0;
				icons[1].Active = 0;
			}
		} else if (id == '?'){
			infoBox.Active = listIndex;
			if(menuBox.Active == 1 && infoBox.Active == 1){
				menuBox.Active = 0;
				icons[0].Active = 0;
			}
		} 
	}
	
	makeGrid(){
		this.Gridlines = [];
		for (var i = -50; i < 51; i += 10) {
			var vert_coords = coeffToCoord([i,0]);
			this.Gridlines.push([vert_coords[0],vert_coords[1],this.sq*0.2,this.sq*55]);
			if (abs(i*this.GridMult[this.W]) < this.YMax[this.W]){
				var hor_coords = coeffToCoord([0,i*this.GridMult[this.W]]);
				this.Gridlines.push([hor_coords[0],hor_coords[1],this.sq*101,this.sq*0.2]);
			}
		}
	}
	
}