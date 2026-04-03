
var blinker_ang = 0;

class TextModule{
	
	constructor(input_module, id = input_module.i){

		if (typeof input_module.default == 'undefined'){
			this.pos = createVector(input_module.x,input_module.y);
			this.border = createVector(input_module.w,input_module.h);
			this.stroke = input_module.stk;
			this.text_size = input_module.txts;
		} else {
			this.pos = present_view[slide].pos.copy();
			this.border = createVector(input_module.w/present_view[slide].size,input_module.h/present_view[slide].size);
			this.stroke = input_module.stk/present_view[slide].size;
			this.text_size = input_module.txts/present_view[slide].size;
		}
	
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.text = input_module.txt;
		this.color = input_module.col;
		this.inverted = input_module.inv == 1;
		this.dim = input_module.dim == 1;
		this.noshad = typeof input_module.noshad != 'undefined';
		
		this.blinker = -1;
		this.type = 'text';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		this.age = typeof input_module.age === "undefined" ? 1 : input_module.age;

	
		this.giveSizes();
		//giveDirection(this);
		giveColors(this);
		this.set_extremes();
	}
	
	display(shadow = false){	
		if (this.noshad && shadow){return;}
		this.bub_ticker = this.id*50 + Date.now()*0.0004;//random()*3000;
	
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		
		strokeWeight((is3d?scalar*wid*0.0003:1/this.size.x)*this.stroke);
		stroke(shadow?this.shadow:this.stroke_color);
	
		if (this.inverted){
			fill(shadow?this.shadow:this.fill_color);
			translate(0,0,-0.0001);
			rect(0,0,this.size.x,this.size.y);
			translate(0,0,0.0001);
		} 
		
		noStroke();
		textSize(this.text_size);
		textLeading(this.text_size);
		
		if (this.text == '$morph$'){
			fill(shadow?this.start_text_shadow:this.start_text_color);
			text_display(this.start_text,this.text_size,this.start_offset);
			fill(shadow?this.end_text_shadow:this.end_text_color);
			text_display(this.end_text,this.text_size,this.end_offset);
		} else {
			fill(shadow?this.shadow:this.stroke_color);
			text_display(this.text,this.text_size);
		}
		
		pop();
		
	}
	
