class Gauss {
	constructor(data,data_index,w) {
		this.Norm = data.getNum(data_index,2);
		this.Arg = data.getNum(data_index,3);
		this.IsPrime = data.getNum(data_index,4);
		this.Factors = data.getString(data_index,8).replace("'","");
		this.FactorA = data.getNum(data_index,5);
		this.ColorFactor = [data.getNum(data_index,6)+data.getNum(data_index,7),data.getNum(data_index,7)];
		this.MainDesc = data.getNum(data_index,9);
		this.Walkable = (this.IsPrime + setting.Prime) % 2;
		this.Coeffs = [[data.getNum(data_index,0),data.getNum(data_index,1)]];
		this.Type = 'Composite';
		this.DistColor = [300-((15-data.getNum(data_index,6)+data.getNum(data_index,7))**2)*0.6,80,100-((15-data.getNum(data_index,6))**2)*0.5];
		if (abs(this.Norm) == 1){
			this.Type = 'Unit';
			this.Walkable = 1;
		}
		else if (this.Norm == 0){
			this.Type = 'Zero';
			this.Walkable = 1;
		}
		else if (this.IsPrime == 1){this.Type = 'Prime';}
		
		this.IsLow = [];
		this.Coords = [];
		this.Color = [[],[],[],[],[],[],[]];
		this.Desc = [];
		var normColor = (int(this.Norm/(9*((abs(setting.WVals[w]))**0.5))) % 360 + 360) % 360;
		var argColor = int(this.Arg * 180/PI);
		var argAdd = int(360/setting.WAssocs[w]);
		
		for (var a = 0; a < setting.WAssocs[w]; a++){
			if (a > 0){
				this.Coeffs.push(multiplyC(this.Coeffs[a-1],setting.WUnit[w],setting.WVals[w]));
			}
			if (abs(this.Norm) == 1){
				setting.UnitsText.push(data.getString(data_index,10+a));
			}
			this.Coords.push(coeffToCoord(this.Coeffs[a],w));
			this.Color[0].push((argColor+a*argAdd)%360);
			this.Color[1].push(normColor);
			this.Color[2].push((argColor+a*argAdd-normColor+360) % 360);
			this.Color[3].push(0);
			this.Color[4].push(int((this.Coeffs[a][0]+this.Coeffs[a][1]+220)*2.5)%360);
			this.Color[5].push(((abs(this.Coeffs[a][0])-abs(this.Coeffs[a][1])+150)*3)%360);
			this.Color[6].push(int(noise(this.Coeffs[a][0]/16+75,this.Coeffs[a][1]/16+120)*360));
			this.Desc.push(data.getString(data_index,10+a));
			this.IsLow.push(goodCoeff(this.Coeffs[a],w));
		}	
		
		if (this.IsPrime == 1 && setting.WVals[w] > 0){
			this.Desc.push(data.getString(data_index,12));
		}
	}
	
	showAll() {
		var a;
		
		if (this.Walkable != 1 || setting.ColorType == 7){
			var lightMult = 1;
			var lightAdd = 0;
			
			if (this.Walkable == -2){
				lightAdd = 85
				lightMult = 0.12
			} 
			
			for (a = 0 ; a < setting.WAssocs[setting.W]; a++){

				if (this.IsLow[a]){

					if (setting.ColorType == 7){
						fill(colorsF[this.ColorFactor[0]][this.ColorFactor[1]][0],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][1],lightAdd + colorsF[this.ColorFactor[0]][this.ColorFactor[1]][2]*lightMult);
					} else{
						fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],lightAdd + colors[this.Color[setting.ColorType][a]][2]*lightMult);
					}
					if(setting.WY[setting.W] == 1){
						rect(this.Coords[a][0], this.Coords[a][1], setting.sq, setting.sq);
					} else {
						hexagon(this.Coords[a][0], this.Coords[a][1], setting.sq);
					}
				}
			}
			
		}
	}
	
	showOutline(a) {
		noFill();
		strokeWeight(setting.sq*0.25);
		if (setting.ColorType == 7){
			stroke(colorsF[this.ColorFactor[0]][this.ColorFactor[1]][0],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][1],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][2]*0.6+40);
		} else{
			stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],colors[this.Color[setting.ColorType][a]][2]*0.6+40);
		}
		if(setting.WY[setting.W] == 1){
			rect(this.Coords[a][0], this.Coords[a][1], setting.sq*1.2, setting.sq*1.25);
		} else {
			hexagon(this.Coords[a][0], this.Coords[a][1], setting.sq*1.2);
		}
		noStroke();
	}
	
	showLabel(){
		
		strokeWeight(setting.sq*0.2);
		textSize(setting.sq*1.2);
			
		for (var a = 0 ; a < setting.WAssocs[setting.W]; a++){
			if (this.IsLow[a] && setting.LabelShow[setting.WAssocs[setting.W]-2][a]){
				if(setting.Prime == 1){
					if (setting.ColorType == 7){
						fill(colorsF[this.ColorFactor[0]][this.ColorFactor[1]][0],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][1],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][2]*0.6+40);
					} else{
						fill(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],60 + colors[this.Color[setting.ColorType][a]][2]*0.4);
					}
					stroke(black);
				}else{
					fill(black);
					if (setting.ColorType == 7){
						stroke(colorsF[this.ColorFactor[0]][this.ColorFactor[1]][0],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][1],colorsF[this.ColorFactor[0]][this.ColorFactor[1]][2]*0.6+40);
					} else { 
						stroke(colors[this.Color[setting.ColorType][a]][0],colors[this.Color[setting.ColorType][a]][1],60 + colors[this.Color[setting.ColorType][a]][2]*0.4);
					}
				}
				textFont(openSans);
				text(this.Desc[a],this.Coords[a][0],this.Coords[a][1]-setting.sq*0.2);
				textFont(atkinsonBold);
			}
		}
		noStroke();
	}
}