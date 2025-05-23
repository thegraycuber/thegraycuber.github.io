

function makeGauss(){
	main_list = [];
	var gauss_rand = random();
	
	var wmax = 15;//ceil(1+width/px);
	var hmax = 15;//ceil(1+height/px);
	for (var re = -wmax; re <= wmax; re++){
		for (var im = -hmax; im <= hmax; im++){
			//console.log(re,im);
			var gaussN = re**2 + im**2;
			if (gaussN > 200){
				continue;
			}
			var isPrime = false;
			var gaussP = 0;
			if (re == 0){
				while(primes[gaussP] < abs(im)){
					gaussP++;
					if(gaussP == primes.length){
						add_prime();
					}
				}
				if (primes[gaussP] == abs(im) && primes[gaussP] % 4 == 3){
					isPrime = true;
				}
			} else if (im == 0){
				while(primes[gaussP] < abs(re)){
					gaussP++;
					if(gaussP == primes.length){
						add_prime();
					}
				}
				if (primes[gaussP] == abs(re) && primes[gaussP] % 4 == 3){
					isPrime = true;
				}
			} else {
				while(primes[gaussP] < gaussN){
					gaussP++;
					if(gaussP == primes.length){
						add_prime();
					}
				}
				if (primes[gaussP] == gaussN){
					isPrime = true;
				}
			}
			
			if (isPrime){
				main_list.push(new Gauss(re,im,gaussN,gauss_rand));
			}
			
		}
	}
	
}


class Gauss {
	constructor(re,im,norm,gauss_rand) {
		this.coords = [re*px*0.35, im*px*0.35];
		this.colorvalue = [0];
		//this.colorshow = [[page_trans,page_time-page_trans]];
		
		this.colorvalue.push(int(norm/16)%sunlen);
		var thetacolor = 0;
		if(re == 0 && im > 0){
			thetacolor = PI/2;
		} else if(re == 0){
			thetacolor = PI*3/2;
		} else if (re > 0){
			thetacolor = atan(im/re)+TWO_PI;
		} else if (re < 0){
			thetacolor = atan(im/re)+PI;
		}
		
		this.colorvalue.push(int(60*thetacolor/PI)%sunlen);
		this.colorvalue.push((this.colorvalue[1]+this.colorvalue[2])%sunlen);
		this.colorvalue.push(mod(int((re+im)*2+50),sunlen));
		this.colorvalue.push(mod((abs(re)-abs(im)+160)*3,sunlen));
		this.colorvalue.push(int(noise(re/16+75*gauss_rand,im/16+120*gauss_rand)*sunlen));
	
		/*
		for (var cv = 1; cv < this.colorvalue.length; cv++){
			this.colorshow.push([page_trans*(1+this.colorvalue[cv]/40),page_time-page_trans*(4-this.colorvalue[cv]/40)]);
		}*/
		
	}
}


var sunset = [];
var sunlen = 120;
function gaussDraw(){
	sunset.push(sunset[0]);
	sunset.splice(0, 1);
	for (var gp of main_list) {
		//if (gp.colorshow[page_rand][0] < ticker && gp.colorshow[page_rand][1] > ticker) {
			noStroke();
			fill(sunset[gp.colorvalue[page_rand]]);
			rect(gp.coords[0], gp.coords[1], px*0.35);
		//}
	}
}