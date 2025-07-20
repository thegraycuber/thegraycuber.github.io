
//var show_stuff = true;

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

		noFill();
		strokeWeight(0.2);
		stroke(palette.front);
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