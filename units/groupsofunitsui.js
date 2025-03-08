class Icon {
	constructor(displayChar,displaySize,radius,coords,yoffset,link = '') {
		this.DisplayChar = [displayChar,'X'];
		this.Size = displaySize;
		this.Radius = radius;
		this.Coords = coords;
		this.UpperLeft = [this.Coords[0]-radius,this.Coords[1]-radius];
		this.LowerRight = [this.Coords[0]+radius,this.Coords[1]+radius];
		this.Active = 0;
		this.YOffset = yoffset;
		this.Time = 0;
		this.Link = link;
	}
	showIcon(){
		if (this.Active > -1){
			
			fill(palette.front);
			stroke(palette.back);
			
			if (this.DisplayChar[this.Active] == '='){
				strokeWeight(this.Radius*0.1);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.1,this.Radius,this.Radius*0.8);
				rect(this.Coords[0],this.Coords[1]-this.Radius*0.04,this.Radius,this.Radius*0.01);
				rect(this.Coords[0],this.Coords[1]+this.Radius*0.24,this.Radius,this.Radius*0.01);
				
			} else if (this.DisplayChar[this.Active] == 'y'){
				noStroke(this.Radius*0.1);
				fill(palette.front);
				rect(this.Coords[0],this.Coords[1],this.Size[0],this.Size[1],this.Radius*0.2);
				fill(palette.back);
				beginShape();
				vertex(this.Coords[0]+this.Size[0]*0.2,this.Coords[1]);
				vertex(this.Coords[0]-this.Size[0]*0.15,this.Coords[1]-this.Size[1]*0.25);
				vertex(this.Coords[0]-this.Size[0]*0.15,this.Coords[1]+this.Size[1]*0.25);
				vertex(this.Coords[0]+this.Size[0]*0.2,this.Coords[1]);
				endShape();
			} else {
				strokeWeight(this.Radius*0.1);
				textSize(this.Size[this.Active]);
				text(this.DisplayChar[this.Active],this.Coords[0],this.Coords[1]+this.YOffset[this.Active]);
			}
			
			noStroke();
		}
	}
	clicked(){
		if(this.Active > -1 && mouseX > this.UpperLeft[0] && mouseX < this.LowerRight[0] && mouseY > this.UpperLeft[1] && mouseY < this.LowerRight[1]){
			
			if (this.Link != ''){
				window.open(this.Link, '_blank');
			} else {
				this.Active = (this.Active + 1) % 2;
				arrowClick(this.DisplayChar[0],this.Active,'');
			}
			return true;
		}
		return false;
	}
}


class Box {
	constructor(coords,radius,pad) {
		this.Items = [];
		this.Radius = radius;
		this.Coords = coords;
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
			var update_radius = [this.Radius[0],this.Radius[1]*item.Volume/volume];
			item.update(update_coords,update_radius);
		}
		
	}
	show(outline=palette.backlight){
		if (this.Active == 1){
		
			fill(outline);
			rect(this.Coords[0],this.Coords[1],this.Radius[0]*2+this.Pad,this.Radius[1]*2+this.Pad);
			fill(palette.back);
			rect(this.Coords[0],this.Coords[1],this.Radius[0]*2,this.Radius[1]*2);
			for (var item of this.Items){
				item.show();
			}
		}
	}
	clicked(click = true){
		if(this.mouseInside() == 1){
			for (var item of this.Items){
				if(mouseY < item.Coords[1] + item.Radius[1] && mouseY > item.Coords[1] - item.Radius[1] && (item.Type == 'slider' || click)){
					item.clicked();
				}
			}
			return true;
		}
		return false;
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
	constructor(volume,list,displaySize,id,font = atkinsonBold) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = 0;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'arrow';
		this.Font = font;
	}
	show(){
		textFont(this.Font);
		if (this.Active){fill(palette.front);} else {fill(palette.backlight);}
		textSize(this.Size);
		text(this.List[this.Index],this.Coords[0],this.Coords[1]);
		if (this.List.length > 1){
			triangle(this.Sides[0]-this.Size,this.Coords[1],this.Sides[0],this.Coords[1]-this.Size*0.5,this.Sides[0],this.Coords[1]+this.Size*0.5);
			triangle(this.Sides[1]+this.Size,this.Coords[1],this.Sides[1],this.Coords[1]-this.Size*0.5,this.Sides[1],this.Coords[1]+this.Size*0.5);
		}
		textFont(atkinsonBold);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
		this.Sides = [this.Coords[0]-this.Radius[0]+this.Size*2,this.Coords[0]+this.Radius[0]-this.Size*2];
	}
	clicked(){
		if(this.Active && mouseX > this.Sides[0]-this.Size*2 && mouseX < this.Sides[0]+this.Size){
			this.giveValue((this.List.length - 1 + this.Index) % this.List.length);
		} else if(this.Active && mouseX < this.Sides[1] + this.Size*2 && mouseX > this.Sides[1]-this.Size){
			this.giveValue((1 + this.Index) % this.List.length);
		}
	}
	giveValue(indexVal){
		if (this.Index != indexVal){
			this.Index = indexVal;
			arrowClick(this.Id,this.Index,this.List[this.Index]);
		}
	}
}

