function make_polylist(type,sequence){
	
	var seq_idx = menuBox.getIndex('Sequence');
	var plus_minus = ['+','-']
	
	
	if (type == 'Sin Maclaurin'){
		polylist = [[0,1]];
		for (var sinidx = 1; sinidx < sequence/2; sinidx++){
			polylist.push([]);
			for (var sinsub = 0; sinsub < polylist[sinidx-1].length; sinsub++){
				polylist[sinidx].push(polylist[sinidx-1][sinsub]);
			}
			polylist[sinidx].push(0);
			polylist[sinidx].push(polylist[sinidx-1][polylist[sinidx-1].length-1]*-1/((sinidx*2+1)*(sinidx*2)));
		}
		
		menuBox.Items[seq_idx].List = ['x'];
		var sin_mac = 3;
		while (menuBox.Items[seq_idx].List.length < polylist.length - 1){
			menuBox.Items[seq_idx].List.push('... ' + plus_minus[int((sin_mac-1)/2)%2] + 'x' + settings.exponent[sin_mac] + '/' + str(sin_mac) + '!');
			sin_mac += 2;
		}
		menuBox.Items[seq_idx].List.push('sin(x)');
	}
	
	else if (type == 'Cos Maclaurin'){
		polylist = [[1,0,-0.5]];
		for (var cosidx = 2; cosidx < sequence/2; cosidx++){
			polylist.push([]);
			for (var cossub = 0; cossub < polylist[cosidx-2].length; cossub++){
				polylist[cosidx-1].push(polylist[cosidx-2][cossub]);
			}
			polylist[cosidx-1].push(0);
			polylist[cosidx-1].push(polylist[cosidx-2][polylist[cosidx-2].length-1]*-1/((cosidx*2)*(cosidx*2-1)));
		}
		
		menuBox.Items[seq_idx].List = [];
		var cos_mac = 2
		while (menuBox.Items[seq_idx].List.length < polylist.length-1){
			menuBox.Items[seq_idx].List.push('... ' + plus_minus[int(cos_mac/2)%2] + 'x' + settings.exponent[cos_mac] + '/' + str(cos_mac) + '!');
			cos_mac += 2;
		}
		menuBox.Items[seq_idx].List.push('cos(x)');
	}
	
	else if (type == 'Exp Maclaurin'){
		polylist = [[1,1]];
		for (var expidx = 2; expidx < sequence; expidx++){
			polylist.push([]);
			for (var expsub = 0; expsub < polylist[expidx-2].length; expsub++){
				polylist[expidx-1].push(polylist[expidx-2][expsub]);
			}
			polylist[expidx-1].push(polylist[expidx-2][polylist[expidx-2].length-1]/(expidx));
		}
		
		menuBox.Items[seq_idx].List = [];
		var exp_mac = 1
		while (menuBox.Items[seq_idx].List.length < polylist.length-1){
			menuBox.Items[seq_idx].List.push('... +x' + settings.exponent[exp_mac] + '/' + str(exp_mac) + '!');
			exp_mac += 1;
		}
		menuBox.Items[seq_idx].List.push('e^x');
	}
	/*
	else if (type == 'Maclaurin'){
		polylist = [
			[0,1,0,-1/6,0,1/120,0,-1/5040,0,1/362880,0,-1/39916800,0,1/6227020800],
			[1,0,-1/2,0,1/24,0,-1/720,0,1/40320,0,-1/3628800,0,1/479001600],
			[1,1,1/2,1/6,1/24,1/120,1/720,1/5040,1/40320,1/362880,1/3628800,1/39916800,1/479001600],
			[1,0,-1/6,0,1/120,0,-1/5040,0,1/362880,0,-1/39916800,0,1/6227020800],
			[0,1,0,1/6,0,1/120,0,1/5040,0,1/362880,0,1/39916800,0,1/6227020800],
			[1,0,1/2,0,1/24,0,1/720,0,1/40320,0,1/3628800,0,1/479001600],
			//[0,9,-6,1],
			//[0,-64,48,-12,1]
		];
		
		menuBox.Items[seq_idx].List = ['sin(x)','cos(x)','exp(x)','sinc(x)','sinh(x)','cosh(x)'];
	}*/
	
	else if (type == 'Chebyshev T'){
		polylist = [
			[1],
			[0,1],
		];
		
		for (var t_idx = 1; t_idx < 20; t_idx++){
			polylist.push([-polylist[t_idx-1][0]]);
			for (var t_sub = 0; t_sub < polylist[t_idx].length; t_sub++){
				polylist[t_idx+1].push(polylist[t_idx][t_sub]*2);
				if (t_sub + 1 < polylist[t_idx-1].length){
					polylist[t_idx+1][t_sub+1] -= polylist[t_idx-1][t_sub+1];
				}
			}
		}
		
		menuBox.Items[seq_idx].List = [];
		for (var t_add = 1; t_add <= polylist.length; t_add++){
			menuBox.Items[seq_idx].List.push('T' + settings.subscript[t_add] + '(x)');
		}
	}
	
	else if (type == 'Chebyshev U'){
		polylist = [
			[1],
			[0,2],
		];
		
		for (var u_idx = 1; u_idx < 20; u_idx++){
			polylist.push([-polylist[u_idx-1][0]]);
			for (var u_sub = 0; u_sub < polylist[u_idx].length; u_sub++){
				polylist[u_idx+1].push(polylist[u_idx][u_sub]*2);
				if (u_sub + 1 < polylist[u_idx-1].length){
					polylist[u_idx+1][u_sub+1] -= polylist[u_idx-1][u_sub+1];
				}
			}
		}
		//console.log(polylist)
		menuBox.Items[seq_idx].List = [];
		for (var u_add = 1; u_add <= polylist.length; u_add++){
			menuBox.Items[seq_idx].List.push('U' + settings.subscript[u_add] + '(x)');
		}
	}
	
	else if (type == 'Fibonacci'){
		polylist = [
			[1],
			[0,1],
		];
		
		for (var f_idx = 1; f_idx < 20; f_idx++){
			polylist.push([polylist[f_idx-1][0]]);
			for (var f_sub = 0; f_sub < polylist[f_idx].length; f_sub++){
				polylist[f_idx+1].push(polylist[f_idx][f_sub]);
				if (f_sub + 1 < polylist[f_idx-1].length){
					polylist[f_idx+1][f_sub+1] += polylist[f_idx-1][f_sub+1];
				}
			}
		}
		
		menuBox.Items[seq_idx].List = [];
		for (var f_add = 1; f_add <= polylist.length; f_add++){
			menuBox.Items[seq_idx].List.push('F' + settings.subscript[f_add] + '(x)');
		}
	}
	
	else if (type == 'Powers of x'){
		polylist = [[0,1]];
		for (var powidx = 1; powidx < sequence; powidx++){
			polylist.push([0]);
			for (var powsub = 0; powsub < polylist[powidx-1].length; powsub++){
				polylist[powidx].push(polylist[powidx-1][powsub]);
			}
		}
		
		menuBox.Items[seq_idx].List = ['x'];
		for (var x_add = 2; x_add <= polylist.length; x_add++){
			menuBox.Items[seq_idx].List.push('x' + settings.exponent[x_add]);
		}
	}
/*

	if (type == '1/1-x'){
		polylist = [[1]];
		for (var polidx = 1; polidx < sequence; polidx++){
			polylist.push([]);
			for (var polsub = 0; polsub < polylist[polidx-1].length; polsub++){
				polylist[polidx].push(polylist[polidx-1][polsub]);
			}
			polylist[polidx].push(1);
		}
	}
*/

	else if (type == 'Cyclotomics'){
		polylist = [
			[-1,1],
			[1,1],
			[1,1,1],
			[1,0,1],
			[1,1,1,1,1],
			[1,-1,1],
			[1,1,1,1,1,1,1],
			[1,0,0,0,1],
			[1,0,0,1,0,0,1],
			[1,-1,1,-1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,0,-1,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,-1,1,-1,1,-1,1],
			[1,-1,0,1,-1,1,0,-1,1],
			[1,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,-1,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,-1,0,1,0,-1,0,1],
			[1,-1,0,1,-1,0,1,0,-1,1,0,-1,1],
			[1,-1,1,-1,1,-1,1,-1,1,-1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,-1,0,0,0,1],
			[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
			[1,-1,1,-1,1,-1,1,-1,1,-1,1,-1,1],
			[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
			[1,0,-1,0,1,0,-1,0,1,0,-1,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,0,-1,-1,-1,0,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
		];
		
		menuBox.Items[seq_idx].List = [];
		for (var phi_add = 1; phi_add <= polylist.length; phi_add++){
			menuBox.Items[seq_idx].List.push('Φ' + settings.subscript[phi_add] + '(x)');
		}
	}
	
	else if (type == 'Inverse Cyclos'){
		polylist = [
			[1],
			[-1,1],
			[-1,1],
			[-1,0,1],
			[-1,1],
			[-1,-1,0,1,1],
			[-1,1],
			[-1,0,0,0,1],
			[-1,0,0,1],
			[-1,-1,0,0,0,1,1],
			[-1,1],
			[-1,0,-1,0,0,0,1,0,1],
			[-1,1],
			[-1,-1,0,0,0,0,0,1,1],
			[-1,-1,-1,0,0,1,1,1],
			[-1,0,0,0,0,0,0,0,1],
			[-1,1],
			[-1,0,0,-1,0,0,0,0,0,1,0,0,1],
			[-1,1],
			[-1,0,-1,0,0,0,0,0,0,0,1,0,1],
			[-1,-1,-1,0,0,0,0,1,1,1],
			[-1,-1,0,0,0,0,0,0,0,0,0,1,1],
			[-1,1],
			[-1,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,1],
			[-1,0,0,0,0,1],
			[-1,-1,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[-1,0,0,0,0,0,0,0,0,1],
			[-1,0,-1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
			[-1,1],
			[-1,1,-1,0,0,-1,1,-1,0,0,0,0,0,0,0,0,1,-1,1,0,0,1,-1,1],
			[-1,1],
			[-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
		];
		
		menuBox.Items[seq_idx].List = [];
		for (var phi_add = 1; phi_add <= polylist.length; phi_add++){
			menuBox.Items[seq_idx].List.push('Ψ' + settings.subscript[phi_add] + '(x)');
		}
	}
	
	else if (type == 'Custom'){
		polylist = [[0],[0]];
		menuBox.Items[seq_idx].List = ['0','0'];
	}
	
	while (polyidx >= menuBox.Items[seq_idx].List.length){
		polyidx -= 1;
		menuBox.Items[seq_idx].Index -= 1;
	}
	
	
}