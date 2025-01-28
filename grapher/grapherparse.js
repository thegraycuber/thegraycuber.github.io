function parse_polynomial(polynomial_string){
	
	polynomial_string = polynomial_string.replace(/ /g,'');
	if (polynomial_string == '0'){
		return [0];
	}
	
	var string_list = [];
	var out_list = [];
	var sign_list = [];
	var split_index = 0;
	var s = 0;
	
	if (polynomial_string.indexOf('x') == -1){
		
		string_list = polynomial_string.split(",");
		
		for (s of string_list){
			if (!isNaN(parseFloat(s)) && isFinite(s)){
				out_list.push(parseFloat(s));
			} else {
				return [];
			} 
		}
			
	} else {
		
		if (polynomial_string.substring(0,1) == '-'){
			sign_list.push(-1);
			polynomial_string = polynomial_string.substring(1);
		} else {
			sign_list.push(1);
		}
		
		var plus_index = polynomial_string.indexOf('+');
		var minus_index = polynomial_string.indexOf('-');
		while (plus_index != -1 || minus_index != -1){
			
			if ((plus_index < minus_index && plus_index > -1)|| minus_index == -1){
				sign_list.push(1);
				split_index = plus_index;
			} else {
				sign_list.push(-1);
				split_index = minus_index;
			}
			
			string_list.push(polynomial_string.substring(0,split_index));
			polynomial_string = polynomial_string.substring(split_index + 1);
			plus_index = polynomial_string.indexOf('+');
			minus_index = polynomial_string.indexOf('-');

		}
		string_list.push(polynomial_string);
		
		var x_index = 0;
		var pre_x = '';
		var post_x = '';
		var s_val = 0;
		for (s of string_list){
			x_index = s.indexOf('x');
			
		
			if (x_index == -1){
				pre_x = s;
				post_x = 0;
			} else {
				pre_x = s.substring(0,x_index);
				if (x_index + 1 == s.length){
					post_x = 1;
				} else if (s.substring(x_index+1,x_index+2) != '^' || x_index + 2 == s.length){
					return [];
				} else {
					post_x = Math.floor(Number(s.substring(x_index+2)));
    			if (post_x === Infinity || String(post_x) !== s.substring(x_index+2) || post_x < 1 || post_x > 40){
						return [];
					}
				} 
				
				if (pre_x == ''){
					pre_x = '1';
				} else if (pre_x == '-'){
					pre_x = '-1';
				}
			}
			
			
			if (isNaN(parseFloat(pre_x)) || !isFinite(pre_x)){
				return [];
			} 
			
			while (out_list.length <= post_x){
				out_list.push(0);
			}
			out_list[post_x] += parseFloat(pre_x)*sign_list[s_val];
			
			s_val++;
		}
		
	}
	
	return out_list;
}

function poly_to_text(raw_poly){
	
	if(raw_poly.length == 1 && raw_poly[0] == 0){
		return '0';
	}
		
		
	var poly_text = ''
	for (var p_term = raw_poly.length - 1; p_term > -1; p_term--){
		if (raw_poly[p_term] == 0){
			continue;
		} else if (raw_poly[p_term] == -1 && p_term > 0){
			poly_text += '-';
		} else if (raw_poly[p_term] > 0){
			if(p_term != raw_poly.length - 1){
				poly_text += '+';
			}
			if(raw_poly[p_term] != 1 || p_term == 0){
				poly_text += str(raw_poly[p_term]);
			}
		} else {
			poly_text += str(raw_poly[p_term]);
		}
		
		if(p_term == 1){
			poly_text += 'x';
		} else if (p_term > 1){
			poly_text += 'x' + settings.exponent[p_term];
		}
	
	}
	
	return poly_text;
}
