class Bubble {
	constructor(index,n,x,y,size) {
		this.index = index;
		this.n = n;
		this.x = x;
		this.y = y;
		this.coords = [];
		this.v = [0,0];
		this.a = [0,0];
		this.size = size;
		this.contains = [];
		this.order = 1;
		this.representative = false;
		this.connections = 0;
		this.uPrimeText = '=';
		this.cPrimeText = '=';
		this.shade = false;
		
		var n_factor = prime_factorization(n);
		var n_cycle = [];
		
		for (var n_fact of n_factor){
			this.uPrimeText += ' U' + n_to_subscript(n_fact[0]**n_fact[1]) + ' ×';
			
			if (n_fact[0] == 2 && n_fact[1] > 2){
				n_cycle.push([2,[n_fact[1]-2,1]]);
				this.cPrimeText += ' C₂ × C' + n_to_subscript(2**(n_fact[1]-2)) + ' ×';
			} else if (n_fact[0] == 2 && n_fact[1] == 2){
				n_cycle.push([2,[1]]);
				this.cPrimeText += ' C₂ ×';
			} else if (n_fact[0] != 2) {
				if (n_fact[1] > 1 && n_fact[0] != 2){
					n_cycle.push([n_fact[0],[n_fact[1]-1]]);
				}
				this.cPrimeText += ' C' + n_to_subscript((n_fact[0]-1)*n_fact[0]**(n_fact[1]-1)) + ' ×';
			}
		}
		this.uPrimeText = this.uPrimeText.substring(0,this.uPrimeText.length-1);
		this.cPrimeText = this.cPrimeText.substring(0,this.cPrimeText.length-1);
		
		for (n_fact of n_factor){
			
			var p = 0;
			while (primes[p][0] != n_fact[0]){
				p++;
			}
			
			for (var p_fact of primes[p][1]){
				var n_cyc = 0;
				while (n_cyc < n_cycle.length && n_cycle[n_cyc][0] != p_fact[0]){
					n_cyc++;
				}
				if(n_cyc == n_cycle.length){
					n_cycle.push([p_fact[0],[p_fact[1]]]);
				}else{
					var n_index = 0;
					while(n_index < n_cycle[n_cyc][1].length && n_cycle[n_cyc][1][n_index] > p_fact[1]){
						n_index++;
					}
					n_cycle[n_cyc][1].splice(n_index,0,p_fact[1]);
					
				}
				
			}
			
		}
		
		this.cycles = [];
		for (n_fact of n_cycle){
			
			for(var n_pow = 0; n_pow < n_fact[1].length; n_pow++){
				if(n_pow == this.cycles.length){
					this.cycles.push(n_fact[0]**n_fact[1][n_pow]);
				}else{
					this.cycles[n_pow] *= (n_fact[0]**n_fact[1][n_pow]);
				}
			}
		}
		
		for (n_fact of this.cycles){
			this.order *= n_fact;
		}
		
		this.ctext = '';
		this.cshort = '';
		for (var cyc = this.cycles.length-1; cyc > -1; cyc--){
			this.ctext += 'C' + n_to_subscript(this.cycles[cyc]) + '×';
			this.cshort += str(this.cycles[cyc]) + '*';//'•';
		}
		this.ctext = this.ctext.substring(0,this.ctext.length-1);
		this.cshort = this.cshort.substring(0,this.cshort.length-1);
		this.utext = 'U' + n_to_subscript(n);

		//console.log(this.n,this.cycles);
	}
	
	displayLines(){
		for (var cont of this.contains){

			if (cont[3] == 0 && lineMode == 'Simplified'){
				continue;
			}
			if ((!bubbles[cont[0]].representative || !this.representative) && cont[2] != 1 && lineMode == 'Simplified'){
				continue;
			}
			
			palette.frontalpha.setAlpha(int(144/cont[2]+10));
			stroke(palette.frontalpha);
			if (this.shade || this.shade){
				stroke(palette.backlight);
			}
			noFill();
			strokeWeight(5*c);
			line(this.coords[0],this.coords[1],bubbles[cont[0]].coords[0],bubbles[cont[0]].coords[1]);
			
		}
	}
	
	display(){
		
		noStroke();
		fill(palette.accent[this.cycles.length-1]);
		var disp_mult = 1;
		
		if (info && info_index == -1){
			if (pointDist(this.x,this.y,mouseLoc[0],mouseLoc[1])[2] < 400){
				info_index = this.index;
			}
		}
		
		if (info_index == this.index) {
			stroke(palette.accent[this.cycles.length-1]);
			strokeWeight(this.size*c*0.1);
			fill(palette.back);
			disp_mult = 1.1;
		}
		
		if (this.shade){
			fill(palette.backlight);
		}
	
		ellipse(this.coords[0],this.coords[1],this.size*c*disp_mult);

	}
	
