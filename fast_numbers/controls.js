

var scrolling = false;
var last_scroll, focus;

function mouseWheel(event){
	
	if (number_values[3] == "" || panning){
		return;
	}
	scrolling = true;
	last_scroll = Date.now();
	offset -= event.delta/128;
	input_box.style("visibility", "hidden");
}


var start_y;
function touchStarted(){

	let in_box = false;
	in_box = in_box || iconBox.clicked();
	in_box = in_box || helpBox.clicked();
	in_box = in_box || mouseInInput();
	
	if (number_values[3] != "" && !in_box){
		panning = true;
		start_y = mouseY;
		last_pan = Date.now();
	}
	updateTouchInfo();
}

function touchEnded(){
	panning = false;
	updateTouchInfo();
}


var panning = false;
function touchMoved(event){
	event.preventDefault(); 

	if (!panning){
		return;
	}
	
	last_pan = Date.now();
	offset += (mouseY - focus.y)/name_gap;
	if (abs(start_y-mouseY)>name_gap*0.1){
		input_box.style("visibility", "hidden");
	}
	updateTouchInfo();
}

function mouseInInput(){
	return abs(mouseX - input_center.x) < input_radius.x && abs(mouseY - input_center.y - input_radius.y) < input_radius.y;
}

function updateTouchInfo(){
	if (touches.length <= 2){
		focus = focus_point();
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

function action(id,index,value){
	if (id == 'palette'){	
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		button_color(input_box,palette.back,palette.bright,true);
		
	} else if (id == 'random'){
		give_value(floor(random()*1000000));
		
	} else if (id == 'info'){
		helpBox.setActive(!helpBox.Active);
		
	} 
}

