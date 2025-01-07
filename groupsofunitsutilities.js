 
function pointDist(x1,y1,x2,y2){
	var dist_mag = ((x2-x1)**2 + (y2-y1)**2)**0.5;
	return([(x2-x1)/dist_mag,(y2-y1)/dist_mag,max(dist_mag**2,1)]);
}

function locToCoords(x,y){
	return([width/2+coord_offset[0]+c*x,height/2+coord_offset[1]+c*y]);
}

function coordsToLoc(xc,yc){
	return([(xc-coord_offset[0]-win[0]/2)/c,(yc-coord_offset[1]-win[1]/2)/c]);
}

function updateScale(){
	var maxx = 1;
	var minx = -1;
	var maxy = 1;
	var miny = -1;
	var os = [coord_offset[0]/c,coord_offset[1]/c]
	
	for (var bubber of bubbles){

		if (bubber.x+os[0]+40 > maxx){
			maxx = bubber.x+os[0]+40;
		} else if (bubber.x+os[0]-40 < minx){
			minx = bubber.x+os[0]-40;
		}
		if (bubber.y+os[1]+40 > maxy){
			maxy = bubber.y+os[1]+40;
		} else if (bubber.y+os[1]-40 < miny){
			miny = bubber.y+os[1]-40;
		}
	}
	
	coord_offset[0] += (-maxx-minx)*c/100;
	coord_offset[1] += (-maxy-miny)*c/100;
	coord_scale = coord_scale*0.95+min(width*0.45/max(-minx,maxx),height*0.45/max(-miny,maxy))*0.05;
	coord_adjust = (coord_adjust+0.02)/1.02;
	c = min(coord_adjust*coord_scale,4);
}

function findContainers(new_idx){
	for (var bub = 0; bub < new_idx; bub++){
		if (bub == clicked){bubbles[new_idx].shade = true;}
		var a = new_idx;
		var b = bub;
		if(bubbles[bub].order > bubbles[new_idx].order || (bubbles[bub].order == bubbles[new_idx].order && bubbles[bub].cycles.length > bubbles[new_idx].cycles.length)){
			a = bub;
			b = new_idx;
		} 
		
		if(bubbles[a].order % bubbles[b].order != 0 || bubbles[a].cycles.length < bubbles[b].cycles.length){
			continue;
		}
		
		var is_subgroup = true;
		//console.log(new_idx,bub,a,b);
		for (var bub_cyc = 0; bub_cyc < bubbles[a].cycles.length; bub_cyc++){
			if (bub_cyc == bubbles[b].cycles.length){
				break;
			}
			if (bubbles[a].cycles[bub_cyc] % bubbles[b].cycles[bub_cyc] != 0){
				is_subgroup = false;
			}
		}
		
		if (is_subgroup){
			var ord = int(bubbles[a].order/bubbles[b].order);
			var ord_p = 0;
			while (ord % primes[ord_p][0] != 0 && ord != 1){
				ord_p++;
			}
			var mark = 1;
			if (ord == primes[ord_p][0] || ord == 1){
				mark = 2;
			}
			
			if (bub == clicked){bubbles[new_idx].shade = false;}
			bubbles[a].contains.push([b,(log(bubbles[a].order/bubbles[b].order)+1)**2,ord,mark]);
			bubbles[a].connections++;
			bubbles[b].connections++;
			//console.log(int(bubbles[a].n) + ' contains ' + int(bubbles[b].n));
		}
	}
	
	return false;
}




function add_prime(){
	
	var test_value = primes[primes.length - 1][0];
	while (true){
		var is_prime = true;
		for (var p_check of primes){
			if(test_value % p_check[0] == 0){
				is_prime = false;
				break;
			}
		}
		
		if(is_prime){
			var p_fact = prime_factorization(test_value-1);
			primes.push([test_value,p_fact])
			break;
		}
		test_value++;
	}
		
}


function prime_factorization(num_to_factor){
	
	var p = 0;
	var factorization = [];
	while(num_to_factor != 1){
		//console.log(primes,factorization);
		if(p == primes.length){
			add_prime();
		}
		while(num_to_factor % primes[p][0] == 0){
			if(factorization.length == 0 || factorization[factorization.length - 1][0] != primes[p][0]){
				factorization.push([primes[p][0],1]);
			}else{
				factorization[factorization.length - 1][1]++;
			}
			num_to_factor = int(num_to_factor/primes[p][0]);
		}
		
		p++;
	}
	
	return(factorization);
}


function cleanLines(){
	for (var bubby of bubbles){
		for (var c = 0; c < bubby.contains.length; c++){
			if (bubby.contains[c][3] != 1){
				continue;
			}
			
			for (var c2 = 0; c2 < bubby.contains.length; c2++){
				if (c2 == c || bubby.contains[c][2] % bubby.contains[c2][2] != 0 || bubby.contains[c2][2] >= bubby.contains[c][2]){
					continue;
				}
				
				for (var cont of bubbles[bubby.contains[c2][0]].contains){
					if (bubby.contains[c][0] == cont[0]){
						bubby.contains[c][3] = 0;
						break;
					}
				}
				
				if (bubby.contains[c][3] == 0){
					break;
				}
				
			}
		}
	}
}


function mouseCheck(){
	
	var foundMouse = 0;
	for (var icon of icons){
		if(icon.Active > -1 && mouseX > icon.UpperLeft[0] && mouseX < icon.LowerRight[0] && mouseY > icon.UpperLeft[1] && mouseY < icon.LowerRight[1]){
			foundMouse++;
		}
	}
	foundMouse += menuBox.mouseInside();
	
	if (foundMouse > 0){return true;}
	else{return false;}
}

function addBubble(addx = (random()*0.9+0.05)*win[0],addy = (random()*0.9+0.05)*win[1],doAdj = true){
	addLoc = coordsToLoc(addx,addy);
	bubbles.push(new Bubble(bubbles.length,bubbles[bubbles.length-1].n+1,addLoc[0],addLoc[1],40));
	findContainers(bubbles.length-1);
	bubbles[bubbles.length-1].checkShade();
	bubbles[bubbles.length-1].checkRep();
	cleanLines();
	if (doAdj){bubbles[bubbles.length-1].adjPos(doAdj);}
}

function n_to_subscript(n_to_sub){
	
	var out_string = '';
	while (n_to_sub > 0) {
		out_string = subscript[n_to_sub%10] + out_string;
		n_to_sub = int(n_to_sub / 10);
	}
	return out_string;
}

function textWithMax(textString,textX,textY,textSizeTry,textMax){
	textSize(textSizeTry);
	var tryWidth = textWidth(textString);
	if (tryWidth > textMax){
		textSize(textSizeTry*textMax/tryWidth);
	}
	
	text(textString,textX,textY);
}


function touchStarted() {
	mouseClicked();
	return false;
}