	giveSizes(){		
		
		textSize(this.text_size);
		this.lines = [];
		this.line_indices = [];
		
		let start_chr = 0;
		let max_line_size = 0;
		
		let auto_y = 0;//*1.4;
		for (let chr = 0; chr <= this.text.length; chr++){
			if (chr == this.text.length || this.text.substring(chr,chr+1) == '\n'){
				auto_y += this.text_size;
				
				this.lines.push(this.text.substring(start_chr,chr));
				this.line_indices.push(start_chr);
				max_line_size = max(max_line_size,textWidth(this.text.substring(start_chr,chr)));
				start_chr = chr+1;

			}
		}
		
		
		this.size = createVector(this.border.x+max_line_size+this.text_size*0.2, this.border.y + auto_y);
		this.set_extremes();
	}
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_text_size = startModule.text_size;
		this.start_stroke = startModule.stroke;
		this.start_stroke_color = startModule.stroke_color;
		this.start_fill_color = startModule.fill_color;
		this.start_shadow = startModule.shadow;
		this.start_angle = startModule.angle;
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size.copy();
		this.start_text_size = this.text_size;
		this.start_stroke = this.stroke;
		this.start_stroke_color = palette.backtrans;
		this.start_fill_color = color(red(this.fill_color),green(this.fill_color),blue(this.fill_color),0);
		this.start_shadow = palette.backtrans;
		this.start_angle = this.angle;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_text_size = endModule.text_size;
		this.end_stroke = endModule.stroke;
		this.end_stroke_color = endModule.stroke_color;
		this.end_fill_color = endModule.fill_color;
		this.end_shadow = endModule.shadow;
		this.end_angle = endModule.angle;
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_text_size = this.text_size;
		this.end_stroke = this.stroke;
		this.end_stroke_color = palette.backtrans;
		this.end_fill_color = palette.backtrans;
		this.end_shadow = palette.backtrans;
		this.end_angle = this.angle;
	}
	
	lerpModule(){
		let lerp_val = lerp_from_anim(this);
		let wigg = wiggle_adjust(this);
		
		this.pos.x = lerp(this.start_pos.x,this.end_pos.x,lerp_val);
		this.pos.y = lerp(this.start_pos.y,this.end_pos.y,lerp_val);
		this.size.x = lerp(this.start_size.x,this.end_size.x,lerp_val)* wigg[0];
		this.size.y = lerp(this.start_size.y,this.end_size.y,lerp_val)* wigg[0];
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];
		this.text_size = lerp(this.start_text_size,this.end_text_size,lerp_val) * wigg[0];
		this.fill_color = lerpColor(this.start_fill_color,this.end_fill_color,lerp_val);
		this.stroke_color = lerpColor(this.start_stroke_color,this.end_stroke_color,lerp_val);
		this.shadow = lerpColor(this.start_shadow,this.end_shadow,lerp_val);
		this.stroke = lerp(this.start_stroke,this.end_stroke,lerp_val);
		
		if (this.text == '$morph$'){
			this.start_text_color = lerpColor(this.stroke_color,palette.backtrans,lerp_val);
			this.start_text_shadow = lerpColor(this.shadow,palette.backtrans,lerp_val);
			this.end_text_color = lerpColor(this.stroke_color,palette.backtrans,1-lerp_val);
			this.end_text_shadow = lerpColor(this.shadow,palette.backtrans,1-lerp_val);
			
			this.start_offset = lerp(this.start_s_offset,this.end_s_offset,lerp_val);
			this.end_offset = lerp(this.start_e_offset,this.end_e_offset,lerp_val);
			
			} //else {
		// 	//this.giveSizes();
		// }
	}
	
	duplicate(dupe_slide,block_links=false){
		return new TextModule(new Simple(this,dupe_slide,block_links));
	}

	set_extremes(){
	let diag_mag = (this.size.x**2 + this.size.y**2)**0.5/2;
	let diag_ang = atan2(this.size.y,this.size.x) + this.angle;
	this.projected = createVector(abs(cos(diag_ang)),abs(sin(diag_ang))).mult(diag_mag);

	this.mins = createVector(this.pos.x - this.projected.x, this.pos.y - this.projected.y);
	this.maxes = createVector(this.pos.x + this.projected.x, this.pos.y + this.projected.y);
	}
	
}

function text_display(display_str, display_size, x_off = 0, y_off = 0){
	text(display_str,x_off,-display_size*0.05+y_off);
}





class PolyModule{
	
	constructor(input_module, id = input_module.i){

		if (typeof input_module.default == 'undefined'){
			this.pos = createVector(input_module.x,input_module.y);
			this.size = createVector(input_module.w,input_module.h);
			this.stroke = input_module.stk;
		} else {
			this.pos = present_view[slide].pos.copy();
			this.size = createVector(input_module.w/present_view[slide].size,input_module.h/present_view[slide].size);
			this.stroke = input_module.stk/present_view[slide].size;
		}

		this.shape = input_module.shp;
		this.points = [];
		if (typeof input_module.pts == 'undefined'){
			this.set_default();
			this.unchanged = true;
		} else {
			for (let pt of input_module.pts){
				this.points.push(createVector(pt[0],pt[1]));
			}
			this.unchanged = false;
		}
		
		this.links = typeof input_module.links == "undefined" ? [] : input_module.links;
		
		
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.color = input_module.col;
		this.inverted = input_module.inv == 1;
		this.dim = input_module.dim == 1;
		this.noshad = typeof input_module.noshad != 'undefined';
		
		this.type = 'poly';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		
		this.age = typeof input_module.age == "undefined" ? 1 : input_module.age;
	
		//giveDirection(this);
		giveColors(this);
		this.set_extremes();
	}
	
	
	display(shadow = false){
		if (this.noshad && shadow){return;}

		let y_mult = this.size.y/this.size.x;
		
		strokeWeight((is3d?scalar*wid*0.0003:1/this.size.x)*this.stroke*2);
		stroke(shadow?this.shadow:this.stroke_color);
		fill(shadow&&this.inverted?this.shadow:this.fill_color);
		// fill(palette.backtrans);
		
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		scale(this.size.x/2);

		if (this.points.length == 0){
			ellipse(0,0,2,2*y_mult);
			
		} else if (this.shape == -2 || this.shape == -5){

			noFill();
			let pt_limit = floor((this.points.length-1)/3)*3+1;
			
			beginShape();
			vertex(this.points[0].x,this.points[0].y*y_mult);
			for (let p = 1; p < pt_limit-2; p += 3){
				bezierVertex(this.points[p].x,this.points[p].y*y_mult,this.points[p+1].x,this.points[p+1].y*y_mult,this.points[p+2].x,this.points[p+2].y*y_mult);
			} 
			endShape();

			fill(shadow?this.shadow:this.stroke_color);
			if (this.shape == -5){
				push();
				
				translate(this.points[pt_limit-1].x,this.points[pt_limit-1].y*y_mult);
				rotate(atan2((this.points[pt_limit-1].y-this.points[pt_limit-2].y)*y_mult,this.points[pt_limit-1].x-this.points[pt_limit-2].x));
				drawTri(0,0,this.stroke*2/this.size.x)
				pop();
			}

			translate(this.points[0].x,this.points[0].y*y_mult);
			rotate(atan2((this.points[0].y-this.points[1].y)*y_mult,this.points[0].x-this.points[1].x));
			drawTri(0,0,this.stroke*2/this.size.x)

		} else {
			
			beginShape();
			for (let p of this.points){
				vertex(p.x,p.y*y_mult);
			}
			
			endShape(CLOSE);
		}
		
		pop();

	}

