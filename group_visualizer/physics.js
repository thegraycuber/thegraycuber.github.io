
var display_state = 0;
var auto_position_skip = false;
var movement = true;

function update_physics(){
	
	if (!movement){
		return;
	} 
	
	for (let a = 0; a < arrow_elements.length; a++){

		if (arrow_elements[a] == -1){continue;}
		
		for (let arrow_from = 0; arrow_from < G_order; arrow_from++){
			
			let arrow_to = G[arrow_elements[a]].arrow_tables[arrow_types[a]][arrow_from];
			
			let diff_vec = G[arrow_from].pos.copy();
			diff_vec = diff_vec.sub(G[arrow_to].pos);
			
			diff_vec.mult(arrow_strengths[a]/2000);
			
			G[arrow_from].acc.sub(diff_vec);
			G[arrow_to].acc.add(diff_vec);
		}
	}
	
	for (let g of G){
		for (let h of G){
			if (g.index == h.index){continue;}
			
			let diff_vec = g.pos.copy();
			diff_vec = diff_vec.sub(h.pos);
			if (diff_vec.mag() > 6){
				continue;
			}
			diff_vec.mult(min(0.0004/diff_vec.mag(),100));
			g.acc.add(diff_vec);
			h.acc.sub(diff_vec);
		}
	}

	
	for (let g of G){
		g.update();
	}
	
	
}

var inner_ring = [];
var outer_ring = [];
function inner_outer(position_mode){
	
	if (G_order == 1 || (auto_position_skip && !movement)){
		return;
	}
	
	if (movement){
		in_theta += 0.0031;
		out_theta += 0.0021;
	}
	
	inner_ring = [0];
	let arrow_check = 0;
	while (inner_ring.length == 1){
		if (arrow_check < arrow_elements.length){
			//console.log(inner_ring,arrow_elements[a]);
			if (arrow_elements[arrow_check] > 0){
				inner_ring.push(...powers_outside_of_list(arrow_elements[arrow_check]));
			}
		} else {
				inner_ring.push(...powers_outside_of_list(1));
		}
		arrow_check++;
	}
	
	let positioned = [];
	outer_ring = [0];
	let outr = -1;
	let pos_rad = inner_ring.length*0.6+3/inner_ring.length;
	let inner_ang = TWO_PI/inner_ring.length;
	let test_el = 1;
	
	while (positioned.length < G_order){
		
		while (outr < outer_ring.length - 1){
			outr++;
			if (positioned.includes(outer_ring[outr])){
				outer_ring.splice(outr,1);
				outr--;
				continue;
			}
			
			for (let inr = 0; inr < inner_ring.length; inr++){
				let pos_el = G[inner_ring[inr]].arrow_tables[arrow_types[0]%2][outer_ring[outr]];
				let pos_ang =  in_theta + inr*inner_ang + outr*(TWO_PI/G_order+out_theta) - PI/2;
				G[pos_el].inner = inr;
				G[pos_el].outer = outr+1;
				
				if (position_mode == 'auto'){
					G[pos_el].pos = createVector(pos_rad*(outr+1)*cos(pos_ang),pos_rad*(outr+1)*sin(pos_ang));
				}
				
				positioned.push(pos_el);
			}
		}
		if (positioned.length == G_order){break;}
		
		let new_outer = [];
		if (arrow_check < arrow_elements.length){
			if (arrow_elements[arrow_check] > 0){
				new_outer = powers_outside_of_list(arrow_elements[arrow_check],positioned);
			}
		} else {
			while (new_outer.length == 0){
				new_outer = powers_outside_of_list(test_el,positioned);
				test_el++;
			}
		}
		arrow_check++;
		
		let old_len = outer_ring.length;
		for (let no of new_outer){
			for (let ol = 0; ol < old_len; ol++){
				outer_ring.push( G[no].arrow_tables[0][ol] );
			}
		}
		
		
	}
	auto_position_skip = true;
}

function powers_outside_of_list(el_index, index_list = [0]){
	
	let power_output = [];
	let power_index = el_index;
	
	while (index_list.includes(power_index) == false){
		power_output.push(power_index);
		power_index = G[el_index].arrow_tables[0][power_index];
	}
	
	return power_output;
}

var in_theta = 0;
var out_theta = 0;

