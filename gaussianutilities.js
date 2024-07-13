
function coordToCoeff(x_c, y_c) {
	return_coeff = [round((x_c - win[0]/2)/setting.sq), round(-(y_c - win[1]/2)/setting.sq)];
  return return_coeff;
}

function coeffToCoord(coeff_input) {
	return_coord = [coeff_input[0]*setting.sq + win[0]/2, -coeff_input[1]*setting.sq + win[1]/2];
  return return_coord;
}

function getAssociate(input_Assoc){
	if (input_Assoc[0] == 0 && input_Assoc[1] == 0){
		return [0,0,0];
	} else if (input_Assoc[0] >= 1 && input_Assoc[1] >= 0){
		return [input_Assoc[0],input_Assoc[1],0];
	} else if (input_Assoc[1] >= 1){
		return [input_Assoc[1],-input_Assoc[0],1];
	} else if (input_Assoc[0] < 0){
		return [-input_Assoc[0],-input_Assoc[1],2];
	} else {
		return [-input_Assoc[1],input_Assoc[0],3];
	}
}

function goodCoeff(checkCoeff){
	return abs(checkCoeff[0]) <= 50 && abs(checkCoeff[1]) <= 27 ;
}

function isOpen(coeffCheck){
	for(var block of setting.Blocked){
		if (block[0] == coeffCheck[0] && block[1] == coeffCheck[1]){
			return false;
		}
	}
	return true;
}

function keyPressed() {
	endScreenSaver()
  if ((keyCode === UP_ARROW || key == 'w' )&& mkr.Sitting) {
    mkr.Acc[1] += 0.2;
  } else if (keyCode === LEFT_ARROW || key == 'a') {
    mkr.Acc[0] -= 0.012;
  } else if (keyCode === RIGHT_ARROW || key == 'd') {
    mkr.Acc[0] += 0.012;
  }
}

function keyReleased() {
	endScreenSaver()
  if ((keyCode === LEFT_ARROW || key == 'a') && mkr.Acc[0] < 0) {
    mkr.Acc[0] = 0;
  } else if ((keyCode === RIGHT_ARROW || key == 'd') && mkr.Acc[0] > 0) {
    mkr.Acc[0] = 0;
  }
}

function multiplyC(a_mult,b_mult){
	var prod_Complex = [a_mult[0]*b_mult[0] - a_mult[1]*b_mult[1],a_mult[0]*b_mult[1] + a_mult[1]*b_mult[0]];
	if (goodCoeff(prod_Complex)){return prod_Complex;}
	else {return [];}
}

function divideC(a_div,b_div){
	var a_assoc = getAssociate(a_div);
	var b_assoc = getAssociate(b_div);
	//console.log(gInts[a_assoc[0]][a_assoc[1]].Factors,gInts[b_assoc[0]][b_assoc[1]].Factors);
	if (gInts[a_assoc[0]][a_assoc[1]].Factors.indexOf(gInts[b_assoc[0]][b_assoc[1]].Factors) > -1){
		return [(a_div[0]*b_div[0] + a_div[1]*b_div[1])/(b_div[0]**2 + b_div[1]**2),(a_div[1]*b_div[0] - a_div[0]*b_div[1])/(b_div[0]**2 + b_div[1]**2)];
	} else {return [];}
	
	
}

function showGrid(){
	if(setting.ShowGrid == 1){
		fill(0,0,black+10);
		for (var gl of setting.Gridlines) {
			rect(gl[0],gl[1],gl[2],gl[3]);
		}
	}
}

function fixedWalk(){
	for (var num of setting.Blocked){
		gInts[num[0]][num[1]].Walkable = 0;
	}
	if (setting.Makker && gInts[mkr.Assoc[0]][mkr.Assoc[1]].Walkable < 1){
		gInts[mkr.Assoc[0]][mkr.Assoc[1]].Walkable = 2;
	}
	if (targets[0].Active){
		var targAssoc = getAssociate(targets[0].Coeffs);
		gInts[targAssoc[0]][targAssoc[1]].Walkable = 1;
	}
}

function resetWalkability(walkValue){
	for (var gRow of gInts) {
		for (var gCol of gRow) {
			if(gCol.Walkable == walkValue){gCol.Walkable = (setting.Prime + gCol.IsPrime) % 2;}
		}
	}
	fixedWalk();
}

function giveWalkability(walkValue,factorString,avoid = -10){
	for (var gRow of gInts) {
		for (var gCol of gRow) {
			if (gCol.Factors.indexOf('(' + factorString + ')') > -1 && gCol.Walkable != avoid){
				gCol.Walkable = walkValue;
			}
		}
	}
	fixedWalk();
}

function endScreenSaver(){
	setting.MouseSS = [mouseX,mouseY,0];
	setting.Refresh = true;
	if (setting.ScreenSaver > -1){
		for (var gRow of gInts) {
			for (var gCol of gRow) {
				gCol.ScreenSaverShow = [true,true,true,true];
			}
		}
		menuBox.Items[menuBox.getIndex('displaying')].giveValue((setting.PreScreenSaver[0]+1)%2);
		menuBox.Items[menuBox.getIndex('colorScheme')].giveValue(setting.PreScreenSaver[1]);
		menuBox.Items[menuBox.getIndex('colorType')].giveValue(setting.PreScreenSaver[2]);
		setting.ColorSpeed = setting.PreScreenSaver[3];
	}
	setting.ScreenSaver = -1;
}

function mouseCheck(){
	var foundMouse = 0;
	for (var icon of icons){
		if(icon.Active > -1 && mouseX > icon.UpperLeft[0] && mouseX < icon.LowerRight[0] && mouseY > icon.UpperLeft[1] && mouseY < icon.LowerRight[1]){
			foundMouse++;
		}
	}
	foundMouse += menuBox.mouseInside();
	foundMouse += infoBox.mouseInside();
	foundMouse += hoverBox.mouseInside();
	foundMouse += messageBox.mouseInside();
	
	if (foundMouse > 0){return true;}
	else{return false;}
}

function walkabilityFactors(walkValue,mouseA){

	var currNorm = gInts[mouseA[0]][mouseA[1]].Norm;
	for (var fRow of gInts) {
		for (var fCol of fRow) {
			if(fCol.IsPrime == 1 && currNorm % fCol.Norm == 0){
				var f_idx = gInts[mouseA[0]][mouseA[1]].Factors.indexOf(fCol.Factors);
				if (f_idx > -1){
					fCol.Walkable = walkValue;
					while(f_idx > -1){
						currNorm = int(currNorm/fCol.Norm);
						f_add = gInts[mouseA[0]][mouseA[1]].Factors.substring(f_idx+1).indexOf(fCol.Factors);
						if (f_add == -1){f_idx = -1;}
						else {f_idx += 1 + f_add}
					}
				}
			}
			if (currNorm == 1){break;}
		}
		if (currNorm == 1){break;}
	}
	fixedWalk()
}

function cleanFlashers(){
	for (var flash = setting.Flashers.length -1; flash > -1; flash--){
		if (setting.Flashers[flash][5] == 1){
			setting.Flashers.splice(flash,1);
		}
	}
}

function tryMove(){
	if (setting.Moves > 0){
		setting.Moves -= 1;
		icons[2].DisplayChar[0] = setting.Moves;
	} else if (setting.Moves == 0){
		messageBox.Active = 1;
		messageBox.Items[messageBox.getIndex('message')].DisplayText = 'You are out of moves. Try restarting the level.';
		return false;
	}
	return true;
}