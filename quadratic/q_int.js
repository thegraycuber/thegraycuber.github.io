
var z_noise = 0;
var is_hex, q_ints;
var D_list = [-1,-2,-3,-7,-11,-19,-43,-67,-163,201,199,197,193,191,181,179,177,173,167,166,163,161,
			  158,157,151,149,141,139,137,134,133,131,129,127,118,113,109,107,103,101,97,94,93,89,86,83,77,
			  73,71,69,67,62,61,59,57,53,47,46,43,41,38,37,33,31,29,23,22,21,19,17,14,13,11,7,6,5,3,2];
var color_mode = 1;
var vertical_unit = 'i';

// 
function q_int_text(q_int,skip_adjust){
	if (is_hex){
		return text_2d([round(q_int[0]+q_int[1]),round(q_int[1]*2)],vertical_unit);
	} else {
		return text_2d(q_int,vertical_unit);
	}
}


function process_int(re, im){
	
	if (abs(re) >= q_ints.length){
		if (process_limit == 0){
			return;
		}
		while (abs(re) >= q_ints.length){
			q_ints.push([]);
		}
	}
	
	while (abs(im) >= q_ints[abs(re)].length){
		q_ints[abs(re)].push(is_hex ?  modulo(re+q_ints[abs(re)].length,2) : 0);
	}
	
	if (q_ints[abs(re)][abs(im)] == 0){
		if(process_limit == 0){
			return;
		}  
		if (is_hex){
			q_ints[abs(re)][abs(im)] = new Q_int([abs(re)/2,abs(im)/2]);
		} else {
			q_ints[abs(re)][abs(im)] = new Q_int([abs(re),abs(im)]);
		}
		process_limit--;
		
	} else if (q_ints[abs(re)][abs(im)] == 1){
		return;
	}

	if (!is_hex || modulo(re+im,2)==0){
		q_ints[abs(re)][abs(im)].display(re,im);	
	}
	
}
	
var type_key = {
	'c' : 'composite',
	'p' : 'prime',
	'z' : 'zero',
	'u' : 'unit',
	'x' : 'unknown'
}
var norm_adjust = 0.0625;

class Q_int {
	constructor(coeffs) {
		//this.q = coeffs;
		this.norm = q_norm(coeffs);
		let abs_norm = abs(this.norm);
		
		this.color = [
			0,
			floor(modulo(noise(coeffs[0]/24,coeffs[1]/24,z_noise)*540,360)),
			floor(modulo(this.norm*norm_adjust,360)),
			floor(modulo((coeffs[0]-coeffs[1])*4,360)),
		];
		
		this.type = 'c'; //composite
		if (this.norm == 0){
			this.type = 'z'; //zero
		} else if (abs_norm == 1){
			this.type = 'u'; //unit
			units.push([...coeffs]);
			if (coeffs[0] != 0){
				units.push([-coeffs[0],coeffs[1]]);
			}
			if (coeffs[1] != 0){
				units.push([coeffs[0],-coeffs[1]]);
			}
			if (coeffs[1] != 0 && coeffs[0] != 0){
				units.push([-coeffs[0],-coeffs[1]]);
			}
			
		} else if (abs_norm > prime_limit){
			this.type = 'x'; //undefined
		} else {

			while (primes[prime_norms.length-1] < abs_norm){
				add_prime_norm();
			}
			if (prime_norms[get_prime_norm(abs_norm)] == abs_norm){
				this.type = 'p'; //prime
			}
		}
		
	}

	display(re,im){
		
		if(this.type == 'p'){
			if (color_mode == 0){
				fill(palette.mono);
			} else {
				fill(palette.gradient[this.color[color_mode]]);
			}
			
		} else if(this.type == 'x'){
			fill(palette.undefined);
		} else {
			return;
		}

		int_shape(re,im);
	}
}

function int_shape(re,im){
	if (is_hex){
		hexagon(re/2,-im*0.866,1);
	} else {
		rect(re,-im,1);
	}
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


function reset_D(){

	norm_adjust = 0.0625/(abs(D)**0.5);
	is_hex = modulo(D,4) == 1 ? 1 : 0;
	vertical_unit = D == -1 ? 'i':'ω';
	
	if (is_hex){
		let const_coeff = round((D - 1)/4);
		textBox.getItem('ring_rule').DisplayText = vertical_unit + '² = ' + text_2d([const_coeff,-1],vertical_unit);

		
	} else {
		textBox.getItem('ring_rule').DisplayText = vertical_unit + '² = ' + str(D);
	}
	
	prime_norms = [modulo(D,8)==5 ? 4 : 2];
	filled_norms = -1;
	for (let i = 0; i < 20; i++){
		add_prime_norm();
	}
	
	q_ints = [];
	
	for (let re = 0; re < 1; re++){
		new_row = [];
		
		for (let im = 0; im < 1; im++){
			if (is_hex ){
				if (modulo(re+im,2)==1){
					new_row.push(1);
				} else {
					new_row.push(new Q_int([re/2,im/2]));	
				}
			} else {
				new_row.push(new Q_int([re,im]));	
			}
		}
		q_ints.push(new_row);
	}
}
