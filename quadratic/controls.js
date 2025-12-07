
var origin, scalar, default_origin;
var info_click = false;
var click_start;

function pixel_to_principal(pixels){
	// principal = (pixel - origin)/scalar
	if (is_hex){
		return p5.Vector.sub(pixels,origin).div(scalar*0.5,-scalar*0.866);
	} else {
		return p5.Vector.sub(pixels,origin).div(scalar,-scalar);
	}
}

function prinicipal_to_pixel(prin){
	// principal = (pixel - origin)/scalar
	if (is_hex){
		return p5.Vector.mult(prin,[scalar*0.5,-scalar*0.866]).add(origin);
	} else {
		return p5.Vector.mult(prin,[scalar,-scalar]).add(origin);
	}	
}


// trigger updates when touches are started, stopped, or moved
var in_a_box = false;
function touchStarted(){
		
	in_a_box = false;

	in_a_box = in_a_box || textBox.clicked();
	in_a_box = in_a_box || iconBox.clicked();
	in_a_box = in_a_box || infoBox.clicked();
	in_a_box = in_a_box || helpBox.clicked();

	info_click = !in_a_box;
	click_start = focus_point();
	
	updateTouchInfo();
}
function touchEnded(){

	if (info_click){
		let raw_info = pixel_to_principal(focus_point(),true);
		
		if (is_hex){
			let lower = round(floor(raw_info.x)/2,1);

			let loweroffset = round(lower - floor(lower),1);
			let lowclosest = [lower,round(raw_info.y/2+loweroffset)-loweroffset];
			let highclosest = [lower+0.5,round(raw_info.y/2+0.5-loweroffset)-0.5+loweroffset];
			let lowdist = (raw_info.x/2-lowclosest[0])**2 + ((raw_info.y/2-lowclosest[1])/1.154)**2;
			let highdist = (raw_info.x/2-highclosest[0])**2 + ((raw_info.y/2-highclosest[1])/1.154)**2;
			
			if (lowdist < highdist){
				raw_info = [round(lowclosest[0]*2),round(lowclosest[1]*2)];
			} else {
				raw_info = [round(highclosest[0]*2),round(highclosest[1]*2)];
			}
		} else {
			raw_info = [round(raw_info.x),round(raw_info.y)];
		}
		
		info_integer = raw_info[0] == info_integer[0] && raw_info[1] == info_integer[1] ? [] : raw_info;
		
	} 
	set_info();
	info_click = false;
	
	updateTouchInfo();
}

function touchMoved(event){
	event.preventDefault(); 
	if (info_click && click_start.dist(focus_point()) > 5){
		info_click = false;
	}
	if (!in_a_box){updateMovement();}
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
	
	if (touches.length == 2){
		var new_dist = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
		scalar *= new_dist/principal_dist;
		
		principal_dist = new_dist;
	}
	
	if (touches.length <= 2){
		if (is_hex){
			origin = focus_point().sub(principal_pos.mult(scalar*0.5,-scalar*0.866));
		} else {
			origin = focus_point().sub(principal_pos.mult(scalar,-scalar));
		}
		principal_pos = pixel_to_principal(focus_point());

		if (highlights.length > 0 && highlight_mode == 'multiples'){
			highlight_multiples(info_integer_true);
		}
	}
}


function mouseWheel(event){
	
	// if (auto_zoom == false){
	updateTouchInfo();

	// scrolling will update scalar logarithmically 
	var scalar_log = log(scalar);
	scalar_log -= event.delta/4096; // make this positive to invert scroll
	scalar = max(scale_min,exp(scalar_log));
	// iconBox.getItem('reset').Active = true;

	updateMovement();
}
