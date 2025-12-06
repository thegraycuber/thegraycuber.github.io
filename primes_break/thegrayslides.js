
var slide, slide_data;
var tgs_default_origin, tgs_origin, tgs_default_scalar, tgs_scalar;

function tgs_setup(scale_adjust){
	
	let wid = min(width,height*16/9);
	tgs_scalar = scale_adjust*wid/1920;
	tgs_default_scalar = tgs_scalar;
	tgs_origin = createVector(width/2,height/2);
	// tgs_origin = createVector(0,0);
	tgs_default_origin = tgs_origin.copy();
	present_view = [new PresentView(1,0,0)];
	
	image_load();
	ellipseMode(CENTER);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	textFont(mainBold);
	imageMode(CENTER);
}

function tgs_next_slide(){

	display_index = display_slides.indexOf(slide);
	if (display_index != -1){
		if (display_D[display_index] != D || display_D[display_index] == -7){
			D = display_D[display_index];
			reset_D();
		}
	} else {
		D = 0;
	}

	
	if (slide + 1 < modules.length){
		slide++;
		prep_presentation();
		
	}
	last_display = Date.now();
}

var last_display;
function tgs_display(){
	load_slide_data();
	
	resetMatrix();
	translate(tgs_origin.x,tgs_origin.y,0);
	scale(tgs_scalar,tgs_scalar,1);
	
	if (present_ticker <= 1){
		present_ticker = min(1,round(present_ticker+(Date.now()-last_display)*0.03*tgs_present_speed,3));
		last_display = Date.now();
		
		lerp_bounce = sin(present_ticker*PI*0.63)/0.918;
		lerp_smooth = (sin((present_ticker-0.5)*PI)+1)/2;
		lerp_abrupt = floor(present_ticker);
		for (let p_module of present_modules){
			p_module.lerpModule();
		}
	
		tgs_scalar = lerp(present_view[slide-1].scalar,present_view[slide].scalar,lerp_smooth);
		tgs_origin = p5.Vector.lerp(present_view[slide-1].origin,present_view[slide].origin,lerp_smooth);
	}

	for (let p_module of present_modules){
		p_module.display();
	}
	
	
}



function tgs_color(plt){
	
	plt.backpale = color(red(plt.back),green(plt.back),blue(plt.back),40);
	plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),200);
	plt.backbeta = color(red(plt.back),green(plt.back),blue(plt.back),150);
	plt.backtrans = color(red(plt.back),green(plt.back),blue(plt.back),0);
	plt.backlight = lerpColor(plt.back,plt.mono,0.2);

	plt.medium = lerpColor(plt.back,plt.mono,0.5);
	plt.monoalpha = color(red(plt.mono),green(plt.mono),blue(plt.mono),50);
	
	plt.colors = [
		plt.front,
		plt.mono,
		plt.bright,
		plt.red,
		plt.gray,
		plt.medium,
		plt.backlight,
		plt.back,
		plt.backtrans,
	];
}

function tgs_color_update(){
	
	for (let slide_mods of modules){
			for (let m of slide_mods){
				giveColors(m);
			}
		}
	
			for (let m of present_modules){
				giveColors(m);
			}
}

function draw_wiggle(wigglers,end_wiggler = wigglers.length){
	beginShape();
			
	vertex(wigglers[0].x,wigglers[0].y);
	for (let p = 3; p < end_wiggler ; p += 3){
		bezierVertex(wigglers[p-2].x,wigglers[p-2].y, wigglers[p-1].x,wigglers[p-1].y, wigglers[p].x,wigglers[p].y);
	}

	endShape();
}

function drawTri(x,y,d){
	triangle(x+d,y,x-d,y+d,x-d,y-d);
}

var modules = [];
var present_view = [];

class PresentView{
	constructor(view_size, view_x, view_y){
		this.size = view_size;
		this.pos = createVector(view_x, view_y);
		this.scalar = tgs_default_scalar*view_size;
		this.origin = p5.Vector.sub(tgs_default_origin,[view_x*this.scalar, view_y*this.scalar]);
		this.log = max(0,round(log(view_size)/log(10)));
	}
	copy(){
		return new PresentView(this.size,this.pos.x,this.pos.y)
	}
}


