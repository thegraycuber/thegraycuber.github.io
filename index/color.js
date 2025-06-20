
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
			this.accent = [color(215,247,91),
				color(35,210,231),
				color(225,133,220)];
			this.gray = color(161,185,212);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(50,29,98);
			this.accent3 = color(160,132,220);
			this.accent1 = color(242,199,111);
			this.accent2 = color(229,104,110);
			this.gray = color(156,147,173);
			this.grayalpha = color(156,147,173,50);
			
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
			this.gray = color(173,178,173);
			
		}
		
	}
	
	refresh(){
		
		if (color_trans[2] == -1){return;}
		
		color_trans[2] += 0.02;
		let pal_a = palette[color_trans[0]];
		let pal_b = palette[color_trans[1]];
		
		this.front = lerpColor(pal_a.front,pal_b.front,color_trans[2]);
		this.back = lerpColor(pal_a.back,pal_b.back,color_trans[2]);
		this.backlight = lerpColor(pal_a.backlight,pal_b.backlight,color_trans[2]);
		this.accent1 = lerpColor(pal_a.accent1,pal_b.accent1,color_trans[2]);
		this.accent2 = lerpColor(pal_a.accent2,pal_b.accent2,color_trans[2]);
		this.accent3 = lerpColor(pal_a.accent3,pal_b.accent3,color_trans[2]);
		this.gray = lerpColor(pal_a.gray,pal_b.gray,color_trans[2]);
	
		//this.grayalpha = lerpColor(pal_a.gray,pal_b.gray,color_trans[2]);
		//this.accent1alpha = lerpColor(pal_a.accent1,pal_b.accent1,color_trans[2]);
		//this.backalpha = lerpColor(pal_a.back,pal_b.back,color_trans[2]);
		
		//this.grayalpha.setAlpha(50);
		//this.accent1alpha.setAlpha(50);
		//this.backalpha.setAlpha(5);
		//this.medium = lerpColor(this.back,this.accent1,0.5);
		this.medium = lerpColor(this.back,this.accent1,0.5);
		//is.backlight.setAlpha(20);
		
		if (color_trans[2] >= 1){
			color_trans[2] = -1;
			color_trans[0] = color_trans[1];
			update_icons(0,icons.length);
		}
		//u_index = (u_index + 1) % icons.length;
		//update_icons(u_index, u_index + 1);
		
	}
	
}
//let u_index = 0;
