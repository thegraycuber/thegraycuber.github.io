
function ideal_location(mobile_location){
	if (mobile_location){
		let idl_adj = scalar/unit*0.4;
		return [ideal[0]*idl_adj*mobileBox.Size[0]+mobileBox.Coords[0], -ideal[1]*idl_adj*mobileBox.Size[1]+mobileBox.Coords[1]];
	} else {
		return [ideal[0]*scalar+origin.x, -ideal[1]*scalar+origin.y];
	}
}

function core_color_custom(plt){
	plt.medium = lerpColor(plt.accent[1],plt.back,0.6);
	plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),150);
	plt.link = plt.mono;
	
	if (['Electric','Pastel','Paper'].includes(plt.scheme)){
		plt.i = plt.red;
		plt.vertices = plt.bright;
	} else {
		plt.i = plt.bright;
		plt.vertices = plt.red;
	}
}

function core_icon_custom(icon_object, icon_color){
	
	if (icon_object.Id == 'spin'){
		push();
		rotate(-0.2);
		onlyStroke(icon_color,icon_object.Size[0]*0.08);
		drawTri(-icon_object.Size[0]*0.15,0,-icon_object.Size[0]*0.35);
		
		if (!spin_shape){
			icon_color = lerpColor(icon_color,palette.back,0.5);
		}
		onlyStroke(icon_color,icon_object.Size[0]*0.06);
		arc(icon_object.Size[0]*0.05,0,icon_object.Size[0],icon_object.Size[0],-0.4,0.5);
		
		translate(icon_object.Size[0]*0.5*cos(-0.35),icon_object.Size[0]*0.5*sin(-0.35));
		rotate(2);
		onlyFill(icon_color);
		drawTri(0,0,icon_object.Size[0]*0.1);
		pop();
	} else {
		onlyFill(icon_color);
		rect(0,0,icon_object.Size[0],icon_object.Size[1]);
	}
}

function i_mult(c_a,c_b,p_ideal){
	return [c_a[0]*c_b[0]+c_a[1]*c_b[1]*p_ideal[0],c_a[0]*c_b[1]+c_a[1]*c_b[0]+c_a[1]*c_b[1]*p_ideal[1]];
}

function randomize(avoidance){
	mag_lerp = 0;
	for (var mi of main_items){
		mi.randomize();
		// while(mi.Id == 'function' && [0,function_list.length-2].includes(polynomial)){
		// 	mi.randomize();
		// }
		if (avoidance && level >= 5){
			while(mi.Id == 'function' && polynomial == target_polynomial){
				mi.randomize();
			}
		}
		if (avoidance && level >= 9){
			while(mi.Id == 'vertices' && target_shape.vertices == shape.vertices){
				mi.randomize();
			}
		}
	}
	ideal = [round(random()*2-1,scale_log+2),round(random()*2-1,scale_log+2)];
}

