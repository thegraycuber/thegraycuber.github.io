class Palette {
	constructor() {
	}
	
	
	getColors(color_type) {
		if (color_type == 'Forest'){
			this.front = color(214,221,204);
			this.frontalpha = color(214,221,204);
			this.back = color(6,58,42);
			this.backlight = color(44,82,63);
			this.accent = [color(214,221,204),
				color(63,189,117),
				color(205,173,50),
				color(238,128,96)];
		} else if (color_type == 'Electric'){
			this.front = color(186,219,243);
			this.frontalpha = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(40,25,140);
			this.accent = [color(186,219,243),
				color(35,210,231),
				color(225,133,220),
				color(215,247,91)];
		} else if (color_type == 'Sunset'){
			this.front = color(220,216,241);
			this.frontalpha = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(72,52,124);
			this.accent = [color(220,216,241),
				color(160,132,220),
				color(242,199,111),
				color(229,104,110)];
		} else if (color_type == 'Dark'){
			this.front = color(200,202,245);
			this.frontalpha = color(200,202,245);
			this.back = color(32,33,63);
			this.backlight = color(55,56,97);
			this.accent = [color(200,202,245),
				color(132,152,240),
				color(44,218,157),
				color(216,111,154)];
		} else if (color_type == 'Light'){
			this.front = color(59,61,64);
			this.frontalpha = color(59,61,64);
			this.back = color(209,209,209);
			this.backlight = color(189,189,189);
			this.accent = [color(59,61,64),
				color(170,68,101),
				color(67,129,193),
				color(50,150,93)];
		}
		
		this.accent.push(lerpColor(this.accent[1],this.back,0.5));
	}
	
}
