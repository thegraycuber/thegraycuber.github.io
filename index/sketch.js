var page_mode = 'intro';

var rot = 0;
var page_rand = 5;
var comp_range = [0, 0];
//var page_count = 0;

function draw() {
	ticker += 0.035;
	palette[0].refresh();
	
	background(palette[0].back);
			
	push();
	noFill();
	translate(logo_os.pos.x,logo_os.pos.y,5);
	logo_shapes[0].check();
	for(let l_shape of logo_shapes){
		l_shape.display();
	}
	pop();
	
	if (page_mode == 'intro' && ticker > 1.8){
		page_mode = 'home';
		ticker = 0;
		update_icons(0,icons.length);
	}
	
	
	if (page_mode == 'to_preview' || page_mode == 'from_preview'){
		
		offset_angle += 0.05;
		let lerpy = (sin(offset_angle)+1)/2
		logo_os.update(lerpy);
		home_os.update(lerpy);
		preview_os.update(lerpy);
		
		if (page_mode == 'to_preview'){
			if (offset_angle > PI/2){page_mode = 'preview';}
			lerpy = 1 - 0.3*lerpy;
		} else if (page_mode == 'from_preview'){
			if (offset_angle > PI/2){page_mode = 'home';}
			lerpy = 0.7 + 0.3*lerpy;
		}
		
		for(let l_shape of logo_shapes){
			l_shape.size = px*lerpy;
		}
		for(let ic of icons){
			ic.update_button();
		}
		
	}
	
	
	if (page_mode != 'preview'){
		
		
		if (page_mode != 'intro' && ticker*6 > icon_a && icon_a < icon_maker.length){
			//let im = icon_maker[icons.length];
			//icons.push(new Icon(im[0], im[1], im[2], im[3], im[4]));
			icon_a++;
			icons[icons.length-icon_a].inactive = false;
			icons[icons.length-icon_a].make_button();
			update_icons(icons.length-icon_a,icons.length-icon_a+1);
		} else if (icon_a == icon_maker.length && asteroids.length < 50){
			let ast_ang = TWO_PI*(random(0.2,0.8) + int(random(pages.length)))/pages.length;
			asteroids.push(new Asteroid(icon_rad,ast_ang,px*random(0.15,0.4),int(random(4))));
		}
		
		icon_ang += 0.003;
		rotate_icons();
		
		push();
		translate(home_os.pos.x, home_os.pos.y, 0);
		textAlign(LEFT, CENTER);
		
		for(let l_word of logo_words){
			l_word.display();
		}
		
		if (page_mode != 'intro'){
			for (let i of icons){
				i.check();
				i.display();
			}
		}
		
		noStroke();
		for (let a of asteroids){
			a.display();
		}
		pop();
	}
	if (page_mode != 'intro' && page_mode != 'home'){
		push();
		translate(preview_os.pos.x, preview_os.pos.y, 0);
			
		translate(0,0,4);
		
		noStroke();
		fill(palette[0].front);
		
		textAlign(CENTER, CENTER);
		textSize(px * 0.8);
		let tw = textWidth(pages[pg].title);
		if (tw > width*0.8){
			textSize(px * 0.64 * width / tw);
		}
		text(pages[pg].title, 0, title_mult*(height*0.5 - px));
		let rect_wid = textWidth(pages[pg].title)+px;
		textSize(px * 0.5);
		fill(palette[0].medium);
		text('click to visit this page', 0, title_mult*(height*0.5 - px*1.8));
		
		translate(0,0,-2);
		fill(palette[0].back);
		rect(0, title_mult*height*0.5,rect_wid,px*4.2,px*0.2);
		
		translate(0,0,-2);
		
		if (pages[pg].title == 'Complex Primes') {
			gaussDraw();
		} else if (pages[pg].title == 'Quadratic Primes') {
			quadraticDraw();
		} else if (pages[pg].title == 'Complex Grapher') {
			grapherDraw();
		} else if (pages[pg].title == 'Groups of Units') {
			unitsDraw();
		} else if (pages[pg].title == "Rubik's Cube Calculator") {
			calculatorDraw();
		} else if (pages[pg].title == "Cursed Equations") {
			cursedDraw();
		} else if (pages[pg].title == "Group Visualizer") {
			explorerDraw();
		}
		pop();
	}

}


function touchStarted(){
	
	if (logo_shapes[0].check(true)){
		if (page_mode == 'home'){
			window.open('https://thegraycuber.github.io/about.html', '_self');	
			return;
		} else if (page_mode == 'preview'){
			from_preview();
			return;
		}
	}
	
	var linked = false;
	for (var i = 0; i < icons.length; i++){
		if(icons[i].check(true)){
			if (icons[i].anchor == ''){
				to_preview(i);
				
			} else {
				linked = true;
				//window.open(icons[i].link, icons[i].anchor);
				
			}
		}
	}
	
	if(!linked && page_mode == 'preview'){
		window.open(pages[pg].link, '_self');
	}
}

function touchMoved(event){
	event.preventDefault(); 
}

function title_refresh(){
	new_display_title = pages[p].full_title;
	disp_update = [];
	while (disp_update.length < new_display_title.length){
		disp_update.push(random(page_trans*0.8));
	}
}


function prep_preview(){
	ticker = 0;

	if (pages[pg].title == 'Complex Primes') {
		makeGauss();
		page_rand = int(random(1, main_list[0].colorvalue.length));

	} else if (pages[pg].title == 'Complex Grapher') {
		comp_range = [0, 0];
		page_rand = int(random() * 5) + 3;
		makePentagon(page_rand);

	} else if (pages[pg].title == 'Groups of Units') {
		main_list = [];
		unit_mod = 0;

	} else if (pages[pg].title == "Rubik's Cube Calculator"){
		calculatorPrep();

	} else if (pages[pg].title == "Cursed Equations"){
		cursedPrep();

	} else if (pages[pg].title == "Group Visualizer"){
		explorerPrep();

	}
}
