
class Palette {
	constructor(scheme) {
		
		if (scheme == 'Electric'){
			this.front = color(186,219,243);
			this.back = color(18,10,92);
			this.backlight = color(50,75,150);
			this.accent1 = color(35,210,231);
			this.accent2 = color(225,133,220);
			this.accent3 = color(215,247,91);
			this.gray = color(161,185,212);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = color(43,23,82);
			this.backlight = color(84,68,136);
			this.accent1 = color(242,199,111);
			this.accent2 = color(229,104,110);
			this.accent3 = color(160,132,220);
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
		
		} else if (scheme == 'Forest' || scheme == 'Current'){
			this.front = color(214,221,204);
			this.back = color(6,58,42);
			this.backlight = color(44,82,63);
			this.accent1 = color(63,189,117);
			this.accent2 = color(216,184,1);
			this.accent3 = color(185,95,95);
			this.gray = color(173,178,173);
			
		}
		
		
	}
	
	refresh(index1,index2,iterate = 0){
		this.front = lerpColor(palette[index1].front,palette[index2].front,iterate);
		this.back = lerpColor(palette[index1].back,palette[index2].back,iterate);
		this.backlight = lerpColor(palette[index1].backlight,palette[index2].backlight,iterate);
		this.accent1 = lerpColor(palette[index1].accent1,palette[index2].accent1,iterate);
		this.accent2 = lerpColor(palette[index1].accent2,palette[index2].accent2,iterate);
		this.accent3 = lerpColor(palette[index1].accent3,palette[index2].accent3,iterate);
		this.gray = lerpColor(palette[index1].gray,palette[index2].gray,iterate);
		
		this.grayalpha = lerpColor(palette[index1].gray,palette[index2].gray,iterate);
		this.accent1alpha = lerpColor(palette[index1].accent1,palette[index2].accent1,iterate);
		this.backalpha = lerpColor(palette[index1].back,palette[index2].back,iterate);
		
		this.grayalpha.setAlpha(50);
		this.accent1alpha.setAlpha(50);
		this.backalpha.setAlpha(20);
	}
	
}