var slides_loaded = 0;
function load_slide_data(){
	
	let data_keys = Object.keys(slide_data);
	while (slides_loaded < data_keys.length){
		
		let d = slide_data[data_keys[slides_loaded]];

		if (typeof d.view != 'undefined'){
			while (present_view.length < d.s){
				present_view.push(present_view[present_view.length-1].copy());
			}
			
			present_view.push(new PresentView(...d.a));
			tgs_scalar = present_view[present_view.length-1].scalar;
			tgs_origin = present_view[present_view.length-1].origin.copy();
			slides_loaded++;
			continue;
		}

		let connected = false;
		if (typeof d.anim == 'undefined' || animations[d.anim] == 'connect' || animations[d.anim] == 'wiggle'){
			let test_parent = slides_loaded - 1;
			while (test_parent > -1){
				if (slide_data[data_keys[test_parent]].s + 1 < d.s){
					break;
				}
				if (slide_data[data_keys[test_parent]].s + 1 == d.s && slide_data[data_keys[test_parent]].i == d.i){
					simple_fill(d, slide_data[data_keys[test_parent]]);
					connected = true;
					break;
				}
				test_parent--;
			}
		}

		if (!connected){
			simple_fill(d, module_defaults[0][d.t]);
		}
		
		while (modules.length <= d.s){
			modules.push([]);
		}
		
		slide = d.s;
		if (d.t == 't'){
			modules[d.s].push(new TextModule(d));
		} else if (d.t == 's'){
			modules[d.s].push(new ShapeModule(d));
		} else if (d.t == 'a'){
			modules[d.s].push(new ArrowModule(d));
		} else if (d.t == 'i'){
			modules[d.s].push(new ImageModule(d));
		}
		
		slides_loaded++;
		slide = 0;
	}
	
	while (present_view.length < modules.length){
		present_view.push(present_view[present_view.length-1].copy());
	}

}


class TextModule{
	
	constructor(input_module, id = input_module.i){
		// console.log(input_module)
		this.pos = createVector(input_module.x,input_module.y);
		this.border = createVector(input_module.w,input_module.h);
		this.stroke = input_module.stk;
		
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.text = input_module.txt;
		this.color = input_module.col;
		this.inverted = input_module.inv == 1;
		this.dim = input_module.dim == 1;
		this.text_size = input_module.txts;
		
		//this.blinker = -1;
		this.type = 'text';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		if (typeof input_module.age === "undefined"){
			this.age = 1;
		} else {
			this.age = input_module.age;
		}
	
		this.giveSizes();
		//giveDirection(this);
		giveColors(this);
		//this.set_extremes();
	
	}
	
	display(){	
	
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		
		// if (this.inverted){
			strokeWeight(this.stroke);
			stroke(this.stroke_color);
		// } else {
		// 	noStroke();
		// }
		
		fill(this.fill_color);
		rect(0,0,this.size.x,this.size.y);
		
		noStroke();
		textSize(this.text_size);
		textLeading(this.text_size);
		
		if (this.text == '$morph$'){
			fill(this.start_text_color);
			text_display(this.start_text,this.text_size,this.start_offset);
			fill(this.end_text_color);
			text_display(this.end_text,this.text_size,this.end_offset);
		}  else {
			fill(this.stroke_color);
			text_display(this.text,this.text_size);
		}
		
		pop();
		
	}
	
	
	giveSizes(){		
		
		textSize(this.text_size);
		let line_string = '';
		let max_line_size = 0;
		let b_line_start = 0;
		let b_line_end = this.text.length;
		
		let auto_y = this.text_size;//*1.4;
		this.blinker_y = 0;
		for (let chr = 0; chr < this.text.length; chr++){
			if (this.text.substring(chr,chr+1) == '\n'){
				auto_y += this.text_size;
				max_line_size = max(max_line_size,textWidth(line_string));
				line_string = '';
				if (this.blinker > chr){
					this.blinker_y += 0.5;
					b_line_start = chr + 1;
				} else {
					this.blinker_y -= 0.5;
					b_line_end = min(b_line_end,chr);
				}
				
			} else {
				line_string += this.text.substring(chr,chr+1);
			}
		}
		
		let half_width = textWidth(this.text.substring(b_line_start,b_line_end))/2;
		let left_width = textWidth(this.text.substring(b_line_start,this.blinker));
		this.blinker_x = left_width - half_width;
		
		max_line_size = max(max_line_size,textWidth(line_string));
		line_string = '';
		this.size = createVector(this.border.x+max_line_size+this.text_size*0.2, this.border.y + auto_y);
		//this.set_extremes();
	}
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_text_size = startModule.text_size;
		this.start_stroke = startModule.stroke;
		this.start_stroke_color = startModule.stroke_color;
		this.start_fill_color = startModule.fill_color;
		this.start_angle = startModule.angle;
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size.copy();
		this.start_text_size = this.text_size;
		this.start_stroke = this.stroke;
		this.start_stroke_color = palette.backtrans;
		this.start_fill_color = color(red(this.fill_color),green(this.fill_color),blue(this.fill_color),0);
		this.start_angle = this.angle;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_text_size = endModule.text_size;
		this.end_stroke = endModule.stroke;
		this.end_stroke_color = endModule.stroke_color;
		this.end_fill_color = endModule.fill_color;
		this.end_angle = endModule.angle;
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_text_size = this.text_size;
		this.end_stroke = this.stroke;
		this.end_stroke_color = palette.backtrans;
		this.end_fill_color = palette.backtrans;
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
		this.stroke = lerp(this.start_stroke,this.end_stroke,lerp_val);
		
