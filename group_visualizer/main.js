
function draw() {
	
	background(palette.back);
	translate(origin.x,origin.y);
	scale(scalar,scalar);
	
	if (display_state != 2){

		if (display_state == 0){
			update_physics();	
		} else {
			inner_outer('auto');
		}

		onlyStroke(palette.front,0.2);
		for (var a = arrow_elements.length -1; a > -1 ; a--){
			if (arrow_elements[a] != -1){
				stroke(palette.accent[a]);
				G[arrow_elements[a]].arrows(arrow_types[a]);
			}
		}
		for (var e of G){
			e.display();
		}
		resetMatrix();


		mouseVec = pixel_to_principal(createVector(mouseX,mouseY));
		for (let el of G){
			el.isWithin(mouseVec);
		}

	} else {
		show_table();
	}

	if (to_download){
		to_download = false;
		save("Group_Visualizer_" + now_string() + ".png");
	}

	resetMatrix();
	settingBox.show();
	arrowBoxes[active_arrow].show();
	iconBox.show();
	arrowBox.show();
	displayBox.show();
	
	
	if (active_element > -1){
		G[active_element].pos = pixel_to_principal(createVector(mouseX,mouseY));
	}
	
}


function core_color_custom(plt){
		plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),200);
		plt.dark = color(int(red(plt.back)*0.75),int(green(plt.back)*0.75),int(blue(plt.back)*0.75));
		plt.medium = lerpColor(plt.back,plt.front,0.3);
		plt.accent0 = plt.accent[0];
		plt.accent1 = plt.accent[1];
		plt.accent2 = plt.accent[2];
}


function core_icon_custom(icon_object, icon_color){
	
	if (icon_object.Id == 'display_mode'){

		if (display_state == icon_object.Type){
			fill(palette.front);
			stroke(palette.front);
		} else {
			fill(palette.medium);
			stroke(palette.medium);
		}
		strokeWeight(0);
		
		if (icon_object.Type == 0) {
			let circ_rad = icon_object.Size[0]*0.18;
			circle(circ_rad*1.3,circ_rad*0.9,circ_rad);
			circle(-1.3*circ_rad,0.2*circ_rad,circ_rad);
			circle(-0.2*circ_rad,-1.1*circ_rad,circ_rad);
			strokeWeight(circ_rad*0.3);
			line(0.3*circ_rad,-0.2*circ_rad,0.6*circ_rad,0.1*circ_rad);
			line(-0.3*circ_rad,0.4*circ_rad,0.3*circ_rad,0.6*circ_rad);
			line(-0.75*circ_rad,-0.4*circ_rad,-0.78*circ_rad,-0.43*circ_rad);

		} else if (icon_object.Type == 1) {
			let circ_rad = icon_object.Size[0]*0.2;
			for (let p = PI/2; p < PI*5/2; p+= TWO_PI/5){
				circle(cos(p)*circ_rad*1.2,-sin(p)*1.2*circ_rad,circ_rad);	
			}

		} else if (icon_object.Type == 2) {
			for (let x = -0.15; x < 0.25; x += 0.3){
				for (let y = -0.15; y < 0.25; y += 0.3){
					rect(x*icon_object.Size[0],y*icon_object.Size[1],icon_object.Size[0]*0.25,icon_object.Size[1]*0.25,icon_object.Size[0]*0.04);
				}
			}
		}
		
	} else if (icon_object.Id == 'arrow_active'){

		let pick_color = palette[icon_object.Color];
		if (arrow_elements[icon_object.Type] == -1){
			pick_color = lerpColor(pick_color, palette.back, 0.5);
		}
		onlyFill(pick_color);
		circle(0,0,icon_object.Size[0]/2);
		
		if (icon_object.Type == active_arrow){
			onlyStroke(palette.front,4);
			circle(0,0,icon_object.Size[0]/2+12);
		}
		
	} else {
		onlyFill(icon_color);
		rect(0,0,icon_object.Size[0]/2,icon_object.Size[1]/2);
	}
}


function check_play(){
	if(movement){
		return 'pause';
	} else {
		return 'play';
	}
}
