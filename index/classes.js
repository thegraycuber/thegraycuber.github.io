
class Icon{
	constructor(pos,size,img_path,link,anchor = '') {
		this.pos = createVector(pos[0],pos[1]);
		this.size = size;
		this.hover = 1;
		this.anchor = anchor;
		this.link = link;
		this.img = createImage(200,200);
		this.base_img = img_path;
		this.inactive = true;
	}
	
	display(){
		if (this.inactive){return;}
		image(this.img,this.pos.x,this.pos.y,this.size*this.hover,this.size*this.hover);
	}
	
	make_button(){
		if (this.anchor.length > 0){
			this.button = createElement('a');
			this.button.attribute("href",this.link);
			this.button.attribute("target",this.anchor);
			this.update_button();
		}
	}
	
	update_button(){
		if (this.anchor.length == 0){return;}
		this.button.style("background-color", "#00000000");
		this.button.size(this.size, this.size);
		this.button.position(width/2+this.pos.x+home_os.pos.x-this.size/2,height/2+this.pos.y+home_os.pos.y-this.size/2);
	}
	
	check(clicked = false){
		let mouseHome = createVector(mouseX-width/2-home_os.pos.x,mouseY-height/2-home_os.pos.y);
		if(mouseHome.dist(this.pos) < this.size*0.6){
			if(clicked){
				return true;
			} 
			this.hover = 1.2;
			
		} else {this.hover = 1;}
		return false;
	}
	
}


//##################################################################################################
var logo_hover = 1;
class LogoItem{
	constructor(name,pos,size,start,stop){
		this.name = name;
		this.pos = createVector(pos[0],pos[1]);
		this.size = size;
		this.start = start;
		this.stop = stop;
	}
	
	display(){
		if (ticker < this.start && page_mode == 'intro'){return;}
		let logo_size = this.size;
		strokeWeight(this.size*0.1);
		if (ticker < this.stop && page_mode == 'intro'){
			logo_size *= 0.6 * (sin(map(ticker,this.start,this.stop,-PI/2,2.411))+1);
		}
		
		if (this.name == 'tri1'){
			logo_size *= logo_hover;
			stroke(palette[0].accent1);
			n_gon(this.pos,logo_size,0.15,3);
		} else if (this.name == 'tri2'){
			logo_size *= logo_hover;
			stroke(palette[0].accent1);
			n_gon(this.pos,logo_size,0.35,3);
		} else if (this.name == 'pent'){
			logo_size *= logo_hover;
			stroke(palette[0].gray);
			n_gon(this.pos,logo_size,0.25,5);
		} else if (this.name == 'pentb'){
			translate(0,0,-1);
			logo_size *= logo_hover;
			fill(palette[0].back);
			stroke(palette[0].back);
			n_gon(this.pos,logo_size,0.25,5);
			noFill();
			translate(0,0,1);
		} else {
			
			textSize(logo_size);
			if (this.name == 'Gray'){fill(palette[0].gray);}
			else {fill(palette[0].accent1);}
			
			text(this.name,this.pos.x,this.pos.y);
		}
	}
	
	check(clicked = false){
		let mouseLogo = createVector(mouseX-width/2-logo_os.pos.x,mouseY-height/2-logo_os.pos.y)
		if(mouseLogo.dist(this.pos) < this.size*1.4 && page_mode != 'intro'){
			if(clicked){
				return true;
			} 
			logo_hover = 1.1;
			
		} else {logo_hover = 1;}
		return false;
	}
}


//##################################################################################################
var offset_angle = 0;
class Offset{
	constructor(pos){
		this.pos = pos;
		this.start = pos.copy();
		this.end = pos.copy();
	}
	
	update(lerpy){
		this.pos = createVector(lerp(this.start.x,this.end.x,lerpy), lerp(this.start.y,this.end.y,lerpy));
	}
}


//##################################################################################################
class Page {
	constructor(title,scheme,link) {
		this.title = title;
		this.scheme = scheme;
		this.color_index = color_list.indexOf(scheme);
		this.link = link;
		this.full_title = title;
		
		while (this.full_title.length < 30){
			if (this.full_title.length % 2 == 0){
				this.full_title += ' ';
			} else {
				this.full_title = ' ' + this.full_title;
			}
		}
	}
}


//##################################################################################################
class Asteroid{
	constructor(rad,ang,size,color){
		this.rad = rad;
		this.ang = ang;
		this.noise_r = random(200);
		this.noise_ang = random(2000,2200);
		this.size = size;
		this.color = color;
	}
	
	display(){
		if (this.color == 0){fill(palette[0].front);}
		else if (this.color == 1){fill(palette[0].accent1);}
		else if (this.color == 2){fill(palette[0].accent2);}
		else if (this.color == 3){fill(palette[0].accent3);}
		
		this.noise_ang += 0.004;
		this.noise_r += 0.002;
		let ast_ang = icon_ang + this.ang + (noise(this.noise_ang)-0.5)*0.4;
		let ast_rad = this.rad*(noise(this.noise_r)*0.4+0.8);
		circle(cos(ast_ang)*ast_rad,sin(ast_ang)*ast_rad,this.size);
		
	}
}