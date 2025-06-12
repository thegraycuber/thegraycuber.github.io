class Palette {
	constructor(scheme) {
		this.getColors(scheme) 
	}
	
	getColors(scheme) {
		
		if (scheme == 'Electric'){
			this.front = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(40,69,140);
			this.accent = [color(215,247,91),
										 color(35,210,231),
										 color(225,133,220)];
			this.link = color(35,210,231);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(84,68,136);
			this.accent = [color(229,104,110),
										 color(242,199,111),
										 color(160,132,220)];
			this.link = color(160,132,220);
		
		} else if (scheme == 'Forest'){
			this.front = color(214,221,204);
			this.back = color(6,58,42);
			this.backlight = color(22,85,63);
			this.accent = [color(63,189,117),
										 color(190,84,75),
										 color(205,173,50)];
			this.link = color(63,189,117);
			
		} else if (scheme == 'Autumn'){
			this.front = color(255,229,181);
			this.back = color(72,42,30);
			this.backlight = color(110,65,35);
			this.accent = [color(210,72,40),
										color(255,130,66),
										color(250,202,48)];
			this.link = color(255,130,66);
			
		} else if (scheme == 'Dark'){
			this.front = color(200,202,245);
			this.back = color(32,33,63);
			this.backlight = color(55,56,97);
			this.accent = [color(132,152,240),
										 color(216,111,154),
										 color(44,218,157)];
			this.link = color(132,152,240);
			
		} else if (scheme == 'Light'){

			this.front = color(61,80,96);
			this.back = color(215,224,249);
			this.backlight = color(170,180,193);
			this.accent = [color(251,174,0),
										 color(0,175,84),
										 color(0,124,216)];
			this.link = color(0,124,216);
			
		}
		this.backalpha = color(red(this.back),green(this.back),blue(this.back));
		this.backalpha.setAlpha(150);
	}
	
}

function give_fill(fill_index){
	if (fill_index == -1){
		fill(palette.front);
	} else {
		fill(palette.accent[fill_index]);
	}
}