		if (this.text == '$morph$'){
			this.start_text_color = lerpColor(this.stroke_color,palette.backtrans,lerp_val);
			this.end_text_color = lerpColor(this.stroke_color,palette.backtrans,1-lerp_val);
			
			this.start_offset = lerp(this.start_s_offset,this.end_s_offset,lerp_val);
			this.end_offset = lerp(this.start_e_offset,this.end_e_offset,lerp_val);
			
		}/* else {
			this.giveSizes();
		}*/
	}
	
	duplicate(){
		return new TextModule(new Simple(this));
	}
	
}

function text_display(display_str, display_size, x_off = 0, y_off = 0){
		if (display_str == 'e_'){
			text('e',x_off,-display_size*0.05+y_off);
			text('..',x_off,display_size*0.2+y_off);
	} else {
		text(display_str,x_off,-display_size*0.05+y_off);
	}
}


class ShapeModule{
	
	constructor(input_module, id = input_module.i){
		
		this.pos = createVector(input_module.x,input_module.y);
		this.size = createVector(input_module.w,input_module.h);
		this.stroke = input_module.stk;
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.shape = input_module.shp;
		this.color = input_module.col;
		this.inverted = input_module.inv == 1;
		this.dim = input_module.dim == 1;
		
		this.type = 'shape';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		if (typeof input_module.age === "undefined"){
			this.age = 1;
		} else {
			this.age = input_module.age;
		}
	
		//giveDirection(this);
		giveColors(this);
		//this.set_extremes();
	}
	
	
	display(){
		
		// if (this.inverted){
		// 	noStroke();
		// } else {
			strokeWeight(this.stroke);
			stroke(this.stroke_color);
		//}
		fill(this.fill_color);
		
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		if (this.shape == 1){ //ellipse
			ellipse(0,0,this.size.x,this.size.y);
			
		} else if (this.shape == 2){ //rectangle
			rect(0,0,this.size.x,this.size.y);
			
		} else if (this.shape == 0){ // x
			beginShape();
			vertex(this.size.x*0.5,this.size.y*0.4);
			vertex(this.size.x*0.4,this.size.y*0.5);
			vertex(0,this.size.y*0.1);
			vertex(-this.size.x*0.4,this.size.y*0.5);
			vertex(-this.size.x*0.5,this.size.y*0.4);
			vertex(-this.size.x*0.1,0);
			vertex(-this.size.x*0.5,-this.size.y*0.4);
			vertex(-this.size.x*0.4,-this.size.y*0.5);
			vertex(0,-this.size.y*0.1);
			vertex(this.size.x*0.4,-this.size.y*0.5);
			vertex(this.size.x*0.5,-this.size.y*0.4);
			vertex(this.size.x*0.1,0);
			endShape(CLOSE);
			
		} else if (this.shape == -1){ // right triangle

			triangle(-this.size.x*0.5,this.size.y*0.5,this.size.x*0.5,this.size.y*0.5,-this.size.x*0.5,-this.size.y*0.5);
			
		} else if (this.shape == -2){ // arrow

			beginShape();
			vertex(this.size.x*0.5,0);
			vertex(this.size.x*0.1,this.size.y*0.5);
			vertex(this.size.x*0.1,this.size.y*0.2);
			vertex(this.size.x*-0.5,this.size.y*0.2);
			vertex(this.size.x*-0.5,-this.size.y*0.2);
			vertex(this.size.x*0.1,-this.size.y*0.2);
			vertex(this.size.x*0.1,-this.size.y*0.5);
			endShape(CLOSE);
					
		} else if (this.shape == -3){ // star
			beginShape();
			vertex(0,-this.size.y*0.5);
			vertex(-0.112*this.size.x,-0.154*this.size.y);
			vertex(-0.476*this.size.x,-0.154*this.size.y);
			vertex(-0.182*this.size.x,0.059*this.size.y);
			vertex(-0.294*this.size.x,0.405*this.size.y);
			vertex(0,0.191*this.size.y);
			vertex(0.294*this.size.x,0.405*this.size.y);
			vertex(0.182*this.size.x,0.059*this.size.y);
			vertex(0.476*this.size.x,-0.154*this.size.y);
			vertex(0.112*this.size.x,-0.154*this.size.y);
			endShape(CLOSE);
			
		} else if (this.shape == -4){ // check

			beginShape();
			vertex(this.size.x*0.5,-this.size.y*0.4);
			vertex(this.size.x*0.4,-this.size.y*0.5);
			vertex(-this.size.x*0.12,this.size.y*0.28);
			vertex(-this.size.x*0.41,this.size.y*0.02);
			vertex(-this.size.x*0.5,this.size.y*0.15);
			vertex(-this.size.x*0.1,this.size.y*0.5);
			endShape(CLOSE);
			
		} else if (this.shape == -5){ // sparkle

			beginShape();
			vertex(this.size.x*0.5,0);
			quadraticVertex(0,0,0,this.size.y*0.5);
			quadraticVertex(0,0,-this.size.x*0.5,0);
			quadraticVertex(0,0,0,-this.size.y*0.5);
			quadraticVertex(0,0,this.size.x*0.5,0);
			endShape();
			
		} else { // n-gon
			let verts = this.shape;
			beginShape();
			for (let v = 0; v < verts; v++){
				let v_ang = v*TWO_PI/verts;
				vertex(cos(v_ang)*this.size.x/2, sin(v_ang)*this.size.y/2);
			}
			endShape(CLOSE);
		} 
		pop();
		
	}
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_stroke_color = startModule.stroke_color;
		this.start_fill_color = startModule.fill_color;
		this.start_stroke = startModule.stroke;
		this.start_angle = startModule.angle;
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size;
		this.start_stroke_color = palette.backtrans;
		this.start_fill_color = color(red(this.fill_color),green(this.fill_color),blue(this.fill_color),0);
		this.start_stroke = 0;
		this.start_angle = this.angle;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_stroke_color = endModule.stroke_color;
		this.end_fill_color = endModule.fill_color;
		this.end_stroke = endModule.stroke;
		this.end_angle = endModule.angle;
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_stroke_color = palette.backtrans;
		this.end_fill_color = palette.backtrans;
		this.end_stroke = 0;
		this.end_angle = this.angle;
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
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];
	}
	
	duplicate(){
		return new ShapeModule(new Simple(this));
	}
	
}


