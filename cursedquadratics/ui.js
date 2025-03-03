class Box {
	constructor(coords,radius,pad) {
		this.Items = [];
		this.Radius = radius;
		this.Coords = coords;
		this.UpperLeft = [this.Coords[0]-this.Radius[0],this.Coords[1]-this.Radius[1]];
		this.LowerRight = [this.Coords[0]+this.Radius[0],this.Coords[1]+this.Radius[1]];
		this.Pad = pad;
		this.Active = 1;
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
	show(){
		if (this.Active == 1){
			fill(palette.backlight);
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
				if(mouseY < item.Coords[1] + item.Radius[1] && mouseY > item.Coords[1] - item.Radius[1]){
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
	constructor(volume,list,displaySize,id,shape = -1,index = 0,color = -1) {
		this.Volume = volume;
		this.Coords = [0,0];
		this.Radius = [0,0];
		this.Sides = [0,0];
		this.List = list;
		this.Index = index;
		this.Size = displaySize;
		this.Id = id;
		this.Active = true;
		this.Type = 'arrow';
		this.Color = color;
		this.Shape = shape;
	}
	show(){
		if (this.Id == 'Sequence' && settings.custom){return;}
		if (this.Active){give_fill(this.Color);} else {fill(palette.backlight);}
		textSize(this.Size);
		text(this.List[this.Index],this.Coords[0],this.Coords[1]);
		
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
			action(this.Id,this.Index,this.List[this.Index],this.Shape);
		}
	}
	randomize(){
		this.giveValue(int(random(this.List.length)));
	}
	tryGive(try_str){
		for (var l_idx = 0; l_idx < this.List.length; l_idx++){
			if (this.List[l_idx].substring(0,3) == try_str){
				this.giveValue(l_idx);
				return true;
			}
		}
		return false;
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
		if (this.Link == ''){fill(palette.front);}
		else{fill(palette.link);}
		textSize(this.Size);
		text(this.DisplayText,this.Coords[0],this.Coords[1]);
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
	constructor(volume,list,displaySize,id,index,shape = -1) {
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
		this.Shape = shape;
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
			action(this.Id,this.Index,this.List[this.Index],this.Shape);
		}
	}
	randomize(){
		this.giveValue(int(random(2)));
	}
	tryGive(try_str){
		for (var l_idx = 0; l_idx < this.List.length; l_idx++){
			if (this.List[l_idx].substring(0,3) == try_str){
				this.giveValue(l_idx);
				return true;
			}
		}
		return false;
	}
}


class Grid{
	constructor(x_min,y_min,x_max,y_max){
		this.grid_min = createVector(x_min,y_min);
		this.grid_max = createVector(x_max,y_max);
		this.wid = createVector(abs(x_max-x_min),abs(y_max-y_min));
		this.mid = createVector(0.5*(x_max+x_min),0.5*(y_max+y_min));
	}
	
	draw_grid(){
		
		var min_prin = pixel_to_principal(this.grid_min.copy());
		var max_prin = pixel_to_principal(this.grid_max.copy());
		var scale = min(max_prin.x-min_prin.x,max_prin.y-min_prin.y)/6;
		var scale_log = floor(log(scale)/log(10))
		var scale_mag = 10**scale_log;
		var scale_val = scale/scale_mag;
		if (scale_val > 5){
			scale = scale_mag*10;
			scale_log += 1;
		} else if (scale_val > 2){
			scale = scale_mag*5;
		} else {
			scale = scale_mag * 2;
		}
		scale_log = max(0,-scale_log);

		fill(palette.backlight);
		textSize(circle_width*6);

		var pixels = scale*scalar;

		var x_value = floor(max_prin.x/scale)*scale;
		var x_line = x_value*scalar+origin.x;
		var y_value = floor(max_prin.y/scale)*scale;
		var y_line = -y_value*scalar+origin.y;
		var y_label, x_label, skip_y;

		if (min_prin.y < 0 && max_prin.y > 0){
			y_label = origin.y;
		} else {
			y_label = y_line;
		}
		if (min_prin.x < 0 && max_prin.x > 0){
			x_label = origin.x;
		} else {
			x_label = x_line;
		}

		while (x_line > this.grid_min.x){
			rect(x_line,this.mid.y,circle_width*0.75,this.wid.y);
			var x_text = round(x_value,scale_log);
			text(x_text,x_line-circle_width*2-textWidth(x_text)/2,y_label+circle_width*4);
			x_line -= pixels;
			x_value -= scale;
		}
		
		while (y_line < this.grid_min.y){
			rect(this.mid.x,y_line,this.wid.x,circle_width*0.75);
			if (y_line != y_label){
				var y_text;
				if (y_value == 1){
					y_text = 'i';
				} else if (y_value == -1){
					y_text = '-i';
				} else if (y_value == 0){
					y_text = '0';
				} else {
					y_text = str(round(y_value,scale_log)) + 'i';
				}
				text(y_text,x_label-circle_width*2-textWidth(y_text)/2,y_line+circle_width*4);
			}
			y_line += pixels;
			y_value -= scale;
		}
		
	}

}