function action(id,index,value){
	
	if (id == 'vertices'){
		
		var step_item = shapeBox.getItem('step');
		step_item.Active = true;
		
		var step = int(step_item.List[step_item.Index].substring(0,1));
		step_item.List = allowed_laps(index_to_verts[index]);
		if (step > 0){
			step_item.Index = step_item.List.length-1;
			while(int(step_item.List[step_item.Index].substring(0,1)) > step){
				step_item.Index--;
			}
		} else {
			step_item.Index = 0;
			while(int(step_item.List[step_item.Index].substring(0,1)) < step){
				step_item.Index++;
			}
		}
		if (step_item.List.length == 1){
			step_item.Active = false;
		}
		
		var type_item = shapeBox.getItem('type');
		type_item.Active = true;
		if (index_to_verts[index] > 0){
			type_item.List = ['regular','flower','wiggle','smooth'];
		} else {
			type_item.List = ['regular'];
			type_item.giveValue(0);
			type_item.Active = false;
		}
		shape = new Shape(index_to_verts[index], int(step_item.List[step_item.Index].substring(0,1)), type_item.List[type_item.Index]);

	} else if (id == 'step'){
	
		shape = new Shape(shape.vertices,int(value.substring(0,1)),shape.type);
		
	} else if (id == 'play'){
	
		level = 0;
		game_mode = !game_mode;
		if (game_mode){
			start_time = millis();
			new_target();
			scalar = unit;
			origin = default_origin.copy();
			spin_shape = true;
			
			for (let mi of main_items){
				mi.Active = false;
			}
			
			iconBox.getItem('random').Active = false;
			iconBox.getItem('spin').Active = false;
			iconBox.getItem('reset').Active = false;	
			
		} else {
			
			win_tracker = 0;
			randomize();
			for (let mi of main_items){
				mi.Active = true;
			}
			iconBox.getItem('random').Active = true;
			iconBox.getItem('spin').Active = true;
			iconBox.getItem('reset').Active = true;
		
		}
		
	} else if (id == 'type'){
		
		shape = new Shape(shape.vertices,shape.step,value);
		
	} else if (id == 'resoution'){
		resolution = resolutions[index];
		shape = new Shape(shape.vertices,shape.step,shape.type);
		if (game_mode){
			target_shape = new Shape(target_shape.vertices,target_shape.step,target_shape.type);
		}
		
	} else if (id == 'function'){
		let funk_i = 0;
		while (function_list[funk_i][0] != value){
			funk_i++;
		}
		labelBox.Items[0].DisplayText = function_list[funk_i][1];
		polynomial = funk_i;
		
	} else if (id == 'reset'){	
		
		origin = default_origin.copy();
		scalar = unit;
		ideal = [-1,0];
		iconBox.getItem('reset').Active = false;
		
	} else if (id == 'palette'){	
		
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		
	} else if (id == 'spin'){	
		
		spin_shape = !spin_shape;
		
	} else if (id == 'restart'){
		game_mode = false;
		action('play',0,0);
		
	} else if (id == 'exit'){
		action('play',0,0);
		
	} else if (id == 'free play'){
		level = 100;
		new_target();
		
	} else if (id == 'random'){	
		randomize();
		
	} 
}

var lap_text = ['','1 lap','2 laps','3 laps','4 laps','5 laps','6 laps'];
function allowed_laps(vertices){
	
	steps = [];
	var step;
	
	if (vertices == -1 || vertices == 0){
		return ['1 lap']; 
		
	} else if (vertices == -2){
		for (step = 1; step <= 3; step++){
				steps.push(lap_text[step]);	
		}
		
	} else {
		for (step = 1; step < vertices/2; step++){
			if (step != 0 && gcd(vertices,abs(step)) == 1){
				steps.push(lap_text[step]);
			}
		}
	}
	return steps;
	
}


var scale_log = 0; 
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
		scale_log = floor(log(scale)/log(10))
		var scale_mag = 10**scale_log;
		var scale_val = scale/scale_mag;
		if (scale_val > 3.5){
			scale = scale_mag*10;
			scale_log += 1;
		} else {
			scale = scale_mag*3;
		} /*else if (scale_val > 2){
			scale = scale_mag*5;
		} else {
			scale = scale_mag * 2;
		}*/
		scale_log = max(0,-scale_log);

		fill(palette.medium);
		textSize(circle_width*4);

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
			rect(x_line,this.mid.y,circle_width*0.5,this.wid.y);
			var x_text = round(x_value,scale_log);
			text(x_text,x_line-circle_width-textWidth(x_text)/2,y_label+circle_width*2.5);
			x_line -= pixels;
			x_value -= scale;
		}
		
		while (y_line < this.grid_min.y){
			rect(this.mid.x,y_line,this.wid.x,circle_width*0.5);
			if (y_line != y_label){
				var y_text = text_2d([0,round(y_value,scale_log)],'i');
				text(y_text,x_label-circle_width-textWidth(y_text)/2,y_line+circle_width*2.5);
			}
			y_line += pixels;
			y_value -= scale;
		}
		
	}

}

function check_play(){
	if(game_mode){
		return 'stop';
	} else {
		return 'play';
	}
}