class ArrowModule{
	
	constructor(input_module, id = input_module.i){
		
		this.pos = createVector(input_module.x,input_module.y);
		this.size = createVector(max(1,input_module.w),max(1,input_module.h));
		this.init_size = createVector(input_module.w,input_module.h);
		this.stroke = input_module.stk;
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		this.mode = input_module.mode;
		
		this.points = [];
		for (let pt of input_module.pts){
			this.points.push(createVector(pt[0],pt[1]));
		}
		this.max_point = this.points.length;
		this.giveInit();
		
		this.color = input_module.col;
		this.inverted = input_module.inv == 1;
		this.dim = input_module.dim == 1;
		
		this.type = 'arrow';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		if (typeof input_module.age === "undefined"){
			this.age = 1;
		} else {
			this.age = input_module.age;
		}
	
		//giveDirection(this);
		giveColors(this);
		//this.set_extremes();
	}
	
	display(){
		
		strokeWeight(this.stroke);
		stroke(this.stroke_color);
		noFill();
		
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		scale(this.size.x/this.init_size.x,this.size.y/this.init_size.y);
		
		draw_wiggle(this.points,this.max_point);
		fill(this.stroke_color);
		
		if (this.max_point == this.points.length && this.mode < 2){
			push();
			let last_segment = this.points[this.max_point-1].copy().sub(this.points[this.max_point-4]);
			translate(this.points[this.max_point-1]);
			rotate(atan2(last_segment.y,last_segment.x));
			drawTri(0,0,this.stroke*1.5);
			pop();
		}
		
		if ((this.mode % 2) == 1){
			push();
			let first_segment = this.points[0].copy().sub(this.points[3]);
			translate(this.points[0]);
			rotate(atan2(first_segment.y,first_segment.x));
			drawTri(0,0,this.stroke*1.5);
			pop();
		}
		pop();
	}

