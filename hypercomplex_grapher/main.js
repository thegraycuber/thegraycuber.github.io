var showgrid = false;
var process = true;
var spin_shape = true;
//test
function draw() {
	
	if (i_dragging){
		let round_add = 2;
		if (keyIsDown(32) || touches.length == 2){round_add = 1;}
		if (mobile){
			let mX_cons = constrain(mouseX,mobileBox.Coords[0]-mobileBox.Size[0]*0.4,mobileBox.Coords[0]+mobileBox.Size[0]*0.4);
			let x_ideal = (mX_cons-mobileBox.Coords[0])*unit/(mobileBox.Size[0]*0.4)+default_origin.x-origin.x;
			let mY_cons = constrain(mouseY,mobileBox.Coords[1]-mobileBox.Size[1]*0.4,mobileBox.Coords[1]+mobileBox.Size[1]*0.4);
			let y_ideal = (mY_cons-mobileBox.Coords[1])*unit/(mobileBox.Size[1]*0.4)+default_origin.y-origin.y;
			ideal = [x_ideal/scalar,-y_ideal/scalar];
		} else {
			ideal = [(mouseX-origin.x)/scalar, -(mouseY-origin.y)/scalar,scale_log];
		}
		ideal = [round(ideal[0],scale_log+round_add),round(ideal[1],scale_log+round_add)]
		
		if (game_mode){
			ideal = [constrain(ideal[0],-1,1),constrain(ideal[1],-1,1)];
		}
	}
	idealBox.Items[0].DisplayText = 'i² =' + text_2d(ideal,'i');
	
	if (spin_shape && shape.vertices != 0){
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
		let prin_0 = 2*(abs(origin.x/scalar)**0.5);
		let rab_range = [max(-origin.y/scalar,-prin_0),min((height-origin.y)/scalar,prin_0)];
		let rab_step = (rab_range[1] - rab_range[0])/100;
		beginShape();
		for (let b = rab_range[0]; b < rab_range[1]+2*rab_step; b += rab_step){
			let a = -(b**2)/4;
			vertex(a,b);
		}
		endShape();
	}
	
	// noStroke();
	// fill(palette.front);
	if (game_mode && win_tracker == 0){
			
		if (target_shape.vertices == shape.vertices && target_shape.step == shape.step && target_shape.type == shape.type){
			if (polynomial == target_polynomial && abs(ideal[0]-target_ideal[0])<0.05 && abs(ideal[1]-target_ideal[1])< 0.05  ){
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
	pop();
	
	if (mobile){
		strokeWeight(vert_width*0.15);
		stroke(palette.back);
		fill(palette.i);
		let real_i_loc = ideal_location(false);
		circle(real_i_loc[0], real_i_loc[1], vert_width*1);
		onlyFill(palette.back);
		rect(default_origin.x,height-width*0.33,width,width*0.66);
		mobileBox.show();
	}

	let i_loc = ideal_location(mobile);
	strokeWeight(vert_width*0.15);
	stroke(palette.back);
	fill(palette.i);
	if (i_loc.length > 0){
		circle(i_loc[0], i_loc[1], vert_width*1.75);
	}
	if (i_loc.length > 0){
	  textSize(1.4*vert_width);
	  noStroke();
	  fill(palette.back);
	  text('i²', i_loc[0], i_loc[1]);	
	}
	
	
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