	set_default(){
		
		if (this.shape == 1){ //ellipse
			this.points = [];
			
			
		} else if (this.shape == 2){ //rectangle
			this.points = [
				createVector(1,1),
				createVector(-1,1),
				createVector(-1,-1),
				createVector(1,-1),
			];
			
		} else if (this.shape == 0){ // x
			this.points = [
				createVector(1,0.7),
				createVector(0.7,1),
				createVector(0,0.3),
				createVector(-0.7,1),
				createVector(-1,0.7),
				createVector(-0.3,0),
				createVector(-1,-0.7),
				createVector(-0.7,-1),
				createVector(0,-0.3),
				createVector(0.7,-1),
				createVector(1,-0.7),
				createVector(0.3,0),
			];
			
		} else if (this.shape == -1){ // right triangle
			this.points = [
				createVector(-1,1),
				createVector(1,1),
				createVector(-1,-1),
			];

		} else if (this.shape == -2 || this.shape == -5){ // arrow
			this.points = [
			];

			for (let p = 0; p < 7; p++){
				this.points.push(createVector(1-p*2/6,0));
			}
			if (this.stroke == 0){
				this.stroke = max(12/present_view[slide].size,this.stroke);
			}
			this.inverted = false;
			giveColors(this);

		} else if (this.shape == -3){ // star
			this.points = [
				createVector(0,-1),
				createVector(-0.224,-0.308),
				createVector(-0.952,-0.308),
				createVector(-0.364,0.118),
				createVector(-0.588,0.91),
				createVector(0,0.382),
				createVector(0.588,0.91),
				createVector(0.364,0.118),
				createVector(0.952,-0.308),
				createVector(0.224,-0.308),
			];
			
		} else if (this.shape == -4){ // check
			this.points = [
				createVector(1,-0.7),
				createVector(0.7,-1),
				createVector(-0.24,0.42),
				createVector(-0.75,-0.06),
				createVector(-1,0.3),
				createVector(-0.2,1),
			];

		} else { // n-gon
			
			this.points = [];
			for (let v = 0; v < this.shape; v++){
				let v_ang = v*TWO_PI/this.shape;
				this.points.push(createVector(cos(v_ang),sin(v_ang)));
			}
		} 
		
	}
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_stroke_color = startModule.stroke_color;
		this.start_fill_color = startModule.fill_color;
		this.start_stroke = startModule.stroke;
		this.start_shadow = startModule.shadow;
		this.start_angle = startModule.angle;
		this.start_points = copy_vector_array(startModule.points);
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size;
		this.start_stroke_color = palette.backtrans;
		this.start_fill_color = color(red(this.fill_color),green(this.fill_color),blue(this.fill_color),0);
		this.start_shadow = palette.backtrans;
		this.start_stroke = 0;
		this.start_angle = this.angle;
		this.start_points = copy_vector_array(this.points);
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_stroke_color = endModule.stroke_color;
		this.end_fill_color = endModule.fill_color;
		this.end_stroke = endModule.stroke;
		this.end_shadow = endModule.shadow;
		this.end_angle = endModule.angle;
		this.end_points = copy_vector_array(endModule.points);
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_stroke_color = palette.backtrans;
		this.end_fill_color = palette.backtrans;
		this.end_stroke = this.stroke;
		this.end_shadow = palette.backtrans;
		this.end_angle = this.angle;
		this.end_points = copy_vector_array(this.points);
	}
	
	lerpModule(){
		let lerp_val = lerp_from_anim(this);
		let wigg = wiggle_adjust(this);
		
		this.pos.x = lerp(this.start_pos.x,this.end_pos.x,lerp_val);
		this.pos.y = lerp(this.start_pos.y,this.end_pos.y,lerp_val);
		this.size.x = lerp(this.start_size.x,this.end_size.x,lerp_val) * wigg[0];
		this.size.y = lerp(this.start_size.y,this.end_size.y,lerp_val) * wigg[0];
		this.fill_color = lerpColor(this.start_fill_color,this.end_fill_color,lerp_val);
		this.stroke_color = lerpColor(this.start_stroke_color,this.end_stroke_color,lerp_val);
		this.stroke = lerp(this.start_stroke,this.end_stroke,lerp_val);
		this.shadow = lerpColor(this.start_shadow,this.end_shadow,lerp_val);
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];

		this.points = [];
		for (let p = 0; p < this.start_points.length; p++){
			this.points.push(p5.Vector.lerp(this.start_points[p],this.end_points[p],lerp_val));
		}
		
	}
	
	duplicate(dupe_slide,block_links=false){
		return new PolyModule(new Simple(this,dupe_slide,block_links));
	}
	
	set_extremes(){
		let diag_mag = (this.size.x**2 + this.size.y**2)**0.5/2;
		let diag_ang = atan2(this.size.y,this.size.x) + this.angle;
		this.projected = createVector(abs(cos(diag_ang)),abs(sin(diag_ang))).mult(diag_mag);
		
		this.mins = createVector(this.pos.x - this.projected.x, this.pos.y - this.projected.y);
		this.maxes = createVector(this.pos.x + this.projected.x, this.pos.y + this.projected.y);
	}
	
}

