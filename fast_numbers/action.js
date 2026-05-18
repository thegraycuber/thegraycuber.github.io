
var scrolling = false;
var lastScroll;
var blockScroll = 0;

function mouseWheel(event){
	
	if (hideCanvas){return;}
	event.preventDefault(); 
	
	if (inputBox.value == "" || panning || (Date.now() - blockScroll < 1000)){
		return;
	}
	scrolling = true;
	lastScroll = Date.now();
	offset -= event.delta/512;
	inputBox.style.borderColor = 'var(--color-back)';
}

var startY;
function touchStarted(){

	if (mouseInMenu || hideCanvas){return;}
	if (inputBox.value != ""){
		panning = true;
		startY = mouseY;
		lastPan = Date.now();
	}
	updateTouchInfo();
}

function touchEnded(){
	panning = false;
	mouseInMenu = false;
	updateTouchInfo();
}


var panning = false;
function touchMoved(event){
	if (mouseInMenu || hideCanvas){return;}
	event.preventDefault(); 

	if (!panning){
		return;
	}
	
	lastPan = Date.now();
	offset += (mouseY - principalPos.y)/(height/7);
	if (abs(startY-mouseY)>0.1){
		inputBox.style.borderColor = 'var(--color-back)';
	}
	updateTouchInfo();
}

function randomize(){
	hidePopups();
	giveValue(floor(random()*1000000));
}

function customToggleHolder(holderType, holderToggle){
	if (holderType == 'info'){
		document.getElementById('main-holder').style.display = (holderToggle == 'show'? 'none':'block');
	} 
}

function setVersion(version){
	hidePopups();
	mode = version;
	nonloaded = true;
	inputBox.value = loadText[dict];
	giveValue(-1);
	document.getElementById('input-alert').style.display = 'none';
	nameData = loadTable('fast_numbers_' + dict + mode + '.csv');
}


function giveValue(testNumber){
	
	if (!isNaN(testNumber) && testNumber > -1 && testNumber <= 1000000){

		document.getElementById('input-alert').style.display = 'none';
		
		if (testNumber != existingNumber){
			inputBox.value = testNumber;
			existingNumber = testNumber;
			for (let n = 0; n < 7; n++){
				let testIndex = testNumber + n - 3;
				let nChildren = document.getElementById('number-holder-'+str(n)).children;

				if (testIndex > -1 && testIndex <= 1000000){
					nChildren[1].children[0].innerHTML = nameDecompress(nameData.getString(testIndex,0));
					nChildren[1].children[1].innerHTML = equationDecompress(nameData.getString(testIndex,1));
					nChildren[0].innerHTML = str(testIndex);
				} else {
					nChildren[1].children[0].innerHTML = '';
					nChildren[1].children[1].innerHTML = '';
					nChildren[0].innerHTML = '';
				}
			}
		} 
		
	} else {
		document.getElementById('input-alert').style.display = 'inline';
		existingNumber = -1;
		for (let n = 0; n < 7; n++){
			let nChildren = document.getElementById('number-holder-'+str(n)).children;
			nChildren[1].children[0].innerHTML = '';
			nChildren[1].children[1].innerHTML = '';
			nChildren[0].innerHTML = '';
		}
	}

}