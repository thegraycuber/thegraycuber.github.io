
var superscripts = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
var subscripts = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];

function onlyStroke(stroke_color, stroke_weight){
	noFill();
	stroke(stroke_color);
	strokeWeight(stroke_weight);
}

function onlyFill(fill_color){
	noStroke();
	fill(fill_color);
}

function copyColor(color_to_copy){
	return color(red(color_to_copy),green(color_to_copy),blue(color_to_copy));
}


function c_scale(c_c,c_a){
	return [c_c*c_a[0],c_c*c_a[1]];
}

function c_add(c_a,c_b){
	return [c_a[0]+c_b[0],c_a[1]+c_b[1]];
}

function c_sub(c_a,c_b){
	return [c_a[0]-c_b[0],c_a[1]-c_b[1]];
}

function c_mult(c_a,c_b){
	return [c_a[0]*c_b[0]-c_a[1]*c_b[1],c_a[0]*c_b[1]+c_a[1]*c_b[0]];
}

function c_sq(c_a){
	return [c_a[0]**2-c_a[1]**2, 2*c_a[0]*c_a[1]];
}

function dot(v_a,v_b){
  return [v_a[0]*v_b[0],v_a[1]*v_b[1]];
}

function gcd(a,b){
	
	if (a < b){
		c = a;
		a = b;
		b = c;
	}
	
	r = a%b;
	while (r != 0){
		a = b;
		b = r;
		r = a%b;
	}
	return b;
}

function modulo(a, b) {
	return (a % b + b) % b;
}

function sign(sign_input){
	if (sign_input == 0){
		return 0;
	} else if (sign_input < 0){
		return -1;
	} else {
		return 1;
	}
}

function vector_to_array(vec_to_convert){
	return [vec_to_convert.x, vec_to_convert.y];
}

function array_to_vector(array_to_convert){
	return createVector(...array_to_convert);
}

function sup_from_val(sup_val){
	if (sup_val < 2){return '';}
	
	let sup = '';
	while (sup_val > 0){
		sup = superscripts[sup_val%10] + sup;
		sup_val = int(sup_val/10);
	}
	return sup;
}


function text_limited(text_value,x,y,text_size,max_size){
	
	textSize(text_size);
	let tw = textWidth(text_value);
	if (tw > max_size){
		textSize(text_size*max_size/tw);
	}
	
	text(text_value,x,y);
}

function text_in_box(t_string, t_x, t_y, t_s, t_color, b_color){
		noStroke();
		textSize(t_s);
		fill(b_color);
		rect(t_x, t_y ,textWidth(t_string)+t_s*0.3,t_s*1.3);

		fill(t_color);
		text(t_string,t_x, t_y);
}


function drawTri(x,y,d){
	triangle(x+d,y,x-d,y+d*1.2,x-d,y-d*1.2);
}

function drawVertTri(x,y,d){
	triangle(x+d*1.2,y-d,x*1.2-d,y-d,x,y+d);
}


function now_string(){
	return pre_0(year()) + pre_0(month()) + pre_0(day()) + '_' + pre_0(hour()) + pre_0(minute()) + pre_0(second());
}

function pre_0(time_value){
	let raw_string = "0" + str(time_value);
	return raw_string.substring(raw_string.length-2,raw_string.length);
}


function text_2d(values,unit){

	if (values[0] == 0){
		if (values[1] == 0){
			return '0';
		} else if (values[1] == 1){
			return unit;
		} else if (values[1] == -1){
			return '-' + unit;
		} else {
			return str(values[1]) + unit;
		}
	}
	
	let text_output = str(values[0]);

	if (values[1] == 1){
		return text_output + ' + ' + unit;
	} else if (values[1] == -1){
		return text_output + ' - ' + unit;	
	} else if (values[1] != 0){
		if (values[1] >= 1){
			return text_output + ' + ' + str(values[1]) + unit;
		} else {
			return text_output + ' - ' + str(abs(values[1])) + unit;
		}
	} else {
		return text_output;
	}
}


function quadratic(a,b,c){
	let discrim = b**2 - 4*a*c;
	if (discrim < 0){
		return [];
	} else {
		let disc_root = discrim**0.5;
		return [(-b+disc_root)/(2*a)*sign(a), (-b-disc_root)/(2*a)*sign(a)];
	}
}


var primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
var prime_limit = 10000;

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

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