function copy_vector_array(array_2d){
	let out_array = [];
	for (let pt of array_2d){
		out_array.push(pt.copy());
	}
	return out_array;
	
}
function copy_2d_array(array_2d){
	let out_array = [];
	for (let pt of array_2d){
		out_array.push([...pt]);
	}
	return out_array;
	
}


function move_links(all_modules,poly_index){
	for (let l of all_modules[poly_index].links){
		for (let m of all_modules){
			if (l[1] == m.id){
				m.pos = pp_to_prin(all_modules[poly_index],l[0]);
				break;
			}
		}
	}
}




var image_list;

function image_load(){
	
	for (let i = 0; i < image_list.length; i++){
		image_list[i] = new ImportedImage(image_list[i]);
	}
}

class ImportedImage{
	constructor(path){
		this.path = path;
		this.image = loadImage(path);

	}
}



class ImageModule{
	
	constructor(input_module, id = input_module.i){
		
		if (typeof input_module.default == 'undefined'){
			this.pos = createVector(input_module.x,input_module.y);
			this.stroke = input_module.stk;
			
			this.path = input_module.path;
			this.size = createVector(input_module.w,input_module.h);
			for (let i = 0; i < image_list.length; i++){
				if (image_list[i].path == 'qter_presentation/' + this.path){
					this.image_index = i;
				}
			}
			
		} else {
			this.pos = present_view[slide].pos.copy();
			this.stroke = input_module.stk/present_view[slide].size;
			
			this.path = image_list[0].path;
			this.image_index = 0;
			this.size = createVector(image_list[this.image_index].image.width,image_list[this.image_index].image.height).div(4*present_view[slide].size);
			
		}
		
		this.aspect = image_list[this.image_index].image.width/image_list[this.image_index].image.height;
		
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.color = input_module.col;
		this.dim = input_module.dim == 1;
		this.noshad = typeof input_module.noshad != 'undefined';
		
		this.type = 'image';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		this.age = typeof input_module.age === "undefined" ? 1 : input_module.age;
		
	
		//giveDirection(this);
		giveColors(this);
		this.set_extremes();
	}
	
	
	display(shadow = false){	
		// if (shadow){
		// 	return;
		// 	// fill(this.shadow);
		// 	// rect(0,0,this.size.x,this.size.y);
		// }
		if (this.noshad && shadow){return;}
		
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		tint(255,this.tint);
		if (shadow){
			image(image_list[this.image_index].shadow,0,0,this.size.x,this.size.y);
		} else {
			image(image_list[this.image_index].image,0,0,this.size.x,this.size.y);
		
			noFill();
			noTint();
			strokeWeight(this.stroke);
			stroke(this.stroke_color);
			rect(0,0,this.size.x,this.size.y);
		}
		
		pop();
		
	}

	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_angle = startModule.angle;
		this.start_stroke_color = startModule.stroke_color;
		this.start_stroke = startModule.stroke;
		this.start_shadow = startModule.shadow;
		this.start_tint = (startModule.age == 1 ? startModule.tint : 0);
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size;
		this.start_angle = this.angle;
		this.start_stroke_color = palette.backtrans;
		this.start_shadow = palette.backtrans;
		this.start_stroke = 0;
		this.start_tint = 0;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_angle = endModule.angle;
		this.end_stroke_color = endModule.stroke_color;
		this.end_stroke = endModule.stroke;
		this.end_shadow = endModule.shadow;
		this.end_tint = (endModule.age == 1 ? endModule.tint : 0);
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_angle = this.angle;
		this.end_stroke_color = palette.backtrans;
		this.end_stroke = this.stroke;
		this.end_shadow = palette.backtrans;
		this.end_tint = 0;
	}
	
	lerpModule(){
		let lerp_val = lerp_from_anim(this);
		let wigg = wiggle_adjust(this);
		
		this.pos.x = lerp(this.start_pos.x,this.end_pos.x,lerp_val);
		this.pos.y = lerp(this.start_pos.y,this.end_pos.y,lerp_val);
		this.size.x = lerp(this.start_size.x,this.end_size.x,lerp_val) * wigg[0];
		this.size.y = lerp(this.start_size.y,this.end_size.y,lerp_val) * wigg[0];
		this.stroke_color = lerpColor(this.start_stroke_color,this.end_stroke_color,lerp_val);
		this.stroke = lerp(this.start_stroke,this.end_stroke,lerp_val);
		this.shadow = lerpColor(this.start_shadow,this.end_shadow,lerp_val);
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];
		this.tint = lerp(this.start_tint,this.end_tint,lerp_val);
	}
	
	duplicate(dupe_slide,block_links=false){//NEWPOLY and the rest
		return new ImageModule(new Simple(this,dupe_slide,block_links));
	}
	
	set_extremes(){
		let diag_mag = (this.size.x**2 + this.size.y**2)**0.5/2;
		let diag_ang = atan2(this.size.y,this.size.x) + this.angle;
		this.projected = createVector(abs(cos(diag_ang)),abs(sin(diag_ang))).mult(diag_mag);
		
		this.mins = createVector(this.pos.x - this.projected.x, this.pos.y - this.projected.y);
		this.maxes = createVector(this.pos.x + this.projected.x, this.pos.y + this.projected.y);
	}
	
}


