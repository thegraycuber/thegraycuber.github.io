

class Icon {
	constructor(type, displaySize, stroke, coords) {
		this.Type = type;
		this.Size = displaySize;
		this.Radius = [displaySize[0]/2,displaySize[1]/2];
		this.Stroke = stroke;
		this.Coords = coords;
	}
	show() {
		if (this.Type == 'copy') {
			noFill();
			strokeWeight(this.Stroke);
			stroke(palette.front);
			rect(this.Coords[0]-this.Size[0]*0.1, this.Coords[1]-this.Size[1]*0.15,this.Size[0]*0.5,this.Size[1]*0.72,this.Size[0]*0.12);
			stroke(palette.back);
			fill(palette.back);
			rect(this.Coords[0]+this.Size[0]*0.2, this.Coords[1]+this.Size[1]*0.15,this.Size[0]*0.5+this.Stroke*3,this.Size[1]*0.72+this.Stroke*3,this.Size[0]*0.12);
			stroke(palette.front);
			rect(this.Coords[0]+this.Size[0]*0.2, this.Coords[1]+this.Size[1]*0.15,this.Size[0]*0.5,this.Size[1]*0.72,this.Size[0]*0.12);
			noStroke();
		} else if (this.Type == 'paste') {
			noFill();
			strokeWeight(this.Stroke);
			stroke(palette.front);
			rect(this.Coords[0], this.Coords[1],this.Size[0]*0.7,this.Size[1],this.Size[0]*0.15);
			noStroke();
			fill(palette.back);
			rect(this.Coords[0], this.Coords[1]-this.Radius[1],this.Size[0]*0.45,this.Size[1]*0.4);
			fill(palette.front);
			rect(this.Coords[0], this.Coords[1]-this.Radius[1],this.Size[0]*0.32,this.Size[1]*0.16,this.Size[0]*0.05);
		} else if (this.Type == 'heart') {
			fill(palette.front);
			beginShape();
			for (var h = 0; h < TWO_PI; h+=0.1){
				vertex(this.Coords[0]+this.Radius[0]*(-0.5+0.4*pow(sin(h),3)), this.Coords[1]-this.Radius[1]*(0.6+0.06*0.4*(13*cos(h)-5*cos(2*h)-2*cos(3*h)-cos(4*h))));
			}
			endShape(CLOSE);	
			beginShape();
			for (h = 0; h < TWO_PI; h+=0.1){
				vertex(this.Coords[0]+this.Radius[0]*0.4*pow(sin(h),3), this.Coords[1]-this.Radius[1]*(-0.3+0.06*0.4*(13*cos(h)-5*cos(2*h)-2*cos(3*h)-cos(4*h))));
			}
			endShape(CLOSE);
			beginShape();
			for (h = 0; h < TWO_PI; h+=0.1){
				vertex(this.Coords[0]+this.Radius[0]*(0.6+0.4*pow(sin(h),3)), this.Coords[1]-this.Radius[1]*(0.4+0.06*0.4*(13*cos(h)-5*cos(2*h)-2*cos(3*h)-cos(4*h))));
			}
			endShape(CLOSE);
			
		} else if (this.Type == 'rand') {
			noFill();
			stroke(palette.front);
			strokeWeight(this.Stroke);
			beginShape();
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]-this.Size[1]*0.5);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0], this.Coords[1]+this.Size[1]*0.5);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			vertex(this.Coords[0], this.Coords[1]+this.Size[1]*0.5);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]);
			endShape();
			ellipse(this.Coords[0], this.Coords[1]-this.Size[1]*0.25,this.Size[0]*0.06, this.Size[1]*0.04);
			ellipse(this.Coords[0]-this.Size[0]*0.28, this.Coords[1]+this.Size[1]*0.025,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]-this.Size[0]*0.15, this.Coords[1]+this.Size[1]*0.2,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]+this.Size[0]*0.31, this.Coords[1]-this.Size[0]*0.015,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.23, this.Coords[1]+this.Size[1]*0.12,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.14, this.Coords[1]+this.Size[1]*0.26,this.Size[0]*0.03, this.Size[1]*0.05);
			noStroke();
		}
	}
	clicked() {
		if(mouseX > this.Coords[0] + this.Radius[0] || mouseX < this.Coords[0] - this.Radius[0]){
			return;
		}
		
		if (this.Type == 'rand'){
			randomize();
			reset_shapes();
		} else if (this.Type == 'copy'){
			var code = ''
			for (var mi of main_items){
				code += mi.List[mi.Index].substring(0,3) + ",";
			}
			copyToClipboard(code.substring(0,code.length-1));
		} else if (this.Type == 'paste'){
			pasting = true;
			input_setup();
			reset_shapes();
		} else if (this.Type == 'heart'){
			fav = (fav + 1)%favorites.length;
			input_settings(favorites[fav]);
			reset_shapes();
		}
	}
}


