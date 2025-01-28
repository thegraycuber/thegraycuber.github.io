class Target {
	
	constructor(id, radius) {
		this.Id = id;
		this.Active = false;
		this.Coeffs = [0,0];
		this.Coords = [0,0];
		this.Color = 0;
		this.Radius = radius;
		this.Bright = 0;
		this.Era = -1;
	}
	
	reached(){
		setting.Blocked = [];
		if (this.Era > -1){
			setting.newEra(this.Era);
		} else {this.random();}
	}
	
	show(){
		if (this.Active){
			this.Bright = (this.Bright + 0.05) % TWO_PI;
			fill(colors[this.Color][0],colors[this.Color][1],colors[this.Color][2]*(1+cos(this.Bright))*0.8 + (1-cos(this.Bright))*20);
			if (this.Id == 'star'){
				beginShape();
				vertex(this.Coords[0], this.Coords[1] - this.Radius);
				vertex(this.Coords[0] + this.Radius*0.24, this.Coords[1] - this.Radius*0.32);
				vertex(this.Coords[0] + this.Radius*0.95, this.Coords[1] - this.Radius*0.3);
				vertex(this.Coords[0] + this.Radius*0.38, this.Coords[1] + this.Radius*0.12);
				vertex(this.Coords[0] + this.Radius*0.59, this.Coords[1] + this.Radius*0.81);
				vertex(this.Coords[0], this.Coords[1] + this.Radius*0.5);
				vertex(this.Coords[0] - this.Radius*0.59, this.Coords[1] + this.Radius*0.81);
				vertex(this.Coords[0] - this.Radius*0.38, this.Coords[1] + this.Radius*0.15);
				vertex(this.Coords[0] - this.Radius*0.95, this.Coords[1] - this.Radius*0.3);
				vertex(this.Coords[0] - this.Radius*0.24, this.Coords[1] - this.Radius*0.32);
				vertex(this.Coords[0], this.Coords[1] - this.Radius);
				endShape(CLOSE);
			} else {
				strokeWeight(setting.sq*0.2);
				stroke(black);
				textSize(this.Radius);
				text(this.Id,this.Coords[0],this.Coords[1]);
				noStroke();
			}
		}
	}
	
	random(){
		var ranAssoc = getAssociate([(int(random()*36)+3)*(int(random()*2)*2-1),(int(random()*18)+3)*(int(random()*2)*2-1)]);
		while(gInts[ranAssoc[0]][ranAssoc[1]].Walkable <= 0 || gInts[ranAssoc[0]][ranAssoc[1]].IsLow[ranAssoc[2]] == 0 || (ranAssoc[0] < -26 && ranAssoc[1] < -15)){
			ranAssoc = getAssociate([(int(random()*36)+3)*(int(random()*2)*2-1),(int(random()*18)+3)*(int(random()*2)*2-1)]);
		}
		this.updateCoeffs(gInts[ranAssoc[0]][ranAssoc[1]].Coeffs[ranAssoc[2]]);
		this.Era = -1;
		
	}
	
	updateCoeffs(newCoeffs){
		this.Coeffs = newCoeffs;
		this.Coords = coeffToCoord(newCoeffs);
		var newAssoc = getAssociate(this.Coeffs);
		this.Color = gInts[newAssoc[0]][newAssoc[1]].Color[setting.ColorType][newAssoc[2]];
	}
}