	giveInit(){
		if (this.max_point > 1){
			let arrow_width = max(1,abs(this.points[0].x - this.points[this.points.length-1].x));
			let arrow_height = max(1,abs(this.points[0].y - this.points[this.points.length-1].y));
			this.init_size = createVector(arrow_width,arrow_height);
		} else {
			this.init_size = createVector(1,1);
		}
	}
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_stroke_color = startModule.stroke_color;
		this.start_fill_color = startModule.fill_color;
		this.start_stroke = startModule.stroke;
		this.start_angle = startModule.angle;
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size;
		if (animations[this.anim] == 'snake'){
			this.start_stroke_color = this.stroke_color;	
		} else {
			this.start_stroke_color = palette.backtrans;
		}
		this.start_fill_color = this.fill_color;
		this.start_stroke = this.stroke;
		this.start_angle = this.angle;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_stroke_color = endModule.stroke_color;
		this.end_fill_color = endModule.fill_color;
		this.end_stroke = endModule.stroke;
		this.end_angle = endModule.angle;
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = this.size;
		this.end_stroke_color = palette.backtrans;
		this.end_fill_color = palette.backtrans;
		this.end_stroke = 0;
		this.end_angle = this.angle;
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
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];
		
		if (animations[this.anim] == 'snake'){
			this.max_point = this.points.length*min(lerp_val+0.01,1);
		}
	}
	
	duplicate(){
		return new ArrowModule(new Simple(this));
	}

}


function image_load(){
	
	for (let i = 0; i < image_list.length; i++){
		image_list[i] = new ImportedImage(image_list[i]);
	}
}

class ImportedImage{
	constructor(path){
		this.path = path.substring(path.indexOf("/")+1);
		this.image = loadImage(path);
	}
}



class ImageModule{
	
	constructor(input_module, id = input_module.i){

		this.pos = createVector(input_module.x,input_module.y);
		this.stroke = input_module.stk;
		
		this.path = input_module.path;
		this.size = createVector(input_module.w,input_module.h);
		for (let i = 0; i < image_list.length; i++){
			if (image_list[i].path == this.path){
				this.image_index = i;
			}
		}
		
		this.angle = input_module.ang;
		this.cos = cos(this.angle);
		this.sin = sin(this.angle);
		
		this.color = input_module.col;
		this.dim = input_module.dim == 1;
		
		this.aspect = image_list[this.image_index].image.width/image_list[this.image_index].image.height;
		
		this.type = 'image';
		this.anim = input_module.anim;
		
		this.index = modules[slide].length;
		this.id = id;
		
		if (typeof input_module.age === "undefined"){
			this.age = 1;
		} else {
			this.age = input_module.age;
		}
	
		giveColors(this);
		//giveDirection(this);
		//this.set_extremes();
	}
	
	
	display(){		
		push();
		translate(this.pos.x,this.pos.y);
		rotate(this.angle);
		image(image_list[this.image_index].image,0,0,this.size.x,this.size.y);

		noFill();
		strokeWeight(this.stroke);
		stroke(this.stroke_color);
		rect(0,0,this.size.x,this.size.y);
		
		pop();
		
	}
	
	
	startAt(startModule){
		this.start_pos = startModule.pos;
		this.start_size = startModule.size;
		this.start_angle = startModule.angle;
		this.start_stroke_color = startModule.stroke_color;
		this.start_stroke = startModule.stroke;
	}
	
	startEmpty(){
		this.start_pos = this.pos;
		this.start_size = this.size;
		this.start_angle = this.angle;
		this.start_stroke_color = palette.backtrans;
		this.start_stroke = 0;
	}
	
