
let random_group = -1;

function explorerPrep(){
	
	
	random_group = (random_group + 1 + int(random(explorer_groups.length-1)) )% explorer_groups.length;
	//random_group = explorer_groups.length - 1;
	main_list = [];
	
	el_size = unit/explorer_groups[random_group].length;
		
	for (let g of explorer_groups[random_group]){
		main_list.push(new GroupElement(...g));
	}
	
	el_radius = (inner_angle*0.6+3/inner_angle)*el_size;
	
	inner_angle = TWO_PI/inner_angle;
	outer_angle = TWO_PI/explorer_groups[random_group].length;
	
	
}


function explorerDraw(){
	
	in_theta += 0.0061;
	out_theta += 0.0103;
	
	for (let el of main_list){
		el.update();
	}
	strokeWeight(0.2*el_size);
	for (let el of main_list){
		el.draw_arrows();
	}
	strokeWeight(0.4*el_size);
	for (let el of main_list){
		el.display();
	}
	
}



var el_size, el_radius;
var in_theta = 0;
var inner_angle = 0;
var out_theta = 0;
var outer_angle = 0;

class GroupElement{
	constructor (display_name, inner, outer, color, arrow1, arrow2){
		
		this.display_name = display_name;
		this.inner = inner;
		this.outer = outer;
		this.color = color;
		this.arrows = [arrow1,arrow2];
		
		inner_angle = max(inner_angle,inner+1);
	}
	
	update(){
		this.giveColors();
		
		let pos_ang =  in_theta + this.inner*inner_angle + this.outer*(outer_angle+out_theta) - PI/2;
		this.pos = createVector(el_radius*(this.outer+1)*cos(pos_ang),el_radius*(this.outer+1)*sin(pos_ang));
	}
	
	giveColors(){
		this.fill_color = palette[0][this.color];
		if (this.color == 'back'){
			this.stroke_color = palette[0].front;
			this.text_color = palette[0].front;
		} else {
			this.stroke_color = palette[0][this.color];
			this.text_color = palette[0].back;
		}
	}
	
	display(){

		fill(this.fill_color);
		stroke(this.stroke_color);
		strokeWeight(el_size*0.2);
		circle(this.pos.x,this.pos.y,el_size*2);
		
		fill(this.text_color);
		noStroke();
		text_limited(this.display_name,this.pos.x,this.pos.y,el_size*1.1,1.75*el_size);
	}
	
	draw_arrows(){
		for (var m = 0; m < 2; m++){
			
			stroke(palette[0].accent[m*2]);
			noFill();
			
			var source_el = this.pos.copy();
			var dest_el = main_list[this.arrows[m]].pos;
			var diff = dest_el.copy().sub(source_el);
			var diff_mag = diff.mag();
			if (diff_mag < 1.4*el_size){
				continue;
			}
			diff.mult(el_size*1.4/diff_mag);
			line(source_el.x+diff.x,source_el.y+diff.y,dest_el.x-diff.x,dest_el.y-diff.y);
			
			var arrow_ang = atan2(diff.y,diff.x);
			arc(dest_el.x - 1.7*cos(arrow_ang)*el_size,dest_el.y - 1.7*sin(arrow_ang)*el_size,0.6*el_size,0.6*el_size,arrow_ang-1.2,arrow_ang+1.2);
	
		}
	}
	
	
}



var explorer_groups = [

	[
		//Q8 with i,j
		['1',0,0,'back',1,4],
		['i',1,0,'mono',2,7],
		['-1',2,0,'front',3,6],
		['-i',3,0,'front',0,5],
		['j',0,1,'bright',5,2],
		['k',1,1,'front',6,1],
		['-j',2,1,'front',7,0],
		['-k',3,1,'front',4,3]
	],
	
	[
		//C3xC3 with 01,10
		['00',0,0,'back',1,3],
		['01',1,0,'mono',2,4],
		['02',2,0,'front',0,5],
		['10',0,1,'bright',4,6],
		['11',1,1,'front',5,7],
		['12',2,1,'front',3,8],
		['20',0,2,'front',7,0],
		['21',1,2,'front',8,1],
		['22',2,2,'front',6,2]
	],
	
	[
		//D5 with r,f
		['e',0,0,'back',1,5],
		['r',1,0,'mono',2,9],
		['r²',2,0,'front',3,8],
		['r³',3,0,'front',4,7],
		['r⁴',4,0,'front',0,6],
		['f',0,1,'bright',6,0],
		['r',1,1,'front',7,4],
		['r²f',2,1,'front',8,3],
		['r³f',3,1,'front',9,2],
		['r⁴f',4,1,'front',5,1]
	],
	
	[
		//C11 with 1,4
		['0',0,0,'back',1,4],
		['1',1,0,'mono',2,5],
		['2',2,0,'front',3,6],
		['3',3,0,'front',4,7],
		['4',4,0,'bright',5,8],
		['5',5,0,'front',6,9],
		['6',6,0,'front',7,10],
		['7',7,0,'front',8,0],
		['8',8,0,'front',9,1],
		['9',9,0,'front',10,2],
		['10',10,0,'front',0,3]
	],
	
	[
		//A4 with 1,4
		['e',0,0,'back',1,3],
		['123',1,0,'mono',2,4],
		['132',2,0,'front',0,5],
		['(12)(34)',0,1,'bright',10,0],
		['243',1,1,'front',11,1],
		['143',2,1,'front',9,2],
		['(13)(24)',0,2,'front',4,9],
		['142',1,2,'front',5,10],
		['234',2,2,'front',3,11],
		['(14)(23)',0,3,'front',7,6],
		['134',1,3,'front',8,7],
		['124',2,3,'front',6,8]
	],
	
	[
		//Q12 with 1,4
		['1',0,0,'back',1,6],
		['ζ',1,0,'mono',2,11],
		['ζ²',2,0,'front',3,10],
		['-1',3,0,'front',4,9],
		['-ζ',4,0,'front',5,8],
		['-ζ²',5,0,'front',0,7],
		['j',0,1,'bright',7,3],
		['ζj',5,1,'front',8,2],
		['ζ²j',4,1,'front',9,1],
		['-j',3,1,'front',10,0],
		['-ζj',2,1,'front',11,5],
		['-ζ²j',1,1,'front',6,4]
	],
];


//superscripts = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];


