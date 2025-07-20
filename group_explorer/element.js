
var element_size = 1;
var element_text_size = 0.6;

class element{
	constructor (name){
		this.index = G.length;
		this.name = name;
		this.inverse = '';
		this.arrow_tables = [[],[],[]];
		this.arrowed = -1;
		this.pos = createVector(random(-width*0.4,width*0.4),random(-height*0.4,height*0.4)).div(scalar);
		this.size = min(width,height)*0.1;
		
		this.inner = this.index;
		this.outer = 0;
		
		this.display_name = '';
		let accum = 0;
		for (let l = 0; l < this.name.length; l++){
			accum += 1;
			if (l + 1 == this.name.length || this.name.substring(l,l+1) != this.name.substring(l+1,l+2)){
				this.display_name += this.name.substring(l,l+1) + exp_from_val(accum);
				accum = 0;
			}
		}
		this.nickname = this.display_name;
		
		
		this.acc = createVector(0,0);
		this.vel = createVector(0,0);
		//this.rep = rep;
	}
	
	giveColor(){
		
		if (this.index == 0){
			this.fill_color = palette.back;
			this.stroke_color = palette.front;
			this.text_color = palette.front;
		} else if (arrow_elements.includes(this.index)){
			this.fill_color = palette.accent[arrow_elements.indexOf(this.index)];
			this.stroke_color = palette.accent[arrow_elements.indexOf(this.index)];
			this.text_color = palette.back;
		} else {
			this.fill_color = palette.front;
			this.stroke_color = palette.front;
			this.text_color = palette.back;
		}
		
	}
	
	update(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		//this.pos.mult(adjust);
		
		this.acc = createVector(0,0);
		this.vel.mult(0.98);
		
	}
	
	display(){
		this.giveColor();
		
		textFont(safeFont);
		fill(this.fill_color);
		stroke(this.stroke_color);
		circle(this.pos.x,this.pos.y,2);
		fill(this.text_color);
		noStroke();
		text_limited(this.display_name,this.pos.x,this.pos.y-0.1,0.9,1.75);
		textFont(mainFont);
	}
	
	arrows(a){
		for (var m = 0; m < this.arrow_tables[a].length; m++){
			var source_el = G[m].pos.copy();
			var dest_el = G[this.arrow_tables[a][m]].pos;
			var diff = dest_el.copy().sub(source_el);
			var diff_mag = diff.mag();
			if (diff_mag < 2.2){
				continue;
			}
			diff.mult(1.3/diff_mag);
			line(source_el.x+diff.x,source_el.y+diff.y,dest_el.x-diff.x,dest_el.y-diff.y);
			
			var arrow_ang = atan2(diff.y,diff.x);
			arc(dest_el.x - 1.6*cos(arrow_ang),dest_el.y - 1.6*sin(arrow_ang),0.6,0.6,arrow_ang-1.2,arrow_ang+1.2);
	
		}
	}
	
	isWithin(mouseVec){
		return this.pos.dist(mouseVec) < 1;
	}
	
	clicked(mouseVec){
		if (this.isWithin(mouseVec) == false){
			return false;
		}
		
		active_element = this.index;
		dragging = 'element';
	
	}
	
	processOperate(){
		
		for (let factor = 0; factor < this.index; factor++){
			
			let left_index = word_to_index( reduce(this.name+G[factor].name) );
			this.arrow_tables[0].push(left_index);
			G[factor].arrow_tables[1].push(left_index);
			
			let right_index = word_to_index( reduce(G[factor].name+this.name) );
			this.arrow_tables[1].push(right_index);
			G[factor].arrow_tables[0].push(right_index);
			
			if (left_index == 0){
				this.inverse = G[factor].name;
				G[factor].inverse = this.name;
				//console.log(this.index, factor);
			}
		}
		
		let el_squared = word_to_index( reduce(this.name+this.name) );
		this.arrow_tables[0].push(el_squared);
		this.arrow_tables[1].push(el_squared);
		if (el_squared == 0){
			this.inverse = this.name;
		}
	}
	
	processConjugate(){
		
		for (let factor = 0; factor < this.index; factor++){
			
			this.arrow_tables[2].push(word_to_index( reduce(this.name+G[factor].name+this.inverse) ));
			G[factor].arrow_tables[2].push(word_to_index( reduce(G[factor].name+this.name+G[factor].inverse) ));
		}
		
		this.arrow_tables[2].push(this.index);
		
	}
	
}


