class Palette {
	constructor() {
	}
	
	
	getColors(color_type) {
		if (color_type == 'Electric'){
			this.front = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(50,75,150);
			this.output = color(35,210,231);
			this.input = color(225,133,220);
			this.focus = color(215,247,91);
		} else if (color_type == 'Winter'){
			this.front = color(180,180,210);
			this.back = color(35,26,40);
			this.backlight = color(72,56,79);
			this.output = color(78,167,192);
			this.input = color(146,104,157);
			this.focus = color(192,183,218);
		} else if (color_type == 'Spring'){
			this.front = color(60,94,45);
			this.back = color(189,231,195);
			this.backlight = color(159,210,145);
			this.output = color(244,132,152);
			this.input = color(232,187,92);
			this.focus = color(73,157,86);
		} else if (color_type == 'Summer'){
			this.front = color(19,84,144);
			this.back = color(92,219,255);
			this.backlight = color(10,194,255);
			this.output = color(255,234,112);
			this.input = color(217,146,39);
			this.focus = color(19,104,206);
		} else if (color_type == 'Autumn'){
			this.front = color(255,229,181);
			this.back = color(72,42,30);
			this.backlight = color(129,75,45);
			this.output = color(255,130,66);
			this.input = color(182,52,34);
			this.focus = color(250,202,48);
		} else if (color_type == 'Forest'){
			this.front = color(214,221,208);
			this.back = color(6,58,42);
			this.backlight = color(44,82,63);
			this.output = color(118,167,140);
			this.input = color(144,78,78);
			this.focus = color(216,184,115);
		} else if (color_type == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(84,68,136);
			this.output = color(242,199,111);
			this.input = color(229,104,110);
			this.focus = color(160,132,220);
		} else if (color_type == 'Love'){
			this.front = color(115,85,138);//115,85,138
			this.back = color(226,211,233);
			this.backlight = color(201,175,223);
			this.output = color(55,39,63);
			this.input = color(163,158,170);
			this.focus = color(115,85,138);//120,85,44
		}
	}
	
}