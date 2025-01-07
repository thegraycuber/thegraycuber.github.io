function tableLoad(){
	data = loadTable('2dInts' + str(setting.WVals[setting.PreW]) + '.4.csv', 'csv', 'header');
	setting.DataRows = 0;
}

function intsLoad(){
	setting.makeGrid();
	setting.W = setting.PreW;
	setting.UnitsText = [];
	
	ints = [];
	for (var drow = 0; drow < data.getRowCount(); drow++){
		ints.push(new Gauss(data,drow,setting.W));
	}
	zoomz = [];
	for (drow = 0; drow < zoomdata.getRowCount(); drow++){
		if(zoomdata.getString(drow,setting.W+2)=='1'){
			zoomz.push(new Zoom(zoomdata,drow,setting.W));
		}
	}
	if(setting.ZoomOut == 2){
		setting.ZoomOut = 1;
	}
}

function coordToCoeff(x_c, y_c,w = setting.W) {
	adj_coeff = [(x_c - win[0]/2)/setting.sq, -(y_c - win[1]/2)/(setting.sq*setting.WY[w])];
	nearest_point = getNearest(adj_coeff);
  return nearest_point;
}

function coeffToCoord(coeff_input,w = setting.W,divfact = 1) {
	return_coord = [coeff_input[0]*setting.sq/divfact + win[0]/2, -coeff_input[1]*setting.sq*setting.WY[w]/divfact + win[1]/2];
  return return_coord;
}

function intIndex(coeff_input){
	for (var int_idx = 0; int_idx < ints.length; int_idx++){
		if (coeff_input[0] == ints[int_idx].Coeffs[0][0] && coeff_input[1] == ints[int_idx].Coeffs[0][1]){
			return(int_idx);
		}
	}
	return(-1);
}

function getAssociate(input_Assoc){
	var a = 0;
	while (intIndex(input_Assoc) == -1){
		a += 1;
		input_Assoc = multiplyC(input_Assoc,setting.WUnitInv[setting.W]);
		//console.log(input_Assoc);
		if (a > setting.WAssocs[setting.W]){
			//console.log('assoc not found');
			return [100,100,0];
		}
	}
	return [ints[intIndex(input_Assoc)].Coeffs[0][0],ints[intIndex(input_Assoc)].Coeffs[0][1],a];
}

function goodCoeff(checkCoeff,w = setting.W,mult = 1){
	return abs(checkCoeff[0]) <= 50*mult && abs(checkCoeff[1]) <= setting.YMax[w]*mult ;
}

function getNearest(findcoeffs){
	if (setting.WY[setting.W] == 1){
		return [round(findcoeffs[0]),round(findcoeffs[1])];
		
	} else {
		var lower = round(floor(findcoeffs[0]*2)/2,1);
		var loweroffset = round(lower - floor(lower),1);
		var lowclosest = [lower,round(findcoeffs[1]+loweroffset)-loweroffset];
		var highclosest = [lower+0.5,round(findcoeffs[1]+0.5-loweroffset)-0.5+loweroffset];
		var lowdist = (findcoeffs[0]-lowclosest[0])**2 + ((findcoeffs[1]-lowclosest[1])/1.154)**2;
		var highdist = (findcoeffs[0]-highclosest[0])**2 + ((findcoeffs[1]-highclosest[1])/1.154)**2;
		
		if (lowdist < highdist){
			return [round(lowclosest[0],1),round(lowclosest[1],1)];
		} else {
			return [round(highclosest[0],1),round(highclosest[1],1)];
		}
	}
}


function multiplyC(a_mult,b_mult,D = setting.WVals[setting.W]){
	var prod_Complex = [round(a_mult[0]*b_mult[0] + D*a_mult[1]*b_mult[1],1),round(a_mult[0]*b_mult[1] + a_mult[1]*b_mult[0],1)];

	return prod_Complex;
}


