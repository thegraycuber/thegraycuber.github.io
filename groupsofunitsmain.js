

function draw() {
	
	info_index = clicked;
	if (mode == 'Auto Add'){
		ticker++;
		if (ticker == 0){
			addBubble();
			ticker = menuBox.Items[menuBox.getIndex('Speed')].Value - max_speed;
		}
	} 
	
	background(palette.back);
	
	var bubby;
	mouseLoc = coordsToLoc(mouseX,mouseY)
	if (mode != 'Pause'){
		for(bubby of bubbles){
			bubby.pull();
		}
		for(bubby of bubbles){
			bubby.push();
			if (interference){bubby.pushMouse();}
		}
	}
	for(bubby of bubbles){
		bubby.move();
	}
	if(autozoom){
		updateScale();
	}
	
	
	for(bubby of bubbles){
		bubby.displayLines();
	}
	/*
	for(bubby of bubbles){
		bubby.display();
	}
	for(bubby = bubbles.length-1; bubby > -1; bubby--){
		bubbles[bubby].text();
		textFont(atkinsonBold);
	}
	*/
	for(var bool = 0; bool < 2; bool++){
		
		for(bubby of bubbles){
			if(bubby.shade == (bool == 1)){
				bubby.display();
			}
		}
		for(bubby = bubbles.length-1; bubby > -1; bubby--){
			if(bubbles[bubby].shade == (bool == 1)){
				bubbles[bubby].text();
				textFont(atkinsonBold);
			}
		}
	}

	noStroke();
	if (mouseIsPressed){
		if (mouseCheck()){
			menuBox.clicked(false);
		} 
	}
	
	menuBox.show();
	if (info){
		var hovercolor = palette.backlight;
		if (info_index == -1){info_index = bubbles.length - 1;}
		else {hovercolor = palette.accent[bubbles[info_index].cycles.length-1];}
		hoverBox.Items[0].DisplayText = str(bubbles[info_index].utext);
		hoverBox.Items[1].DisplayText = str(bubbles[info_index].uPrimeText);
		hoverBox.Items[2].DisplayText = str(bubbles[info_index].cPrimeText);
		hoverBox.Items[3].DisplayText = str(bubbles[info_index].ctext);
		hoverBox.show(hovercolor);
	}
	
	for (var icon of icons){
		icon.showIcon();
	}
}

function touchStarted(){
	
	console.log('here');
	if (mouseCheck()){
		menuBox.clicked();
		//infoBox.clicked();
		for (var icon of icons){
			icon.clicked();
		}
	} else {
		if (focus.substring(focus.length-7,focus.length) == 'Clicked'){
		
			clicked = -1;
			for (var bub_click of bubbles){
				if (pointDist(bub_click.x,bub_click.y,mouseLoc[0],mouseLoc[1])[2] < 400){
					clicked = bub_click.index;
					break;
				}
			}

			for (var bubby of bubbles){
				bubby.shade = true;
			}
			for (bubby of bubbles){
				bubby.checkShade();
			}
			for (bubby of bubbles){
				bubby.checkRep();
			}
		}
		
		if (mode == 'Click to Add' && clicked == -1){
			addBubble(mouseX,mouseY,false);
		}
	}
	
}


function mouseWheel(event) {
  if(!autozoom){
		coord_adjust *= pow(2,-0.16*event.delta/px);
		var mouseLoc = coordsToLoc(mouseX,mouseY);
		coord_offset = [coord_offset[0] + mouseLoc[0]*(c - coord_adjust*coord_scale),coord_offset[1] + mouseLoc[1]*(c - coord_adjust*coord_scale)];
		c = coord_adjust*coord_scale;
	}
}

function mouseDragged() {
  if(!autozoom){
		coord_offset[0] += (mouseX - pmouseX);
		coord_offset[1] += (mouseY - pmouseY);
	}
}
