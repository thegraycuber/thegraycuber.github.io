var showgrid = false;
var process = true;
var spin_shape = true;

function draw() {
	
	if (i_dragging){
		let round_add = 2;
		if (keyIsDown(32)){round_add = 1;}
		ideal = [round((mouseX-origin.x)/scalar,scale_log+round_add), round(-(mouseY-origin.y)/scalar,scale_log+round_add)];
		
		if (game_mode){
			ideal = [constrain(ideal[0],-1,1),constrain(ideal[1],-1,1)];
		}
	}
	idealBox.Items[0].DisplayText = 'i² =' + text_2d(ideal,'i');
	
	if (spin_shape){
		let res_angle = PI/360;
		
		
		rotation_angle = (res_angle+rotation_angle)%TWO_PI;
		shape.rotate(res_angle);
		if (game_mode){
			target_shape.rotate(res_angle);
		}
		
	}
	
	
	background(palette.back);
	grid.draw_grid();

		
	push();
	translate(origin.x, origin.y);
	scale(scalar,scalar);
	
	if (!game_mode){
		// dual ideal parabola
		stroke(palette.medium);
		strokeWeight(0.6*circle_width/scalar);
		noFill();
		beginShape();
		for (let y = 0; y < height+25; y+= 20){
			let b = (y-origin.y)/scalar;
			let a = -(b**2)/4;
			vertex(a,b);
		}
		endShape();
	}
	
	// noStroke();
	// fill(palette.front);
	if (game_mode && win_tracker == 0){
			
		if (target_shape.vertices == shape.vertices && target_shape.step == shape.step && target_shape.type == shape.type){
			if (polynomial == target_polynomial && round(ideal[0],1) == round(target_ideal[0],1) && round(ideal[1],1) == round(target_ideal[1],1)){
				win_tracker = 0.001;
				i_dragging = false;
			}
		}
			target_shape.display_output(palette.medium, palette.medium, target_ideal, function_list[target_polynomial][3]);	
	}
	
	
	if (win_tracker > 0){
		win_tracker += 0.3;		
		ideal = [...target_ideal];
		target_shape.display_output(palette.bright, palette.bright, target_ideal, function_list[target_polynomial][3], 1 + 2*sin(win_tracker));

		if (win_tracker >= PI){
			level++;
			if (level == 12){
				win_time = millis() - start_time;
				win_tracker = -1;
				has_won = 1;
			} else {
				new_target();
			}
		}
		
	} else if (win_tracker < 0){
		ideal = [...target_ideal];
		i_dragging = false;
		target_shape.display_output(palette.bright, palette.bright, target_ideal, function_list[target_polynomial][3]);
		
	} else {
		
		shape.display_output(palette.front, palette.vertices, ideal, function_list[polynomial][3]);
	}
	
	strokeWeight(vert_width*0.15/scalar);
	stroke(palette.back);
	fill(palette.i);
	circle(ideal[0], -ideal[1], vert_width*1.75/scalar);
	
	textSize(1.4*vert_width/scalar);
	noStroke();
	fill(palette.back);
	text('i²', ideal[0], -ideal[1]);	
	pop();
	
	
	
	shapeBox.show();
	iconBox.show();
	idealBox.show();
	labelBox.show();

	noStroke();
	fill(palette.mono);
	shape.display([labelBox.Coords[0]+function_list[polynomial][2]*shape_size,labelBox.Coords[1]], shape_size);
	
	display_messages();

}


// show_stuff = true;
// function keyPressed() {
// 	if (keyCode === 32 && mobile == false){
// 		show_stuff = !show_stuff;
// 	}
// 	tgc_next_slide();
// }