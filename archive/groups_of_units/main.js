

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



