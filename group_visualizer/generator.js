
class generator{
	constructor(name,reduce_order){
		this.name = name;
		this.reduce_order = reduce_order;
	}
}

function group_from_gens(){
	
	gen = [];
	G = [];
	
	for (var rule of gen_rules){
		
		var first_letter = rule[0].substring(0,1);
		if (rule[0].replaceAll(first_letter,'').length == 0){
			gen.push(new generator(first_letter,rule[0].length));
		}
	}
	
	var group_order = 1;
	for (var gen_el of gen){
		group_order *= gen_el.reduce_order;
	}
	generator_recursive(0,group_order,'');
	
	for (let el of G){
		el.processOperate();
	}
	for (let el of G){
		el.processConjugate();
	}
}

function generator_recursive(gen_i,group_order,el_name){
	
	if (gen_i == gen.length){
	
		G.push(new element(el_name));
		return;
	}
	
	for (var o = 0; o < gen[gen_i].reduce_order; o++){
		generator_recursive(gen_i+1,group_order,el_name);
		el_name = gen[gen_i].name + el_name;
	}
}


function reduce(word_to_reduce){
	
	while (true){
		var tracker = word_to_reduce;
		for (var rule of gen_rules){
			word_to_reduce = word_to_reduce.replace(rule[0],rule[1]);
		}
		if (tracker == word_to_reduce){
			return word_to_reduce;
		}
	}
}
function word_to_index(input_word){

	var index_from_word = 0;
	
	for (var g_i = 0; g_i < gen.length; g_i++){
		index_from_word += input_word.length - input_word.replaceAll(gen[g_i].name,'').length;
		if (g_i != gen.length - 1){
			index_from_word *= gen[g_i+1].reduce_order;
		}
	}
	
	return index_from_word;
}


function name_reduce(full_name){
	let reduced = '';
	let curr_letter = '';
	let curr_count = 0;
	for (let r = 0; r < full_name.length; r++){
		if (full_name.substring(r,r+1) == curr_letter){
			curr_count += 1;
		} else {
			reduced += sup_from_val(curr_count);
			curr_letter = full_name.substring(r,r+1);
			reduced += curr_letter;
			
		}
	}
	reduced += sup_from_val(curr_count);
	return reduced;
}


v