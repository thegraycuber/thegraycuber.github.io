var points, output, input = [];
var polylist, polydesc = [[0],[0],[0],[0],[0]];
var icons = [];
var palette = 0;
var settings = 0;

var h_factor = 2.5;
var h = h_factor;
var ratcos = 0;
var ratio = 1;
var polyidx = 0;
var px9;


function draw() {
	
	if (settings.animate == 'Radius'){
		settings.animate_val = (settings.animate_val + 0.02)%6.28;
		var rad_fact = (cos(settings.animate_val)+1)/2;
		settings.radius = 2**(settings.radius_range[0]*rad_fact+settings.radius_range[1]*(1-rad_fact));
	} else if (settings.animate == 'Rotation'){
		settings.animate_val = (settings.animate_val + 0.001) % 1;
		var rot_idx = menuBox.getIndex('Rotation');
		menuBox.Items[rot_idx].giveValue(menuBox.Items[rot_idx].Range[0]*(1-settings.animate_val)+menuBox.Items[rot_idx].Range[1]*settings.animate_val);
	} else if (settings.animate == 'Trace'){
		settings.animate_val += ceil(settings.point_count/400);
	} else if (settings.animate == 'Function'){
		settings.animate_val += 0.03;
		if (settings.animate_val >= 3.14){
			menuBox.Items[menuBox.getIndex('Sequence')].giveValue((polyidx + 1) % (menuBox.Items[menuBox.getIndex('Sequence')].List.length - 1));
			settings.animate_val  = 0;
		}
		settings.animate_ratio = (cos(settings.animate_val)+1)/2;
		settings.display_jump = 0;
		if (settings.animate_ratio < 0.5){
			settings.display_jump = 1 ;
		}
	}
	
	if (ratcos == 200){
		polyidx += 1;
		ratcos = 0;
	}
	ratio = (cos(PI*ratcos/200) + 1)/2;
	
	background(palette.back);
	

	if(settings.ShowGrid == 0){
		settings.makeGrid();
		fill(palette.backlight);
		for (var gl of settings.gridlines) {
			rect(gl[0],gl[1],gl[2],gl[3]);
		}
		
		
		textAlign(LEFT,CENTER);
		textSize(settings.px*0.3);
		for (var lab of settings.labels) {
			text(lab[2],lab[0],lab[1]);
		}
		textAlign(CENTER,CENTER);
	}

	if(menuBox.Items[menuBox.getIndex('Input')].Index == 2){
		fill(palette.back);
		rect(win[0]/2 + settings.px * 5,win[1]/2 - settings.px * 3.5,settings.px*6,settings.px*2);
	}
	
	if (menuBox.Items[menuBox.getIndex('Zoom')].Index == 0){
		h = 0;
	} 
	
	if (settings.animate_ratio < 1){
		output = process_output(polylist[polyidx],polylist[(polyidx + 1) % polylist.length]);
	} else {
		output = process_output(polylist[polyidx]);
	}
	if (menuBox.Items[menuBox.getIndex('Input')].Index == 1 || menuBox.Items[menuBox.getIndex('Points')].Index % 2 == 1){
		input = process_output([0,1]);
		input = points_to_coords(input);
	}
	output = points_to_coords(output);
	stroke(palette.backlight);	
	strokeWeight(settings.px/8);
	noFill();
	
	if(menuBox.Items[menuBox.getIndex('Input')].Index == 2 && settings.custom == false){
		strokeWeight(settings.px/15);
		input = process_output([0,1],[],true);
		if (settings.animate != 'Trace'){
			stroke(palette.input);
		}
		beginShape();
		for (var inpu of input){
			vertex(inpu[0],inpu[1]);
		}
		endShape(CLOSE);
		strokeWeight(settings.px/9);
	} else if (menuBox.Items[menuBox.getIndex('Input')].Index == 1){
		if (settings.animate != 'Trace'){
			stroke(palette.input);
		}
		beginShape();
		for (var inp of input){
			vertex(inp[0]+settings.shift[0],inp[1]);
		}
		endShape(CLOSE);
	}
	
	
	if (settings.animate != 'Trace'){
		stroke(palette.output);
	}
	
	beginShape();
	for (var out of output){
		vertex(out[0],out[1]);
	}
	endShape(CLOSE);

	if (settings.animate == 'Trace'){
		var alp = 15;
		var grad_pts = settings.point_count/20;
		if (menuBox.Items[menuBox.getIndex('Input')].Index == 1 || (menuBox.Items[menuBox.getIndex('Input')].Index == 2 && settings.custom == false)){
			beginShape();
			for (o_idx = settings.animate_val; o_idx < settings.animate_val + grad_pts; o_idx++){
				palette.input.setAlpha(alp);
				stroke(palette.input);
				vertex(input[o_idx%points.length][0]+settings.shift[1],input[o_idx%points.length][1]);
				alp += 240/grad_pts;
				endShape();
				beginShape();
				vertex(input[o_idx%points.length][0]+settings.shift[1],input[o_idx%points.length][1]);
			}
			endShape();
		}
	
		alp = 15;
		beginShape();
		for (o_idx = settings.animate_val; o_idx < settings.animate_val + grad_pts; o_idx++){
			palette.output.setAlpha(alp);
			stroke(palette.output);
			vertex(output[o_idx%points.length][0]+settings.shift[1],output[o_idx%points.length][1]);
			alp += 240/grad_pts;
			endShape();
			beginShape();
			vertex(output[o_idx%points.length][0]+settings.shift[1],output[o_idx%points.length][1]);
		}
		endShape();
	}
	
	if (menuBox.Items[menuBox.getIndex('Points')].Index % 2 == 1 && (settings.custom == false || menuBox.Items[menuBox.getIndex('Input')].Index == 1)){
		var circ_rad = settings.px/4;
		if(menuBox.Items[menuBox.getIndex('Input')].Index == 2){
			circ_rad = settings.px/8;
		}
		noStroke();
		fill(palette.focus);
		for (o_idx = 0; o_idx < dots.length; o_idx++){
			circle(input[dots[o_idx]][0]+settings.shift[1],input[dots[o_idx]][1],circ_rad);
		}
	} 
	
	if (menuBox.Items[menuBox.getIndex('Points')].Index >= 2){
		noStroke();
		fill(palette.focus);
		for (o_idx = 0; o_idx < dots.length; o_idx++){
			circle(output[dots[o_idx]][0]+settings.shift[1],output[dots[o_idx]][1],settings.px/4);
		}
	}
	
	fill(palette.front);
	textSize(settings.px*0.6);
	textFont(openSans);
	stroke(palette.back);
	strokeWeight(settings.px*0.1);
	var function_desc = menuBox.Items[menuBox.getIndex('Sequence')].List[menuBox.Items[menuBox.getIndex('Sequence')].Index+settings.display_jump];
	
	if(menuBox.Items[menuBox.getIndex('Input')].Index == 2){
		
		if (settings.custom){
			var t_wid = textWidth(function_desc);
			if (t_wid > settings.px*4.5){
				textSize(settings.px*2.7*settings.px/t_wid);
			}
			text(function_desc,settings.display[0],settings.display[1]);
		}else{
			var x_ind = function_desc.indexOf('x');

			textAlign(LEFT);
			text(function_desc.substring(x_ind+1,function_desc.length),settings.display[0]+settings.px*0.8,settings.display[1]+settings.px*0.1);

			textAlign(RIGHT);
			text(function_desc.substring(0,x_ind),settings.display[0]-settings.px*0.8,settings.display[1]+settings.px*0.1);
		}
		
		textAlign(CENTER);
		textFont(atkinsonBold);	
		textSize(settings.px*0.3);
		
		var rad_str = menuBox.Items[menuBox.getIndex('Radius')].List[menuBox.Items[menuBox.getIndex('Radius')].Index];
		if (settings.animate == 'Radius'){
			var rad_log = floor(log(settings.radius)/log(10));
			rad_str = str(round(settings.radius,max(0,-rad_log)));
		}
		
		fill(palette.input);
		text('Radius ' + rad_str,settings.display[0],settings.display[1]+settings.px*1.3);
		textSize(settings.px*0.4);
		fill(palette.output);
		text('Output',settings.display[0],settings.display[1]+settings.px*1.9);
		
	} else {
		
		if (settings.custom){
			var t_wi = textWidth(function_desc);
			if (t_wi > settings.px*4.5){
				textSize(settings.px*2.7*settings.px/t_wi);
			}
		}
		
		text(function_desc,settings.display[0],settings.display[1]);
		
		textAlign(CENTER);
		textFont(atkinsonBold);	
		textSize(settings.px*0.4);
		
		if(menuBox.Items[menuBox.getIndex('Input')].Index == 1){
			fill(palette.input);
			text('Input',settings.display[0],settings.display[1]+settings.px*0.8);
			fill(palette.output);
			text('Output',settings.display[0],settings.display[1]+settings.px*1.4);
		}

	}
	
	noStroke();
	menuBox.show();
	
	for (var icon of icons){
		icon.showIcon();
	}
	
	
	noStroke();
	if (mouseIsPressed){
		if (mouseCheck()){
			menuBox.clicked(false);
		} 
	}
	
	if (settings.custom){
		var parse_list = parse_polynomial(settings.custom_input.value());
		if (parse_list.length == 0){
			stroke(palette.back);
			strokeWeight(settings.px*0.06);
			textSize(settings.px*0.25);
			text('Enter a polynomial in the form:   2x^5 - x^4 + 3x + 10    or    10,3,0,0,-1,2',win[0]/2,win[1]/2 + settings.px*4);
			noStroke();
		} else {
			var seq_idx = menuBox.getIndex('Sequence');
			polylist = [parse_list];
			polylist.push(polylist[0]);
			menuBox.Items[seq_idx].List = [poly_to_text(polylist[0])];
			menuBox.Items[seq_idx].List.push(menuBox.Items[seq_idx].List[0]);
		}
	}
	
}


function mouseClicked(){
	
	if (mouseCheck()){
		menuBox.clicked();
		//infoBox.clicked();
		for (var icon of icons){
			icon.clicked();
		}
	} 
}

function mouseWheel(event) {
  if(menuBox.Items[menuBox.getIndex('Zoom')].Index == 1){
		settings.hpower += event.delta/200;
		h = h_factor*(2**settings.hpower);
	}
}