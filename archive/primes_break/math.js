
var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
var prime_limit = 100000;

function add_prime(){
	let test_prime = primes[primes.length-1];
	
	while (test_prime < prime_limit){
		test_prime += 2;
		let test_is_prime = true;
		let max_factor = test_prime**0.5+0.01;
		for (let test_factor of primes){
			if (test_factor > max_factor){break;}
			if (test_prime % test_factor == 0){
				test_is_prime = false;
				break;
			}
		}

		if (test_is_prime){
			primes.push(test_prime);
			return;
		}
	}
}


function modulo(a, b) {
	return (a % b + b) % b;
}

var z_noise = 0;
var is_hex, q_ints;
var display_type = 'p';
var color_mode = 0;

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
	
class Q_int {
	constructor(coeffs) {
		//this.q = coeffs;
		this.norm = q_norm(coeffs);
		let abs_norm = abs(this.norm);
		
		this.color = [
			floor(modulo(noise(coeffs[0]/24,coeffs[1]/24,z_noise)*1000,360)),
			floor(modulo((coeffs[0]-coeffs[1])*4,360)),
			0
		];
		
		this.type = 'c'; //composite
		if (this.norm == 0){
			this.type = 'z'; //zero
		} else if (abs_norm == 1){
			this.type = 'u'; //unit
		} else if (abs_norm > prime_limit){
			this.type = 'x'; //undefined
		} else {

			while (primes[prime_norms.length-1] < abs_norm){
				add_prime_norm();
			}
			for (let pn of prime_norms){
				if (modulo(abs_norm,pn) == 0){
					if (abs_norm == pn){
						this.type = 'p'; //prime
					}
					break;
				}
			}
		}
		
	}

	display(re,im){

		let this_fill_color;
		if(this.type == display_type){
			// let int_noise = floor(noise(re/16,im/16,z_noise)*360);
			// if (color_mode == 1){
			// console.log(this.color[color_mode]);
			// }
			this_fill_color = palette.gradient[this.color[color_mode]];
			
		} else if(this.type == 'x'){
			this_fill_color = palette.undefined;
		} else if (slide != 5 && slide != 6){
			return;
		} else {
			this_fill_color = palette.back;
		}
		
		if (slide == 5){
			this_fill_color = palette.mono;
			stroke(palette.back);
			strokeWeight(0.1);
		} else if (slide == 6){
			this_fill_color = lerpColor(palette.mono, this_fill_color,present_ticker);
			stroke(palette.back);
			strokeWeight(0.1);
		}
		fill(this_fill_color);

		if (is_hex){
			hexagon(re/2,-im*0.866,1);
		} else {
			rect(re,-im,1);
		}
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

	last_frame = Date.now();
	is_hex = modulo(D,4) == 1 ? 1 : 0;

	prime_norms = [modulo(D,8)==5 ? 4 : 2];
	for (let i = 0; i < 1; i++){
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


function q_norm(q_to_norm){
	return round(q_to_norm[0]**2 - D*(q_to_norm[1]**2));
}


var prime_norms = [2];
function add_prime_norm(){

	if (prime_norms.length == primes.length){
		if (primes[primes.length - 1] > prime_limit){
			return;
		}
		add_prime();
	}

	let test_prime = primes[prime_norms.length];
	if (modulo(D,test_prime) == 0 || test_prime == 2){
		prime_norms.push(test_prime);
		return;
	}
	
	let D_power = 1;
	let D_2n = D*(4-3*is_hex);
	let remaining_exp = round((test_prime-1)/2,0);
	while (remaining_exp > 0){
		if (remaining_exp % 2 == 1){
			D_power = modulo(D_power*D_2n,test_prime);
		}	
		remaining_exp = floor(remaining_exp/2);
		D_2n = modulo(D_2n*D_2n,test_prime);
	}

	if (D_power == 1){
		prime_norms.push(test_prime);
	} else {
		prime_norms.push(test_prime**2);
	}
}


var squares = [];
var root_of_index = [];
function generate_squares(square_count){

	for (let s = 0; s <= square_count; s++){
		let s2 = s*s;
		squares.push(s2);
		while (root_of_index.length < s2){
			root_of_index.push(-1);
		}
		root_of_index.push(s);
	}
}


	