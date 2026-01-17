

class Icon {
	constructor(type, displaySize, stroke, coords, direction = 1) {
		this.Type = type;
		this.Size = displaySize;
		this.Radius = [displaySize[0]/2,displaySize[1]/2];
		this.Stroke = stroke;
		this.Coords = coords;
		this.Direction = direction;
		this.Id = type;
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
		} else if (this.Type == 'play') {
			push();
			translate(this.Coords[0],this.Coords[1]);
			rotate(PI/4);
			rect(0,0,this.Size[0],this.Size[0]*0.12);
			rotate(PI/2);
			rect(0,0,this.Size[0],this.Size[0]*0.12);
			rotate(-3*PI/4);
			pop();
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
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]-this.Size[1]*0.5);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]-this.Size[1]*0.25);
			vertex(this.Coords[0]+this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			vertex(this.Coords[0], this.Coords[1]+this.Size[1]*0.5);
			vertex(this.Coords[0]-this.Size[0]*0.433, this.Coords[1]+this.Size[1]*0.25);
			endShape(CLOSE);
			
			line(this.Coords[0], this.Coords[1], this.Coords[0]-(this.Size[0]-this.Stroke)*0.433, this.Coords[1]-(this.Size[1]-this.Stroke)*0.25);
			line(this.Coords[0], this.Coords[1], this.Coords[0]+(this.Size[0]-this.Stroke)*0.433, this.Coords[1]-(this.Size[1]-this.Stroke)*0.25);
			line(this.Coords[0], this.Coords[1], this.Coords[0], this.Coords[1]+(this.Size[1]-this.Stroke)*0.5);
			ellipse(this.Coords[0], this.Coords[1]-this.Size[1]*0.25,this.Size[0]*0.06, this.Size[1]*0.04);
			ellipse(this.Coords[0]-this.Size[0]*0.28, this.Coords[1]+this.Size[1]*0.025,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]-this.Size[0]*0.15, this.Coords[1]+this.Size[1]*0.2,this.Size[0]*0.04, this.Size[1]*0.06);
			ellipse(this.Coords[0]+this.Size[0]*0.31, this.Coords[1]-this.Size[0]*0.015,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.23, this.Coords[1]+this.Size[1]*0.12,this.Size[0]*0.03, this.Size[1]*0.05);
			ellipse(this.Coords[0]+this.Size[0]*0.14, this.Coords[1]+this.Size[1]*0.26,this.Size[0]*0.03, this.Size[1]*0.05);
			noStroke();
		} else if (this.Type == 'arrow'){
			fill(palette.front);
			beginShape();
			vertex(this.Coords[0]+this.Radius[0]*this.Direction,this.Coords[1]);
			vertex(this.Coords[0]-0.5*this.Radius[0]*this.Direction,this.Coords[1]+this.Radius[1]*0.866);
			vertex(this.Coords[0]-0.5*this.Radius[0]*this.Direction,this.Coords[1]-this.Radius[1]*0.866);
			endShape(CLOSE);	
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
				if (mi.Shape >= funk_shapes[active_funk]){
					break;
				} else if (mi.Id == 'function'){
					code += funk_codes[mi.Index] + ",";
				} else {
					code += mi.List[mi.Index].substring(0,3) + ",";	
				}
			}
			if (mobile){
				copy_text.style("visibility", "visible");
				copy_text.attribute("value",code.substring(0,code.length-1));
				copy_label.style("visibility", "visible");
				iconBox.Items[iconBox.getIndex('copy')].Type = 'play';
				return;
			} else {
				copyToClipboard(code.substring(0,code.length-1));
			}
			
		} else if (this.Type == 'paste'){
			pasting = true;
			input_setup();
	
		} else if (this.Type == 'heart'){
			fav = (fav + 1)%favorites.length;
			input_settings(favorites[fav][0]);
			at_text = favorites[fav][1];
			at_ticker = 400;
			reset_shapes();
		}
		
		if (mobile){
			copy_text.style("visibility", "hidden");
			copy_label.style("visibility", "hidden");
			iconBox.Items[iconBox.getIndex('copy')].Type = 'copy';
		}
	}
}


