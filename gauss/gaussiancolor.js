function colorScheme(schemeId){
	var color_output = [];
	var c;
	
	if (schemeId == 'Rainbow'){
		for (c = 0; c < 360; c++){
			color_output.push([c,60,60]);
		}
	} else if (schemeId == 'Fire'){color_output = gradient([[0,70,50],[60,80,60]],2);
	} else if (schemeId == 'Ice'){color_output = gradient([[200,60,60],[210,30,70],[230,70,70]],2);
	} else if (schemeId == 'Sunset'){ color_output = gradient([[50,75,75],[10,85,75],[350,80,70],[330,50,60],[280,40,55],[250,40,55],[280,40,55],[330,50,60],[350,80,70],[10,85,75]],1);
	} else if (schemeId == 'Pastel'){color_output = gradient([[0,70,85],[50,85,85],[150,85,85],[205,85,80],[270,85,85]],1);
	} else if (schemeId == 'Cotton Candy'){ color_output = gradient([[190,50,70],[190,50,70],[265,35,80],[320,40,70],[320,40,70],[265,35,80]],2);
	} else if (schemeId == 'Dark Mode'){ color_output = gradient([[210,30,40],[255,25,40]],2);
	} else if (schemeId == 'Forest'){ color_output = gradient([[130,45,35],[90,70,40],[130,50,35],[80,45,35],[130,45,30],[150,35,50]],1);
	
	}
	
	return color_output;
}

function gradient(gradSteps,repeats){
	var grad_output = [];
	var start_len = gradSteps.length;
	for (var rep = 1; rep < repeats; rep++){
		for (var step = 0; step < start_len; step++){
			gradSteps.push(gradSteps[step]);
		}
	}
	var jumps = int(360/gradSteps.length);

	for (var g = 0; g < gradSteps.length; g++){
		var gn = (g + 1) % gradSteps.length;
		var glig = gradSteps[g][2] ** 2;
		var gnlig = gradSteps[gn][2] ** 2;
		var ghue = gradSteps[g][0];
		if (ghue + 360 - gradSteps[gn][0] < gradSteps[gn][0] - ghue){
			ghue += 360
		} else if (ghue - gradSteps[gn][0] > gradSteps[gn][0] - ghue + 360){
			ghue -= 360
		} 
		for (var jump = 0; jump < jumps; jump++){
			var jump2 = jump ** 1.5;
			var jinv2 = (jumps - jump) ** 1.5;
			var jump_hue = int(360+(ghue*jinv2+gradSteps[gn][0]*jump2)/(jump2+jinv2))%360;
			var jump_sat = int((gradSteps[g][1]*jinv2+gradSteps[gn][1]*jump2)/(jump2+jinv2));
			var jump_lig = int(((glig*jinv2+gnlig*jump2)/(jump2+jinv2))**0.5);
			grad_output.push([jump_hue,jump_sat,jump_lig]);
			
		}
	}
	return grad_output;
}