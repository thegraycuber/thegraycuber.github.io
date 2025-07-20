
function modulo(a, b) {
	return (a % b + b) % b;
}

var superscripts = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
function exp_from_val(exp_val){
	if (exp_val < 2){return '';}
	
	let exp = '';
	while (exp_val > 0){
		exp = superscripts[exp_val%10] + exp;
		exp_val = int(exp_val/10);
	}
	return exp;
}


function text_limited(text_value,x,y,text_size,max_size){
	
	textSize(text_size);
	let tw = textWidth(text_value);
	if (tw > max_size){
		textSize(text_size*max_size/tw);
	}
	
	text(text_value,x,y);
}

function now_string(){
	return pre_0(year()) + pre_0(month()) + pre_0(day()) + '_' + pre_0(hour()) + pre_0(minute()) + pre_0(second());
}

function pre_0(time_value){
	let raw_string = "0" + str(time_value);
	return raw_string.substring(raw_string.length-2,raw_string.length);
}