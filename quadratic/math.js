

function q_norm(q_to_norm){
	return round(q_to_norm[0]**2 - D*(q_to_norm[1]**2));
}


function q_div(q_num, q_denom){
	let denom_norm = q_norm(q_denom);
	let test_product = q_mult(q_num,[q_denom[0],-q_denom[1]]);

	let divisible;
	if (is_hex){
		divisible = modulo(round(test_product[0]*2),denom_norm) == 0 && modulo(round(test_product[1]*2),denom_norm) == 0;
	} else {
		divisible = modulo(test_product[0],denom_norm) == 0 && modulo(test_product[1],denom_norm) == 0;
	}
	
	if (!divisible){
		return [];
	} else {
		return [round(test_product[0]/denom_norm,1),round(test_product[1]/denom_norm,1)]
	}
}

function q_mult(q_a, q_b){
	return [q_a[0]*q_b[0]+D*q_a[1]*q_b[1],q_a[1]*q_b[0]+q_a[0]*q_b[1]];
}



function q_factorize(q_to_factor){
	if (highlight_mode == 'prime factors'){
		highlights = [];
	}

	if (q_to_factor[0] == 1 && q_to_factor[1] == 0){
		return '1';
	} else if (q_to_factor[0] == 0 && q_to_factor[1] == 0){
		return '0';
	}
	
	let factor_norm = q_norm(q_to_factor);
	let unfactored = [...q_to_factor];
	let factorization = [];

	if (factor_norm >= prime_limit){
		return 'norm is above\ncompute limit';
	}

	while (factor_norm >= primes[prime_norms.length-1]){
		add_prime_norm();
	}
	
	let rep_count = 0;
	let pn = 0;
	while (abs(factor_norm) != 1 && rep_count < 2000){

		rep_count++;
		
		if (modulo(factor_norm,prime_norms[pn]) != 0){
			pn++;
			continue;
		}

		let q_factor = [];
		for (let sq of squares){
			for (let sq_sign = (D>0?-1:1); sq_sign < 2; sq_sign += 2){
				let a2 = sq_sign*prime_norms[pn]*(is_hex?4:1) + D*sq;
				
				if (a2 < 0 || a2 >= root_of_index.length){
					continue;
				}
				if (root_of_index[a2] == -1){
					continue;
				}
				q_factor = [root_of_index[a2]*(is_hex?0.5:1),root_of_index[sq]*(is_hex?0.5:1)];
				break;
			}
			if (q_factor.length > 1){
				break;
			}
		}

		if (q_factor.length == 0){
			return 'failed to\nfind factors';
		}

		let factor_found = false;
		for (let l = 0; l < 2; l++){
			let factor_quotient = q_div(unfactored,q_factor);
			if (factor_quotient.length > 0){
				factor_norm = round(factor_norm/prime_norms[pn]);
				unfactored = factor_quotient;
				if (factorization.length > 0 && factorization[factorization.length-1][0][0] == q_factor[0] && factorization[factorization.length-1][0][1] == q_factor[1]){
					factorization[factorization.length-1][1]++;
				} else {		
					factorization.push([[...q_factor],1]);
				}
				factor_found = true;
				l = 2;
			}
			q_factor[1] *= -1;
		}

		if (!factor_found){
			infoBox.getItem('info_factor').Volume = 2;
			return 'failed to\nfind factors';
		}
		
	}
	if (rep_count >= 5000){
	infoBox.getItem('info_factor').Volume = 2;
		return 'failed to\nfind factors';
	}

	if (highlight_mode == 'prime factors'){
		for (let u of units){
			for (let f of factorization){
				let h = q_mult(u,f[0]);
				highlights.push([h[0]*(is_hex?2:1),h[1]*(is_hex?2:1)]);
			}
		}
	}

	if (unfactored[0] != 1 || unfactored[1] != 0){
		factorization.unshift([unfactored,1]);
	}

	let factor_rows = floor(factorization.length**0.5);
	let factor_divisor = ceil(factorization.length/factor_rows);
	let factor_text = '';
	infoBox.getItem('info_factor').Volume = factor_rows;
	
	for (let f = 0; f < factorization.length; f++){
		factor_text += '(' + q_int_text(factorization[f][0],true) + ')' + sup_from_val(factorization[f][1]);
		if ((f+1)%factor_divisor == 0){
			factor_text += '\n';
		} else if (f+1 != factorization.length){
			factor_text += ' '
		}
	}
	if (factor_text.substring(factor_text.length-1) == '\n'){
		factor_text = factor_text.substring(0,factor_text.length-1);
	}
	return factor_text;
}


var prime_norms = [2];
var filled_norms = 0;
function add_prime_norm(){

	if (prime_norms.length == primes.length){
		if (primes[primes.length - 1] > prime_limit){
			return;
		}
		add_prime();
	}

	let test_prime = primes[prime_norms.length];
	if (modulo(D,test_prime) == 0){
		let new_index = get_prime_norm(test_prime)+1;
		prime_norms.splice(new_index,0,test_prime);
		filled_norms = new_index;
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
		let new_index = get_prime_norm(test_prime)+1;
		prime_norms.splice(new_index,0,test_prime);
		filled_norms = new_index;
	} else {
		prime_norms.splice(get_prime_norm(test_prime**2)+1,0,test_prime**2);
	}
}

function get_prime_norm(norm_max){

	if (norm_max < prime_norms[0]){
		return -1;
	}

	let norm_power = 2**floor(log(prime_norms.length-1)/log(2));
	let current_index = 0;
	
	while (norm_power > 0){
		if (current_index + norm_power < prime_norms.length){
			if (prime_norms[current_index + norm_power] <= norm_max){
				current_index += norm_power;
			}
		}
		norm_power = floor(norm_power/2);
	}

	return current_index;
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
