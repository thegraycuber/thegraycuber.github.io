
var origin, scalar, default_origin, y_flip;

function pixel_to_principal(pixels){
	// principal = (pixel - origin)/scalar
	return pixels.sub(origin).mult(y_flip).div(scalar);
}


// trigger updates when touches are started, stopped, or moved
var in_a_box = false;
function touchStarted(){
	at_ticker = min(at_ticker,at_text.length);
	in_a_box = false;
	if(!pasting){
		in_a_box = in_a_box || settingBox.clicked();
		in_a_box = in_a_box || shapeBox[activeShape].clicked();
		in_a_box = in_a_box || iconBox.clicked();
	}
	
	updateTouchInfo();
}
function touchEnded(){
	updateTouchInfo();
}
function touchMoved(event){
	event.preventDefault(); 
	if (auto_zoom == false && pasting == false && !in_a_box){updateMovement();}
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
		scalar *= new_dist/principal_dist;
		principal_dist = new_dist;
	}
	
	if (touches.length <= 2){
		origin = focus_point().sub(principal_pos.mult(scalar).mult(y_flip));
		principal_pos = pixel_to_principal(focus_point());
	}
}


function mouseWheel(event){
	
	if (auto_zoom == false){
		updateTouchInfo();

		// scrolling will update scalar logarithmically 
		var scalar_log = log(scalar);
		scalar_log -= event.delta/1024; // make this positive to invert scroll
		scalar = exp(scalar_log);

		updateMovement();
	}
}