function hexagon(xcenter,ycenter,hexrad){
	beginShape();
	vertex(xcenter,ycenter-hexrad*0.577);
	vertex(xcenter+hexrad*0.5,ycenter-hexrad*0.2886);
	vertex(xcenter+hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter,ycenter+hexrad*0.577);
	vertex(xcenter-hexrad*0.5,ycenter+hexrad*0.2886);
	vertex(xcenter-hexrad*0.5,ycenter-hexrad*0.2886);
	endShape(CLOSE);
}

function trapezoid(xcenter,ycenter,wid){
	
	var xmin = max(win[0]/2 - setting.sq*50.5,xcenter - setting.sq*15.877);
	var xmax = min(win[0]/2 + setting.sq*50.5,xcenter + setting.sq*15.877);
	
	beginShape();
	vertex(xmin-wid,ycenter-(xcenter-xmin)*1.732);
	vertex(xmin+wid,ycenter-(xcenter-xmin)*1.732);
	vertex(xmax+wid,ycenter+(xmax-xcenter)*1.732);
	vertex(xmax-wid,ycenter+(xmax-xcenter)*1.732);
	endShape(CLOSE);
}

function showGrid(){
	if(setting.ShowGrid == 1){
		fill(0,0,black+10);
		for (var gl of setting.Gridlines) {
			if (setting.WVals[setting.W] == -3 && gl[2] < setting.sq){
				trapezoid(gl[0],gl[1],gl[2]/2);
			} else {
				rect(gl[0],gl[1],gl[2],gl[3]);
			}
		}
	}
}

function resetWalkability(walkValue){
	for (var iRow of ints) {
	  if (iRow.Norm == 0){iRow.Walkable = 1;}
		else if(iRow.Walkable == walkValue){iRow.Walkable = (setting.Prime + iRow.IsPrime) % 2;}
	}
}

function giveWalkability(walkValue,factorString,avoid = -10){
	for (var iRow of ints) {
		if (iRow.Factors.indexOf('(' + factorString + ')') > -1 && iRow.Walkable != avoid){
			iRow.Walkable = walkValue;
		} else if (iRow.Norm == 0){
			iRow.Walkable = walkValue;
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
	foundMouse += infoBox.mouseInside();
	foundMouse += hoverBox.mouseInside();
	foundMouse += messageBox.mouseInside();
	
	if (foundMouse > 0){return true;}
	else{return false;}
}

function walkabilityFactors(walkValue,mouseA){

	var mouseIdx = intIndex(mouseA);

	for (var fRow of ints) {
		
		if(fRow.IsPrime == 1 && ints[mouseIdx].Norm % fRow.Norm == 0){
			if (ints[mouseIdx].Factors.indexOf('(' + fRow.Desc[fRow.MainDesc] + ')') > -1){
				fRow.Walkable = walkValue;
			}
		}		
	}
}

function highlightAssociates(walkValue,mouseA){

	var mouseIdx = intIndex(mouseA);
	if (setting.WVals[setting.W] < 0){
		ints[mouseIdx].Walkable = walkValue;
	} else {
		var absNorm = abs(ints[mouseIdx].Norm);
		for (var fRow of ints) {
			if (absNorm == abs(fRow.Norm)){
				var reCoeff = ints[mouseIdx].Coeffs[0][0]*fRow.Coeffs[0][0] - setting.WVals[setting.W]*ints[mouseIdx].Coeffs[0][1]*fRow.Coeffs[0][1];
				var imCoeff =  ints[mouseIdx].Coeffs[0][1]*fRow.Coeffs[0][0] - ints[mouseIdx].Coeffs[0][0]*fRow.Coeffs[0][1];
				if ((reCoeff % absNorm + absNorm) % absNorm == 0 && (imCoeff % absNorm + absNorm) % absNorm == 0){
					fRow.Walkable = walkValue;
				} else if (setting.GridMult[setting.W] == 0.5 && (reCoeff % absNorm + absNorm) % absNorm != 0 && (imCoeff % absNorm + absNorm) % absNorm != 0){
					if (((reCoeff*2) % absNorm + absNorm) % absNorm == 0 && ((imCoeff*2) % absNorm + absNorm) % absNorm == 0){
						fRow.Walkable = walkValue;
					}
				}
			}		
		}
	}
}


function touchStarted() {
	mouseClicked();
	return false;
}
