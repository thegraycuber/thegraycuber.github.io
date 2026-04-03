
var draw_age = 0;
var show_stuff = true;
var back_image = false;

var filePath = 'qter_presentation/proj';

function preload(){
	mainBold = loadFont('qter_presentation/proj/GoogleSansCode-SemiBold.ttf');
	module_defaults = loadJSON('qter_presentation/proj/defaults_015.json');
	slide_data = loadJSON('qter_presentation/proj/qter_hack_051.json');
}

function draw() {

	load_slide_data();
	
	background(palette.back);

	push();
	aux_draw();
	pop();
	

	if (is3d){
		translate(0,0,wid*0.5);
		scale(wid*0.000625);
		translate(-width/2,-height/2);
	}

	translate(origin.x,origin.y);
	scale(scalar,scalar);

	last_frame = Date.now();
		
	let present_timer = (Date.now() - last_transition)*timing_multiplier;

	if (present_ticker < 1){
		let present_length = (timed_presenting ? present_timing[slide].transition : 750);
		present_ticker = min(1,present_timer/present_length);
		if (present_ticker == 1){
			if (keyIsDown(67)){
				present_ticker = 0.999999999;
			} else {
			last_transition = Date.now();
			}
		}
		
		lerp_bounce = sin(present_ticker*PI*0.63)/0.918;
		lerp_spin = sin(present_ticker*PI*0.58)/0.969;
		lerp_smooth = (sin((present_ticker-0.5)*PI)+1)/2;
		lerp_abrupt = floor(present_ticker);
		for (let p_module of present_modules){
			p_module.lerpModule();
		}
		for (let l of settingsLerp){
			settings[l.key] = lerp(l.start,l.end,lerp_smooth);
		}

		for (let p = 0; p < present_modules.length; p++){
			if (present_modules[p].type == 'poly'){
				move_links(present_modules,p);
			}
		}	
		
		scalar = lerp(present_view[slide-1].scalar,present_view[slide].scalar,lerp_smooth);
		origin = p5.Vector.lerp(present_view[slide-1].origin,present_view[slide].origin,lerp_smooth);
		
		
	} 

	push();
	translate(8/scalar*width/1920,8/scalar*width/1920);
	for (let p_module of present_modules){
		p_module.display(true);
	}
	pop();

	if (is3d){translate(0,0,0.0001);}
	
	for (let p_module of present_modules){
		p_module.display();
		if (is3d){translate(0,0,0.0001);}
	}


}



var allow_audio = false;
var is3d = true;


var slide_data, modules, module_defaults, audio_file, cam;
var wid;
var module_id_counter = 1;
var onion_skin = false;
var select_focus = true;

var slide = 1;

function setup() {
	
	image_list = [
		filePath + '/qter_logo.png',
		filePath + '/qter_label.png',
		filePath + '/scratch_1.png',
		filePath + '/scratch_2.png',
		filePath + '/scratch_3.png',
		filePath + '/scratch_4.png',
		filePath + '/scratch_5.png',
		filePath + '/scratch_6.png',
		filePath + '/scratch_7.png',
		filePath + '/4by4.png',
		filePath + '/5by5.png',
		filePath + '/8by8.png',
		filePath + '/cube_solved.png',
		filePath + '/cube_u.png',
		filePath + '/cube_l.png',
		filePath + '/cube_r.png',
		filePath + '/cube_f.png',
		filePath + '/cube_rf.png',
		filePath + '/cube_ru.png',
		filePath + '/cube_rd.png',
		filePath + '/cube_position.png',
		filePath + '/cube_random.png',
		filePath + '/cube_5.png',
		filePath + '/cube_shorten.png',
	];
	image_load();

	wid = min(window.innerWidth,window.innerHeight*16/9);
	if (is3d){
		createCanvas(wid,wid*9/16,WEBGL);
		cam = createCamera();
		cam.setPosition(0,0,wid);
	} else {
		createCanvas(wid,wid*9/16);
	}
	palette = new Palette('Dark');
	noStroke();
	smooth();
	frameRate(30);
	
	scalar = wid/1920;
	default_scalar = scalar;
	origin = createVector(width/2,height/2);
	default_origin = origin.copy();

	last_frame = 0;
	present_view = [new PresentView(1,0,0)];

	ellipseMode(CENTER);
	rectMode(CENTER);
	textAlign(CENTER,CENTER);
	textFont(mainBold);
	imageMode(CENTER);
	strokeCap(SQUARE);
	
	modules = [[],[]];

	present_timing = [[],new Timing(750,4000,false)]; 

	background(palette.back);

	aux_setup();
    getCurrentSettings();
}


