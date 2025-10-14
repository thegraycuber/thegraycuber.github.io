
var ideal = [-1,0];
var target_ideal, target_polynomial;
var level, start_time, level_start, win_time, win_tracker, game_icons;
var game_mode = false;
var has_won = 0;

var i_dragging = false;
var i_touched = false;
var bounce_angle = 0;

function display_messages(){
	bounce_angle += 0.1;
	let bounce = sin(bounce_angle)*0.1+1;
	
	if (!game_mode){
		if (!i_touched && millis() - start_time > 3000){
			text_in_box('drag me',ideal[0]*scalar+origin.x,-ideal[1]*scalar+origin.y-vert_width*2, bounce*vert_width, palette.i, palette.back);
		}
		return;
	}
	
	if (level > 0 && level < 12){
		text_in_box(str(level) + '/12', default_origin.x-height*0.06, height*0.04, height*0.03, palette.bright, palette.back);
		let elapsed = (millis() - start_time)/1000;
		let time_string = pre_zero(str(floor(elapsed/60))) + ':' + pre_zero(str(floor(elapsed)%60));
		text_in_box(time_string, default_origin.x+height*0.06, height*0.04, height*0.03, palette.bright, palette.back);
	} else if (level >= 100){
		text_in_box(str(level-100), width - (2+str(level-100).length)*height*0.02, height*0.06, height*0.05, palette.bright, palette.back);
	}
	
	if (level == 0){
		text_in_box('move i² to match the target shape', default_origin.x, height*0.05, height*0.03*bounce, palette.back, palette.bright);
		
	} else if (level == 5){
		let y_offset = lerp(default_origin.y,height*0.08,constrain((millis() - level_start)/2000-3,has_won,1));
		text_in_box('now you must also match the function', default_origin.x, y_offset, height*0.03*bounce, palette.back, palette.bright);
		
	} else if (level == 9){
		let y_offset = lerp(default_origin.y,height*0.08,constrain((millis() - level_start)/2000-3,has_won,1));
		text_in_box('now you must also match the input shape', default_origin.x, y_offset, height*0.03*bounce, palette.back, palette.bright);
		
	} else if (level == 12){
		text_in_box('you win!', default_origin.x, default_origin.y - height*0.13, height*0.06*bounce, palette.back, palette.bright);
		let elapsed = win_time/1000;
		let time_string = pre_zero(str(floor(elapsed/60))) + ':' + pre_zero(str(floor(elapsed)%60)) + '.' + pre_zero(str(floor((win_time)/10)%100));
		text_in_box(time_string,  default_origin.x, default_origin.y - height*0.01, height*0.06, palette.bright, palette.back);
		
		for (let gi of game_icons){
			gi.show();
		}
	}
	
}

function pre_zero(input_string){
	let with_zero = '0' + input_string;
	return with_zero.substring(with_zero.length-2,with_zero.length);
}




function new_target(){
	level_start = millis();
	win_tracker = 0;
	randomize();
	target_ideal = [...ideal];
	if (level >= 5 && level < 100){
		target_polynomial = polynomial;	
		shapeBox.getItem('function').Active = true;
	}
	if (level >= 9 && level < 100){
		target_shape = new Shape(shape.vertices, shape.step, shape.type);
		shapeBox.getItem('vertices').Active = true;
		shapeBox.getItem('step').Active = true;
		shapeBox.getItem('type').Active = true;
	}
	
	randomize(level < 100);
	if (level < 5 || level >= 100){
		target_polynomial = polynomial;
	}
	if (level < 9 || level >= 100){
		target_shape = new Shape(shape.vertices, shape.step, shape.type);
		shapeBox.getItem('vertices').Active = false;
		shapeBox.getItem('step').Active = false;
		shapeBox.getItem('type').Active = false;
	}
	
	while (abs(target_ideal[0]-ideal[0]) < 0.3 || abs(target_ideal[1]-ideal[1]) < 0.3){
		ideal = [round(random()*2-1,scale_log+2),round(random()*2-1,scale_log+2)];
	}
}