function randomize(){
	for (var mi of main_items){
		mi.randomize();
	}
}

function input_settings(input_str){
	var input_values = input_str.trim().split(',');
	if (main_items.length != input_values.length){
		return "Invalid Input Length";
	}
	
	var input_fail = 0;
	for (var m = 0; m < main_items.length; m++){
		var try_result = main_items[m].tryGive(input_values[m]);
		if (!try_result){
			input_fail++;
		}
	}
	if (input_fail == 0){
		for (var shp of shapes){
			shp.radius_theta= 0;
			shp.radius = 1;
			shp.start = 0;
		}
		return "";
	} else {
		return str(input_fail) + "/14 Codes Invalid";
	}
}
var pasting = false;

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

var paste_input, paste_go;
function input_setup(){
  paste_input.style("visibility", "visible");
  paste_go.style("visibility", "visible");
}

function button_style(button_in,back,front,input,x,y,w,h,fontsize,bordersize = 0, rad = 0.1){
  button_in.style("font-size", int(unit*fontsize) + "px");
  button_in.style("border-radius", int(unit*rad) + "px");
  button_in.size(unit*w, unit*h);
	button_in.position(x, y);
  button_in.style("visibility", "hidden");
	if (input){
  	button_in.style("border", int(unit*bordersize) + "px solid");
		button_in.addClass('cursed_input');
	} else {
		button_in.addClass('cursed_button');
	}
	button_color(button_in,back,front,input);
}

function button_color(button_in,back,front,input){
  button_in.style("background-color", back);
  button_in.style("color", front);
	if (input){
  	button_in.style("border-color", front);
	}
}

function get_paste(){
	invalid_text = input_settings(paste_input.value());
	paste_input.value('');
	pasting = false;
  paste_input.style("visibility", "hidden");
  paste_go.style("visibility", "hidden");
	
	if (invalid_text.length > 0){
		invalid_tick = 50;
	}
}

var favorites = [
	'Squ,1,Rot,Reg,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi', //dual flower
	'Hex,-1,Off,Reg,11g,-4,Rot,Reg,Cir,3,Off,Reg,Off,Poi', //sunburst
	'Pen,-1,Rot,Smo,10g,1,Rot,Flo,Pen,-2,Rad,Smo,Off,Poi', //
	'13g,-1,Rot,Reg,Spi,2,Rot,Reg,Spi,-2,Rot,Reg,Off,Off', // doodle
	'Oct,1,Rot,Reg,13g,-6,Off,Flo,Cir,2,Off,Reg,Off,Poi', // framed
	'Pen,2,Rot,Flo,Cir,-1,Off,Reg,Pen,1,Off,Flo,Gri,Poi', // folding petals
	'Hex,1,Rot,Wig,13g,5,Off,Smo,Cir,2,Rad,Reg,Gri,Off', //wobbly leaf
	'Hex,-1,Rad,Wig,Hex,-1,Rot,Wig,Tri,-1,Off,Wig,Gri,Poi', // worm gemini
	'10g,3,Off,Smo,Tri,1,Rad,Smo,10g,-1,Off,Smo,Gri,Off', // secret circle
	'13g,-1,Rad,Wig,12g,-5,Rot,Flo,Tri,1,Rot,Flo,Off,Poi', // patrick rave
	'10g,3,Off,Flo,Spi,2,Rot,Reg,Tri,1,Off,Smo,Gri,Off',// kid drew a sun
	'12g,1,Off,Wig,Cir,-4,Off,Reg,12g,-5,Rot,Flo,Off,Poi',//bounce
	'12g,5,Rot,Reg,Cir,3,Off,Reg,Tri,1,Rad,Smo,Off,Poi',// flower
	'Tri,1,Off,Reg,Cir,4,Off,Reg,Oct,-3,Rot,Reg,Off,Poi'
]
var fav = 0;