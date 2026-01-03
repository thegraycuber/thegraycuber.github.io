

var modulus, multiplier, crow_constant, equivalence_classes;

var mod_list = [[5,0],[3,2],[3,0],[5,0],[7,0],[7,0],[4,3],[3,1],[4,3]];
var mult_list = [[0,1],[-2,1],[-1,2],[-1,2],[2,-1],[-2,-1],[2,-1],[2,-2],[-4,5]];
var crow_list = [-1,-1,-2,-1,-11,-3,-1,-1,-1];

function hexponentPrep(){
	
	let list_choice = floor(random()*mod_list.length);
	// let list_choice = mod_list.length-1;
	modulus = [...mod_list[list_choice]];
	multiplier = [...mult_list[list_choice]];
	crow_constant = crow_list[list_choice];
	process_mod();
	process_orbits();
}

var highlight = 0;
var hex_tick = 0;
var orbit_number;
function hexponentDraw(){
	scale(hex_scalar,hex_scalar);
	for (let c of Object.keys(equivalence_classes)){
		if (c == '0;0'){continue;}
		onlyFill(palette[0].orbits[equivalence_classes[c].orbit]);
		for (let hex of equivalence_classes[c].hexes){
			hexagon(hex[0],hex[1],0.51);
		}
	}
	
	//draw the borders
	hex_tick = hex_tick+(Date.now()-last_display)*0.004;
	last_display = Date.now();
	if (hex_tick > PI){
		hex_tick = -PI;
		highlight = (highlight + 1) % orbit_number;
	}

	translate(0,0,0.02);
	onlyStroke(palette[0].back,(cos(hex_tick)*0.06+0.06));//*hex_scalar
	for (let c of Object.keys(equivalence_classes)){
		if (equivalence_classes[c].orbit != highlight){continue;}
		for (let hex of equivalence_classes[c].hexes){
			hexagon(hex[0],hex[1],0.51);
		}
	}
}




function hex_mult(a, b){
	return [a[0]*b[0] + crow_constant*a[1]*b[1], a[1]*b[0] + a[0]*b[1] + a[1]*b[1]];
}

function hex_str(a){
	return str(a[0]) + ';' + str(a[1]);
}

function hex_norm(a){
	return a[0]**2 + a[0]*a[1] - crow_constant*a[1]**2;
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

var hex_scalar, last_display;
function process_mod(){
	last_display = Date.now();
	
	let mod_norm = abs(hex_norm(modulus));
	let mod_size = mod_norm**0.5;
	hex_scalar = 2.5*px/mod_size;
	let extremes = [floor(mod_size*8),floor(mod_size*8)];
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
			if ((re*0.5)**2 + (im*0.866)**2 <= mod_norm*4){
				equivalence_classes[rep].hexes.push([re*0.5,im*0.866]);
			}
		}
	}
}

function process_orbits(){

	for (let c of Object.keys(equivalence_classes)){
		equivalence_classes[c].orbit = -1;
	}

	orbit_number = 0;
	let class_keys = Object.keys(equivalence_classes);
	class_keys.sort();
	for (let c of class_keys){
		if (c == '0;0'){continue;}
		if (equivalence_classes[c].orbit == -1){
			let orbiter = [...equivalence_classes[c].rep];
			while (equivalence_classes[hex_str(orbiter)].orbit == -1){
				equivalence_classes[hex_str(orbiter)].orbit = orbit_number;
				orbiter = get_representative(hex_mult(orbiter,multiplier));
			}
			orbit_number++;
		}
	}
}

function hexagon(x,y,radius){
	beginShape();
	vertex(x,y-radius*1.16);
	vertex(x+radius,y-radius*0.58);
	vertex(x+radius,y+radius*0.58);
	vertex(x,y+radius*1.16);
	vertex(x-radius,y+radius*0.58);
	vertex(x-radius,y-radius*0.58);
	endShape(CLOSE);
}