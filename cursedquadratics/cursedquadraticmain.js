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
		}
	}
	
	
	if (process){
		quadratic();
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

	settingBox.show();
	shapeBox[activeShape].show();
	label.show();
	
	for (var sh = 0; sh < 3; sh++){
		fill(palette.accent[sh]);
		shapes[sh].display(shape_locs[sh],shape_size);
	}
	
}
