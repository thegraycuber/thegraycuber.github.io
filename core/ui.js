
//relies on toolbox.js

class Icon {
	constructor(id, coords, size, type = id, color = 'front', link = '') {
		this.Id = id;
		this.Type = type;
		this.Size = size;
		this.Coords = coords;
		this.Active = true;
		this.Link = link;
		this.Color = color;
		this.make_button();
	}
	show() {
		push();
		
		let icon_color = palette[this.Color];
		if (!this.Active){
			icon_color = palette.backlight;
		}
		translate(this.Coords[0], this.Coords[1]);
		
		if (this.Type == 'palette'){
			onlyStroke(icon_color,this.Size[0]*0.08);
			let diam = this.Size[0]*0.65;
			circle(0, -this.Size[0]*0.2,diam);
			circle(-this.Size[0]*0.18, this.Size[0]*0.1,diam);
			circle(this.Size[0]*0.18, this.Size[0]*0.1,diam);
			
		} else if (this.Type == 'reset'){
			onlyStroke(icon_color,this.Size[0]*0.1);
			arc(0,0, this.Size[0]*0.75, this.Size[1]*0.75, -PI/2, PI);
			onlyFill(icon_color);
			drawTri(-this.Size[1]*0.15, -this.Size[1]*0.38, -this.Size[1]*0.15);
			
		} else if (this.Type == 'play'){
			onlyFill(icon_color);
			if (check_play() == 'play'){
				drawTri(0,0,this.Size[0]*0.38);
			} else if (check_play() == 'pause'){
				rect(-this.Size[0]*0.22,0,this.Size[0]*0.22,this.Size[1]*0.85);
				rect(this.Size[0]*0.22,0,this.Size[0]*0.22,this.Size[1]*0.85);
			} else if (check_play() == 'stop'){
				rotate(PI/4);
				rect(0,0,this.Size[0],this.Size[0]*0.12);
				rotate(PI/2);
				rect(0,0,this.Size[0],this.Size[0]*0.12);
				rotate(-3*PI/4);
			}
			
		} else if (this.Type == 'info'){
			onlyFill(icon_color);
			if (check_info() == 'info'){
				textSize(this.Size[1]*0.65);
				text('i',0,0);
				onlyStroke(palette.front,this.Size[1]*0.08);
				circle(0,0,this.Size[1]);
			} else if (check_info() == 'hide'){
				rotate(PI/4);
				rect(0,0,this.Size[0],this.Size[0]*0.1);
				rotate(PI/2);
				rect(0,0,this.Size[0],this.Size[0]*0.1);
				rotate(-3*PI/4);
			}
			
		} else if (this.Type == 'physics'){
			let rad = this.Size[0]*0.2;
			onlyFill(icon_color);
			circle(-rad*1.2, rad*1.4, rad*1.4);
			circle(rad*1.2, - rad*1.4, rad*1.4);
			
			onlyStroke(icon_color,this.Size[0]*0.1);
			line(-rad*0.12, -rad*0.12, rad*0.12, rad*0.12);
			
		} else if (this.Type == 'download'){
			onlyStroke(icon_color,this.Size[0]*0.1);
			let rad = this.Size[0]*0.25;
			line(-rad, rad*1.6, rad, rad*1.6);
			line(0, -rad*1.6, 0, rad*0.5);
			line(-rad, -rad*0.5, 0, rad*0.5);
			line(rad, -rad*0.5, 0, rad*0.5);
			
		} else if (this.Type == 'random') {
			onlyStroke(icon_color,this.Size[0]*0.06);
			beginShape();
			vertex(-this.Size[0]*0.433, -this.Size[1]*0.25);
			vertex(0, -this.Size[1]*0.5);
			vertex(this.Size[0]*0.433, -this.Size[1]*0.25);
			vertex(this.Size[0]*0.433, this.Size[1]*0.25);
			vertex(0, this.Size[1]*0.5);
			vertex(-this.Size[0]*0.433, this.Size[1]*0.25);
			endShape(CLOSE);
			
			line(0, 0, -this.Size[0]*0.413, -this.Size[1]*0.23);
			line(0, 0, this.Size[0]*0.413, -this.Size[1]*0.23);
			line(0, 0, 0, this.Size[1]*0.48);
			ellipse(0, -this.Size[1]*0.25,this.Size[0]*0.06, this.Size[1]*0.04);
			ellipse(-this.Size[0]*0.28, this.Size[1]*0.025,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(-this.Size[0]*0.15, this.Size[1]*0.2,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Size[0]*0.31, -this.Size[0]*0.015,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Size[0]*0.23, this.Size[1]*0.12,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Size[0]*0.14, this.Size[1]*0.26,this.Size[0]*0.03, this.Size[1]*0.05);
			
		} else if (this.Type == 'grid'){
			onlyStroke(palette.front,this.Size[0]*0.08);
			for (let g_pos = -0.3; g_pos < 0.4; g_pos += 0.3){
				rect(this.Size[0]*g_pos,0,0,this.Size[1]);
				rect(0,this.Size[1]*g_pos, this.Size[0],0);
			}
			
		} else if (this.Type == 'youtube'){
			onlyFill(palette.front);
			rect(0,0,this.Size[0],this.Size[0]*0.8,this.Size[0]*0.25);
			fill(palette.back);
			drawTri(this.Size[0]*0.05,0,this.Size[0]*0.18);
			
		} else if (this.Type == 'text'){
			text_in_box(this.Id, 0, 0, this.Size[1]*0.8, icon_color, palette.back);
			
		} else if (this.Type == 'text_inv'){
			text_in_box(this.Id, 0, 0, this.Size[1]*0.8, palette.back ,icon_color);
			
		} else if (typeof core_icon_custom === 'function'){
			core_icon_custom(this, icon_color);
			
		} else {
			onlyFill(icon_color);
			rect(0,0,this.Size[0],this.Size[1]);
			
		}
		
		pop();
	}
	
	clicked() {
		if(this.Active && abs(mouseX - this.Coords[0])*2 <= this.Size[0] && abs(mouseY - this.Coords[1])*2 <= this.Size[1]){
			action(this.Id,this.Type);
		}
		
	}
	
	make_button(){
		if (this.Link.length > 0){
			this.button = createElement('a');
			this.button.attribute("href",this.Link);
			this.button.attribute("target","_blank");
			this.update_button();
		}
	}
	
	update_button(){
		if (this.Link.length == 0){return;}
		this.button.style("background-color", "#00000000");
		this.button.size(this.Size[0], this.Size[1]);
		this.button.position(this.Coords[0]-this.Size[0]/2, this.Coords[1]-this.Size[1]/2);
	}
	
}

class Box {
	constructor(coords,size,pad,hide=false) {
		this.Items = [];
		this.Size = size;
		this.Coords = coords;
		this.Pad = pad;
		this.Active = 1;
		this.Hide = hide;
	}
	giveSizes(rad_adjust = 1){
		var volume = 0;
		for (var item of this.Items){
			volume += item.Volume;
		}
		var run_vol = 0;
		for (item of this.Items){
			run_vol += item.Volume;
			var update_coords = [this.Coords[0],this.Coords[1] + this.Size[1]*0.5*(run_vol/volume-1)];
			run_vol += item.Volume;
			var update_size = [this.Size[0]*rad_adjust,this.Size[1]*item.Volume/volume];
			item.update(update_coords,update_size);
		}
		
	}
	show(){
		noStroke();
		if (this.Active == 1){
			
			if (!this.Hide){
				fill(palette.backlight);
				rect(this.Coords[0],this.Coords[1],this.Size[0]+this.Pad,this.Size[1]+this.Pad,this.Pad*1.6);
				fill(palette.back);
				rect(this.Coords[0],this.Coords[1],this.Size[0],this.Size[1],this.Pad*1.2);
				
			}
			
			for (var item of this.Items){
				item.show();
			}
		}
	}
	clicked(){
		if (this.mouseInside()){
			for (let item of this.Items){
				if( abs(mouseY - item.Coords[1])*2 < item.Size[1]){
					item.clicked();
				}
			}
			return true;
		}
		return false;
	}
	