function core_color_custom(plt){
	
		plt.backpale = color(red(plt.back),green(plt.back),blue(plt.back),40);
		plt.backalpha = color(red(plt.back),green(plt.back),blue(plt.back),200);
		plt.backbeta = color(red(plt.back),green(plt.back),blue(plt.back),150);
		plt.backtrans = color(red(plt.back),green(plt.back),blue(plt.back),0);
		if (plt.rev == -1){
			plt.shadow = lerpColor(plt.front,plt.front,0);
			plt.shadow.setAlpha(50);
			plt.backdark = lerpColor(plt.back,color(255),0.2);
		} else {
			plt.shadow = color(0,0,0,100);
			plt.backdark = lerpColor(plt.back,color(0),0.2);
		}	
		plt.backlight = lerpColor(plt.back,plt.mono,0.2);
		plt.backframe = lerpColor(plt.back,plt.mono,0.05);
		plt.medium = lerpColor(plt.back,plt.mono,0.5);
		plt.monoalpha = color(red(plt.mono),green(plt.mono),blue(plt.mono),50);
		plt.colors = [
			plt.front,
			plt.mono,
			plt.bright,
			plt.red,
			plt.gray,
			plt.medium,
			plt.backlight,
			plt.back,
			plt.backtrans,
			color('#e1e485'),
			color('#ebad6b'),
		];

		let flat_shadow = make_solid(plt.backdark);
		for (let im of image_list){
			im.shadow = im.image.get();//image(shad,im.image.width,im.image.height);
			im.shadow.copy(flat_shadow,0,0,1,1,0,0,im.image.width,im.image.height);
			im.shadow.mask(im.image);
		}
}




function make_solid(solid_color){
	let solid = createImage(1,1);
	solid.loadPixels();
	solid.pixels[0] = red(solid_color);
	solid.pixels[1] = green(solid_color);
	solid.pixels[2] = blue(solid_color);
	solid.pixels[3] = 255;
	solid.updatePixels();
	return solid;
}



var settingsList = [];
var settingsOpen = false;
var settings = {};
var settingsLerp;

function updateSettings(hide=true){
    settingsList[slide] = JSON.parse(document.getElementById('settings').value);
    if (hide){
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-enter').style.display = 'none';
    
        settingsOpen = false;
    }
    getCurrentSettings();
}


function getCurrentSettings(toPresent = false){

    if (toPresent){settingsLerp = [];}

    for (let s = 0; s < min(slide+1,settingsList.length); s++){
        for (let k of Object.keys(settingsList[s])){
            if (settingsList[slide][k] == 'skip' || settingsList[s][k] == 'skip' || (s < slide && toPresent && settingsList[slide-1][k] == 'skip')){
                continue;
            }

            if (k in settings){
                if (s == slide && toPresent && !isNaN(settings[k]) && !isNaN(settingsList[s][k])  && !(settingsList[s][k] === true || settingsList[s][k] === false)){
                    settingsLerp.push({
                        'key': k, 
                        'start': settings[k], 
                        'end': settingsList[s][k]});
                } else {
                    settings[k] = settingsList[s][k];
                }
            } else {
                Object.defineProperty(settings,k,{
                    value:settingsList[s][k],
                    enumerable:true,
                    writable:true
                });
            }

        }
    }
}


