
var coord_scale = 4;
var coord_adjust = 1;
var origin; 
var c = 4; 

function pixel_to_principal(pixels){
	// principal = (pixel - origin)/c
	return pixels.sub(origin).div(c);
}

var in_a_box = false;

function touchStarted(){
	in_a_box = false;

	updateTouchInfo();

	if (mouseCheck()){
		in_a_box = in_a_box || menuBox.clicked();
		for (var icon of icons){
			in_a_box = in_a_box || icon.clicked();
		}
	} else {
		if (focus.substring(focus.length-7,focus.length) == 'Clicked'){
		
			clicked = -1;
			for (var bub_click of bubbles){
				if (pointDist(bub_click.x,bub_click.y,mouseLoc[0],mouseLoc[1])[2] < 400){
					clicked = bub_click.index;
					break;
				}
			}

			for (var bubby of bubbles){
				bubby.shade = true;
			}
			for (bubby of bubbles){
				bubby.checkShade();
			}
			for (bubby of bubbles){
				bubby.checkRep();
			}
		}
		
		if (mode == 'Click to Add' && clicked == -1){
			addBubble(mouseX,mouseY,false);
		}
	}
	
}

function touchEnded(){
	updateTouchInfo();
}

function touchMoved(event){
	event.preventDefault();
	if (!autozoom && !in_a_box){updateMovement();}
}


var principal_pos, principal_dist; // these track the values that should remain fixed by movement

function updateTouchInfo(){
	if (touches.length == 2){
		principal_dist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
	} 
	if (touches.length <= 2){
		principal_pos = pixel_to_principal(focus_point());
	}
}

function focus_point(){
	if (touches.length == 0){ // Desktop - mouse is focus
		return createVector(mouseX,mouseY);
		
	} else if (touches.length == 1){ // Mobile - location of single touch is focus
		return createVector(touches[0].x,touches[0].y);
		
	} else if (touches.length == 2){ // Mobile - midpoint between two touches is focus
		return createVector((touches[0].x+touches[1].x)/2,(touches[0].y+touches[1].y)/2);
	}
}


function updateMovement(){
	if (touches.length == 2){
		var new_dist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		coord_adjust *= new_dist/principal_dist;
		c = coord_adjust*coord_scale;
		principal_dist = new_dist;
	}
	
	if (touches.length <= 2){
		origin = focus_point().sub(principal_pos.mult(c));
		principal_pos = pixel_to_principal(focus_point());
	}
}


function mouseWheel(event){

	if(!autozoom){
		updateTouchInfo();
		coord_adjust *= exp(-event.delta/512);
		c = coord_adjust*coord_scale;
		updateMovement();
	}
}