	text(){
	
		strokeWeight(2);
		if (this.index == info_index){
			stroke(palette.back);
			fill(palette.accent[this.cycles.length-1]);
		} else {
			stroke(palette.accent[this.cycles.length-1]);
			fill(palette.back);
		}
		if (this.shade){
			stroke(palette.backlight);
		}
		
		if (label == 'Full'){
			textFont(openSans);
			textWithMax(this.utext,this.coords[0],this.coords[1]-13*c,12*c,this.size*c);
			textWithMax(this.ctext,this.coords[0],this.coords[1]+3*c,14*c,this.size*0.85*c);
		} else if (label == 'Shortened'){
			textWithMax(str(this.n),this.coords[0],this.coords[1]-13*c,10*c,this.size*c);
			if (this.representative){textWithMax(this.cshort,this.coords[0],this.coords[1]+3*c,14*c,this.size*0.9*c);}
		} else if (label == 'Just Modulus'){
			textWithMax(str(this.n),this.coords[0],this.coords[1],16*c,this.size*c);
		} else if (label == 'Just Cycles'){
			if (this.representative){textWithMax(this.cshort,this.coords[0],this.coords[1],16*c,this.size*0.9*c);}
		}
		
	}
	
	pull(){
		for (var cont of this.contains){
			if (cont[3] == 0){
				continue;
			}
			var pull_strength = 1/cont[1];
			var dist_info = pointDist(this.x,this.y,bubbles[cont[0]].x,bubbles[cont[0]].y);
			this.a[0] += dist_info[0]*pull_strength;
			this.a[1] += dist_info[1]*pull_strength;
			bubbles[cont[0]].a[0] -= dist_info[0]*pull_strength;
			bubbles[cont[0]].a[1] -= dist_info[1]*pull_strength;
		}
	}
	
	push(){
		for (var pusher = 0; pusher < this.index; pusher++){
			var dist_info = pointDist(this.x,this.y,bubbles[pusher].x,bubbles[pusher].y);
			if (dist_info[2] < 62500){
				var push_strength = min(2000/dist_info[2],5);
				this.a[0] -= dist_info[0]*push_strength;
				this.a[1] -= dist_info[1]*push_strength;
				bubbles[pusher].a[0] += dist_info[0]*push_strength;
				bubbles[pusher].a[1] += dist_info[1]*push_strength;
			}
		}
	}
	
	pushMouse(){
		if (menuBox.Items[mode_index].List[menuBox.Items[mode_index].Index] == 'Click to Add' && this.index == bubbles.length - 1){
			return;
		}
		for (var pusher = 0; pusher < this.index; pusher++){
			var dist_info = pointDist(this.x,this.y,mouseLoc[0],mouseLoc[1]);
			if (dist_info[2] < 62500){
				var push_strength = min(400/dist_info[2],5);
				this.a[0] -= dist_info[0]*push_strength;
				this.a[1] -= dist_info[1]*push_strength;
			}
		}
	}

	move(){
		this.v = [this.v[0]*0.75 + this.a[0],this.v[1]*0.75 + this.a[1]];
		this.x += this.v[0];
		this.y += this.v[1];
		this.a = [0,0];//random(1)*0.02-0.01,random(1)*0.02-0.01];//[random(1)*0.002-0.001,random(1)*0.002-0.001];
		this.coords = locToCoords(this.x,this.y);
	}
	
	checkRep(){
		
		this.representative = true;
		for (var cont of this.contains){
			if (cont[2] == 1){
				if (!bubbles[cont[0]].shade || this.shade){
					this.representative = false;
					break;
				}
				if (!this.shade && bubbles[cont[0]].shade && bubbles[cont[0]].representative){
					bubbles[cont[0]].representative = false;
				}
			}
		}
	}
	
	adjPos(doAdj){

		var denom = 1;
		for (var con of this.contains){
			if (con[3] != 0){
				this.x += bubbles[con[0]].x/con[2];
				this.y += bubbles[con[0]].y/con[2];
				denom += 1/con[2];
			}
		}

		this.x /= denom;
		this.y /= denom;
	}
	
	checkShade(){
		
		if (focus == 'All Integers'){
			this.shade = false;
		} else if (focus == 'Primes'){
			while (primes[primes.length - 1][0] < this.n){
				add_prime();
			}
			for (var prime_check of primes){
				if (prime_check[0] >= this.n){
					this.shade = prime_check[0] != this.n;
					return;
				}
			}
		} else if (focus == 'Powers of 2'){
			while (pow2[pow2.length - 1] < this.n){
				pow2.push(pow2[pow2.length - 1]*2);
			}
			this.shade = !(pow2.includes(this.n));
		} else if (focus == 'Abundant'){
			var ab_sum = 1;
			for (var ab = 2; ab <= this.n/2; ab++){
				if (this.n % ab == 0){
					ab_sum += ab;
				}
			}
			this.shade = ab_sum <= this.n;
			return;
		} else if (focus == 'Related to Clicked'){
			if (clicked == -1){
				this.shade = false;
			} else {
				if (this.index == clicked){
					this.shade = false;
					for (var cont of this.contains){
						bubbles[cont[0]].shade = false;
					}
					return;
				}
				for (var conty of this.contains){
					if (conty[0] == clicked){
						this.shade = false;
						return;
					}
				}
			}
		} else if (focus == 'Multiple of Clicked'){
			if (clicked == -1){
				this.shade = false;
				return;
			} 
			this.shade = (this.n % bubbles[clicked].n != 0);
		} else if (focus == 'Factor of Clicked'){
			if (clicked == -1){
				this.shade = false;
				return;
			} 
			this.shade = (bubbles[clicked].n % this.n != 0);
		}
		
	}
}

