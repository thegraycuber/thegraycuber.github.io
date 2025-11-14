prod = true;
win = [];
setting = 0;
ints = [[]];
zoomz = [[]];
colors = [];
colorsF = [];
colorsLite = [];
icons = [];
menuBox = [];
infoBox = [];
hoverBox = [];
data = [];

function draw() {
	
	if (setting.DataRows == data.getRowCount() && setting.DataRows > 1){
		intsLoad();
		setting.DataRows = -1;
	} else if (setting.DataRows != -1){
		setting.DataRows = data.getRowCount();
	}
	
	if (setting.ZoomOut == 1 && prod){
		background(palette.back);
		for (var zRow of zoomz) {
			zRow.showAll();
		}
		setting.ZoomOut = 2;
	} else if (setting.ZoomOut == 0){

		var newMouse = coordToCoeff(mouseX,mouseY);
		var mouseA = getAssociate(setting.MouseCoeff);

		var mouseIdx = -1;
		if (goodCoeff(newMouse)){
			mouseIdx = intIndex(mouseA);
		} 

		setting.Time = setting.Time + 1;

		if (setting.MouseCoeff[0] != newMouse[0] || setting.MouseCoeff[1] != newMouse[1]){
			setting.MouseCoeff = newMouse;
			setting.Time = 0;
			if (setting.IsHovering){
				resetWalkability(-2);
				for (var hoveritem of hoverBox.Items){hoveritem.DisplayText = '';}
				setting.IsHovering = false;
				setting.Refresh = true;
			}

		} else if (setting.Time == setting.HoverPause && mouseCheck() == false && mouseIdx > -1){

			hoverBox.Items[hoverBox.getIndex('hovertext')].DisplayText = ints[mouseIdx].Desc[mouseA[2]];
			hoverBox.Items[hoverBox.getIndex('factortitle')].DisplayText = ints[mouseIdx].Type + '       Norm ' + ints[mouseIdx].Norm;
			hoverBox.Items[hoverBox.getIndex('primefactorization')].DisplayText = 'Prime Factorization:'
			var unitText = '';
			if (ints[mouseIdx].FactorA > -1){
				unitText = '(' + setting.UnitsText[(ints[mouseIdx].FactorA + mouseA[2]) % setting.UnitsText.length + ints[mouseIdx].FactorA - (ints[mouseIdx].FactorA) % setting.UnitsText.length] + ') '; 
			}
			unitText += ints[mouseIdx].Factors;

			if (unitText.length > 40){
				//console.log(unitText.length);
				var textmid = int(unitText.length/2);
				var textdiff = 0;
				//console.log(unitText.substring(textmid+textdiff,textmid+textdiff+2),'b');

				while (unitText.substring(textmid+textdiff,textmid+textdiff+2) != ' ('){
					textdiff *= -1;
					if (textdiff >= 0){
						textdiff += 1;
					}
					//console.log(textdiff);
				}
				unitText = unitText.substring(0,textmid+textdiff) + '\n' + unitText.substring(textmid+textdiff+1)

			}

			hoverBox.Items[hoverBox.getIndex('factors')].DisplayText = unitText;

			if (setting.ShowAssoc == 1){
				highlightAssociates(-2,mouseA);
			} else if(ints[mouseIdx].IsPrime == 0){
				walkabilityFactors(-2,mouseA);
			} else {
				giveWalkability(-2,ints[mouseIdx].Desc[ints[mouseIdx].MainDesc]);
			} 

			setting.Refresh = true;
			setting.IsHovering = true;
		}


		for (var dummy = 0; dummy < setting.ColorSpeed; dummy++){
			colors.push(colors[0]);
			colors.splice(0,1);
		}

		var iRow;

		if(setting.ColorSpeed > 0 || setting.Refresh){

			background(palette.back);

			for (iRow of ints) {
				iRow.showAll();
			}
		}

		showGrid();



		if(setting.Labels == 1){
			for (iRow of ints) {
				if (iRow.Coeffs[0][0] % 5 == 0 && iRow.Coeffs[0][1] % 5 == 0 && (iRow.Coeffs[0][0] == 0 || iRow.Coeffs[0][1] == 0)){
					iRow.showLabel();
				}
			}
		}
		if(setting.IsHovering){ints[mouseIdx].showOutline(mouseA[2]);}
	}
	
	for (var icon of icons){
		icon.showIcon();
	}
	
	menuBox.show();
	infoBox.show();
	hoverBox.show();

	if (fullscreen_count > 0){
		fullscreen_count++;
		if (fullscreen_count > 30){
			fullscreen_count = 0;
			resizeCanvas(window.innerWidth,window.innerHeight);
		}
	}
	let currentUrl = window.location.href;
	if (currentUrl.includes('key_test')){
		text_in_box(last_key,width/2,height/2,height*0.08,palette.back,palette.front);
	}
}

var fullscreen_count = 0;
var last_key = '';
function keyPressed(){
	last_key = keyCode;
	
	if (key == 'f'){
		fullscreen(true);
		fullscreen_count = 1;
	}
}

function touchStarted(){
	
	if(setting.ZoomOut == 2){
		setting.ZoomOut = 1;
	}
	
	if (mouseCheck()){
		menuBox.clicked();
		infoBox.clicked();
		for (var icon of icons){
			icon.clicked();
		}
	}
}

function touchMoved(event){
	event.preventDefault(); 
}
