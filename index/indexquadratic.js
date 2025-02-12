var quad_options = [-3,5,13,21,29,37,-7,-11,-19,-43,17,33,41];

function makeQuad(dindex,colorindex){
	//var gauss_rand = random();
	var d = quad_options[dindex];
	
	var wmax = ceil(1+width/px);
	var hmax = ceil(1+height/(px*1.732051));
	for (var re = 0; re <= wmax; re+= 0.5){
		var parity = mod(re*2,2)/2;
		
		for (var im =  parity; im <= hmax - parity; im++){
			
			//console.log(im);
			
			var norm = abs(int(re**2 - d*(im**2)));
			var isPrime = false;
			var primeidx = 0;

			//console.log(re,im,norm,'bbbb');
			if (norm > 1){
				while (primes[primeidx] <= norm){
					
					
					if(primes[primeidx]**2 == norm){
						//console.log(re,im,norm,'primesq');
						isPrime = isNotSquare(primes[primeidx],d);
						break;
					}
					if(primes[primeidx] == norm){
						//console.log(re,im,norm,'prime');
						isPrime = true;
						break;
					}
					primeidx++;
					if(primeidx == primes.length){
						add_prime();
					}
				}
			}
		
			if (isPrime){
				main_list.push(new Quad(re,im,colorindex));
				if (re != 0){
					main_list.push(new Quad(-re,im,colorindex));
				}
				if (im != 0){
					main_list.push(new Quad(re,-im,colorindex));
				}
				if (re != 0 && im != 0){
					main_list.push(new Quad(-re,-im,colorindex));
				}
			}
			
		}
	}
	
}


class Quad {
	constructor(re,im,colorindex) {
		//console.log(re,im);
		this.coords = [width/2+re*px/2,height/2+1.732051*im*px/2];
		this.colorindex = colorindex;
	}
}


function isNotSquare(pcheck,ncheck){
	
	if(mod(ncheck,pcheck)==0){
		return false;
	}
	if(pcheck==2){
		return (ncheck % 4) != 1;
	}
	
	var p_exp = int((pcheck - 1)/2);
	var echeck = 1;
	while (p_exp > 0){
		if (p_exp % 2 == 1){
			echeck = mod(echeck * ncheck , pcheck);
			p_exp -= 1;
		}
		p_exp = int(p_exp / 2);
		ncheck = mod(ncheck ** 2 , pcheck);
	}
	
	return echeck != 1;
	
}


function hexagon(xcenter,ycenter,hexrad){
	beginShape();
	vertex(xcenter,ycenter-hexrad*0.577);
	vertex(xcenter+hexrad*0.5,ycenter-hexrad*0.2886);
	vertex(xcenter+hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter,ycenter+hexrad*0.577);
	vertex(xcenter-hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter-hexrad*0.5,ycenter-hexrad*0.2886);
	endShape(CLOSE);
}

function quadraticDraw(){
	
		noStroke();

		if (ticker > page_trans && ticker <= page_trans*2){
			quad_show = [true,false,false];
			quad_colors[0].setAlpha(int(255*(ticker-page_trans)/page_trans));
		} else if (ticker > quad_len && ticker <= quad_len + page_trans){
			quad_show = [true,true,false];
			quad_colors[0].setAlpha(int(255*(quad_len+page_trans-ticker)/page_trans));
			quad_colors[1].setAlpha(int(255*(ticker-quad_len)/page_trans));
		} else if (ticker > quad_len + page_trans && ticker <= quad_len*2 - page_trans){
			quad_show = [false,true,false];
		} else if (ticker > quad_len*2 - page_trans && ticker <= quad_len*2){
			quad_show = [false,true,true];
			quad_colors[1].setAlpha(int(255*(quad_len*2-ticker)/page_trans));
			quad_colors[2].setAlpha(int(255*(ticker-quad_len*2+page_trans)/page_trans));
		} else if (ticker > quad_len*2 && ticker <= page_time - page_trans*2){
			quad_show = [false,false,true];
		} else if (ticker > page_time - page_trans*2 && ticker <= page_time - page_trans){
			quad_colors[2].setAlpha(int(255*(page_time-page_trans-ticker)/page_trans));
		} else if (ticker > page_time - page_trans){
			quad_show = [false,false,false];
		}

		for (var qd of main_list) {
			if (quad_show[qd.colorindex]){
				fill(quad_colors[qd.colorindex]);
				hexagon(qd.coords[0], qd.coords[1], px/2);
			}
		}
			
}