function giveColors(module){

	if (module.age != 1){
		module.shadow = palette.backtrans;
		if (mouse_state == 'presenting'){
			module.fill_color = palette.backtrans;
			module.stroke_color = palette.backtrans;
			if (module.type == 'image'){
				module.tint = 0;
			}
			
		} else {
			if (module.inverted){
				module.fill_color = palette.monoalpha;
				module.stroke_color = palette.backalpha;
			} else {
				module.fill_color = palette.backtrans;
				module.stroke_color = palette.monoalpha;
			}
			
			if (module.type == 'image'){
				module.tint = 30;
			}
		}
		return;
	}
	
	module.shadow = (module.color==8||module.dim)?palette.backtrans:palette.shadow;
	if (module.inverted){
		module.fill_color = palette.colors[module.color];
		module.stroke_color = palette.backdark;
	} else {
		module.fill_color = palette.backtrans;
		module.stroke_color = palette.colors[module.color];
	}
	if (module.type == 'image'){
		module.tint = 255;
	}
	
	if (module.dim){
		module.stroke_color = lerpColor(module.stroke_color,palette.back,0.8);
		if (module.inverted){
			module.fill_color = lerpColor(module.fill_color,palette.back,0.8);
		}
		if (module.type == 'image'){
			module.tint = 50;
		}
	}
	
	
}