	mouseInside(){
		if(this.Active == 1 && abs(mouseX - this.Coords[0])*2 < this.Size[0] && abs(mouseY - this.Coords[1])*2 < this.Size[1]){
			return true;
		} else {return false;}
	}
	
	getItem(searchId){
		for (var checkId = 0; checkId < this.Items.length; checkId++){
			if (searchId == this.Items[checkId].Id){return this.Items[checkId]}
		}
		return -1;
	}
	
	randomize(){
		for (let item of this.Items){
			item.randomize();
			// if (item.Id == 'arrow_active' && item.Index == 1){
			// 	return;
			// }
		}
	} 
	
	setActive(active_value){
		this.Active = active_value;
		for (let list_item of this.Items){
			if (list_item.Type == 'text' && list_item.Link != ''){
				if (active_value){
					list_item.button.removeAttribute("hidden");
				} else {
					list_item.button.attribute("hidden","hidden");
				}
			} 
		}
	}
}

class arrowItem {
	constructor(volume,list,textsize,id,arrow = -1,index = 0,color = 'front') {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Size = [0,0];
		this.List = list;
		this.Index = index;
		this.TextSize = textsize;
		this.Id = id;
		this.Active = true;
		this.Type = 'arrow';
		this.Color = color;
		this.Arrow = arrow;
	}
	show(){
		if (this.Active){fill(palette[this.Color]);} else {fill(palette.backlight);}
		text_limited(this.List[this.Index],this.Coords[0],this.Coords[1],this.TextSize,this.Size[0]-this.TextSize*3);
		
		if (this.List.length > 1){
			drawTri(this.Coords[0]-this.Size[0]*0.5+this.TextSize*0.75, this.Coords[1], -this.TextSize*0.25);
			drawTri(this.Coords[0]+this.Size[0]*0.5-this.TextSize*0.75, this.Coords[1], this.TextSize*0.25);
		}
	}
	update(coords,size){
		this.Coords = coords;
		this.Size = size;
	}
	clicked(){
		if(this.Active && abs(mouseX-this.Coords[0]+this.Size[0]*0.5-this.TextSize*0.75) < this.TextSize ){
			this.giveValue((this.List.length - 1 + this.Index) % this.List.length);
		} else if(this.Active && abs(mouseX-this.Coords[0]-this.Size[0]*0.5+this.TextSize*0.75) < this.TextSize ){
			this.giveValue((1 + this.Index) % this.List.length);
		}
	}
	giveValue(indexVal){
		if (this.Index != indexVal){
			this.Index = indexVal;
			action(this.Id,this.Index,this.List[this.Index],this.Arrow);
		}
	}
	randomize(){
		if (this.Id == 'arrow'){return;}
		this.giveValue(int(random(this.List.length)));
	}
}

class textItem {
	constructor(volume,displayText,displaySize,id = '',link = '', color = 'front') {
		this.Volume = volume;
		this.Coords = [0,0]; 
		this.Size = [0,0];
		this.DisplayText = displayText;
		this.TextSize = displaySize;
		this.Id = id;
		this.Type = 'text';
		this.Link = link;
		this.Color = color;
	}
	show(){
		if (this.Active == false){fill(palette.backlight);}
		else {fill(palette[this.Color]);}
		
		text_limited(this.DisplayText,this.Coords[0],this.Coords[1],this.TextSize,this.Size[0]*0.9);
	}
	update(coords,size){
		this.Coords = coords;
		this.Size = size;
		if(this.Link != ''){
			this.make_button();
		}
	}

