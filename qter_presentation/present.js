

var present_modules = [];
var lerp_bounce, lerp_smooth, lerp_abrupt, lerp_spin;
var present_timing, present_timer, last_transition, last_frame;
var transition_start = -1;
var animations = ['smooth','bounce','abrupt','connect','snake','wiggle','spin'];
var present_view = [];
var present_ticker = 1;
var timed_presenting = false;
var timing_multiplier = 1;
var mouse_state = 'presenting';


function next_slide(){
	if (slide == modules.length - 1){
		return;
	}
	last_transition = Date.now();
	slide++;
	prep_presentation();
}

function prep_presentation(){
	
	getCurrentSettings(true);
	get_all_colors(slide);
	present_ticker = 0;
	
	present_modules = [];
	let prior_connected = [];
	for (let _ = 0; _ < modules[slide - 1].length; _++){
		prior_connected.push(false);
	}
	
	for (let module of modules[slide]){

		let present_mod;
		let prior_mod = get_parent(module, slide);

		if (typeof prior_mod != 'undefined'){

			prior_connected[prior_mod.index] = true;
			
			present_mod = prior_mod.duplicate(slide-1);
			present_mod.startAt(prior_mod);
			present_mod.endAt(module);
			present_mod.anim = module.anim;
			
			if (module.type == 'text' && module.text != prior_mod.text){
				present_mod.text = '$morph$';
				present_mod.start_text = prior_mod.text;
				present_mod.end_text = module.text;
				
				let s_len = present_mod.start_text.length;
				let e_len = present_mod.end_text.length;
				let min_len = min(s_len,e_len);
				
				let left_share = 0;
				while (left_share < min_len){
					if (present_mod.start_text.substring(left_share,left_share+1) == present_mod.end_text.substring(left_share,left_share+1)){
						left_share++;
					} else {
						break;
					}
				}
						
				let right_share = 0;
				while (right_share < min_len){
					if (present_mod.start_text.substring(s_len-right_share-1,s_len-right_share) == present_mod.end_text.substring(e_len-right_share-1,e_len-right_share)){
						right_share++;
					} else {
						break;
					}
				}
				
				if (right_share > left_share){
					let s_excess = present_mod.start_text.substring(0,s_len-right_share);
					let e_excess = present_mod.end_text.substring(0,e_len-right_share);
							
					textSize(present_mod.start_text_size);
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = (textWidth(s_excess)-textWidth(e_excess))/2;
					
					textSize(present_mod.end_text_size);
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = (textWidth(e_excess)-textWidth(s_excess))/2;
					
				} else if (left_share > 0) {
					let s_excess = present_mod.start_text.substring(left_share,s_len);
					let e_excess = present_mod.end_text.substring(left_share,e_len);
					
					textSize(present_mod.start_text_size);
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = (textWidth(e_excess)-textWidth(s_excess))/2;
					
					textSize(present_mod.end_text_size);
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = (textWidth(s_excess)-textWidth(e_excess))/2;
					
				} else {
					present_mod.start_s_offset = 0;
					present_mod.start_e_offset = 0;
					present_mod.end_e_offset = 0;
					present_mod.end_s_offset = 0;
				}
						
			} else if (module.type == 'poly'){ //NEWPOLY
				for (let l = present_mod.links.length-1; l > -1; l--){
					let bad_link = true;
					for (let link of module.links){
						if (link[0] == present_mod.links[l][0] && link[1] == present_mod.links[l][1]){
							bad_link = false;
							break;
						}
					}
					if (bad_link){
						present_mod.links.splice(l,1);
					}
				}
			}
				
		} else {
			
			present_mod = module.duplicate(slide);
			present_mod.startEmpty();
			present_mod.endAt(module);
			
			if (animations[module.anim] == 'bounce'){
				present_mod.start_text_size = 0;
				present_mod.start_size = createVector(0,0);
			} else if (animations[module.anim] == 'spin'){
				present_mod.start_text_size = 0;
				present_mod.start_size = createVector(0,0);
				present_mod.start_angle = present_mod.end_angle + TWO_PI;//*(floor(random()*2)*2-1);
			}

			if (present_mod.type == 'poly'){present_mod.links = [];}
		}

		//NEWPOLY
		if (present_mod.type == 'poly'){
			while (present_mod.start_points.length > present_mod.end_points.length){
				present_mod.end_points.push(present_mod.end_points[present_mod.end_points.length-1].copy());
			}
			while (present_mod.end_points.length > present_mod.start_points.length){
				present_mod.start_points.push(present_mod.start_points[present_mod.start_points.length-1].copy());
			}
		}
		
		present_modules.push(present_mod);
	}
	
	let fading_modules = [];
	for (let module of modules[slide-1]){
		if (prior_connected[module.index]){continue;}
		
		let fading_mod = module.duplicate(slide-1);
		fading_mod.startAt(module);
		fading_mod.endEmpty();
		fading_mod.anim = animations.indexOf('smooth');	
		
		if (fading_mod.type == 'poly'){fading_mod.links = [];}
		
		fading_modules.push(fading_mod);
	}
	present_modules = fading_modules.concat(present_modules);

	if (timed_presenting && audio_update && allow_audio){
		slide_audio();
		audio_update = false;
	}
}

var audio_update = false;


function get_parent(child_module, child_slide){

	if (typeof child_module.anim != 'undefined' && animations[child_module.anim] != 'connect' && animations[child_module.anim] != 'wiggle'){
		return;
	}
	for (let test_parent of modules[child_slide-1]){
	
		if (test_parent.id != child_module.id || test_parent.type != child_module.type){
			continue;
		}

		return test_parent;
	}

	child_module.anim = animations.indexOf('smooth');
}

class Timing{
	constructor(transition, main, custom, slide = 0){
		this.transition = transition;
		this.main = main;
		this.custom = custom;
		this.s = slide;
	}
	copy(){
		return new Timing(this.transition, this.main, this.custom, this.s);
	}
	total(){
		return this.transition + this.main;
	}
}
