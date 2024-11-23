var page_time = 30;
var page_trans = 3;
var rot = 0;
var page_rand = 5;
var comp_range = [0, 0];
var quad_len = 10;
var quad_show = [false,false,false];
var page_count = 0;


function draw() {
	//console.log(main_list.length);
	background(palette[0].back);
	ticker += ticker_add;
	if (ticker > 0) {

		if (pages[p].title == 'Complex Primes') {
			sunset.push(sunset[0]);
			sunset.splice(0, 1);
			for (var gp of main_list) {
				if (gp.colorshow[page_rand][0] < ticker && gp.colorshow[page_rand][1] > ticker) {
					noStroke();
					fill(sunset[gp.colorvalue[page_rand]]);
					rect(gp.coords[0], gp.coords[1], px / 2);
				}
			}
		} else if (pages[p].title == 'Quadratic Primes') {
			
			
			noStroke();
			
			if (ticker > page_trans && ticker <= page_trans*2){
				quad_show = [true,false,false];
				quad_colors[0].setAlpha(int(255*(ticker-page_trans)/page_trans));
			} else if (ticker > quad_len && ticker <= quad_len + page_trans){
				quad_show = [true,true,false];
				quad_colors[0].setAlpha(int(255*(quad_len+page_trans-ticker)/page_trans));
				quad_colors[1].setAlpha(int(255*(ticker-quad_len)/page_trans));
			} else if (ticker > quad_len + page_trans && ticker <= quad_len*2 - page_trans){
				quad_show = [false,true,false];
			} else if (ticker > quad_len*2 - page_trans && ticker <= quad_len*2){
				quad_show = [false,true,true];
				quad_colors[1].setAlpha(int(255*(quad_len*2-ticker)/page_trans));
				quad_colors[2].setAlpha(int(255*(ticker-quad_len*2+page_trans)/page_trans));
			} else if (ticker > quad_len*2 && ticker <= page_time - page_trans*2){
				quad_show = [false,false,true];
			} else if (ticker > page_time - page_trans*2 && ticker <= page_time - page_trans){
				quad_colors[2].setAlpha(int(255*(page_time-page_trans-ticker)/page_trans));
			} else if (ticker > page_time - page_trans){
				quad_show = [false,false,false];
			}
			
			for (var qd of main_list) {
				if (quad_show[qd.colorindex]){
					fill(quad_colors[qd.colorindex]);
					hexagon(qd.coords[0], qd.coords[1], px/2);
				}
			}
			
		} else if (pages[p].title == 'Complex Grapher') {

			if (ticker > page_trans && ticker < page_trans*3+ticker_add){
				comp_range[1] = min(0.5*main_list.length*(ticker - page_trans)/page_trans,main_list.length);
			} else if (ticker > page_time - page_trans*3 && ticker < page_time - page_trans+ticker_add){
				comp_range[0] = min(int(0.5*main_list.length*(ticker - page_time + page_trans*3)/page_trans),main_list.length);
			}


			rot -= 0.01;

			noFill();
			strokeWeight(px * 0.2);
			stroke(palette[0].accent1);
			push();
			translate(width / 2, height / 2);
			rotate(rot);
			beginShape();
			for (var cpoint = comp_range[0]; cpoint < comp_range[1]; cpoint++) {
				vertex(main_list[cpoint][0][0] * px * 7, -main_list[cpoint][0][1] * px * 7);
			}
			endShape();
			stroke(palette[0].accent2);
			rotate(rot * (page_rand - 2));
			beginShape();
			for (cpoint = comp_range[0]; cpoint < comp_range[1]; cpoint++) {
				vertex(main_list[cpoint][1][0] * px * 7, -main_list[cpoint][1][1] * px * 7);
			}
			endShape();

			pop();
		}

		textAlign(CENTER, CENTER);
		textSize(px * 1.2);
		var tw = textWidth(pages[p].title);

		var message = 0;
		if (page_count % (pages.length + 1) == 1){
			message = 1;
		}
		
		noStroke();
		fill(palette[0].backalpha);
		for (var shad = 0.02; shad < 1; shad += 0.02) {
			rect(width / 2, height / 2 - px * 3, shad * px * 8, shad * px * 4.5, shad * px / 2);
			rect(width / 2, height / 2 + px * (1.2+ 0.25*message), shad * tw * 1.2, shad * px * 2, shad * px * (0.6+0.5*message));
		}

		noStroke();
		fill(palette[0].front);
		text(pages[p].title, width / 2, height / 2 + px);
		textSize(px * 0.4);
		
		if (message == 1){
			text("click to view this page or wait for more previews",width/2,height/2+px*2);
		}


		var updater = false;
		if (ticker < page_trans) {
			palette[0].back.setAlpha((page_trans - ticker) * 255 / page_trans);
			updater = true;
			background(palette[0].back);
			palette[0].refresh(old_index, pages[p].index, (ticker / page_trans + 1) * 0.5);
		} else if (ticker + page_trans > page_time) {
			palette[0].back.setAlpha((ticker + page_trans - page_time) * 255 / page_trans);
			updater = true;
			background(palette[0].back);
			palette[0].refresh(pages[p].index, pages[mod(p + 1, pages.length)].index, 0.5 * (ticker + page_trans - page_time) / page_trans);
		}
		palette[0].back.setAlpha(255);


		if (ticker >= page_time) {
			page_count += 1;
			old_index = pages[p].index;
			ticker = 0;
			p = (p + 1) % pages.length;

			if (pages[p].title == 'Complex Primes') {
				makeGauss();
				page_rand = int(random(1, main_list[0].colorvalue.length));
			} else if (pages[p].title == 'Quadratic Primes') {
				quad_len = page_time/3;
				main_list = [];
				makeQuad(int(random(quad_options.length)),0);
				makeQuad(int(random(quad_options.length)),1);
				makeQuad(int(random(quad_options.length)),2);
			} else if (pages[p].title == 'Complex Grapher') {
				comp_range = [0, 0];
				page_rand = int(random() * 7) + 3;
				makePentagon(page_rand);
			}

		}

	}

	logo([width / 2, height / 2 - px * 3], px * 1.5);
}


function mouseClicked(){
	if(ticker > page_trans && ticker < page_time - page_trans){
		window.open(pages[p].link, '_self');
	}
}