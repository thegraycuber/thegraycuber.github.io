// dev version of https://thegraycuber.github.io/hexponents

var modulus = [11,0]; 
var orbits = 3; 
var crow_constant = -1; 


var ticker = -3.14;
var highlight = 0;
var last_display = 0;
var show_borders = true;
function draw(){
	background(palette.back);
	translate(origin.x,origin.y);
	scale(scalar,-scalar);

	//draw the hexagons
	for (let c of Object.keys(equivalence_classes)){
		if (c == '0;0'){continue;}
		onlyFill(palette.orbits[equivalence_classes[c].orbit]);
		for (let hex of equivalence_classes[c].hexes){
			hexagon(hex[0],hex[1],0.51);
		}
	}
	
	//draw the borders
	if (show_borders){
		ticker = ticker+(Date.now()-last_display)*0.003;
		last_display = Date.now();
		if (ticker > PI){
			ticker = -PI;
			highlight = (highlight + 1) % orbits;
		}
		
		onlyStroke(palette.back,cos(ticker)*0.05+0.05);
		for (let c of Object.keys(equivalence_classes)){
			if (equivalence_classes[c].orbit != highlight){continue;}
			for (let hex of equivalence_classes[c].hexes){
				hexagon(hex[0],hex[1],0.51);
			}
		}	
	}
	
	resetMatrix();
	textBox.show();
	iconBox.show();
	helpBox.show();

	if(pasting){
		background(palette.backalpha);
	}
	
	stroke(palette.back);
	if (invalid_text.length > 0){
		strokeWeight(bigText*0.25);
		textSize(bigText*2);
		fill(palette.red);
		text(invalid_text,origin.x,origin.y);
		invalid_tick--;
		if (invalid_tick == 0){
			invalid_text = "";
		}
	}
	if (at_ticker > 0){
		strokeWeight(bigText*0.16);
		textSize(bigText);
		fill(palette.front);
		text(at_text.substring(0,at_ticker),at_location[0],at_location[1]);
		at_ticker--;
	}
	
}

function hexagon(x,y,radius){
	beginShape();
	vertex(x,y-radius*1.16);
	vertex(x+radius,y-radius*0.58);
	vertex(x+radius,y+radius*0.58);
	vertex(x,y+radius*1.16);
	vertex(x-radius,y+radius*0.58);
	vertex(x-radius,y-radius*0.58);
	endShape(CLOSE);
}