	clicked(){
		/*
		if(this.Link != ''){
			window.open(this.Link, '_blank');
		}*/
	}
	make_button(){
		this.button = createElement('a');
		this.button.attribute("href",this.Link);
		this.button.attribute("target","_blank");
		this.button.style("background-color", "#00000000");
		this.button.size(this.Size[0], this.Size[1]);
		this.button.position(this.Coords[0]-this.Size[0]/2,this.Coords[1]-this.Size[1]/2);
	}
	
	update_button(){
		if (this.anchor.length == 0){return;}
	}
	
	randomize(){
		return;
	}
}

class binaryItem {
	constructor(volume,list,displaySize,id,index,arrow = -1) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Size = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = index;
		this.TextSize = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'binary';
		this.Arrow = arrow;
	}
	show(){
		
		fill(palette.front);
		rect(this.Sides[this.Index],this.Coords[1],this.Size[0]*0.4,this.Size[1]*0.9,this.TextSize*0.5);
		textSize(this.TextSize);
		fill(palette.back);
		text(this.List[this.Index],this.Sides[this.Index],this.Coords[1]);
		fill(palette.front);
		text(this.List[(this.Index+1)%2],this.Sides[(this.Index+1)%2],this.Coords[1]);
	}
	update(coords,size){
		this.Coords = coords;
		this.Size = size;
		this.Sides = [this.Coords[0]-this.Size[0]/4,this.Coords[0]+this.Size[0]/4];
	}
	clicked(){
		if(this.Active && abs(mouseX - this.Sides[0]) < this.Size[0]/4){
			this.giveValue(0);
		} else if(this.Active && abs(mouseX - this.Sides[1]) < this.Size[0]/4){
			this.giveValue(1);
		}
	}
	giveValue(indexVal){
		if (this.Index != indexVal){
			this.Index = indexVal;
			action(this.Id,this.Index,this.List[this.Index],this.Arrow);
		}
	}
	randomize(){
		this.giveValue(int(random(2)));
	}
}


