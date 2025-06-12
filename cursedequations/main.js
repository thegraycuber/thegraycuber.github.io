var showgrid = false;
var process = true;

function draw() {
	
	background(palette.back);

	for (var s = 0; s < 3; s++){
		var anim = shapeBox[s].Items[shapeBox[s].getIndex('animation')].List[shapeBox[s].Items[shapeBox[s].getIndex('animation')].Index];
		if (anim == 'Rotate'){
			shapes[s].rotate(rotation_angle[s]);
		} else if (anim == 'Radius'){
			shapes[s].radius_theta += rotation_angle[s]*2;
			shapes[s].radius = 2**(sin(shapes[s].radius_theta)*2);
			process = true;
		} else if (anim == 'Translate'){
			shapes[s].trans_ang += 2.23*rotation_angle[s];
			shapes[s].trans_rad_ang += 3.07*rotation_angle[s];
			process = true;
		}
	}
	
	
	if (process){
		output = [[],[]];
		output_vertices = [];
		funk_prep();
		new_max_mag = 0;
		
		if (active_funk == 0){
			quadratic();
		} else if (active_funk == 1){
			pythag();
		} else if (active_funk == 2){
			pythag_3d();
		}
		
		update_max_mag(); 
		process = false;
	}
	
	if (show_grid){
		grid.draw_grid();
	}

	var out, o;
	fill(palette.front);
	for (out of output){
		for (o = 0; o < out.length; o++){
			if (show_vertices == false || output_vertices[o] == -1){
				circle(origin.x+out[o][0]*scalar,origin.y-out[o][1]*scalar,circle_width);
			}
		}
	}
	
	if (show_vertices){
		for (var sidx = 2; sidx > -1; sidx--){
			for (out of output){
				for (o = 0; o < out.length; o++){
					if (output_vertices[o] == sidx){
						fill(palette.accent[sidx]);
						circle(origin.x+out[o][0]*scalar,origin.y-out[o][1]*scalar,vert_width);
					}
				}
			}
		}
	}

	if (show_stuff){
		settingBox.show();
		shapeBox[activeShape].show();
		iconBox.show();
	
	}

	if (show_label){
		textFont(atkinsonRegular);
		labelBox.show();
		fill(palette.back);
		strokeWeight(shape_size*0.12);
		for (var sh = 0; sh < funk_shapes[active_funk]; sh++){
			stroke(palette.accent[sh]);
			shapes[sh].display(shape_locs[active_funk][sh],shape_size);
		}
		textFont(atkinsonBold);
	}
	
	
	stroke(palette.back);
	if (at_ticker > 0){
		fill(palette.front);
		textSize(at_location.z);
		text(at_text.substring(0,at_ticker),at_location.x,at_location.y);
		at_ticker--;
	}
	
	if (pasting){
		background(palette.backalpha);
	}
	
	if (invalid_text.length > 0){
		textSize(unit*0.16);
		strokeWeight(unit*0.05);
		fill(palette.accent[2]);
		text(invalid_text,default_origin.x,default_origin.y);
		invalid_tick--;
		if (invalid_tick == 0){
			invalid_text = "";
		}
	}
	noStroke();
	
}


show_stuff = true;
function keyPressed() {
	if (keyCode === 32 && mobile == false){
		show_stuff = !show_stuff;
	}
}