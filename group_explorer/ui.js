
class Icon {
	constructor(type, displaySize, stroke, coords, value = -1) {
		this.Type = type;
		this.Size = displaySize;
		this.Radius = [displaySize[0]/2,displaySize[1]/2];
		this.Stroke = stroke;
		this.Coords = coords;
		this.Value = value;
	}
	show() {
		push();
		translate(this.Coords[0], this.Coords[1]);
		strokeWeight(this.Stroke);
		stroke(palette.front);
		noFill();
		
		if (this.Type == 'palette'){
			let diam = this.Radius[0]*1.3;
			circle(0, -this.Radius[0]*0.4,diam);
			circle(-this.Radius[0]*0.36, this.Radius[0]*0.2,diam);
			circle(this.Radius[0]*0.36, this.Radius[0]*0.2,diam);
			
		} else if (this.Type == 'physics'){
			let rad = this.Radius[0]*0.4;
			fill(palette.front);
			circle(-rad*1.2, rad*1.4, rad*1.4);
			circle(rad*1.2, - rad*1.4, rad*1.4);
			stroke(palette.front);
			noFill();
			line(-rad*0.12, -rad*0.12, rad*0.12, rad*0.12);
			
		} else if (this.Type == 'save_image'){
			let rad = this.Radius[0]*0.4;
			line(-rad, rad*1.6, rad, rad*1.6);
			line(0, -rad*1.6, 0, rad*0.5);
			line(-rad, -rad*0.5, 0, rad*0.5);
			line(rad, -rad*0.5, 0, rad*0.5);
			
		} else if (this.Type == 'movement'){
			fill(palette.front);
			noStroke();
			if (movement){
				rect(-this.Radius[0]*0.4, 0, this.Radius[0]*0.4, this.Radius[1]*1.6);
				rect(this.Radius[0]*0.4, 0, this.Radius[0]*0.4, this.Radius[1]*1.6);
			} else {
				triangle(this.Radius[0]*0.7, 0, -this.Radius[0]*0.7, -this.Radius[1]*0.8, -this.Radius[0]*0.7, this.Radius[1]*0.8);
			}
			
		} else if (this.Type == 'rand') {
			beginShape();
			vertex(-this.Size[0]*0.433, -this.Size[1]*0.25);
			vertex(0, -this.Size[1]*0.5);
			vertex(this.Size[0]*0.433, -this.Size[1]*0.25);
			vertex(this.Size[0]*0.433, this.Size[1]*0.25);
			vertex(0, this.Size[1]*0.5);
			vertex(-this.Size[0]*0.433, this.Size[1]*0.25);
			endShape(CLOSE);
			
			line(0, 0, -(this.Size[0]-this.Stroke)*0.433, -(this.Size[1]-this.Stroke)*0.25);
			line(0, 0, (this.Size[0]-this.Stroke)*0.433, -(this.Size[1]-this.Stroke)*0.25);
			line(0, 0, 0, (this.Size[1]-this.Stroke)*0.5);
			ellipse(0, -this.Size[1]*0.25,this.Size[0]*0.06, this.Size[1]*0.04);
			ellipse(-this.Size[0]*0.28, this.Size[1]*0.025,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(-this.Size[0]*0.15, this.Size[1]*0.2,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Size[0]*0.31, -this.Size[0]*0.015,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Size[0]*0.23, this.Size[1]*0.12,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Size[0]*0.14, this.Size[1]*0.26,this.Size[0]*0.03, this.Size[1]*0.05);
			
		} else if (this.Type == 'display_mode') {
			if (display_state == this.Value){
				fill(palette.front);
				stroke(palette.front);
			} else {
				fill(palette.medium);
				stroke(palette.medium);
			}
			strokeWeight(0);
			
			if (this.Value == 0) {
				let circ_rad = this.Size[0]*0.35;
				circle(circ_rad*1.3,circ_rad*0.9,circ_rad);
				circle(-1.3*circ_rad,0.2*circ_rad,circ_rad);
				circle(-0.2*circ_rad,-1.1*circ_rad,circ_rad);
				strokeWeight(circ_rad*0.3);
				line(0.3*circ_rad,-0.2*circ_rad,0.6*circ_rad,0.1*circ_rad);
				line(-0.3*circ_rad,0.4*circ_rad,0.3*circ_rad,0.6*circ_rad);
				line(-0.75*circ_rad,-0.4*circ_rad,-0.78*circ_rad,-0.43*circ_rad);

			} else if (this.Value == 1) {
				let circ_rad = this.Size[0]*0.4;
				for (let p = PI/2; p < PI*5/2; p+= TWO_PI/5){
					circle(cos(p)*circ_rad*1.2,-sin(p)*1.2*circ_rad,circ_rad);	
				}

			} else if (this.Value == 2) {
				for (let x = -0.3; x < 0.5; x += 0.6){
					for (let y = -0.3; y < 0.5; y += 0.6){
						rect(x*this.Size[0],y*this.Size[1],this.Size[0]*0.5,this.Size[1]*0.5,this.Size[0]*0.08);
					}
				}
			}
		
		} else if (this.Type == 'arrow_active'){
			let pick_color = palette.accent[this.Value];
			if (arrow_elements[this.Value] == -1){
				pick_color = lerpColor(pick_color, palette.back, 0.5);
			}
			noStroke();
			fill(pick_color);
			circle(0,0,this.Size[0]);
			
			if (this.Value == active_arrow){
				stroke(palette.front);
				strokeWeight(4);
				noFill();
				circle(0,0,this.Size[0]+12);
			}
			
		}
		
		pop();
	}
	
	clicked() {
		if(mouseX > this.Coords[0] + this.Radius[0] || mouseX < this.Coords[0] - this.Radius[0]){
			return;
		}
		action(this.Type,this.Value);
		
	}
}

class Box {
	constructor(coords,radius,pad,hide=false) {
		this.Items = [];
		this.Radius = radius;
		this.Coords = coords;
		this.UpperLeft = [this.Coords[0]-this.Radius[0],this.Coords[1]-this.Radius[1]];
		this.LowerRight = [this.Coords[0]+this.Radius[0],this.Coords[1]+this.Radius[1]];
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
			var update_coords = [this.Coords[0],this.Coords[1] + this.Radius[1]*(run_vol/volume-1)];
			run_vol += item.Volume;
			var update_radius = [this.Radius[0]*rad_adjust,this.Radius[1]*item.Volume/volume];
			item.update(update_coords,update_radius);
		}
		
	}
	show(){
		if (this.Active == 1){
			
			if (!this.Hide){
				fill(palette.backlight);
				rect(this.Coords[0],this.Coords[1],this.Radius[0]*2+this.Pad,this.Radius[1]*2+this.Pad,this.Pad*1.6);
				fill(palette.back);
				rect(this.Coords[0],this.Coords[1],this.Radius[0]*2,this.Radius[1]*2,this.Pad*1.2);
				
			}
			
			for (var item of this.Items){
				item.show();
			}
		}
	}
	clicked(){
		if (this.mouseInside() == 1){
		
			for (let item of this.Items){
				if(mouseY < item.Coords[1] + item.Radius[1] && mouseY > item.Coords[1] - item.Radius[1]){
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
	
	getItem(searchId){
		for (var checkId = 0; checkId < this.Items.length; checkId++){
			if (searchId == this.Items[checkId].Id){return this.Items[checkId]}
		}
		return -1;
	}
	
	randomize(){
		for (let item of this.Items){
			item.randomize();
			//console.log(item.Id+"  "+G.length);
			// if (item.Id == 'arrow_active' && item.Index == 1){
			// 	return;
			// }
		}
	}
}

class arrowItem {
	constructor(volume,list,displaySize,id,arrow = -1,index = 0,color = -1) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = index;
		this.Size = displaySize*0.5;
		this.TextSize = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'arrow';
		this.Color = color;
		this.Arrow = arrow;
	}
	show(){
		if (this.Active){give_fill(this.Color);} else {fill(palette.backlight);}
		//textSize(this.TextSize);
		if (this.Id == 'arrow_element'){textFont(safeFont);}
		//text(this.List[this.Index],this.Coords[0],this.Coords[1]);//,this.Radius[0]-this.Size*2);
		text_limited(this.List[this.Index],this.Coords[0],this.Coords[1],this.TextSize,this.Radius[0]*2-this.Size*6);
		textFont(mainFont);
		
		if (this.List.length > 1){
			triangle(this.Sides[0]-this.Size,this.Coords[1],this.Sides[0],this.Coords[1]-this.Size*0.5,this.Sides[0],this.Coords[1]+this.Size*0.5);
			triangle(this.Sides[1]+this.Size,this.Coords[1],this.Sides[1],this.Coords[1]-this.Size*0.5,this.Sides[1],this.Coords[1]+this.Size*0.5);
		}
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
			action(this.Id,this.Index,this.List[this.Index],this.Arrow);
		}
	}
	randomize(){
		if (this.Id == 'arrow'){return;}
		this.giveValue(int(random(this.List.length)));
	}
}

class textItem {
	constructor(volume,displayText,displaySize,id = '',link = '') {
		this.Volume = volume;
		this.Coords = [0,0]; 
		this.DisplayText = displayText;
		this.Size = displaySize;
		this.Radius = [0,0];
		this.Id = id;
		this.Type = 'text';
		this.Link = link;
	}
	show(){
		if (this.Active == false){fill(palette.backlight);}
		else if (this.Link == ''){fill(palette.front);}
		else{fill(palette.mono);}
		textSize(this.Size);
		text(this.DisplayText,this.Coords[0],this.Coords[1]);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
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
		this.button.size(this.Radius[0]*2, this.Radius[1]*2);
		this.button.position(this.Coords[0]-this.Radius[0],this.Coords[1]-this.Radius[1]);
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
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = index;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'binary';
		this.Arrow = arrow;
	}
	show(){
		
		fill(palette.front);
		rect(this.Sides[this.Index],this.Coords[1],this.Radius[0]*0.8,this.Radius[1]*1.8,this.Size*0.5);
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
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.Value = value;
		this.Range = range;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'slider';
		this.Arrow = arrow;
	}
	show(){
		
		fill(palette.backlight);
		rect(this.Coords[0],this.Coords[1]-0.2*this.Radius[1],this.Radius[0]*1.6,this.Radius[1]*0.4);
		if (this.Active){fill(palette.front);} else {fill(palette.backlight);}
		var point_x  = this.Coords[0] + this.Radius[0]*(1.6*(this.Value - this.Range[0])/(this.Range[1] - this.Range[0]) - 0.8);
		circle(point_x,this.Coords[1]-0.2*this.Radius[1],this.Radius[1]);
		textSize(this.Size);
		var slider_text = str(round(this.Value,2));
		if (this.Id == 'Radius'){
			slider_text = str(round(2**this.Value,2))
		}
		text(slider_text,point_x,this.Coords[1]+this.Radius[1]);
	}
	update(coords,radius){
		this.Coords = coords;
		this.Radius = radius;
		this.Sides = [this.Coords[0]-this.Radius[0]*0.5,this.Coords[0]+this.Radius[0]*0.5];
	}
	clicked(){
		if (this.Active){
			dragging = 'slider';
			this.giveValue(min(max(((mouseX - this.Coords[0])/this.Radius[0] + 0.8)*(this.Range[1] - this.Range[0])/1.6 + this.Range[0],this.Range[0]),this.Range[1]));
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