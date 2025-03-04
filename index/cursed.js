
class CursedShape {
	constructor(vertices,step,rotation = 0, radius_theta = 0, type = 0) {
	
		this.vertices = vertices;
		this.step = step;
		this.radius_theta = radius_theta;
		this.radius = 2**(sin(radius_theta)*2);
		this.mags = [];
		this.isvertex = [];
		
		var p, increment;
		var phi = 0;
		
		if (vertices == 0){
			for (p = 0; p < cursed_resolution; p++){
				this.mags.push(1);
				this.isvertex.push(false);
			}
			
		} else if (vertices == -2){
			
			phi = 0.2;
			increment = 0.8/cursed_resolution;
			for (p = 0; p < cursed_resolution; p++){
				this.isvertex.push(false);
				this.mags.push(phi);
				phi += increment;
			}
			
		} else {
		
			var theta = TWO_PI*abs(step)/vertices;
			var m = sin(theta)/(1 - cos(theta));
			
			if (type == 3){
				increment = TWO_PI*vertices/cursed_resolution;
				for (p = 0; p < cursed_resolution; p++){
					this.mags.push(cos(phi)*0.15+0.85);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % TWO_PI;
				} 
				
			} else if (type == 1){
				increment = 2*vertices/cursed_resolution;
				for (p = 0; p < cursed_resolution; p++){
					this.mags.push(abs(1-phi)*0.6+0.4);
					this.isvertex.push(phi < increment);
					phi = (phi+increment) % 2;
				} 
				
			} else {
				increment = TWO_PI*abs(step)/cursed_resolution;
				for (p = 0; p < cursed_resolution; p++){
					this.mags.push(abs(m/(sin(phi) + cos(phi)*m)));
					this.isvertex.push(phi < increment);

					phi += increment;
					if (phi >= theta){
						phi -= theta;
					}
				}
				
				if (type == 2){
					phi = 0;
					increment = TWO_PI*vertices*3/cursed_resolution;
					for (p = 0; p < cursed_resolution; p++){
						this.mags[p] *= cos(phi)*0.1+0.9;
						phi += increment;
					}
				}
			} 
		}
	}
	
}

var out_cursed, vert_cursed, rotation_angle, max_mag, curse_tick, cursed_rot;
function cursedDraw(){
	
	if (ticker < page_time/2 && curse_tick < cursed_resolution){
			curse_tick = min(int(curse_tick + cursed_resolution/32),cursed_resolution);
	} else if (ticker + ticker_add*50 > page_time && curse_tick > 0){
			curse_tick = max(int(curse_tick - cursed_resolution/32),0);
	}
	
	cursed_rot[3] += 1;
	for (var fi = 0; fi < 3; fi++){
		if (cursed_favorites[fav][2+4*fi] == 1){
			var rot_speed = [1,0.75,1.5];
			while (cursed_rot[3] > cursed_rot[fi]){
				cursed_rot[fi] += rot_speed[fi];
				shapes[fi].mags.push(shapes[fi].mags[0]);
				shapes[fi].mags.splice(0,1);
				shapes[fi].isvertex.push(shapes[fi].isvertex[0]);
				shapes[fi].isvertex.splice(0,1);
			}
		} else if (cursed_favorites[fav][2+4*fi] == 2){
			shapes[fi].radius_theta += rotation_angle[fi]*2;
			shapes[fi].radius = 2**(sin(shapes[fi].radius_theta)*2);
		}
	}
	
  noStroke();
	cursed_quadratic();
	var out, o;
	var circle_rad = unit*0.02;
	fill(palette[0].front);
	for (out of out_cursed){
		for (o = 0; o < curse_tick; o++){
			if (show_vertices == false || vert_cursed[o] == -1){
				circle(origin.x+out[o][0]*scalar,origin.y-out[o][1]*scalar,circle_rad);
			}
		}
	}
	
  translate(0,0,5);
	circle_rad = unit*0.07;
	if (show_vertices){
		for (var sidx = 2; sidx > -1; sidx--){
			for (out of out_cursed){
				for (o = 0; o < curse_tick; o++){
					if (vert_cursed[o] == sidx){
						fill(palette[0].accent[sidx]);
						circle(origin.x+out[o][0]*scalar,origin.y-out[o][1]*scalar,circle_rad);
					}
				}
			}
		}
	}
  translate(0,0,-5);
	
}