function sortAsc(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function get_all_colors(color_slide){
	for (let module of modules[color_slide]){
		giveColors(module);
	}
}

function background3d(backcolor){
	if (is3d){
		translate(0,0,0.0001);
		onlyFill(backcolor);
		rect(0,0,10000,10000);
	} else {
		background(backcolor);
	}
}

function skips_from_keys(){
	for (let i = 1; i < 10; i++){
		if (keyIsDown(48+i)){
			return i;
		}
	}
	return 0;
}

function arrow_to_vec(arrow_code){
	
	if (arrow_code == LEFT_ARROW){
		return createVector(-1,0);
	} else if (arrow_code == RIGHT_ARROW){
		return createVector(1,0);
	} else if (arrow_code == UP_ARROW){
		return createVector(0,1);
	} else if (arrow_code == DOWN_ARROW){
		return createVector(0,-1);
	} 
}

function is_arrow(arrow_code){
	return [LEFT_ARROW,RIGHT_ARROW,UP_ARROW,DOWN_ARROW].includes(arrow_code);
}

function active_setup(){
	if (active_modules.length == 1){
		single_active = modules[slide][active_modules[0]];
		single_active.makeEditors();

	} else if (active_modules.length > 1){
		make_editors('select', 48/scalar, 0);

	}
	mouse_state = 'free';
}


function updateModuleIndices(){
	let active_static = [];
	for (let n of  active_modules){
		active_static.push(true)
	}

	let ant_static = [];
	for (let n of ants){
		ant_static.push(true)
	}
	
	for (let m = 0; m < modules[slide].length; m++){
		for (let n = 0; n < active_modules.length; n++){
			if (active_modules[n] == modules[slide][m].index && active_static[n]){
				active_modules[n] = m;
				active_static[n] = false;
				break;
			}
		}
		for (let n = 0; n < ants.length; n++){
			if (ants[n].target == modules[slide][m].index && ant_static[n]){
				ants[n].target = m;
				ant_static[n] = false;
				break;
			}
		}
		modules[slide][m].index = m;
	}
}


var slides_loaded = 0;
function load_slide_data(){
	
	let data_keys = Object.keys(slide_data);
	while (slides_loaded < data_keys.length){
		
		let d = slide_data[data_keys[slides_loaded]];
		slides_loaded++;

		if ('settings' in d){
			settingsList = d.settings;
			continue;
		}

		if ('view' in d){
			while (present_view.length < d.s){
				present_view.push(present_view[present_view.length-1].copy());
			}
			
			present_view.push(new PresentView(...d.a));
			scalar = present_view[present_view.length-1].scalar;
			origin = present_view[present_view.length-1].origin.copy();
			continue;
		}

		if ('transition' in d){
			while (present_timing.length < d.s){
				present_timing.push(present_timing[present_timing.length-1].copy());
			}
			while (present_timing.length > d.s){
				present_timing.splice(present_timing.length-1,1);
			}
			
			present_timing.push(new Timing(d.transition, d.main, d.custom));
			continue;
		}


		let connected = false;
		if (!('anim' in d) || animations[d.anim] == 'connect' || animations[d.anim] == 'wiggle'){
			let test_parent = slides_loaded - 2;
			while (test_parent > -1){
				if (slide_data[data_keys[test_parent]].s + 1 < d.s){
					break;
				}
				if (slide_data[data_keys[test_parent]].s + 1 == d.s && slide_data[data_keys[test_parent]].i == d.i){
					simple_fill(d, slide_data[data_keys[test_parent]]);
					connected = true;
					break;
				}
				test_parent--;
			}
		}

		if (!connected){
			simple_fill(d, module_defaults[0][d.t]);
		}
		
		while (modules.length <= d.s){
			modules.push([]);
		}

		//NEWPOLY
		slide = d.s;
		module_id_counter = max(module_id_counter,d.i+1);
		if (d.t == 't'){
			modules[d.s].push(new TextModule(d));
		} else if (d.t == 's'){
			modules[d.s].push(new ShapeModule(d));
		} else if (d.t == 'a'){
			modules[d.s].push(new ArrowModule(d));
		} else if (d.t == 'i'){
			modules[d.s].push(new ImageModule(d));
		} else if (d.t == 'p'){
			modules[d.s].push(new PolyModule(d));
		}
		slide = 0;
		document.getElementById('slide-counter').innerHTML = 'slide 1/' + str(modules.length);
	}
	
	while (present_view.length < modules.length){
		present_view.push(present_view[present_view.length-1].copy());
	}
	while (present_timing.length < modules.length){
		present_timing.push(new Timing(750,4000,false));
	}
	while (settingsList.length < modules.length){
		settingsList.push({});
	}
}


class PresentView{
	constructor(view_size, view_x, view_y){
		this.size = view_size;
		this.pos = createVector(view_x, view_y);
		this.scalar = default_scalar*view_size;
		this.origin = p5.Vector.sub(default_origin,[view_x*this.scalar, view_y*this.scalar]);
		this.log = max(0,round(log(view_size)/log(10)));
	}
	copy(){
		return new PresentView(this.size,this.pos.x,this.pos.y)
	}
}

function type_id_check(check_type, check_id){
	
	if (check_type == 'text'){
		return ! ['shape','points','mode','image_index'].includes(check_id);
		
	} else if (check_type == 'shape'){
		return ! ['text_size','points','mode','image_index'].includes(check_id);
		
	} else if (check_type == 'arrow'){
		return ! ['shape','text_size','image_index'].includes(check_id);
		
	} else if (check_type == 'image'){
		return ! ['shape','text_size','points','mode'].includes(check_id);
		
	} else if (check_type == 'poly'){
		return ! ['text_size','mode','image_index'].includes(check_id);
	} //NEWPOLY
}

