var palette;
var palette_names = ['Forest','Sunset','Dark','Autumn','Paper','Pastel','Electric'];
var palette_index = 0;
class Palette {
	constructor(scheme) {
		this.scheme = scheme;
		
		this.rev = 1;
		if (scheme == 'Electric'){
			this.front = color('#bbdbf3');
			this.back = color('#110a5d');
			this.backlight = color('#273f8a');
			this.bright = color('#d7f75b');
			this.red = color('#e185dc');
			this.mono = color('#23d2e8');
			this.gray = color('#a0b9d4');
			
		} else if (scheme == 'Sunset'){
			this.front = color('#dcd8f1');
			this.back = color('#2b1752');
			this.backlight = color('#53407e');
			this.red = color('#e5686e');
			this.bright = color('#f2c76f');
			this.mono = color('#bc7ff5');
			this.gray = color('#8c849e');
		
		} else if (scheme == 'Forest'){
			this.front = color('#d6ddcb');
			this.back = color('#063a2a');
			this.backlight = color('#16553f');
			this.mono = color('#3fbd75');
			this.red = color('#ee8060');
			this.bright = color('#d8b801');
			this.gray = color('#adb2ad');
			
		} else if (scheme == 'Autumn'){
			this.front = color('#ffe5b5');
			this.back = color('#482a1d');
			this.backlight = color('#6e4122');
			this.mono = color('#fe8241');
			this.bright = color('#faca30');
			this.red = color('#d94242');
			this.gray = color('#999170');
			
		} else if (scheme == 'Dark'){
			this.front = color('#c8caf4');
			this.back = color('#20213f');
			this.backlight = color('#373861');
			this.mono = color('#8498ef');
			this.red = color('#f168a0');
			this.bright = color('#2cda9d');
			this.gray = color('#afb4c9');
			
		} else if (scheme == 'Pastel'){
			this.front = color('#5b2a7d');
			this.back = color('#cbc1e9');
			this.backlight = color('#b6a5db');
			this.mono = color('#9a63d9');
			this.red = color('#c353a0');
			this.bright = color('#5184d2');
			this.gray = color('#8c8eb4');
			this.rev = -1;
			
		} else if (scheme == 'Paper'){
			this.front = color('#663F00');
			this.back = color('#e9d8c6');
			this.backlight = color('#ddc3a8');
			this.mono = color('#bf7853');
			this.red = color('#ad588b');
			this.bright = color('#829651');
			this.gray = color('#9b928a');
			this.rev = -1;
			
		}
		
		this.accent = [ this.bright,
										this.mono,
									 	this.red
									];
		
		if (typeof core_color_custom === 'function'){
			core_color_custom(this);
		}

	}
}