
name_compress = [
	["-",";"],
	["one","1"],
	["two","2"],
	["three","3"],
	["four","4"],
	["five","5"],
	["six","6"],
	["seven","7"],
	["eight","8"],
	["nine","9"],
	["ten","T"],
	["eleven","E"],
	["twelve","W"],
	["teen","N"],
	["twenty","Y"],
	["ty","0"],
	[" hundred ","D"],
	[" thousand ","J"],
	[" million ","O"],
	[" hundred","H"],
	[" thousand","K"],
	[" million","M"],
	[" times ","*"],
	[" plus ","+"],
	[" minus ","-"],
	[" over ","/"],
	[" squared","²"],
	[" cubed","³"],
	["halves","V"],
	["thir","R"],
	["ninths","I"],
	["twelfths","L"],
	["fif","F"],
	["ths","S"],
	["0²","["],
	["1²","]"],
	["2²","{"],
	["3²","}"],
	["4²",":"],
	["5²","."],
	["6²","("],
	["7²",")"],
	["8²","&"],
	["9²","^"],
	["0³","%"],
	["1³","$"],
	["2³","#"],
	["3³","@"],
	["4³","A"],
	["5³","B"],
	["6³","C"],
	["7³","G"],
	["8³","Q"],
	["9³","X"],
]

equation_compress = [
	[" + ","+"],
	[" - ","-"],
	[" / ","/"],
	[" × ","*"],
	["000000","A"],
	["000","B"],
	["00","C"],
	["10","D"],
	["12","E"],
	["+1","a"],
	["+2","b"],
	["+3","c"],
	["+4","d"],
	["+5","e"],
	["+6","f"],
	["+8","g"],
	["+9","h"],
	["-1","i"],
	["-2","j"],
	["-3","k"],
	["-4","l"],
	["-5","m"],
	["-6","n"],
	["-8","o"],
	["-9","p"],
	["/1","q"],
	["/2","r"],
	["/3","s"],
	["/4","t"],
	["/5","u"],
	["/6","v"],
	["/8","w"],
	["/9","x"],
	[" ²","y"],
	[" ³","z"],
	["*1","F"],
	["*2","G"],
	["*3","H"],
	["*4","I"],
	["*5","J"],
	["*6","K"],
	["*7","L"],
	["*8","M"],
	["*9","N"],
	["20","O"],
	["30","P"],
	["40","Q"],
	["50","R"],
	["60","S"],
	["70","T"],
	["80","U"],
	["90","V"],
	["11","W"],
	["13","X"],
	["14","Y"],
	["15","Z"],
	["16","["],
	["17","]"],
	["18","{"],
	["19","}"],
]

function name_decompress(name_string){
	let decompressed = name_string;
	for (let n = name_compress.length-1; n > -1; n--){
		decompressed = decompressed.replaceAll(name_compress[n][1],name_compress[n][0]);
	}
	if (decompressed.length > 20){
		let d = floor(decompressed.length/2);
		let s = 1;
		while (decompressed.substring(d,d+1) != " "){
			d += s;
			s *= -1;
			s += sign(s);
		}
		decompressed = decompressed.substring(0,d) + "\n" + decompressed.substring(d+1);
		
	}
	return decompressed;
}

function equation_decompress(eq_string){
	let decompressed = eq_string;
	for (let n = equation_compress.length-1; n > -1; n--){
		decompressed = decompressed.replaceAll(equation_compress[n][1],equation_compress[n][0]);
	}
	return decompressed;
}