class textItem {
	constructor(volume,displayText,displaySize,id = '',font = atkinsonBold,link = '') {
		this.Volume = volume;
		this.Coords = [0,0]; 
		this.DisplayText = displayText;
		this.Size = displaySize;
		this.Radius = [0,0];
		this.Id = id;
		this.Font = font;
		this.Link = link;
		this.Type = 'text';
	}
	show(){
		textFont(this.Font);
		fill(palette.front);
		if(this.Link != ''){
			fill(210,90,70);
		}
		textSize(this.Size);
		text(this.DisplayText,this.Coords[0],this.Coords[1]);
		textFont(atkinsonBold);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
	}
	clicked(){
		if(this.Link != ''){
			window.open(this.Link, '_blank');
		}
	}
}

class binaryItem {
	constructor(volume,list,displaySize,id,index) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = index;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'binary';
	}
	show(){
		
		fill(palette.front);
		rect(this.Sides[this.Index],this.Coords[1],this.Radius[0]*0.5,this.Radius[1]*1.8,this.Size*0.5);
		textSize(this.Size);
		fill(palette.back);
		text(this.List[this.Index],this.Sides[this.Index],this.Coords[1]);
		fill(palette.front);
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
			arrowClick(this.Id,this.Index,this.List[this.Index]);
		}
	}
}


class sliderItem {
	constructor(volume,displaySize,range,id,value) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.Value = value;
		this.Range = range;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'slider';
	}
	show(){
		
		fill(palette.backlight);
		rect(this.Coords[0],this.Coords[1]-0.2*this.Radius[1],this.Radius[0]*1.6,this.Radius[1]*0.4);
		if (this.Active){fill(palette.front);} else {fill(palette.backlight);}
		var point_x  = this.Coords[0] + this.Radius[0]*(1.6*(this.Value - this.Range[0])/(this.Range[1] - this.Range[0]) - 0.8);
		circle(point_x,this.Coords[1]-0.2*this.Radius[1],this.Radius[1]);

	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
		this.Sides = [this.Coords[0]-this.Radius[0]*0.5,this.Coords[0]+this.Radius[0]*0.5];
	}
	clicked(){
		if (this.Active){
			this.giveValue(min(max(((mouseX - this.Coords[0])/this.Radius[0] + 0.8)*(this.Range[1] - this.Range[0])/1.6 + this.Range[0],this.Range[0]),this.Range[1]));
		}
	}
	giveValue(indexVal){
		if (this.Value != indexVal){
			this.Value = int(indexVal);
			arrowClick(this.Id,this.Value,'');
		}
	}
}