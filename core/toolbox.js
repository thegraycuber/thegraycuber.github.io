
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


function text_2d(values,unit){
	let text_output = '';
	
	if (values[0] != 0 || values[1] == 0){
		text_output += ' ' + str(values[0]);
	}

	if (values[1] == 1){
		text_output += ' ' + unit;
	} else if (values[1] == -1){
		if (text_output.length == 0){
			text_output += ' -' + unit;
		} else {
			text_output += ' - ' + unit;	
		}
	} else if (values[1] != 0){
		if (text_output.length == 0){
			text_output += ' ' + str(values[1]) + unit;
		} else if (values[1] >= 1){
			text_output += ' + ' + str(values[1]) + unit;
		} else {
			text_output += ' - ' + str(abs(values[1])) + unit;
		}
	}
	
	return text_output;
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