
function show_table(){
	inner_outer('table');
	let box_colors = get_box_colors();
	let box_size = 2; //
	
	strokeWeight(box_size*0.05);
	noStroke();
	fill(palette.front);

	let ts = box_size*0.5;
	let tmax = box_size*0.8;
	/*
	textSize(ts);
	for (let e of G){
		let tw = textWidth(e.display_name);
		if (tw > tmax){
			textSize(ts*tmax/tw);
		}
	}*/
	
	
	let box_base = (-0.25-G_order/2)*box_size;
	
	for (let x = 0; x < G_order; x++){
		
		let box_x = (x-(G_order-1.5)/2)*box_size;
		noStroke();
		fill(box_colors[x][G_order][0]);
		text_limited(G[x].display_name ,box_x,box_base-box_size*0.1, ts, tmax);
		fill(box_colors[G_order][x][0]);
		text_limited(G[x].display_name ,box_base,box_x-box_size*0.1, ts, tmax);
		
		
		for (let y = 0; y < G_order; y++){
		
			let box_y = (y-(G_order-1.5)/2)*box_size;
			
			//stroke(palette.medium);
			noStroke();
			fill(box_colors[x][y][0]);
			rect(box_x,box_y,box_size*0.9,box_size*0.9,box_size*0.05);
			
			noStroke();
			fill(box_colors[x][y][1]);
			text_limited(G[G[y].arrow_tables[0][x]].display_name ,box_x,box_y-box_size*0.05, ts, tmax);
		}	
	}
	
}

var box_adjust = 0;
function get_box_colors(){
	
	if (movement){
		box_adjust += 0.003;
	}
	
	let box_colors = [];
	
	for (let x = 0; x < G_order + 1; x++){
		let new_row = [];
		if (G_order == x){
			for (let y = 0; y < G_order; y++){
				new_row.push([palette.front]);
			}	
			
		} else {
			
			for (let y = 0; y < G_order; y++){
				
				let sqel = G[G[y].arrow_tables[0][x]];
				let square_color;
				
				if (!auto_color_table){
					
					let lerper = 0.1 + (0.9*G[y].arrow_tables[0][x]/G_order+box_adjust)%0.9;
					square_color = lerpColor(palette.back, palette.front, lerper);
			
				} else {
	
					let lerper_in = 0.1 + 0.9*sqel.inner/inner_ring.length;
					let lerper_out = 0.1 + 0.9*sqel.outer/outer_ring.length;
				
					if (sqel.outer == 1 || outer_ring.length > 4){
						square_color = lerpColor(palette.back, palette.front, lerper_in);
					} else {
						square_color = lerpColor(palette.back, palette.accent[sqel.outer-2], lerper_in);
					}

					
				}
				
				if (brightness(square_color)*palette.rev > 50*palette.rev){
					new_row.push([square_color,palette.back]);
				} else {
					new_row.push([square_color,palette.front]);
				}
				
			}	
			
		}
		new_row.push([palette.front]);
		box_colors.push(new_row.slice());
	}
	
	if (auto_color_table){
		return box_colors;
	}
	
	
	for (let a = arrow_elements.length -1; a > -1; a--){
		if (arrow_elements[a] == -1){continue;}
		
		if (arrow_types[a] == 1){
			for (let y = 0; y < G_order+1; y++){
				box_colors[arrow_elements[a]][y] = [palette.accent[a],palette.back];
			}	
		} else if (arrow_types[a] == 0){
			for (let x = 0; x < G_order+1; x++){
				box_colors[x][arrow_elements[a]] = [palette.accent[a],palette.back];
			}	
		} else if (arrow_types[a] == 2){
			for (let x = 0; x < G_order; x++){
				for (let y = 0; y < G_order; y++){
					if (G[y].arrow_tables[0][x] == arrow_elements[a]){
						box_colors[x][y] = [palette.accent[a],palette.back];
					}
				}	
			}	
			
			box_colors[G_order][arrow_elements[a]] = [palette.accent[a]];
			box_colors[arrow_elements[a]][G_order] = [palette.accent[a]];
			
		}
		
	}
	
	return box_colors;
}

var auto_color_table = false;
