

function action(id, value, object = [], arrow = active_arrow) {
	
	if (id == 'arrow'){
		active_arrow = value;
		for (var box of arrowBoxes){
			box.getItem('arrow').Index = value;
		}
		
	} else if (id == 'arrow_active'){

		auto_position_skip = false;
		if (arrow_elements[active_arrow] != -1 && active_arrow == value){
			arrow_elements[active_arrow] = -1;
			arrowBoxes[active_arrow].getItem('arrow_element').Active = false;
			arrowBoxes[active_arrow].getItem('arrow_type').Active = false;
			arrowBoxes[active_arrow].getItem('type_head').Active = false;
		} else {
			active_arrow = value;
			arrow_elements[active_arrow] = arrowBoxes[active_arrow].getItem('arrow_element').Index;
			arrowBoxes[active_arrow].getItem('arrow_element').Active = true;
			arrowBoxes[active_arrow].getItem('arrow_type').Active = true;
			arrowBoxes[active_arrow].getItem('type_head').Active = true;
		}
		
		refresh_strength_elements();
		
	}  else if (id == 'arrow_element'){
		
		auto_position_skip = false;
		arrow_elements[arrow] = value;
		
	} else if (id == 'arrow_type'){

		auto_position_skip = false;
		arrow_types[arrow] = value;
		
	} else if (id == 'arrow_strength'){
		arrow_strengths[arrow] = value**2;
		
	} else if (id == 'order') {
		
		G_order = value + 1;
		scalar = min(width, height) / (9 * G_order ** 0.5);
		
		let classItem = settingBox.getItem('class');
		classItem.List = group_classes[G_order];
		classItem.Index = min(classItem.List.length - 1, classItem.Index);
		
		action('class',classItem.Index,classItem);
		
	} else if (id == 'class') {
		
		G_class = value;
		generate_group();
		refresh_arrow_types();
				
		let groupItem = settingBox.getItem('group');
		groupItem.List = [];//['generators'];
		for (let g of groups[G_order][G_class]){
			groupItem.List.push(g.group_name);
		}
		groupItem.Index = min(groupItem.List.length - 1, groupItem.Index);
		
		action('group',groupItem.Index,groupItem);
		
	} else if (id == 'group') {
		
		auto_position_skip = false;
		
		G_group = value;
		
		// if (G_group == 0) {
		// 	for (let g of G) {
		// 		g.display_name = g.nickname;
		// 	}
			
		// } else {
		let vers = groups[G_order][G_class][G_group];
		for (let g of G) {
			g.display_name = vers.names[g.index];
		}
		// }
		
		refresh_arrow_elements();
		
		
	} else if (id == 'palette') {
		palette_index = (palette_index + 1) % palette_names.length;
		palette = new Palette(palette_names[palette_index]);
		// for (let g of G) {
		// 	g.giveColor();
		// }

	} else if (id == 'display_mode') {
		//object.darkened = physics_o;
		
		if (display_state != 1 || value != 0){
			scalar = min(width, height) / (6 * G_order ** 0.7);
			origin = default_origin.copy();
		}
		
		display_state = value;
		refresh_arrow_types();
		refresh_strength_elements();
		
	} else if (id == 'save_image') {
		save("Group_Explorer_" + now_string() + ".jpg");
		
		
	} else if (id == 'rand') {
		settingBox.randomize();
		display_state = int(random(3));
		refresh_arrow_types();
		
		arrow_elements = [-1,-1,-1];
		let actives = int((random(15)+1)**0.5);
		if (G_order == 1){
			actives = 0;
		}
		active_arrow = max(actives-1,0);
		for (let a = 0; a < actives; a++){
			arrow_elements[a] = arrowBoxes[a].getItem('arrow_element').Index;
			arrowBoxes[a].randomize();
		}
		
		refresh_strength_elements();
		
	} else if (id == 'movement') {
		movement = !movement;
		
	}

}

function refresh_arrow_types(){
	
	for (let a = 0; a < arrowBoxes.length; a++){
		let type_item = arrowBoxes[a].getItem('arrow_type');
		
		if (display_state == 2){
			type_item.List = ['left operate', 'right operate', 'results'];
		} else if (group_classes[G_order][G_class].substring(0,1) != 'C'){
			type_item.List = ['left operate', 'right operate', 'conjugate'];
		} else {
			type_item.List = ['operate'];
		}
		
		type_item.Index = min(type_item.List.length - 1, type_item.Index);
		arrow_types[a] = type_item.Index;
	}
}

function refresh_arrow_elements(){
	
	for (let a = 0; a < arrowBoxes.length; a++){
		let el_item = arrowBoxes[a].getItem('arrow_element');
		
		//console.log(G_order,G);
		el_item.List = [];
		for (let g = 0; g < G_order; g++) {
			el_item.List.push(G[g].display_name);
		}

		if (el_item.Index >= G_order){
			if (arrow_elements[a] == -1){
				el_item.Index = G_order - 1;	
			} else {
				el_item.giveValue(G_order - 1);	
			}
		}
	}
}


function refresh_strength_elements(){
	
	for (let a = 0; a < arrowBoxes.length; a++){
		
		if (display_state == 0 && arrow_elements[active_arrow] != -1){
			arrowBoxes[active_arrow].getItem('arrow_strength').Active = true;
			arrowBoxes[active_arrow].getItem('strength_head').Active = true;
		} else {
			arrowBoxes[active_arrow].getItem('arrow_strength').Active = false;
			arrowBoxes[active_arrow].getItem('strength_head').Active = false;
		}
		
	}
}

