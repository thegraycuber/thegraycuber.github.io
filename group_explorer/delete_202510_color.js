
var palette_names = ['Forest','Sunset','Dark','Light','Autumn','Electric'];
var palette_index = 0;
class Palette {
	constructor(scheme) {
		
		this.rev = 1;
		if (scheme == 'Electric'){
			this.front = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(50,75,150);
			this.bright = color(215,247,91);
			this.red = color(225,133,220);
			this.mono = color(35,210,231);
			this.gray = color(161,185,212);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(84,68,136);
			this.red = color(229,104,110);
			this.bright = color(242,199,111);
			this.mono = color(160,132,220);
			this.gray = color(140,132,158);
		
		} else if (scheme == 'Forest' || scheme == 'Current'){
			this.front = color(214,221,204);
			this.back = color(6,58,42);
			this.backlight = color(22,85,63);
			this.mono = color(63,189,117);
			this.red = color(238,128,96);
			this.bright = color(205,173,50);
			this.gray = color(173,178,173);
			
		} else if (scheme == 'Autumn'){
			this.front = color(255,229,181);
			this.back = color(72,42,30);
			this.backlight = color(110,65,35);
			this.mono = color(255,130,66);
			this.bright = color(250,202,48);
			this.red = color(210,72,40);
			this.gray = color(110,106,90);
			
		} else if (scheme == 'Dark'){
			this.front = color(200,202,245);
			this.back = color(32,33,63);
			this.backlight = color(55,56,97);
			this.mono = color(132,152,240);
			this.red = color(216,111,154);
			this.bright = color(44,218,157);
			this.gray = color(140,142,180);
			
		} else if (scheme == 'Light'){
			this.front = color(35,57,91);
			this.back = color(209,209,209);
			this.backlight = color(170,172,178);
			this.mono = color(0,124,216);
			this.red = color(137,42,147);
			this.bright = color(0,175,84);
			this.gray = color(120,120,120);
			this.rev = -1;
			
		}
		
		this.accent = [ this.bright,
										this.mono,
									 	this.red
									];
		
		this.backalpha = color(red(this.back),green(this.back),blue(this.back),200);
		this.dark = color(int(red(this.back)*0.75),int(green(this.back)*0.75),int(blue(this.back)*0.75));
		this.medium = lerpColor(this.back,this.front,0.3);
	}
	

}

function give_fill(fill_index,defaul='front'){
	if (fill_index == -1){
		if (defaul == 'none'){
			noFill();
		} else {
			fill(palette[defaul]);
		}
	} else {
		fill(palette.accent[fill_index]);
	}
}

function give_stroke(stroke_index,defaul='front'){
	if (stroke_index == -1){
		if (defaul == 'none'){
			noStroke();
		} else {
			stroke(palette[defaul]);
		}
	} else {
		stroke(palette.accent[stroke_index]);
	}
}
