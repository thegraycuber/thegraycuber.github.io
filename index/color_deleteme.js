
var color_trans;

class Palette {
	constructor(scheme) {
		
		if (scheme == 'Electric' || scheme == 'Current'){
			this.front = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(20,15,110);
			this.accent1 = color(35,210,231);
			this.accent2 = color(225,133,220);
			this.accent3 = color(215,247,91);
			
			this.mono = color(35,210,231);
			this.bright = color(225,133,220);
			this.red = color(215,247,91);
			
			this.gray = color(161,185,212);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(50,29,98);
			this.accent3 = color(160,132,220);
			this.accent1 = color(242,199,111);
			this.accent2 = color(229,104,110);
			
			this.mono = color(160,132,220);
			this.bright = color(242,199,111);
			this.red = color(229,104,110);
			
			this.gray = color(156,147,173);
			
			for(var suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(this.backlight,this.accent2,3*suns/sunlen));
			}
			for(suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(this.accent2,this.accent1,3*suns/sunlen));
			}
			for(suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(this.accent1,this.backlight,3*suns/sunlen));
			}
		
		} else if (scheme == 'Forest'){
			this.front = color(214,221,204);
			this.back = color(6,58,42);
			this.backlight = color(10,70,55);
			this.accent1 = color(63,189,117);
			this.accent2 = color(216,184,1);
			this.accent3 = color(238,128,96);
			
			this.mono = color(63,189,117);
			this.bright = color(216,184,1);
			this.red = color(238,128,96);
			
			this.gray = color(173,178,173);
			
		}
		
	}
	
	refresh(){
		
		if (color_trans[2] == -1){return;}
		
		color_trans[2] += 0.02;
		let pal_a = palette[color_trans[0]];
		let pal_b = palette[color_trans[1]];
		
		for (let c_type of color_types){
			this[c_type] = lerpColor(pal_a[c_type], pal_b[c_type] ,color_trans[2]);
		}
	
		this.accent = [this.accent1,
			this.accent2,
			this.accent3];
	
		//this.backalpha = lerpColor(pal_a.back,pal_b.back,color_trans[2]);
		//this.backalpha.setAlpha(5);
		
		this.medium = lerpColor(this.back,this.accent1,0.5);
		
		if (color_trans[2] >= 1){
			color_trans[2] = -1;
			color_trans[0] = color_trans[1];
			update_icons(0,icons.length);
		}
		
	}
	
}

let color_types = ['front','back','backlight','accent1','accent2','accent3','mono','bright','red','gray'];