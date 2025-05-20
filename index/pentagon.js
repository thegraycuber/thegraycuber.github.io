
function makePentagon(verts){
	main_list = makePoints(verts);
}



function makePoints(vertices = 5,steps = 1,volume = 240){
	
	var subvol = round(volume/vertices);
	var point_list = [[[1,0],[1,0]]];
	
	for (var vert = 1; vert <= vertices; vert++){
		var next = [cos(2*PI*vert*steps/vertices),sin(2*PI*vert*steps/vertices)];
		var iter = [(-point_list[point_list.length-1][0][0] + next[0])/subvol,(-point_list[point_list.length-1][0][1] + next[1])/subvol];
		
		for (var subpoint = 0; subpoint < subvol; subpoint++){
			point_list.push([[point_list[point_list.length-1][0][0]+iter[0],point_list[point_list.length-1][0][1]+iter[1]],[1,0]]);
			for (expon = 0; expon < vertices-1; expon++){
				point_list[point_list.length-1][1] = mult(point_list[point_list.length-1][0],point_list[point_list.length-1][1]);
			}
		}
	}
	
	return point_list;
}

function mult(alpha,beta){
	return([alpha[0]*beta[0] - alpha[1]*beta[1], alpha[0]*beta[1] + alpha[1]*beta[0]]);
}

function grapherDraw(){
	
	/*
		if (ticker > page_trans && ticker < page_trans*3+ticker_add){
			comp_range[1] = min(0.5*main_list.length*(ticker - page_trans)/page_trans,main_list.length);
		} else if (ticker > page_time - page_trans*3 && ticker < page_time - page_trans+ticker_add){
			comp_range[0] = min(int(0.5*main_list.length*(ticker - page_time + page_trans*3)/page_trans),main_list.length);
		}
*/

		rot -= 0.01;

		pent_rad = min(px * 5,width*0.4);
		noFill();
		strokeWeight(px * 0.2);
		stroke(palette[0].accent1);
	
		rotate(rot);
		beginShape();
		for (let cpoint of main_list) {
			vertex(cpoint[0][0] * pent_rad, -cpoint[0][1] * pent_rad);
		}
		endShape();
		stroke(palette[0].accent2);
		rotate(rot * (page_rand - 2));
		beginShape();
		for (let cpoint of main_list) {
			vertex(cpoint[1][0] * pent_rad, -cpoint[1][1] * pent_rad);
		}
		endShape();
}