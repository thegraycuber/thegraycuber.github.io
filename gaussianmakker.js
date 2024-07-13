class Makker {
	constructor(radius, squarew, start_pos) {
		this.Radius = radius;
		this.DrawRadius = radius * squarew * 2;
		this.Pos = start_pos;
		this.Round = [round(this.Pos[0]), round(this.Pos[1])];
		this.Coords = coeffToCoord(this.Pos);
		this.Vel = [0, 0];
		this.Acc = [0, -0.005];
		this.Assoc = getAssociate(this.Round);
		this.Sitting = false;
	}

	Go() {
		this.Vel[0] = min(max(this.Vel[0] + this.Acc[0], -0.5), 0.5);
		this.Vel[1] = min(max(this.Vel[1] + this.Acc[1], -0.5), 0.5);
		this.Acc[1] = -0.005;
		
		if (round(this.Vel[0],4) != 0 || this.Vel[1] != this.Acc[1] || this.Sitting == false) {

			this.Sitting = false;
			var vel_sign = [0, 0];
			if (this.Vel[0] > 0) {
				vel_sign[0] = 1
			} else if (this.Vel[0] < 0) {
				vel_sign[0] = -1
			}
			if (this.Vel[1] > 0) {
				vel_sign[1] = 1
			} else if (this.Vel[1] < 0) {
				vel_sign[1] = -1
			}
			var new_pos = [max(min(this.Pos[0] += this.Vel[0],50),-50), max(min(this.Pos[1] += this.Vel[1],27),-27.5 + this.Radius)];

			var vert_edge = [new_pos[0], new_pos[1] + vel_sign[1] * this.Radius];
			var vert_round = [round(vert_edge[0]), round(vert_edge[1])];
			
			if (vert_round != this.Round && vel_sign[1] != 0) {
				var vert_assoc = getAssociate(vert_round);
				if (gInts[vert_assoc[0]][vert_assoc[1]].Walkable <= 0) {
					if (vel_sign[1] == 1) {
						new_pos[1] -= vert_edge[1] + 0.499 - floor(vert_edge[1] + 0.5);
					} else {
						new_pos[1] -= vert_edge[1] - 0.499 - ceil(vert_edge[1] - 0.5);
					}
					this.Vel[1] = this.Vel[1] * 0.4;
				}
			}


			var hor_edge = [new_pos[0] + vel_sign[0] * this.Radius, new_pos[1]];
			var hor_round = [round(hor_edge[0]), round(hor_edge[1])];
			if (hor_round != this.Round && vel_sign[0] != 0) {
				var hor_assoc = getAssociate(hor_round);
				if (gInts[hor_assoc[0]][hor_assoc[1]].Walkable <= 0) {
					if (vel_sign[0] == 1) {
						new_pos[0] -= hor_edge[0] + 0.499 - floor(hor_edge[0] + 0.5);
					} else {
						new_pos[0] -= hor_edge[0] - 0.499 - ceil(hor_edge[0] - 0.5);
					}
					this.Vel[0] = this.Vel[0] * 0.4;
				}
			}

			this.Vel[0] = this.Vel[0] * 0.9;
			this.Pos = new_pos;
			this.Round = [round(this.Pos[0]), round(this.Pos[1])];
			this.Coords = coeffToCoord(this.Pos);
			this.Assoc = getAssociate(this.Round);
			
			for (var targ of targets){
				if (this.Round[0] == targ.Coeffs[0] && this.Round[1] == targ.Coeffs[1] && targ.Active){
					targ.reached();
				}
			}
				//this.PrimeMode = gInts[this.Assoc[0]][this.Assoc[1]].IsPrime;

				if (round(this.Pos[1] + 0.5 - this.Radius, 2) == this.Round[1]) {
					var below_assoc = getAssociate([this.Round[0], this.Round[1] - 1]);
					
					if (gInts[below_assoc[0]][below_assoc[1]].Walkable <= 0 || this.Round[1] == -27) {
						this.Sitting = true;

					}
				}
		}
		if (this.Sitting) {
			this.Vel[1] = 0;
		}
		var myGInt = gInts[this.Assoc[0]][this.Assoc[1]];
		var a = this.Assoc[2];
		fill(colors[myGInt.Color[setting.ColorType][a]][0], colors[myGInt.Color[setting.ColorType][a]][1], int(colors[myGInt.Color[setting.ColorType][a]][2] * 0.5) + 50);
		circle(this.Coords[0], this.Coords[1], this.DrawRadius);
		setting.Partial.push([this.Round[0] - 1, this.Round[1] + 1, this.Round[0] + 1, this.Round[1] - 1]);
	}
	
	setPosition(posArr){
		this.Pos = posArr;
		this.Round = [round(this.Pos[0]), round(this.Pos[1])];
		this.Coords = coeffToCoord(this.Pos);
		this.Assoc = getAssociate(this.Round);
		this.Sitting = false;
		this.Vel = [0, 0];
	}
}