function cursed_quadratic(){
	
	var new_max_mag = 0;
	out_cursed = [[],[]];
	vert_cursed = [];
	var inc_b2 = shapes[1].step*2*TWO_PI/cursed_resolution;
	var inc_b = shapes[1].step*TWO_PI/cursed_resolution;
	var inc_ac = (shapes[0].step+shapes[2].step)*TWO_PI/cursed_resolution;
	var inc_a = shapes[0].step*TWO_PI/cursed_resolution;
	var rad02 = shapes[0].radius*shapes[2].radius;
	var rad11 = shapes[1].radius**2;
	var q = [0,0,0];

	for (var p = 0; p < cursed_resolution; p++){
		
		
		var vertex_index = -1;
		for (var qindex = 0; qindex < 3; qindex++){
			q[qindex] = (q[qindex] + 1) % cursed_resolution;
			if (shapes[qindex].isvertex[q[qindex]] && vertex_index == -1){
				vertex_index = qindex;
			}
		}
		vert_cursed.push(vertex_index);
		
		var b2 = [rad11*(shapes[1].mags[q[1]]**2)*cos(p*inc_b2),rad11*(shapes[1].mags[q[1]]**2)*sin(p*inc_b2)];
		var ac = [rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*cos(p*inc_ac),rad02*shapes[0].mags[q[0]]*shapes[2].mags[q[2]]*sin(p*inc_ac)];
		
		var disc = [b2[0]-4*ac[0],b2[1]-4*ac[1]];
		
		var mag = (disc[0]**2+disc[1]**2)**0.25;
		var arg = atan2(disc[1],disc[0])/2;
		
		var a_inv2 = [cos(p*inc_a)/(2*shapes[0].mags[q[0]]*shapes[0].radius),-sin(p*inc_a)/(2*shapes[0].mags[q[0]]*shapes[0].radius)];
		for (var out = 0; out < 2; out++){
			var numer = [mag*cos(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*cos(p*inc_b),mag*sin(arg+out*PI)-shapes[1].mags[q[1]]*shapes[1].radius*sin(p*inc_b)];
			var result = [numer[0]*a_inv2[0]-numer[1]*a_inv2[1],numer[0]*a_inv2[1]+numer[1]*a_inv2[0]];
			out_cursed[out].push(result);
	
			var this_mag = pow(result[0],2)+pow(result[1],2);
			if (this_mag > new_max_mag){
					new_max_mag = this_mag;
			}

		}
		
	}
	
    new_max_mag = (new_max_mag**0.5);
    if (max_mag != undefined){
        scalar = scalar*max_mag/new_max_mag;
    } else {
        scalar = scalar/new_max_mag;
    }
    max_mag = new_max_mag;
	
}

var cursed_favorites;
function cursedPrep(){
    
	cursed_rot = [0,0,0,0];
    rotation_angle = [TWO_PI/480,TWO_PI/420,TWO_PI/360];
    cursed_favorites = [
        [4,1,1,0,0,-1,0,0,8,-3,2,1,true],
        [6,-1,0,0,11,-4,1,0,0,3,0,0,true],
        [6,1,1,2,13,5,0,3,0,2,2,0,false],
        [5,-1,1,2,10,1,0,1,5,-2,2,3,true],
        [5,2,1,1,0,-1,0,0,5,1,0,1,true],
        [13,-1,2,3,12,-5,1,1,3,1,1,1,true]
    ];
    
    var new_fav = int(random(cursed_favorites.length));
    while (new_fav == fav){
        new_fav = int(random(cursed_favorites.length));
    }

    fav = new_fav;
    shapes = [];
    for (var shp = 0; shp < 12; shp += 4){
        shapes.push(new CursedShape(cursed_favorites[fav][0+shp],cursed_favorites[fav][1+shp],0,0,cursed_favorites[fav][3+shp]));
    }
    show_vertices = cursed_favorites[fav][12];
    curse_tick = 0;
    
}

var origin, scalar, unit;
var show_vertices = false;
var cursed_resolution = 512;
var fav = -1;

