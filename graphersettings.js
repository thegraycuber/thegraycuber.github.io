class Settings {
	constructor(px) {
		this.point_count = 360;
		this.radius = 1;
		this.px = px;
		this.shift = [0,0];
		this.hpower = 0;
		this.vertices = 5;
		this.step = 1;
		this.rotation = [1,0];
		this.animate = 'Off';
		this.animate_val = 0;
		this.animate_ratio = 1;
		this.radii = [1,1.570796326,2,2.7182818284,3,3.1415926535,4,4.7123889803,5,6.283185307,0.2,0.25,0.33333333333,0.3678794411,0.5];
		this.radius_range = [-4,4]
		this.exponent = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
		this.display = [windowWidth/2+px*5.6,windowHeight/2-px*3.75];
		this.display_jump = 0;
		for (var exp_ten = 1; exp_ten < 10; exp_ten++){
			for (var exp_unit = 0; exp_unit < 10; exp_unit++){
				this.exponent.push(this.exponent[exp_ten]+this.exponent[exp_unit]);
			}
		}
		this.subscript = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
		for (var sub_ten = 1; sub_ten < 10; sub_ten++){
			for (var sub_unit = 0; sub_unit < 10; sub_unit++){
				this.subscript.push(this.subscript[sub_ten]+this.subscript[sub_unit]);
			}
		}
		this.gridlines = [];
		this.labels = [];
		this.ShowGrid = 0;
		this.custom_input = createInput('');
		this.custom_input.hide();
		this.custom = false;
		
	}
	
	arrowClick(id,listIndex,listValue){
	
		
		var step_index = menuBox.getIndex('Step');
		var rot_index = menuBox.getIndex('Rotation');
		var rad_index = menuBox.getIndex('Radius');
		var seq_index = menuBox.getIndex('Sequence');
		
		if (id == '='){
			menuBox.Active = listIndex;
			this.custom_input.hide();
			if (listIndex == 1 && menuBox.Items[menuBox.getIndex('Function')].List[menuBox.Items[menuBox.getIndex('Function')].Index] == 'Custom'){
				this.custom_input.show();
			}
			
		} else if (id == 'Shape'){

			if (listIndex == 0){
				menuBox.Items[step_index].Index = 0;
				menuBox.Items[step_index].Active = false;
				
			} else {
				menuBox.Items[step_index].List = [];
				for (var vertice_count = 1; vertice_count < 1+listIndex/2; vertice_count++){
					if (gcd(listIndex+1,vertice_count)==1){
						menuBox.Items[step_index].List.push(str(vertice_count));
					}
				}
				menuBox.Items[step_index].Active = true;
				while (menuBox.Items[step_index].Index >= menuBox.Items[step_index].List.length){
					menuBox.Items[step_index].Index -= 1;
				}
				this.step = int(menuBox.Items[step_index].List[menuBox.Items[step_index].Index]);
			}
			
			this.vertices = listIndex + 1
			points = make_points();
			
			
    } else if (id == 'Step'){
			this.step = int(listValue);
			points = make_points();
			
    } else if (id == 'Input'){
			this.display_jump = 0;
			
    } else if (id == 'Function'){
			
			if (listValue == 'Custom'){
				this.custom = true;
				menuBox.Items[seq_index].Active = false;
				this.custom_input.position(menuBox.Items[seq_index].Coords[0]-menuBox.Items[seq_index].Radius[0]*0.76,menuBox.Items[seq_index].Coords[1]);
				this.custom_input.size(menuBox.Items[seq_index].Radius[0]*1.5,menuBox.Items[seq_index].Radius[1]*1.6);
				this.custom_input.show();
			} else {
				this.custom = false;
				this.custom_input.hide();
				menuBox.Items[seq_index].Active = true;
			}
			make_polylist(listValue,40);
			
    } else if (id == 'Sequence'){
			polyidx = listIndex;
			
    } else if (id == 'Radius'){
			this.radius = this.radii[listIndex];
			
    } else if (id == 'Zoom'){
			if (listValue == 'Auto'){
				this.hpower = 0;
				h = h_factor;
			} else {
				this.hpower = log(h/h_factor)/log(2);
			}
		} else if (id == 'Gridlines'){
			this.ShowGrid = listIndex;
			
		} else if (id == 'Rotation'){
			this.rotation = [cos(listIndex),sin(listIndex)];
			points = make_points();
			
		} else if (id == 'Color'){
			palette.getColors(listValue);
			
		} else if (id == 'Resolution'){
			this.point_count = int(listValue);
			points = make_points();
			
		} else if (id == 'Animate'){
			this.animate = listValue;
			this.animate_ratio = 1;
			this.point_range = [0,points.length+1];
			settings.display_jump = 0;
			
			menuBox.Items[rad_index].Active = true;
			this.radius = this.radii[menuBox.Items[rad_index].Index];
			
			menuBox.Items[seq_index].Active = true;
			menuBox.Items[rot_index].Active = true;
	
			
			if (listValue == 'Radius'){
				menuBox.Items[rad_index].Active = false;
				this.animate_val = acos((log(this.radii[menuBox.Items[rad_index].Index])/log(2) - this.radius_range[0])/(this.radius_range[1] - this.radius_range[0]));
			} else if (listValue == 'Rotation'){
				menuBox.Items[rot_index].Active = false;
				this.animate_val = (menuBox.Items[rot_index].Value - menuBox.Items[rot_index].Range[0])/(menuBox.Items[rot_index].Range[1] - menuBox.Items[rot_index].Range[0]);
			} else if (listValue == 'Trace'){
				this.animate_val = 0;
			} else if (listValue == 'Function'){
				menuBox.Items[seq_index].Active = false;
				this.animate_val = 0;
			}
			
		}
		
	
	}
	
	makeGrid(){
		
		this.gridlines = [];
		this.labels = [];
		
		var h_pre = h*4/9;
		var h_log = floor(log(h_pre)/log(10));
		h_pre = floor(h_pre/(10**h_log));
		if (h_pre >= 5){
			h_pre = 5;
		} else if (h_pre > 2){
			h_pre = 2;
		} 
		var h_div = h_pre*(10**h_log);
		
		for (var i = -4; i <= 4; i++) {
			var vert_coords = ztoCoords([i*h_div,0]);
			if (vert_coords[0] <= windowWidth/2 + this.px*8 && vert_coords[0] >= windowWidth/2 - this.px*8){
				this.gridlines.push([vert_coords[0],vert_coords[1],this.px*0.05,this.px*9]);
				if (h_log>6 && i != 0){
					this.labels.push([vert_coords[0]+settings.px*0.1,vert_coords[1]+settings.px*0.3,str(i*h_pre)+'e'+str(h_log)]);
				} else {
					this.labels.push([vert_coords[0]+settings.px*0.1,vert_coords[1]+settings.px*0.3,str(round(i*h_div,max(-h_log,0)))]);
				}
			}
			
			var hor_coords = ztoCoords([0,i*h_div]);
			if (hor_coords[1] <= windowHeight/2 + this.px*4.5 && hor_coords[1] >= windowHeight/2 - this.px*4.5){
				this.gridlines.push([hor_coords[0],hor_coords[1],this.px*16,this.px*0.05]);
				if (h_log>6 && i != 0) {
					this.labels.push([hor_coords[0]+settings.px*0.1,hor_coords[1]+settings.px*0.3,str(i*h_pre)+'e'+str(h_log)+'i']);
				} else { 
					var i_str = ';'+str(round(i*h_div,max(-h_log,0)))+'i';
					i_str = i_str.replace(';0i','').replace(';1i','i').replace(';-1i','-i').replace(';','')
					this.labels.push([hor_coords[0]+settings.px*0.1,hor_coords[1]+settings.px*0.3,i_str]);
				}

			}
			
		}
	}
	
	
}