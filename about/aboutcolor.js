
var palette = [];
var curr_color = 3;
var new_color = 3;
var color_list = ['Current','Sunset','Electric','Forest','Autumn','Dark','Light'];
var color_v, color_a, color_noise, color_theta, color_move;

class Palette {
	constructor(scheme) {
		
		if (scheme == 'Electric'){
			this.front = color(186,219,243);
			this.back = [color(22,11,104),color(21,11,98),color(18,10,92),color(16,9,86),color(15,9,80)];
			this.backlight = color(50,75,150);
			this.accent1 = color(215,247,91);
			this.accent2 = color(225,133,220);
			this.accent3 = color(35,210,231);
			this.gray = color(161,185,212);
			
		} else if (scheme == 'Sunset'){
			this.front = color(220,216,241);
			this.back = [color(48,26,92),color(45,25,87),color(43,23,82),color(41,21,77),color(38,20,72)];
			this.backlight = color(84,68,136);
			this.accent1 = color(229,104,110);
			this.accent2 = color(242,199,111);
			this.accent3 = color(160,132,220);
			this.gray = color(140,132,158);
		
		} else if (scheme == 'Forest' || scheme == 'Current'){
			this.front = color(214,221,204);
			this.back = [color(7,64,47),color(7,61,45),color(6,58,42),color(5,55,39),color(5,52,37)];
			this.backlight = color(22,85,63);
			this.accent1 = color(63,189,117);
			this.accent2 = color(238,128,96);
			this.accent3 = color(205,173,50);
			this.gray = color(173,178,173);
			
		} else if (scheme == 'Autumn'){
			this.front = color(255,229,181);
			this.back = [color(80,48,35),color(76,45,33),color(72,42,30),color(68,39,27),color(64,36,25)];
			this.backlight = color(110,65,35);
			this.accent1 = color(255,130,66);
			this.accent2 = color(250,202,48);
			this.accent3 = color(210,72,40);
			this.gray = color(110,106,90);
			
		} else if (scheme == 'Dark'){
			this.front = color(200,202,245);
			this.back = [color(37,38,69),color(34,35,66),color(32,33,63),color(29,30,60),color(27,28,57)];
			this.backlight = color(55,56,97);
			this.accent1 = color(132,152,240);
			this.accent2 = color(216,111,154);
			this.accent3 = color(44,218,157);
			this.gray = color(140,142,180);
			
		} else if (scheme == 'Light'){
			this.front = color(35,57,91);
			this.back = [color(197,197,197),color(203,203,203),color(209,209,209),color(215,215,215),color(221,221,221)];
			this.backlight = color(170,172,178);
			this.accent1 = color(35,57,91);
			this.accent2 = color(137,42,147);
			this.accent3 = color(55,90,160);
			this.gray = color(120,120,120);
			
		}

	}
	
	refresh(index1,index2,iterate = 0){
		this.front = lerpColor(palette[index1].front,palette[index2].front,iterate);
		for (var back_item = 0; back_item < this.back.length; back_item++){
			this.back[back_item] = lerpColor(palette[index1].back[back_item],palette[index2].back[back_item],iterate);
		}
		this.backlight = lerpColor(palette[index1].backlight,palette[index2].backlight,iterate);
		this.accent1 = lerpColor(palette[index1].accent1,palette[index2].accent1,iterate);
		this.accent2 = lerpColor(palette[index1].accent2,palette[index2].accent2,iterate);
		this.accent3 = lerpColor(palette[index1].accent3,palette[index2].accent3,iterate);
		this.gray = lerpColor(palette[index1].gray,palette[index2].gray,iterate);
		
		this.grayalpha = lerpColor(palette[index1].gray,palette[index2].gray,iterate);
		this.accent3alpha = lerpColor(palette[index1].accent3,palette[index2].accent3,iterate);
		this.backalpha = lerpColor(palette[index1].back[2],palette[index2].back[2],iterate);
		
		this.grayalpha.setAlpha(50);
		this.accent3alpha.setAlpha(50);
		//console.log(alphaVal);
		this.backalpha.setAlpha(245);
	}
	
}