class sliderItem {
	constructor(volume,displaySize,range,id,value,arrow=-1) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Size = [0,0];
		//this.Radius = [0,0];
		this.Sides = [0,0];
		this.Value = value;
		this.Range = range;
		this.TextSize = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'slider';
		this.Arrow = arrow;
	}
	show(){
		
		fill(palette.backlight);
		rect(this.Coords[0],this.Coords[1]-0.1*this.Size[1],this.Size[0]*0.8,this.Size[1]*0.2);
		if (this.Active){fill(palette.front);} else {fill(palette.backlight);}
		var point_x  = this.Coords[0] + this.Size[0]*(0.8*(this.Value - this.Range[0])/(this.Range[1] - this.Range[0]) - 0.4);
		circle(point_x,this.Coords[1]-0.1*this.Size[1], 0.5*this.Size[1]);
		textSize(this.TextSize);
		var slider_text = str(round(this.Value,2));
		if (this.Id == 'Radius'){
			slider_text = str(round(2**this.Value,2))
		}
		text(slider_text,point_x,this.Coords[1]+this.Size[1]*0.5);
	}
	update(coords,size){
		this.Coords = coords;
		this.Size = size;
	}
	clicked(){
		if (this.Active){
			dragging = 'slider';
			this.giveValue(min(max(((mouseX - this.Coords[0])*2/this.Size[0] + 0.8)*(this.Range[1] - this.Range[0])/1.6 + this.Range[0],this.Range[0]),this.Range[1]));
		}
	}
	giveValue(indexVal){
		if (this.Value != indexVal){
			this.Value = indexVal;
			action(this.Id,this.Value,this,this.Arrow);
		}
	}
	randomize(){
		this.giveValue(random(this.Range[0],this.Range[1]));
	}
}