function giveDirection(module){
	module.dir = createVector(0.5,0.5);
	if (module.pos.x > present_view[slide].pos.x){
		module.dir.x = -0.5;
	}
	if (module.pos.y > present_view[slide].pos.y){
		module.dir.y = -0.5;
	}
}

function lerp_from_anim(module){
	if (animations[module.anim] == 'bounce'){
		return lerp_bounce;
	} else if (animations[module.anim] == 'spin' ){
		return lerp_spin;
	} else if (animations[module.anim] == 'smooth'){
		return lerp_smooth;
	} else if (animations[module.anim] == 'abrupt'){
		return lerp_abrupt;	
	}
	
	return lerp_smooth;
}


function wiggle_adjust(module){
	
	if (animations[module.anim] == 'wiggle'){
		return [1+0.2*(sin(lerp_smooth*PI)**0.5),0.08*sin(constrain(lerp_smooth*2.4*PI,0,TWO_PI))];
	} else {
		return [1,0];
	}
}

function simple_fill(module_to_fill, parent_module){
	for (let key of Object.keys(parent_module)){
		if (typeof module_to_fill[key] == 'undefined' && !['age','default'].includes(key) ){
			module_to_fill[key] = parent_module[key];
		}
	}
}

function simple_clean(module_to_clean, parent_module){
	for (let key of Object.keys(module_to_clean)){
		if (!['i','t','s','anim'].includes(key) && module_to_clean[key] == parent_module[key]){
			delete module_to_clean[key];
		}
	}
}


class Simple{//NEWPOLY
	
	constructor(s_module, s_slide = slide, block_links = false){
		
		this.x = round(s_module.pos.x, present_view[s_slide].log+1);
		this.y = round(s_module.pos.y, present_view[s_slide].log+1);
		this.w = round(s_module.size.x, present_view[s_slide].log);
		this.h = round(s_module.size.y, present_view[s_slide].log);
		this.ang = round(s_module.angle,2);
		
		this.i = s_module.id;
		this.anim = s_module.anim;
		
		this.stk = round(s_module.stroke, present_view[s_slide].log) ;
		if (this.type != 'image'){
			this.col = s_module.color;
			this.inv = +s_module.inverted;
		}
		this.dim = +s_module.dim;
		if (s_module.noshad){
			this.noshad = true;
		}
		
		this.t = s_module.type.substring(0,1);
		this.s = s_slide;
		//this.i = s_module.index;
		
		if (s_module.type == 'text'){
			this.txt = s_module.text;
			this.txts = round(s_module.text_size, present_view[s_slide].log);
			this.w = round(s_module.border.x, present_view[s_slide].log);
			this.h = round(s_module.border.y, present_view[s_slide].log);
			
		} else if (s_module.type == 'shape'){
			this.shp = s_module.shape;
			
		} else if (s_module.type == 'arrow'){
			this.mode = s_module.mode;
			this.pts = points_to_pts(s_module.points,s_module.size,s_slide);
			
		} else if (s_module.type == 'image'){
			this.path = s_module.path;
			
		} else if (s_module.type == 'poly'){
			this.shp = s_module.shape;
			if (!s_module.unchanged){
				this.pts = points_to_pts(s_module.points,s_module.size,s_slide);
			}
			if (s_module.links.length > 0 && !block_links){
				this.links = copy_2d_array(s_module.links);
			}
			
		}
		

		if (s_module.age != 1){
			this.age = s_module.age;
		}

		
	}
	
}

function points_to_pts(points_array,points_size,s_slide){//NEWPOLY
	let logger = round(present_view[s_slide].log + log(points_size.x+points_size.y)/log(10),0);
	let pts = [];
	for (let pt of points_array){
		pts.push([round(pt.x, logger),round(pt.y, logger)]);
	}
	return pts;	
}


function pp_to_prin(poly_module,p){
	return poly_module.points[p].copy().mult(poly_module.size).div(2).rotate(poly_module.angle).add(poly_module.pos);
}
