
var group_classes = [];
var groups = [];


class Group{
	
	constructor(names,group_name){
		this.names = names;
		this.group_name = group_name;
	}
	
}

function generate_group_classes(){
	
	let new_cardinality = 0;	
	let new_order = [];
	let new_class = '';
	let new_order_groups = [];
	let new_groups = [];

	for (let el_row = 0; el_row < el_data.getRowCount(); el_row++){
		
		if (new_class != el_data.getString(el_row,0)){
			new_order.push(new_class);
			new_class = el_data.getString(el_row,0);
			new_order_groups.push(new_groups);
			new_groups = [];
		}
		
		if (new_cardinality != el_data.getNum(el_row,1)){
			group_classes.push(new_order);
			groups.push(new_order_groups);
			new_cardinality = el_data.getNum(el_row,1);
			new_order = [];
			new_order_groups = [];
		}
		
		
		let row_group = [];
		for (let el_col = 0; el_col < new_cardinality; el_col++){
			row_group.push(el_data.getString(el_row,el_col+3));
		}
		new_groups.push(new Group(row_group,el_data.getString(el_row,2)));
	}
	
	
	new_order.push(new_class);
	group_classes.push(new_order);
	
	new_order_groups.push(new_groups);
	groups.push(new_order_groups);
}

function generate_group(){
	gen_rules = [];
	for (let gen_row = 1; gen_row < gen_data.getRowCount(); gen_row++){
		if (gen_data.getString(gen_row,0) == group_classes[G_order][G_class]){
			gen_rules.push([gen_data.getString(gen_row,1),gen_data.getString(gen_row,2)]);
		}
	}
	
	G_name = group_classes[G_order][G_class];
	group_from_gens();
	
}
