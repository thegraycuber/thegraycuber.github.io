
var origin;
var default_origin;
var scalar = 1; 
var active_element = -1;
var dragging = 'none';
var mouseVec;
var ac_el_pos, ac_el_vel;


function pixel_to_principal(pixels){
	// principal = (pixel - origin)/scalar
	return pixels.sub(origin).div(scalar);
}


// trigger updates when touches are started, stopped, or moved
function touchStarted(){
	
	if (dragging != 'none'){
		return;
	}
	
	in_a_box = false;
	in_a_box = in_a_box || iconBox.clicked();
	in_a_box = in_a_box || arrowBox.clicked();
	in_a_box = in_a_box || arrowBoxes[active_arrow].clicked();
	in_a_box = in_a_box || displayBox.clicked();
	in_a_box = in_a_box || settingBox.clicked();

	skip_move = true;
	//if (display_state == 2){return;}
	updateTouchInfo();

	
	for (let g of G){
		if (g.clicked(mouseVec)){return;}
	}

}


function touchEnded(){
	dragging = 'none';
	active_element = -1;
	updateTouchInfo();
}


function touchMoved(event){
	event.preventDefault(); // ##### this line is critical to prevent built-in mobile zoom and pan #####
	if ((!in_a_box || dragging == 'slider') ){updateMovement();} //&& display_state < 2
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



var skip_move = false;
function updateMovement(){
	
	if (touches.length == 2){
		var new_dist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= new_dist/principal_dist;
		principal_dist = new_dist;
	}
	
	if (touches.length <= 2){
		
		if (dragging == 'slider'){
			arrowBoxes[active_arrow].getItem('arrow_strength').clicked();
			return;
		}
		
		if (skip_move){
			skip_move = false;
			return;
		}
		
		if(active_element != -1){
			return;
			
		} 
		origin = focus_point().sub(principal_pos.mult(scalar));
		principal_pos = pixel_to_principal(focus_point());

	}
}



function mouseWheel(event){
	//if(display_state == 2){return;}
	
	updateTouchInfo();
	
	var scalar_log = log(scalar);
	scalar_log -= event.delta/512; // make this positive to invert scroll
	scalar = exp(scalar_log);
	
	updateMovement();
}
