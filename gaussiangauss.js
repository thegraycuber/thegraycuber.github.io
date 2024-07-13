class Gauss {
	constructor(data,data_index,sq) {
		this.Norm = data.getNum(data_index,2);
		this.Arg = data.getNum(data_index,3);
		this.IsPrime = data.getNum(data_index,4);
		this.Desc = [data.getString(data_index,5),
								data.getString(data_index,6),
								data.getString(data_index,7),
								data.getString(data_index,8)];
		this.Factors = data.getString(data_index,9);
		this.FactorA = data.getNum(data_index,11);
		this.Walkable = (this.IsPrime + 1) % 2;
		this.Coeffs = [[data.getNum(data_index,0),data.getNum(data_index,1)]]
		this.IsLow = [abs(this.Coeffs[0][1])<28];
		this.ScreenSaverShow = [true,true,true,true];
		for (var g = 0; g < 3; g++){
			this.Coeffs.push([-this.Coeffs[g][1],this.Coeffs[g][0]]);
			this.IsLow.push(abs(this.Coeffs[g+1][1])<28);
		}
		
		this.Coords = [];
		this.Color = [[],[],[],[],[],[],[]];
		var normColor = int(this.Norm/9)%360;
		var argColor = int(this.Arg * 180/PI);
		
		for (g = 0; g < 4; g++){
			this.Coords.push(coeffToCoord(this.Coeffs[g]));
			this.Color[0].push(argColor+g*90);
			this.Color[1].push(normColor);
			this.Color[2].push((argColor+g*90-normColor+360) % 360);
			this.Color[3].push(0);
			this.Color[4].push(int((this.Coeffs[g][0]+this.Coeffs[g][1]+240)*2.25)%360);
			this.Color[5].push(((abs(this.Coeffs[g][0])-abs(this.Coeffs[g][1])+160)*3)%360);
			this.Color[6].push(int(noise(this.Coeffs[g][0]/16+75,this.Coeffs[g][1]/16+120)*360));
		}
		
		this.Type = 'Composite';
		if (this.Desc[0] == 1){this.Type = 'Unit';}
		else if (this.Desc[0] == 0){this.Type = 'Zero';}
		else if (this.IsPrime == 1){this.Type = 'Prime';}
		
	}
	
	showAll() {
		var a;
		if (this.Walkable != 1 && this.Walkable != 2){
			var lightMult = 1;
			var lightAdd = 0;
			if (setting.ScreenSaver > -1){
				lightMult = (1 - cos(setting.ScreenSaver*PI/360))*0.4+0.2;
				for (a = 0 ; a < 4; a++){
					if (setting.ScreenSaver == setting.MultSS[1] + setting.MultSS[0]*this.Color[setting.ColorType][a]){this.ScreenSaverShow[a] = true;} 
					else if (setting.ScreenSaver - 360 == setting.MultSS[1] + setting.MultSS[0]*this.Color[setting.ColorType][a]){this.ScreenSaverShow[a] = false;}
				}
			//} else if (this.Walkable == 2){
				//lightMult = 0.35;
			} else if (this.Walkable == -1){
				lightMult = 0.6;
			} else if (this.Walkable == -2){
				lightAdd = 85;
				lightMult = 0.12;
			} 
			
			for (a = 0 ; a < 4; a++){
				if (this.IsLow[a] && this.ScreenSaverShow[a]){
					fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],lightAdd + colors[this.Color[setting.ColorType][a]][2]*lightMult);
					rect(this.Coords[a][0], this.Coords[a][1], setting.sq, setting.sq);
				}
			}
			
		}
	}
	
	showOutline(a) {
		noFill();
		strokeWeight(setting.sq*0.25);
		stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],colors[this.Color[setting.ColorType][a]][2]*0.6+40);
		rect(this.Coords[a][0], this.Coords[a][1], setting.sq*1.2, setting.sq*1.25);
		noStroke();
	}
	
	showLabel(){
		
		strokeWeight(setting.sq*0.2);
		textSize(setting.sq*1.2);
			
		for (var a = 0 ; a < 4; a++){
			if (this.IsLow[a]){
				if(setting.Prime == 1){
					fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],int(colors[this.Color[setting.ColorType][a]][2]*0.4)+60);
					stroke(black);
				}else{
					fill(black);
					stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],int(colors[this.Color[setting.ColorType][a]][2]*0.4)+60);
				}
				text(this.Desc[a],this.Coords[a][0],this.Coords[a][1]);
			}
		}
		noStroke();
	}
}