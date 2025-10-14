

var color_trans;
var color_types = ['front','back','backlight','accent1','accent2','accent3','mono','bright','red','gray'];

function color_refresh(){

	if (color_trans[2] == -1){return;}

	color_trans[2] += 0.02;
	let pal_a = palette[color_trans[0]];
	let pal_b = palette[color_trans[1]];

	for (let c_type of color_types){
		palette[0][c_type] = lerpColor(pal_a[c_type], pal_b[c_type] ,color_trans[2]);
	}

	palette[0].accent = [palette[0].accent1,
		palette[0].accent2,
		palette[0].accent3];

	//this.backalpha = lerpColor(pal_a.back,pal_b.back,color_trans[2]);
	//this.backalpha.setAlpha(5);

	palette[0].medium = lerpColor(palette[0].back,palette[0].accent1,0.5);

	if (color_trans[2] >= 1){
		color_trans[2] = -1;
		color_trans[0] = color_trans[1];
		update_icons(0,icons.length);
	}

}


function core_color_custom(plt){
		// plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),200);
		// plt.dark = color(int(red(plt.back)*0.75),int(green(plt.back)*0.75),int(blue(plt.back)*0.75));
		// plt.medium = lerpColor(plt.back,plt.front,0.3);
		plt.accent1 = plt.mono;
		plt.accent2 = plt.bright;
		plt.accent3 = plt.red;
	
		if (plt.scheme == 'Sunset'){

			for(var suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(plt.red,plt.mono,3*suns/sunlen));
			}
			for(suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(plt.mono,plt.bright,3*suns/sunlen));
			}
			for(suns = 0; suns < sunlen/3; suns++){
				sunset.push(lerpColor(plt.bright,plt.red,3*suns/sunlen));
			}
		}
}


function update_icons(u_start,u_end){
	
	var flat_link = make_solid(palette[0].accent2);
	var flat_prev = make_solid(palette[0].accent3);
	
	for (let icn = u_start; icn < u_end; icn++){
		
		if (icons[icn].anchor != ''){
			icons[icn].img.copy(flat_link,0,0,1,1,0,0,200,200);
		} else {
			icons[icn].img.copy(flat_prev,0,0,1,1,0,0,200,200);
		}
		icons[icn].img.mask(icons[icn].base_img);		
	}
}

function make_solid(solid_color){
	let solid = createImage(1,1);
	solid.loadPixels();
	solid.pixels[0] = red(solid_color);
	solid.pixels[1] = green(solid_color);
	solid.pixels[2] = blue(solid_color);
	solid.pixels[3] = 255;
	solid.updatePixels();
	return solid;
}

var icon_ang, icon_rad;
function rotate_icons(){
	
	let i_ang = icon_ang;
	for (let ic = 0; ic < pages.length; ic++){
		
		if (ic >= icons.length){return;}
		let my_rad = icon_rad + sin(i_ang*((pages.length+1)**2))*px/8;
		icons[ic].pos = createVector(my_rad*cos(i_ang), my_rad*sin(i_ang));
		icons[ic].ang = i_ang;
		i_ang -= TWO_PI/pages.length;
	}
	
}

var title_mult;
function to_preview(preview_index){
	page_mode = 'to_preview';
	
	offset_angle = -PI/2;
	pg = preview_index;
	color_trans[1] = pages[pg].color_index;
	color_trans[2] = 0;
	let big_dist = max(width, height)*1.5;
	
	let logo_ang = mod(icons[pg].ang,TWO_PI);
	if (corner_ang < logo_ang && PI - corner_ang > logo_ang){
		let end_y = -height/2 + 1.4*px;
		logo_os.end = createVector(end_y/tan(logo_ang),end_y);
		
	} else if (PI - corner_ang < logo_ang && PI + corner_ang > logo_ang) {
		let end_x = width/2 - 1.4*px;
		logo_os.end = createVector(end_x,tan(logo_ang)*end_x);
		
	} else if (PI + corner_ang < logo_ang && TWO_PI - corner_ang > logo_ang){
		let end_y = height/2 - 1.4*px;
		logo_os.end = createVector(end_y/tan(logo_ang),end_y);
		
	} else {
		let end_x = -width/2 + 1.4*px;
		logo_os.end = createVector(end_x,tan(logo_ang)*end_x);
		
	}
	
	if (logo_ang < PI){
		title_mult = 1;
	} else {
		title_mult = -1;
	}
	
	logo_os.start = createVector(logo_os.pos.x,logo_os.pos.y);
	home_os.start = createVector(home_os.pos.x,home_os.pos.y);
	home_os.end = createVector(-cos(logo_ang)*big_dist,-sin(logo_ang)*big_dist);
	preview_os.start = createVector(cos(logo_ang)*big_dist,sin(logo_ang)*big_dist);
	preview_os.end = createVector(0,0);
	prep_preview();
}

function from_preview(){
	page_mode = 'from_preview';
	offset_angle = -PI/2;
	
	logo_os.start = createVector(logo_os.end.x,logo_os.end.y);
	logo_os.end = createVector(-px,-px);
	
	home_os.start = createVector(home_os.end.x,home_os.end.y);
	home_os.end = createVector(0,0);
	
	preview_os.end = createVector(preview_os.start.x,preview_os.start.y);
	preview_os.start = createVector(0,0);
	
}


function n_gon(center,radius,start,step){

	beginShape();
	for (var step_count = 0; step_count < step; step_count++){
		vertex(center.x+radius*cos(TWO_PI*(start+step_count/step)),center.y-radius*sin(TWO_PI*(start+step_count/step)));
		//vertex(center[0]+radius*cos(TWO_PI*(start+0.001+step_count/step)),center[1]-radius*sin(TWO_PI*(start+0.001+step_count/step)));
	}
	endShape(CLOSE);
}



function mod(mod_a,mod_m){
	while(mod_a < 0){
		mod_a += mod_m;
	}
	return (mod_a % mod_m);
}


var primes = [2,3];
function add_prime(){
	
	var test_value = primes[primes.length - 1] + 1;
	while (true){
		var is_prime = true;
		for (var p_check of primes){
			if(test_value % p_check == 0){
				is_prime = false;
				break;
			}
		}
		
		if(is_prime){
			primes.push(test_value)
			break;
		}
		test_value++;
	}
		
}

var primeswf = [[2,[]]];
function add_prime_wf(){
	
	var test_value = primeswf[primeswf.length - 1][0];
	while (true){
		var is_prime = true;
		for (var p_check of primeswf){
			if(test_value % p_check[0] == 0){
				is_prime = false;
				break;
			}
		}
		
		if(is_prime){
			var p_fact = prime_factorization(test_value-1);
			primeswf.push([test_value,p_fact])
			break;
		}
		test_value++;
	}
		
}


function prime_factorization(num_to_factor){
	
	var p = 0;
	var factorization = [];
	while(num_to_factor != 1){
		//console.log(primeswf,factorization);
		if(p == primeswf.length){
			add_prime_wf();
		}
		while(num_to_factor % primeswf[p][0] == 0){
			if(factorization.length == 0 || factorization[factorization.length - 1][0] != primeswf[p][0]){
				factorization.push([primeswf[p][0],1]);
			}else{
				factorization[factorization.length - 1][1]++;
			}
			num_to_factor = int(num_to_factor/primeswf[p][0]);
		}
		
		p++;
	}
	
	return(factorization);
}

function text_limited(text_value,x,y,text_size,max_size){
	
	textSize(text_size);
	let tw = textWidth(text_value);
	if (tw > max_size){
		textSize(text_size*max_size/tw);
	}
	
	text(text_value,x,y);
}
