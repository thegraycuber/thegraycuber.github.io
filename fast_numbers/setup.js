
// var origin, scalar;
var input_box, input_center, input_radius, iconBox, helpBox;
var name_x, name_width, name_gap, name_size;
function setup() {

	createCanvas(windowWidth, windowHeight);

	if (window.location.href.includes("lang=nl")){
		dict = 'nl';
	} else if (window.location.href.includes("mode=ance")){
		mode = 'ance';
	} else if (window.location.href.includes("mode=serious")){
		mode = 'serious';
	}
	
	
	palette_names = ['Dark','Electric','Forest','Sunset','Autumn','Paper','Pastel'];
	palette = new Palette('Dark');
	palette_index = palette_names.indexOf('Dark');
	textFont(mainBold);

	textAlign(CENTER,CENTER);
	rectMode(CENTER);
	ellipseMode(CENTER);
	fill(palette.front);

	input_box = createInput(messages.load[dict]);
	
	name_size = min(height*0.035,width*0.05);
	name_width = name_size*9;
	name_x = name_size*4.8;
	name_gap = name_size*4.5;

	let adjuster = width*1.4 < height ? 0.8 : 1;
	input_center = createVector(width*0.5-name_x,height*0.45-name_size);
	input_radius = createVector(name_size*4,name_size*1.2);
	button_style(input_box,palette.back,palette.bright,true,input_center.x-input_radius.x,input_center.y,input_radius.x*adjuster*2,input_radius.y*adjuster*2,name_size*1.5);

	
	iconBox = new Box([width*0.5,height],[name_size*11.5,name_size*5],name_size*0.35);
	let icon_size = [name_size*1.3,name_size*1.3];
	iconBox.Items.push(new Icon('random',[width*0.5-name_size*4.2,height-name_size*1.2],icon_size,'random','red'));
	iconBox.Items.push(new Icon('info',[width*0.5-name_size*1.4,height-name_size*1.2],icon_size));
	iconBox.Items.push(new Icon('palette',[width*0.5+name_size*1.4,height-name_size*1.2],icon_size));
	iconBox.Items.push(new Icon('thegraycuber',[width*0.5+name_size*4.2,height-name_size*1.2],icon_size,'thegraycuber','front','https://thegraycuber.github.io/'));
	
	helpBox = new Box([width*0.5,height-name_size*6.1],[name_size*14,name_size*6],name_size*0.35);
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.Items.push(new textItem(1,messages.info1[dict],name_size*0.6));
	helpBox.Items.push(new textItem(0.6,"",0));
	helpBox.Items.push(new textItem(3,messages.info2[dict],name_size*0.6));
	helpBox.Items.push(new textItem(0.6,"",0));
	helpBox.Items.push(new textItem(1,messages.info3[dict+mode],name_size*0.6,'help_link',messages.link[dict+mode],'bright'));
	helpBox.Items.push(new textItem(0.6,'',0));
	helpBox.giveSizes();
	helpBox.setActive(false);

	
	name_data = loadTable('fast_numbers/fast_numbers_' + dict + mode + '.csv');
	
}


var mainBold, regularFont, name_data;
function preload(){
	// mainBold = loadFont('AshkinsonBold_prod.ttf');
	// regularFont = loadFont('AshkinsonRegular_000.ttf');
	mainBold = loadFont('media/AshkinsonBold_prod.ttf');
	regularFont = loadFont('media/AshkinsonRegular_000.ttf');
}

function core_color_custom(plt){
	plt.fronts = [];
	plt.monos = [];
	plt.brights = [];

	for (let i = 0; i <= 1.001; i += 0.01){
		plt.fronts.push(lerpColor(plt.front,plt.back,i));
		plt.monos.push(lerpColor(plt.mono,plt.back,i));
		plt.brights.push(lerpColor(plt.bright,plt.back,i));
	}
	
}

function button_style(button_in,back,front,input,x,y,w,h,text_height){

	button_in.style("font-size", int(text_height) + "px");
	button_in.style("border-radius", int(text_height*0.3) + "px");
	button_in.size(w,h);
	button_in.position(x, y);
	button_in.style("visibility", "visible");
	if (input){
	button_in.style("border", int(text_height*0.08) + "px solid");
		button_in.addClass('efficient_input');
	} else {
		button_in.addClass('efficient_button');
	}
	button_color(button_in,back,front,input);
}

function button_color(button_in,back,front,input){
  button_in.style("background-color", back);
  button_in.style("color", front);
  button_in.style("text_color", front);
	if (input){
  	button_in.style("border-color", front);
	}
}


function check_info(){
	if (helpBox.Active){
		return 'hide';
	} else {
		return 'info';
	}
}
