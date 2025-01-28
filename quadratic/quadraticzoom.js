class Zoom {
	constructor(zoomdata,data_index,w) {
		this.Coeffs = [[zoomdata.getNum(data_index,0),zoomdata.getNum(data_index,1)]];
		this.Coords = [];
		this.IsLow = [];
		
		for (var a = 0; a < setting.WAssocs[w]; a++){
			if (a > 0){
				this.Coeffs.push(multiplyC(this.Coeffs[a-1],setting.WUnit[w],setting.WVals[w]));
			}
			this.Coords.push(coeffToCoord(this.Coeffs[a],w,4));
			this.IsLow.push(goodCoeff(this.Coeffs[a],w,4));
		}	
	}
	
	showAll() {
		var a;	
			
		for (a = 0 ; a < setting.WAssocs[setting.W]; a++){
			
			if (this.IsLow[a]){
				fill(colors[0][0],colors[0][1],colors[0][2]);

				if(setting.WY[setting.W] == 1){
					rect(this.Coords[a][0], this.Coords[a][1], setting.sq/4, setting.sq/4);
				} else {
					hexagon(this.Coords[a][0], this.Coords[a][1], setting.sq/4);
				}
			}
		}
		
	}
}