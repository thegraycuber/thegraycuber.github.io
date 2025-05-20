
class Bubble {
	constructor(index, n, x, y, size) {
		this.index = index;
		this.n = n;
		this.x = x;
		this.y = y;
		this.v = [0, 0];
		this.a = [0, 0];
		this.size = size;
		this.contains = [];
		this.order = 1;
		this.representative = false;
		this.connections = 0;

		var n_factor = prime_factorization(n);
		var n_cycle = [];

		for (var n_fact of n_factor) {

			if (n_fact[0] == 2 && n_fact[1] > 2) {
				n_cycle.push([2, [n_fact[1] - 2, 1]]);
			} else if (n_fact[0] == 2 && n_fact[1] == 2) {
				n_cycle.push([2, [1]]);
			} else if (n_fact[0] != 2) {
				if (n_fact[1] > 1 && n_fact[0] != 2) {
					n_cycle.push([n_fact[0],
						[n_fact[1] - 1]
					]);
				}
			}
		}

		for (n_fact of n_factor) {

			var p = 0;
			while (primeswf[p][0] != n_fact[0]) {
				p++;
			}

			for (var p_fact of primeswf[p][1]) {
				var n_cyc = 0;
				while (n_cyc < n_cycle.length && n_cycle[n_cyc][0] != p_fact[0]) {
					n_cyc++;
				}
				if (n_cyc == n_cycle.length) {
					n_cycle.push([p_fact[0],
						[p_fact[1]]
					]);
				} else {
					var n_index = 0;
					while (n_index < n_cycle[n_cyc][1].length && n_cycle[n_cyc][1][n_index] > p_fact[1]) {
						n_index++;
					}
					n_cycle[n_cyc][1].splice(n_index, 0, p_fact[1]);

				}

			}

		}

		this.cycles = [];
		for (n_fact of n_cycle) {

			for (var n_pow = 0; n_pow < n_fact[1].length; n_pow++) {
				if (n_pow == this.cycles.length) {
					this.cycles.push(n_fact[0] ** n_fact[1][n_pow]);
				} else {
					this.cycles[n_pow] *= (n_fact[0] ** n_fact[1][n_pow]);
				}
			}
		}

		for (n_fact of this.cycles) {
			this.order *= n_fact;
		}

	}

	displayLines() {
		for (var cont of this.contains) {

			if (cont[3] == 0 || cont[0] >= main_list.length) {
				continue;
			}

			if ((!main_list[cont[0]].representative || !this.representative) && cont[2] != 1) {
				continue;
			}

			stroke(palette[0].medium);
			noFill();
			strokeWeight(px * 0.15);
			line(this.x, this.y, main_list[cont[0]].x, main_list[cont[0]].y);

		}
	}

	display() {

		noStroke();
		if (this.cycles.length == 1) {
			fill(palette[0].front);
		} else if (this.cycles.length == 2) {
			fill(palette[0].accent1);
		} else {
			fill(palette[0].accent2);
		}
		ellipse(this.x, this.y, this.size);

	}


	pull() {
		for (var cont of this.contains) {
			if (cont[3] == 0 || cont[0] >= main_list.length) {
				continue;
			}
			var pull_strength = 1 / cont[1];
			var dist_info = pointDist(this.x, this.y, main_list[cont[0]].x, main_list[cont[0]].y);
			this.a[0] += dist_info[0] * pull_strength;
			this.a[1] += dist_info[1] * pull_strength;
			main_list[cont[0]].a[0] -= dist_info[0] * pull_strength;
			main_list[cont[0]].a[1] -= dist_info[1] * pull_strength;
		}
	}

	push() {
		for (var pusher = 0; pusher < this.index; pusher++) {
			var dist_info = pointDist(this.x, this.y, main_list[pusher].x, main_list[pusher].y);
			if (dist_info[2] < px2 * 4) {
				var push_strength = min(px * 8 / dist_info[2], px * 0.4);
				this.a[0] -= dist_info[0] * push_strength;
				this.a[1] -= dist_info[1] * push_strength;
				main_list[pusher].a[0] += dist_info[0] * push_strength;
				main_list[pusher].a[1] += dist_info[1] * push_strength;
			}
		}
	}


	move() {
		this.v = [this.v[0] * 0.75 + this.a[0], this.v[1] * 0.75 + this.a[1]];
		this.x += this.v[0];
		this.y += this.v[1];
		this.a = [0, 0];
	}


	checkRep() {
		this.representative = true;
		for (var cont of this.contains) {
			if (cont[2] == 1) {
				this.representative = false;
				break;
			}
		}
	}

}

function pointDist(x1, y1, x2, y2) {
	var dist_mag = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
	return ([(x2 - x1) / dist_mag, (y2 - y1) / dist_mag, max(dist_mag ** 2 / px, 1)]);
}



function findContainers(new_idx) {
	for (var bub = 0; bub < new_idx; bub++) {
		var a = new_idx;
		var b = bub;
		if (main_list[bub].order > main_list[new_idx].order || (main_list[bub].order == main_list[new_idx].order && main_list[bub].cycles.length > main_list[new_idx].cycles.length)) {
			a = bub;
			b = new_idx;
		}

		if (main_list[a].order % main_list[b].order != 0 || main_list[a].cycles.length < main_list[b].cycles.length) {
			continue;
		}

		var is_subgroup = true;
		//console.log(new_idx,bub,a,b);
		for (var bub_cyc = 0; bub_cyc < main_list[a].cycles.length; bub_cyc++) {
			if (bub_cyc == main_list[b].cycles.length) {
				break;
			}
			if (main_list[a].cycles[bub_cyc] % main_list[b].cycles[bub_cyc] != 0) {
				is_subgroup = false;
			}
		}

		if (is_subgroup) {
			var ord = int(main_list[a].order / main_list[b].order);
			var ord_p = 0;
			while (ord % primeswf[ord_p][0] != 0 && ord != 1) {
				ord_p++;
			}
			var mark = 1;
			if (ord == primeswf[ord_p][0] || ord == 1) {
				mark = 2;
			}

			main_list[a].contains.push([b, (log(main_list[a].order / main_list[b].order) + 1) ** 3 * px * 0.006, ord, mark]);
			main_list[a].connections++;
			main_list[b].connections++;
		}
	}

}


function unitsDraw() {
	
	/*
	if (ticker > 3 && ticker < 23 && unit_mod == 0) {
		main_list.push(new Bubble(main_list.length, main_list.length + 3, (random() * 0.9 + 0.05) * width, (random() * 0.9 + 0.05) * height, px*1.25));
		findContainers(main_list.length - 1);
		main_list[main_list.length - 1].checkRep();
		if (main_list.length > 1) {
			findContainers(main_list.length - 1);
		}
	} else if (ticker > 23 && ticker < 27) {
		if (main_list.length > 0) {
			main_list.splice(main_list.length - 1, 1);
		}
	}
	*/
	if (main_list.length**2 < ticker*30-10) {
		main_list.push(new Bubble(main_list.length, main_list.length + 3, random(-0.4,0.4) * width, random(-0.4,0.4) * height, px*1.25));
		findContainers(main_list.length - 1);
		main_list[main_list.length - 1].checkRep();
		if (main_list.length > 1) {
			findContainers(main_list.length - 1);
		}
	} 

	for (var bubby of main_list) {
		bubby.pull();
		bubby.push();
	}
	translate(0, 0, -2);
	for (bubby of main_list) {
		bubby.move();
		bubby.displayLines();
	}
	translate(0, 0, 2);
	for (bubby of main_list) {
		bubby.display();
	}
}