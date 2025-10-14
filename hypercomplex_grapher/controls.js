
var origin, scalar, default_origin, y_flip;

function pixel_to_principal(pixels){
	// principal = (pixel - origin)/scalar
	return pixels.sub(origin).mult(y_flip).div(scalar);
}


// trigger updates when touches are started, stopped, or moved
var in_a_box = false;
function touchStarted(){
	
	let i_sq_var = pixel_to_principal(createVector(mouseX, mouseY)).sub(createVector(ideal[0], ideal[1]));
	if (i_sq_var.mag() < vert_width*3/scalar){
		i_dragging = true;
		i_touched = true;
	}
	
	in_a_box = false;

	in_a_box = in_a_box || labelBox.clicked();
	in_a_box = in_a_box || shapeBox.clicked();
	in_a_box = in_a_box || iconBox.clicked();
	in_a_box = in_a_box || labelBox.clicked();
	if (level == 12){
		for (let gi of game_icons){
			gi.clicked();
		}
	}
	
	updateTouchInfo();
}
function touchEnded(){
	i_dragging = false;
	updateTouchInfo();
}

function touchMoved(event){
	event.preventDefault(); 
	if (!in_a_box && i_touched){updateMovement();}
	// && auto_zoom == false
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
	
	if (i_dragging || game_mode){
		return;
	}
	
	if (touches.length == 2){
		var new_dist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= new_dist/principal_dist;
		
		principal_dist = new_dist;
	}
	
	if (touches.length <= 2){
		origin = focus_point().sub(principal_pos.mult(scalar).mult(y_flip));
		principal_pos = pixel_to_principal(focus_point());
	}
}


function mouseWheel(event){
	
	// if (auto_zoom == false){
	if (i_touched && !game_mode){
		updateTouchInfo();

		// scrolling will update scalar logarithmically 
		var scalar_log = log(scalar);
		scalar_log -= event.delta/1024; // make this positive to invert scroll
		scalar = exp(scalar_log);

		updateMovement();
	}
}

