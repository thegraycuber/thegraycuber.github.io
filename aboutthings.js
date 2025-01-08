class Point {
	constructor(x, y, px) {
		this.pos = createVector(x,y);
		this.size = px*4;
		this.color_noise = createVector(x/(px*60),y/(px*60));
		this.color_bucket = 0;
		this.get_color_bucket();
		if(random() < 0.25){
			this.display();
			
		}
	}
	
	display(){
		this.get_color_bucket();
		fill(palette[0].back[this.color_bucket]);
		circle(this.pos.x,this.pos.y,(random()**2+0.2)*this.size);
	}
	
	get_color_bucket(){
		var color_val = noise(this.color_noise.x+color_v.x,this.color_noise.y+color_v.y)*12;
		color_val += color_move;
		color_val = sin(color_val)*0.5;
		for (var b = 0; b < bucket_min.length;b++){
			if(bucket_min[b]<=color_val){
				 this.color_bucket = b;
			}
		}
	}
	
}



class Icon{
	constructor(coords,px,index,size) {
		this.img = createImage(533,533);
		this.coords = createVector(px*coords[0],px*coords[1]);
		this.size = size;
		this.mouseMin = createVector(this.coords.x-this.size*0.8,this.coords.y-this.size*0.8);
		this.mouseMax = createVector(this.coords.x+this.size*0.8,this.coords.y+this.size*0.8);
		this.mult = 1;
		this.index = index;
	}
	
	display(){
		if (this.index == 9){
			fill(palette[0].back[2]);
			circle(this.coords.x,this.coords.y,this.size*1.2*this.mult);
			strokeWeight(this.size/20);
			fill(palette[0].grayalpha);
			stroke(palette[0].gray);
			n_gon([this.coords.x,this.coords.y],this.size*0.6*this.mult,0.25,5);	
			fill(palette[0].accent3alpha);
			stroke(palette[0].accent3);
			n_gon([this.coords.x,this.coords.y],this.size*0.6*this.mult,0.15,3);	
			n_gon([this.coords.x,this.coords.y],this.size*0.6*this.mult,0.35,3);	
			
		} else {
			stroke(palette[0].back[2]);
			image(this.img,this.coords.x,this.coords.y,this.size*this.mult,this.size*this.mult);
		}
	}
	
	check(clicked = false){
		if(mouseX - windowWidth/2 > this.mouseMin.x && mouseX - windowWidth/2 < this.mouseMax.x && mouseY - windowHeight/2 > this.mouseMin.y && mouseY - windowHeight/2  < this.mouseMax.y){
			if(clicked){
				return true;
			} 
			
			if (this.mult==1){
				this.mult = 1.2;
				
				if (this.index < 7 && curr_color != this.index){// && adjust_counter == -1
					new_color = this.index;
					adjust_counter = 0;
					adjust_wait = true;
					for (var t = 0; t < infoText[0].length; t++){
						info_rand[t] = [];
						for (var char = 0; char < 40; char++){
							info_rand[t].push(random()*PI);
						}
					}
					
				}
				fill(palette[0].back[2]);
				circle(this.coords.x,this.coords.y,this.size*1.5);
				
			}
			
		} else if (this.mult > 1) {
			this.mult = 1;
			fill(palette[0].back[2]);
			circle(this.coords.x,this.coords.y,this.size*1.5);
		}
		return false;
	}
	
}

function n_gon(center,radius,start,step){
	
	beginShape();
	for (var step_count = 0; step_count < step; step_count++){
		vertex(center[0]+radius*cos(TWO_PI*(start+step_count/step)),center[1]-radius*sin(TWO_PI*(start+step_count/step)));
	}
	endShape(CLOSE);
}
