var page_time = 30;
var page_trans = 3;
var rot = 0;
var page_rand = 5;
var comp_range = [0, 0];
var quad_len = 10;
var quad_show = [false,false,false];
var page_count = 0;
var unit_mod = 0;
var logos = false;
var display_title = '                              ';
var disp_update, new_display_title;

function draw() {

	translate(-width/2,-height/2,-5);
	background(palette[0].back);
			
	translate(0,0,10);
	logo([px*1.8, px*1.1]);
	translate(0,0,-10);
	
	ticker += ticker_add;
	if (ticker > 0) {

		if (pages[p].title == 'Complex Primes') {
			gaussDraw();
		} else if (pages[p].title == 'Quadratic Primes') {
			quadraticDraw();
		} else if (pages[p].title == 'Complex Grapher') {
			grapherDraw();
		} else if (pages[p].title == 'Groups of Units') {
			unitsDraw();
		} else if (pages[p].title == "Rubik's Cube Calculator") {
			calculatorDraw();
		} else if (pages[p].title == "Cursed Quadratic Equations") {
			cursedDraw();
		}

		textAlign(CENTER, CENTER);

		var message = 0;
		if (page_count % (pages.length + 1) == 1){
			message = 1;
		}
		
	
		noStroke();
		translate(0,0,10);
		fill(palette[0].front);
		textSize(px * 0.56);
		var tw = textWidth(pages[p].title);
		if (tw > px*8){
			textSize(px2*6/tw);
		}
		text(display_title, width - px*5.5, height - px*2.3);
		textSize(px * 0.38);
		fill(palette[0].medium);
		text('click to view this page', width - px*5.5, height - px*1.7);
		/*
		textSize(px * 0.4);
		if (message == 1){
			text("click to view or wait for more previews", width - px*4.5, height - px*1.8);
		}
		*/
		if (!logos){
			for (var i of imgs){
				i.check();
				i.display();
			}
		}

		
		var updater = false;
		if (ticker < page_trans) {
			for (var d = 0; d < disp_update.length; d++){
				if (disp_update[d] < ticker){
					disp_update[d] = page_trans;
					display_title = display_title.substring(0,d) + new_display_title.substring(d,d+1) + display_title.substring(d+1,display_title.length);
				}
			}
			updater = true;
			palette[0].refresh(old_index, pages[p].index, (ticker / page_trans + 1) * 0.5);
			update_imgs();
		} else if (ticker + page_trans > page_time) {
			logos = true;
			//palette[0].back.setAlpha((ticker + page_trans - page_time) * 255 / page_trans);
			//background(palette[0].back);
			updater = true;
			palette[0].refresh(pages[p].index, pages[mod(p + 1, pages.length)].index, 0.5 * (ticker + page_trans - page_time) / page_trans);
			update_imgs();
		}
		palette[0].back.setAlpha(255);
		
		if (logos){
			for (var im of imgs){
				im.check();
				im.display();
			}
		}
		translate(0,0,-10);

		if (ticker >= page_time) {
			page_count += 1;
			old_index = pages[p].index;
			ticker = 0;
			p = (p + 1) % pages.length;
			title_refresh();

			if (pages[p].title == 'Complex Primes') {
				makeGauss();
				page_rand = int(random(1, main_list[0].colorvalue.length));
			} else if (pages[p].title == 'Quadratic Primes') {
				quad_len = page_time/3;
				main_list = [];
				var rands = [];
				for (var rand_add = 0; rand_add < 3; rand_add++){
					var new_rand = int(random(quad_options.length));
					while (rands.includes(new_rand)){
						new_rand = int(random(quad_options.length));
					}
					rands.push(new_rand);
					makeQuad(rands[rand_add],rand_add);
				}
			} else if (pages[p].title == 'Complex Grapher') {
				comp_range = [0, 0];
				page_rand = int(random() * 5) + 3;
				makePentagon(page_rand);

			} else if (pages[p].title == 'Groups of Units') {
				main_list = [];
				unit_mod = 0;

			} else if (pages[p].title == "Rubik's Cube Calculator"){
				calculatorPrep();
				playalg = 'UlBBDfrDBurDLUlBDfrDBuuRfLdd';
				var dummy = int(random(25));
				playalg = playalg.substring(dummy,playalg.length) + playalg.substring(0,dummy);
					

			} else if (pages[p].title == "Cursed Quadratic Equations"){
				cursedPrep();

			}

		}
		

	}

}


function touchStarted(){

	var linked = false;
	for (var i of imgs){
		if(i.check(true)){
			linked = true;
			window.open(i.link, i.type);
		}
	}
	if(!linked && ticker > 0){
		window.open(pages[p].link, '_self');
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