function randomize(){
	mag_lerp = 0;
	for (var mi of main_items){
		mi.randomize();
	}
}


function input_settings(input_str){
	mag_lerp = 0;
	process = true;
	input_str = input_str.trim();
	if (input_str.length < 39){
		return "Invalid Input Length";
	}
	
	if (input_str.substring(0,1) != 'f'){
		let cut = input_str.length - 8;
		input_str = 'fQua' + input_str.substring(cut,input_str.length) + ',' + input_str.substring(0,cut);
	}
	
	var input_values = input_str.split(',');
	
	if (main_items.length < input_values.length){
		return "Invalid Input Length";
	}
	
	var input_fail = 0;
	for (var m = 0; m < input_values.length; m++){
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
		return "Invalid Input";
	}
}
var pasting = false;

var copy_text, copy_label;
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
	reset_shapes();
	
	if (invalid_text.length > 0){
		invalid_tick = 50;
	}
}

var favorites = [
	['fPy3,Off,Poi,Hex,-1,Off,Reg,12g,5,Rot,Smo,Cir,3,Off,Reg',''],
['fPy3,Off,Poi,Pen,1,Rot,Reg,13g,2,Rot,Wig,Cir,-1,Off,Reg','@ymperal4663'],
['Oct,-3,Rot,Wig,Pen,2,Off,Reg,Cir,2,Off,Reg,Gri,Off','@Detteraleon'],
['fQua,Gri,Poi,Hep,2,Rot,Reg,Hep,-1,Rot,Wig,Hep,3,Rot,Reg','@gergelyarpa7071'],
['fPyt,Gri,Poi,Hex,1,Tra,Wig,Hex,1,Rot,Wig',''],
['fQua,Gri,Poi,Hep,2,Tra,Wig,13g,-2,Rot,Wig,11g,5,Off,Smo','@superdreamstelly5689'],
['fQua,Gri,Off,13g,-6,Off,Flo,13g,3,Rot,Smo,13g,-2,Off,Wig','@zdohmarbleblaster2048'],
['12g,5,Rot,Reg,Hex,-1,Rad,Smo,12g,-5,Rad,Reg,Gri,Poi','@oxSoul99'],
['Squ,1,Rot,Reg,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi',''],
['fPy3,Off,Off,Spi,-3,Rot,Reg,Spi,3,Rot,Reg,Hex,1,Rot,Flo','@axolotlmaru'],
['fPy3,Gri,Poi,Pen,1,Tra,Wig,10g,-1,Rot,Flo,Hep,-1,Rad,Smo','@SoulFule101'],
['fPy3,Off,Poi,Spi,4,Rot,Reg,Spi,-4,Tra,Reg,Spi,-4,Tra,Reg','@NoenD_io'],
['fPy3,Off,Off,12g,5,Rot,Flo,Cir,-1,Tra,Reg,Spi,-1,Off,Reg',''],
['fQua,Off,Poi,Cir,-1,Rot,Reg,10g,1,Off,Flo,Oct,-1,Rot,Smo','@tornadix99'],
['13g,1,Rot,Wig,Cir,-1,Off,Reg,Oct,-3,Rad,Flo,Off,Poi','@memeing_donkey'],
['fPyt,Off,Off,9go,-1,Rot,Wig,11g,-2,Off,Wig',''],
['fQua,Off,Off,13g,1,Rot,Flo,13g,-3,Rot,Flo,13g,6,Rot,Flo','@CelloGiraffe'],
['fPy3,Off,Off,Cir,4,Rot,Reg,9go,1,Rad,Reg,10g,-3,Rad,Reg','@orrinpants'],
['Squ,1,Rot,Flo,Cir,-4,Rad,Reg,Oct,3,Rot,Flo,Off,Off','@hollow7549'],
['fPy3,Gri,Off,9go,-2,Rad,Flo,10g,1,Rot,Smo,Hex,1,Tra,Smo',''],
['fPy3,Off,Off,10g,3,Tra,Flo,Spi,2,Rot,Reg,Cir,1,Rot,Reg','@svcjunior5526'],
['12g,5,Rot,Flo,12g,1,Rad,Wig,Roc,-1,Off,Reg,Off,Off','@mutuio5841'],
['fPy3,Off,Poi,13g,-1,Rot,Smo,Hep,-2,Off,Flo,Spi,2,Off,Reg',''],
['11g,5,Rad,Smo,Hex,-1,Rot,Smo,9go,-1,Rad,Reg,Gri,Poi','@atomikiki'],
['fPyt,Gri,Off,Spi,3,Rot,Reg,Spi,-3,Tra,Reg','@Chagama9'],
['Hex,-1,Rad,Wig,Hex,-1,Rot,Wig,Tri,-1,Off,Wig,Gri,Poi',''],
['11g,5,Rad,Reg,Squ,-1,Off,Reg,11g,-1,Rot,Wig,Off,Off','@steamedeggeggegg'],
['Oct,1,Rot,Flo,Pen,-2,Rad,Reg,Spi,2,Rot,Reg,Off,Poi','@Novacozmo'],
['fPyt,Off,Poi,Hep,2,Rot,Wig,Cir,-4,Off,Reg',''],
['fQua,Gri,Poi,Roc,-1,Rad,Reg,Spi,4,Tra,Reg,13g,-4,Rot,Wig','@memeing_donkey'],
['Spi,1,Rot,Reg,Spi,4,Rad,Reg,Cir,-4,Rad,Reg,Gri,Poi','@refiredspace6930'],
['Cir,4,Rot,Reg,13g,3,Off,Flo,Hep,2,Rot,Smo,Off,Poi',''],
['fPy3,Gri,Poi,Pen,2,Rot,Reg,Hep,-2,Rad,Reg,Hep,3,Tra,Reg','@pvlchess'],
['Cir,-4,Rot,Reg,9go,4,Rot,Reg,Cir,-3,Rad,Reg,Gri,Poi','@MunawwarMusic'],
['fPy3,Gri,Poi,10g,1,Tra,Flo,Squ,1,Rad,Flo,Hex,-1,Rot,Reg',''],
['13g,1,Rad,Wig,13g,6,Rad,Wig,13g,-1,Rot,Flo,Off,Poi','@moretto6575'],
['fPy3,Gri,Poi,Oct,-1,Off,Wig,Oct,-3,Rot,Reg,Oct,1,Off,Wig','@cosmnik472'],
['fPyt,Gri,Poi,Pen,-1,Tra,Smo,Hex,1,Rot,Smo',''],
['Tri,-1,Rad,Wig,9go,1,Rad,Wig,Spi,3,Rot,Reg,Off,Off','@SmokeTranspicuators'],
['Oct,-3,Rot,Wig,12g,5,Rad,Reg,Cir,2,Off,Reg,Gri,Off','@16alpakas'],
['Hep,3,Off,Smo,12g,5,Rot,Flo,12g,-5,Rad,Flo,Gri,Poi',''],
['Tri,1,Off,Wig,Pen,2,Rad,Flo,Oct,-3,Rot,Smo,Off,Poi','@JunglinGuitarJourney'],
['Cir,-4,Rot,Reg,Spi,1,Rot,Reg,Spi,-3,Rot,Reg,Off,Off','@EnricoRodolico'],
['fPyt,Gri,Poi,9go,2,Rad,Reg,9go,-2,Rot,Smo',''],
['13g,1,Off,Reg,13g,1,Rot,Reg,13g,4,Rot,Smo,Gri,Poi','@yousseftamer4943'],
['13g,-6,Rad,Wig,13g,5,Rot,Wig,13g,3,Rad,Smo,Off,Off','@22vasudevajith2'],
['fPy3,Off,Poi,10g,3,Tra,Wig,10g,3,Rot,Smo,Pen,-2,Rot,Reg',''],
['10g,3,Off,Smo,Tri,1,Off,Smo,10g,-1,Rot,Smo,Gri,Poi','@Charred_Pickles'],
['Spi,4,Rot,Reg,Spi,-4,Rot,Reg,Spi,4,Rot,Reg,Off,Off','@joerivanlimpt9642'],
['Hex,-1,Off,Reg,11g,-4,Rot,Reg,Cir,3,Off,Reg,Off,Poi',''],
['Hex,1,Rot,Smo,Spi,4,Off,Reg,13g,-6,Off,Reg,Gri,Off','@halojack2904'],
['9go,-4,Off,Wig,12g,-1,Rot,Wig,12g,1,Rad,Smo,Off,Poi','@Guys-s5v'],
['fPy3,Gri,Off,Cir,-2,Rot,Reg,Oct,1,Rad,Flo,9go,-1,Rad,Smo',''],
['Tri,1,Rad,Reg,Cir,1,Rad,Reg,13g,-2,Rot,Flo,Gri,Poi','@cosmnik472'],
['10g,-1,Off,Reg,Squ,1,Rad,Reg,9go,-4,Rot,Reg,Off,Off','@evanurquhart9225'],
['Pen,-1,Rot,Smo,10g,1,Rot,Flo,Pen,-2,Rad,Smo,Off,Poi',''],
['Oct,-1,Rot,Flo,Cir,4,Rad,Reg,Tri,-1,Rot,Smo,Gri,Poi','@Nathan-rhino'],
['12g,-1,Rot,Wig,13g,-2,Off,Wig,11g,2,Rot,Flo,Off,Off','@a71ficial'],
['fPyt,Gri,Off,Spi,-2,Rad,Reg,Spi,3,Rad,Reg',''],
['Pen,-1,Off,Wig,Squ,-1,Rot,Smo,Spi,-1,Rot,Reg,Gri,Off','@lichenenrichedfrenchtoast'],
['11g,2,Rot,Smo,11g,4,Rad,Flo,11g,-5,Rot,Smo,Off,Poi','@Greenfire44'],
['12g,5,Rot,Reg,Cir,3,Off,Reg,Tri,1,Rad,Smo,Off,Poi',''],
['Cir,2,Rot,Reg,Hep,3,Rot,Wig,12g,-5,Rad,Flo,Gri,Poi','@jakobesparza'],
['Spi,-2,Rot,Reg,Hep,1,Rot,Reg,Hep,-3,Off,Smo,Gri,Poi','@camfunme'],
['fPy3,Gri,Poi,Hex,-1,Off,Smo,Hex,1,Rot,Smo,12g,-5,Rot,Smo',''],
['11g,-2,Rot,Wig,Hex,1,Rad,Flo,11g,4,Off,Reg,Gri,Off','@lukesquire263'],
['12g,-1,Rad,Reg,Pen,2,Rot,Reg,13g,6,Rad,Wig,Gri,Poi','@hdhejeje9681'],
['10g,3,Off,Smo,Tri,1,Rad,Smo,10g,-1,Off,Smo,Gri,Off',''],
['Pen,1,Rot,Smo,Cir,4,Rad,Reg,Hep,-2,Rot,Flo,Off,Poi','@R.B.'],
['Oct,1,Rot,Reg,Spi,1,Rad,Reg,12g,-1,Rot,Wig,Gri,Off','@bruh6942'],
['fPyt,Off,Poi,9go,-4,Off,Wig,12g,-1,Rot,Wig',''],
['13g,2,Off,Flo,Tri,1,Rad,Smo,9go,1,Rot,Wig,Off,Poi','@wcodelyoko'],
['13g,1,Rot,Smo,13g,-3,Off,Reg,Cir,1,Rot,Reg,Off,Off','@lunaamora1794'],
]
var fav = -1;
