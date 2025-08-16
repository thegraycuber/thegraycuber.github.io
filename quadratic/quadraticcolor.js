function core_color_custom(plt){

	plt.accent.push(plt.front);
}


function colorScheme(fullness = 0){
	var grad_output = [];
	let gradSteps = [palette.mono,palette.bright,palette.red];
	var jumps = int(360/gradSteps.length);

	for (var g = 0; g < gradSteps.length; g++){
		var gn = (g + 1) % gradSteps.length;
		for (var jump = 0; jump < jumps; jump++){
			grad_output.push(lerpColor(lerpColor(gradSteps[g],gradSteps[gn],jump/jumps),palette.front,fullness));
		}

	}
	return grad_output;
}


function colorFactor(){
	var grad_output = [];
	var huenum = 7;
	var lightnum = 17;
	
	for (var gradRow = 0; gradRow < lightnum; gradRow++){
		grad_output.push([]);
		for (var gradCol = 0; gradCol < huenum; gradCol++){
			grad_output[gradRow].push(lerpColor(lerpColor(palette.mono,palette.bright,(gradCol+1)/huenum),palette.back,gradRow/lightnum));
		}
	}

	return grad_output;
}
	