	endAt(endModule){
		this.end_pos = endModule.pos;
		this.end_size = endModule.size;
		this.end_angle = endModule.angle;
		this.end_stroke_color = endModule.stroke_color;
		this.end_stroke = endModule.stroke;
	}
	
	endEmpty(){
		this.end_pos = this.pos;
		this.end_size = createVector(1,1);
		this.end_angle = this.angle;
		this.end_stroke_color = palette.backtrans;
		this.end_stroke = 0;
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
		this.angle = lerp(this.start_angle,this.end_angle,lerp_val) + wigg[1];
	}
	
	duplicate(){
		return new ImageModule(new Simple(this));
	}

}

function giveColors(module){
	
	if (module.age != 1){
		// if (mouse_state == 'presenting'){
			module.fill_color = palette.backtrans;
			module.stroke_color = palette.backtrans;
			
		// } else {
		// 	module.fill_color = palette.monoalpha;
		// 	module.stroke_color = palette.monoalpha;
		// }
		return;
	}
	
	if (module.inverted){
		module.fill_color = palette.colors[module.color];
		module.stroke_color = palette.back;
	} else {
		module.fill_color = palette.backtrans;
		module.stroke_color = palette.colors[module.color];
	}

	if (module.dim){
		module.stroke_color = lerpColor(module.stroke_color,palette.back,0.8);
		if (module.inverted){
			module.fill_color = lerpColor(module.fill_color,palette.back,0.8);
		}
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

function get_parent(child_module, child_slide){

	if (typeof child_module.anim != 'undefined' && animations[child_module.anim] != 'connect' && animations[child_module.anim] != 'wiggle'){
		return;
	}
	for (let test_parent of modules[child_slide-1]){
	
		if (test_parent.id != child_module.id || test_parent.type != child_module.type){
			continue;
		}

		return test_parent;
	}

	child_module.anim = animations.indexOf('smooth');
}


function wiggle_adjust(module){
	
	if (animations[module.anim] == 'wiggle'){
		return [1+0.3*(sin(lerp_smooth*PI)**0.5),0.16*sin(constrain(lerp_smooth*2.4*PI,0,TWO_PI))];
	} else {
		return [1,0];
	}
}

function simple_fill(module_to_fill, parent_module){
	for (let key of Object.keys(parent_module)){
		if (typeof module_to_fill[key] == 'undefined' && !['age','default'].includes(key)){
			module_to_fill[key] = parent_module[key];
		}
	}
}

class Simple{
	
	constructor(s_module,s_slide){
		
		this.x = round(s_module.pos.x);
		this.y = round(s_module.pos.y);
		this.w = round(s_module.size.x);
		this.h = round(s_module.size.y);
		this.ang = round(s_module.angle,2);
		
		this.id = s_module.id;
		this.anim = s_module.anim;
		
		if (this.type != 'image'){
			this.col = s_module.color;
			this.stk = s_module.stroke;
			this.inv = +s_module.inverted;
		}
		this.dim = +s_module.dim;
		
		this.t = s_module.type.substring(0,1);
		this.s = s_slide;
		this.i = s_module.index;
		
		if (s_module.type == 'text'){
			this.txt = s_module.text;
			this.txts = s_module.text_size;
			this.w = round(s_module.border.x);
			this.h = round(s_module.border.y);
			
		} else if (s_module.type == 'shape'){
			this.shp = s_module.shape;
			
		} else if (s_module.type == 'arrow'){
			this.mode = s_module.mode;
			this.pts = [];
			for (let pt of s_module.points){
				this.pts.push([round(pt.x),round(pt.y)]);
			}
			
		} else if (s_module.type == 'image'){
			this.path = s_module.path;
			
		}

		if (s_module.age != 1){
			this.age = s_module.age;
		}
		
	}
	
}


var present_modules = [];
var lerp_bounce, lerp_smooth, lerp_abrupt, present_ticker;
var animations = ['smooth','bounce','abrupt','connect','snake','wiggle'];

function prep_presentation(){
	
	present_ticker = 0;
	
	present_modules = [];
	let prior_connected = [];
	for (let _ = 0; _ < modules[slide - 1].length; _++){
		prior_connected.push(false);
	}
	
	
	for (let module of modules[slide]){

		let present_mod;
		let prior_mod = get_parent(module, slide);

		if (typeof prior_mod != 'undefined'){

			prior_connected[prior_mod.index] = true;
			
			present_mod = prior_mod.duplicate();
			present_mod.startAt(prior_mod);
			present_mod.endAt(module);
			present_mod.anim = module.anim;
			
			if (module.type == 'text' && module.text != prior_mod.text){
				present_mod.text = '$morph$';
				present_mod.start_text = prior_mod.text;
				present_mod.end_text = module.text;
				
				let s_len = present_mod.start_text.length;
				let e_len = present_mod.end_text.length;
				let min_len = min(s_len,e_len);
				
				let left_share = 0;
				while (left_share < min_len){
					if (present_mod.start_text.substring(left_share,left_share+1) == present_mod.end_text.substring(left_share,left_share+1)){
						left_share++;
					} else {
						break;
					}
				}
						
				let right_share = 0;
				while (right_share < min_len){
					if (present_mod.start_text.substring(s_len-right_share-1,s_len-right_share) == present_mod.end_text.substring(e_len-right_share-1,e_len-right_share)){
						right_share++;
					} else {
						break;
					}
				}
				
				if (right_share > left_share){
					let s_excess = present_mod.start_text.substring(0,s_len-right_share);
					let e_excess = present_mod.end_text.substring(0,e_len-right_share);
							
					textSize(present_mod.start_text_size);
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = (textWidth(s_excess)-textWidth(e_excess))/2;
					
					textSize(present_mod.end_text_size);
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = (textWidth(e_excess)-textWidth(s_excess))/2;
					
				} else if (left_share > 0) {
					let s_excess = present_mod.start_text.substring(left_share,s_len);
					let e_excess = present_mod.end_text.substring(left_share,e_len);
					
					textSize(present_mod.start_text_size);
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = (textWidth(e_excess)-textWidth(s_excess))/2;
					
					textSize(present_mod.end_text_size);
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = (textWidth(s_excess)-textWidth(e_excess))/2;
					
				} else {
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = 0;
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = 0;
				}
						
			}
				
		} else {
			
			present_mod = module.duplicate();
			present_mod.startEmpty();
			present_mod.endAt(module);
			
			if (animations[module.anim] == 'bounce'){
				present_mod.start_text_size = 0;
				present_mod.start_size = createVector(0,0);
			} else if (animations[module.anim] == 'spin'){
				present_mod.start_text_size = 0;
				present_mod.start_size = createVector(0,0);
				present_mod.start_angle = present_mod.end_angle + TWO_PI*(floor(random()*2)*2-1);
			}
		}
		
		present_modules.push(present_mod);
	}
	
	let fading_modules = [];
	for (let module of modules[slide-1]){
		if (prior_connected[module.index]){continue;}
		
		let fading_mod = module.duplicate();
		fading_mod.startAt(module);
		fading_mod.endEmpty();
		fading_mod.anim = animations.indexOf('smooth');
		
		fading_modules.push(fading_mod);
	}
	present_modules = fading_modules.concat(present_modules);
}



var module_defaults = [{
  "t":
  {
    "x": 0,
    "y": 0,
    "w": 0,
    "h": 0,
    "ang": 0,
    "id": 0,
    "txt": "enter text",
    "txts": 64,
    "anim": 0,
    "col": 0,
    "stk": 0,
    "inv": 0,
    "dim": 0,
    "default": 1
  },
  "s":
  {
    "x": 0,
    "y": 0,
    "w": 64,
    "h": 64,
    "ang": 0,
    "id": 0,
    "shp": 2,
    "anim": 0,
    "col": 0,
    "stk": 0,
    "inv": 1,
    "dim": 0,
    "default": 1
  },
  "a":
  {
    "x": 0,
    "y": 0,
    "w": 1,
    "h": 1,
    "ang": 0,
    "id": 0,
    "mode": 0,
    "pts": [],
    "anim": 4,
    "col": 0,
    "stk": 8,
    "inv": 0,
    "dim": 0,
    "default": 1
  },
  "i":
  {
    "x": 0,
    "y": 0,
    "w": 64,
    "h": 64,
    "ang": 0,
    "id": 0,
    "anim": 0,
    "dim": 0,
    "col": 0,
    "stk": 0,
    "default": 1
  }
}];
