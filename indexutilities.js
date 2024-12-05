
function radius_adjust(radius, tick){
	if (tick > 4){
		return radius;
	}
	return radius * 0.6 * (sin(tick-PI/2)+1);
}

function n_gon(center,radius,start,step){
	
	beginShape();
	for (var step_count = 0; step_count < step; step_count++){
		vertex(center[0]+radius*cos(TWO_PI*(start+step_count/step)),center[1]-radius*sin(TWO_PI*(start+step_count/step)));
		//vertex(center[0]+radius*cos(TWO_PI*(start+0.001+step_count/step)),center[1]-radius*sin(TWO_PI*(start+0.001+step_count/step)));
	}
	endShape(CLOSE);
}


function logo(logo_center,logo_rad) {
	
	textAlign(LEFT,CENTER);
	
	var rad_adj;
	var shape_center = [logo_center[0]-logo_rad*1.2,logo_center[1]];
	var logo_col = [palette[0].gray,palette[0].accent1,palette[0].accent1];
	var logo_alpha = [palette[0].grayalpha,palette[0].accent1alpha,palette[0].accent1alpha];
	
	for (var l = 0; l < logo_info.length; l++){
		if (ticker > logo_info[l][3]*3.5 - intro_len){
			rad_adj = radius_adjust(logo_rad,ticker + intro_len - logo_info[l][3]*3.5);
			
			strokeWeight(logo_rad/12);
			fill(logo_alpha[l]);
			stroke(logo_col[l]);
			n_gon(shape_center,rad_adj,logo_info[l][1],logo_info[l][2]);	
			
			if (ticker > 4+logo_info[l][3]*3.5 - intro_len){
				fill(logo_col[l]);
				noStroke();
				textSize(logo_rad*logo_info[l][4]);
				text(logo_info[l][0],logo_center[0]+logo_rad*logo_info[l][5],logo_center[1]+logo_rad*logo_info[l][6])
			}
		}
	}
	
}

function mod(mod_a,mod_m){
	while(mod_a < 0){
		mod_a += mod_m;
	}
	return (mod_a % mod_m);
}


function add_prime(){
	
	var test_value = primes[primes.length - 1] + 1;
	while (true){
		var is_prime = true;
		for (var p_check of primes){
			if(test_value % p_check == 0){
				is_prime = false;
				break;
			}
		}
		
		if(is_prime){
			primes.push(test_value)
			break;
		}
		test_value++;
	}
		
}

function add_prime_wf(){
	
	var test_value = primeswf[primeswf.length - 1][0];
	while (true){
		var is_prime = true;
		for (var p_check of primeswf){
			if(test_value % p_check[0] == 0){
				is_prime = false;
				break;
			}
		}
		
		if(is_prime){
			var p_fact = prime_factorization(test_value-1);
			primeswf.push([test_value,p_fact])
			break;
		}
		test_value++;
	}
		
}


function prime_factorization(num_to_factor){
	
	var p = 0;
	var factorization = [];
	while(num_to_factor != 1){
		//console.log(primeswf,factorization);
		if(p == primeswf.length){
			add_prime_wf();
		}
		while(num_to_factor % primeswf[p][0] == 0){
			if(factorization.length == 0 || factorization[factorization.length - 1][0] != primeswf[p][0]){
				factorization.push([primeswf[p][0],1]);
			}else{
				factorization[factorization.length - 1][1]++;
			}
			num_to_factor = int(num_to_factor/primeswf[p][0]);
		}
		
		p++;
	}
	
	return(factorization);
}


class Page {
	constructor(title,scheme,link) {
		this.title = title;
		this.scheme = scheme;
		this.index = color_list.indexOf(scheme);
		this.link = link;
	}
}
