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