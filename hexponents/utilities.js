
function hex_mult(a, b){
	return [a[0]*b[0] + crow_constant*a[1]*b[1], a[1]*b[0] + a[0]*b[1] + a[1]*b[1]];
}

function hex_str(a){
	return str(a[0]) + ';' + str(a[1]);
}

function hex_norm(a){
	return a[0]**2 + a[0]*a[1] - crow_constant*a[1]**2;
	//return hex_mult(a,[a[0]+a[1],-a[1]])[0];
}

// two values will return the same representative if they're congruent using the mod
function get_representative(a){
	let rounded_quotient = rounded_division(a,modulus);
	let nearest_multiple = hex_mult(modulus,rounded_quotient);
	return [a[0] - nearest_multiple[0], a[1] - nearest_multiple[1]];
}

function rounded_division(a, b){
	let b_norm = hex_norm(b);
	let unscaled = hex_mult(a,[b[0]+b[1],-b[1]]);
	return [round(unscaled[0]/b_norm),round(unscaled[1]/b_norm)];
}

function process_mod(){
	scalar = 0.4*min(width,height)/max(abs(hex_norm(modulus))**0.5,8);
	let extremes = [floor(width/(2*scalar))*2+4,floor(height/(2*scalar))*2+4];
	equivalence_classes = {};
	
	for (let re = -extremes[0]; re <= extremes[0]; re++){
		for (let im = -extremes[1]; im <= extremes[1]; im++){
			if (abs(re+im)%2!=0){
				continue;
			}

			let rep_val = get_representative([round((re-im)/2),im]);
			let rep = hex_str(rep_val); 
			if (typeof equivalence_classes[rep] == 'undefined'){
				Object.defineProperty(equivalence_classes,rep,{value:{rep:rep_val,orbit:-1,hexes:[]},enumerable:true});
			}
			equivalence_classes[rep].hexes.push([re*0.5,im*0.866]);
		}
	}
}

function process_orbits(){
	// console.log(modulus);
	// console.log(crow_constant);
	// console.log(orbits);
	// console.log(hex_norm(modulus))
	let mod_norm = abs(hex_norm(modulus));
	let target_order = round((mod_norm-1)/orbits);
	let one_rep = hex_str(get_representative([1,0]));

	let multiplier = [];
	for (let c of Object.keys(equivalence_classes)){
		if (c == '0;0'){continue;}
		let c_val = [...equivalence_classes[c].rep];
		let c_pow = 1;
		let c_str = hex_str(c_val);
		while (c_str != one_rep && c_pow < target_order){
			c_pow++;
			c_val = get_representative(hex_mult(c_val,equivalence_classes[c].rep));
			c_str = hex_str(c_val);
		}

		if (c_str == one_rep && c_pow == target_order){
			multiplier = [...equivalence_classes[c].rep];
			break;
		}
	}
	for (let c of Object.keys(equivalence_classes)){
		equivalence_classes[c].orbit = -1;
	}

	let orbit_number = 0;
	for (let c of Object.keys(equivalence_classes)){
		if (c == '0;0'){continue;}
		if (equivalence_classes[c].orbit == -1){
			let orbiter = [...equivalence_classes[c].rep];
			// console.log(hex_str(orbiter));
			while (equivalence_classes[hex_str(orbiter)].orbit == -1){
				equivalence_classes[hex_str(orbiter)].orbit = orbit_number;
				// console.log(multiplier);
				orbiter = get_representative(hex_mult(orbiter,multiplier));
				// console.log(hex_str(orbiter));
			}
			orbit_number++;
		}
	}
}

var orbit_options;
function generate_orbit_options(mod_norm){
	orbit_options = [];
	let orbit_texts = [];
	let orbit_index = 0;
	for (let oo = 2; oo < abs(mod_norm); oo++){
		if (modulo(abs(mod_norm) - 1,oo) == 0){
			orbit_options.push(oo);
			orbit_texts.push(str(oo) + ' orbits');
			if (oo <= orbits){
				orbit_index = orbit_texts.length-1;
			}
		}
	}

	textBox.getItem('orbits').List = orbit_texts;
	textBox.getItem('orbits').giveValue(orbit_index,true);
	
}

function generate_hex_primes(){	
	prime_norms = modulo(crow_constant,2)==1 ? [[2,0,4]]:[];
	
	
	for (let p = 1; p < primes.length; p++){
		add_prime_norm(p);
	}

	let prime_texts = [];
	for (let pn of prime_norms){
		prime_texts.push('mod ' + text_2d(pn,'c'));
	}
	textBox.getItem('mod').List = prime_texts;
	textBox.getItem('mod').giveValue(min(textBox.getItem('mod').Index,prime_texts.length-1),true);
}

var prime_norms;
function add_prime_norm(prime_index){

	let D = crow_constant*4+1;
	let test_prime = primes[prime_index];
	if (modulo(D,test_prime) == 0){
		add_hex_with_norm(test_prime);
		return;
	}
	
	let D_power = 1;
	let D_2n = D;
	let remaining_exp = round((test_prime-1)/2,0);
	while (remaining_exp > 0){
		if (remaining_exp % 2 == 1){
			D_power = modulo(D_power*D_2n,test_prime);
		}	
		remaining_exp = floor(remaining_exp/2);
		D_2n = modulo(D_2n*D_2n,test_prime);
	}

	if (D_power == 1){
		add_hex_with_norm(test_prime);
	} else if (test_prime < 50){
		prime_norms.push([test_prime,0,test_prime**2]);
	}
}

function add_hex_with_norm(target_norm){
	
	for (let re = 0; re < 20; re++){
		for (let im = -re; im < 30 - re; im++){
			if (abs(hex_norm([re,im])) == target_norm){
				prime_norms.push([re,im,target_norm]);
				return;
			}
		}
	}
}


function core_color_custom(plt){
	plt.medium = lerpColor(plt.mono,plt.back,0.5);
	plt.backalpha = copyColor(plt.back);
	plt.backalpha.setAlpha(150);
}

// pick a good color scheme depending on the number of orbits
function orbit_color_setup(){
	
	if (orbits <= 2){
		palette.orbits = [palette.front, palette.medium];
		
	} else if (orbits <= 4){
		palette.orbits = [palette.front,palette.mono,palette.bright,palette.red];
		
	} else if (orbits <= 8){
		palette.orbits = [palette.front,palette.bright,palette.red];
		for (let c = 3; c < orbits; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,(c-3)/(orbits-3)));
		}
	} else {
		palette.orbits = [];
		for (let c = 0; c < orbits; c++){
			palette.orbits.push(lerpColor(palette.mono,palette.back,c/orbits));
		}
	}
}

function check_info(){
	if (helpBox.Active){
		return 'hide';
	} else {
		return 'info';
	}
}
