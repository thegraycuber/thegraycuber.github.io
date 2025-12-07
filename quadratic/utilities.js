

function core_color_custom(plt){
	plt.medium = lerpColor(plt.accent[1],plt.back,0.6);
	plt.backtrans = color(red(plt.back),green(plt.back),blue(plt.back),0);
	plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),1);
	plt.undefined = lerpColor(plt.mono,plt.back,0.85);

	plt.gradient = [];
	let gradient_inputs = ['mono','bright','mono','red','mono'];
	for (let g = 0; g < gradient_inputs.length-1; g++){
		for (let clr = 0; clr < 90; clr++){
			plt.gradient.push(lerpColor(plt[gradient_inputs[g]],plt[gradient_inputs[g+1]],clr/90));
		}
	}
	
	plt.prime_highlight = [];
	plt.multiple_highlight = [];
	for (let theta = 0; theta < 120; theta++){
		let lerpy = cos(theta*TWO_PI/120)*0.5+0.5;
		plt.prime_highlight.push(lerpColor(plt.back,plt.backtrans,lerpy));
		plt.multiple_highlight.push(lerpColor(plt.back,plt.front,lerpy));
	}
	
}


function action(id,index,value){
	
	if (id == 'reset'){	
		info_integer = [];
		set_info();
		origin = default_origin.copy();
		scalar = min(width,height)*0.02;
		reset_D();
		
		
	} else if (id == 'palette'){	
		
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		
	} else if (id == 'grid'){
		grid.visible = !grid.visible;
		
	} else if (id == 'info'){
		helpBox.setActive(!helpBox.Active);
		
	} else if (id == 'highlight_mode'){
		highlight_mode = value;
		set_info();
		
	} else if (id == 'power'){
		modulus_powers = !modulus_powers;
		background(palette.back);
		
	} else if (id == 'ring'){
		
		units = [];
		info_integer = [];
		set_info();
		action('reset');
		D = D_list[index];
		reset_D();
		
		scale_min = max(height*0.5/((prime_limit/abs(D))**0.5),width*0.5/(prime_limit**0.5))
		scale_min = constrain(scale_min,3,min(width,height)*0.01);
		
	} else if (id == 'color_mode'){
		color_mode = index;
		
	} else if (id == 'download'){
		save("Quadratic_Primes_" + now_string() + ".png");
		
	} else if (id == 'random'){

		let ringItem = textBox.getItem('ring');
		let new_ring = ringItem.Index;
		while (new_ring == ringItem.Index){
			new_ring = floor(random()*ringItem.List.length);
		}
		ringItem.giveValue(new_ring);
		
	}
}
var to_download = false;



class Grid{
	constructor(x_min,y_min,x_max,y_max){
		this.grid_min = createVector(x_min,y_min);
		this.grid_max = createVector(x_max,y_max);
		this.wid = createVector(abs(x_max-x_min),abs(y_max-y_min));
		this.mid = createVector(0.5*(x_max+x_min),0.5*(y_max+y_min));
		this.visible = true;
	}
	
	draw_grid(){
		if (!this.visible){
			return
		}
		
		this.min_prin = pixel_to_principal(this.grid_min.copy());
		this.max_prin = pixel_to_principal(this.grid_max.copy());
		let scale_value = min(this.max_prin.x-this.min_prin.x,this.max_prin.y-this.min_prin.y)/8;
		this.scale_log = floor(log(scale_value)/log(10))
		let scale_mag = 10**this.scale_log;
		let scale_adjusted = scale_value/scale_mag;
		if (scale_adjusted > 3.5){
			scale_value = scale_mag*10;
			this.scale_log += 1;
		} else if (scale_adjusted > 2){
			scale_value = scale_mag*5;
		} else {
			scale_value = scale_mag * 2;
		}
		let scale_vec = createVector(scale_value,scale_value*(is_hex?0.866:1));
		this.scale_log = max(0,-this.scale_log);

		onlyStroke(palette.backlight, scalar**0.5);
		
		// let x_value = floor(this.max_prin.x/scale_vec.x)*scale_vec.x;
		let x_value = floor(this.max_prin.x/scale_vec.x*(is_hex?0.5:1))*scale_vec.x;
		let x_line = x_value*scalar+origin.x;
		let y_value = floor(this.max_prin.y/(scale_vec.y)*(is_hex?0.866:1))*scale_vec.y;
		let y_line = -y_value*scalar+origin.y;
		
		let pixels = p5.Vector.mult(scale_vec,scalar);

		let x_extend = 0;
		if (is_hex){
			x_line += modulo((this.wid.y/2 - origin.y)*0.5774,pixels.x)+pixels.x;
			x_extend = -pixels.y*1.1547;
			x_value -= round((this.wid.y/2 - origin.y)*0.5774/pixels.x-1)*scale_vec.x;
		}

		this.labels = [[],[]];

		while (x_line > this.grid_min.x + x_extend){
			this.draw_line(x_line,this.mid.y,0,this.wid.y);
			x_line -= pixels.x;
			this.labels[0].push(x_value);
			x_value -= scale_vec.x;
		}

		while (y_line < this.grid_min.y){
			this.draw_line(this.mid.x,y_line,this.wid.x,0);
			y_line += pixels.y;
			this.labels[1].push(y_value);
			y_value -= scale_vec.y;
		}
		
	}

	draw_line(x_center,y_center,x_wid,y_wid){
		if (is_hex && x_wid == 0){
			line(x_center-y_wid*0.5774,y_center-y_wid,x_center+y_wid*0.5774,y_center+y_wid);
		} else {
			rect(x_center,y_center,x_wid,y_wid);
		}
	}

	draw_labels(){
		if (!this.visible){
			return
		}

		let text_size = 12*(scalar**0.3);
		textSize(text_size);
		stroke(palette.back);
		strokeWeight(text_size*0.2);
		fill(palette.front);

		for (let x_lab of this.labels[0]){
			var x_text = round(x_lab,this.scale_log);
			
			let x_pix = prinicipal_to_pixel(createVector(x_lab*(is_hex?2:1),0));
			let variances = [this.grid_max.y+text_size*1.5 - x_pix.y, this.grid_min.y-text_size*1.5 - x_pix.y];
			
			if (variances[0] <= 0 && variances[1] >= 0){
				text(x_text,x_pix.x,x_pix.y);
			} else if (variances[0] > 0 && is_hex) {
				text(x_text,x_pix.x+variances[0]*0.5/0.866,x_pix.y+variances[0]);	
			} else if (is_hex){
				text(x_text,x_pix.x+variances[1]*0.5/0.866,x_pix.y+variances[1]);	
			} else {
				text(x_text,x_pix.x,x_pix.y + constrain(0,variances[0],variances[1]));
			}
			
		}

		for (let y_lab of this.labels[1]){

			if (y_lab == 0){
				continue;
			}

			let y_text, y_pix;
			if (is_hex){
				y_text = text_2d([0,round(y_lab/0.866,this.scale_log)],vertical_unit);
				y_pix = prinicipal_to_pixel(createVector(-y_lab/0.866,y_lab/0.866));
			} else {
				y_text = text_2d([0,round(y_lab,this.scale_log)],vertical_unit);
				y_pix = prinicipal_to_pixel(createVector(0,y_lab));
			}
			
			y_pix.x = constrain(y_pix.x,this.grid_min.x+textWidth(y_text)*0.5+text_size,this.grid_max.x-textWidth(y_text)*0.5-text_size);
			text(y_text,y_pix.x,y_pix.y);
		}
	}

}
