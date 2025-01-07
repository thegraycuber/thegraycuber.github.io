var infoText = [
	["You can often find me with Hayley,",
"my fiancée, watching thrillers, playing",
"Overcooked and Star Realms, shopping",
"at vintage stores and eating vegan food."],
["Two of my roommates are cats!",
"Tog can be shy, but will meow back",
"if you talk to him. Poe is more",
"friendly and loves head scratches."],
["Why do I go by the TheGrayCuber?",
"My last name is Gray, and I originally",
"made videos about Rubik's cubes.",
"My favorite is the megaminx!"],
["Ik hou niet alleen van wiskunde!",
"I love learning other languages.",
"I'm pretty good with Dutch, and",
"working on Russian and Afrikaans."],
["My logo is a representation of",
"the 15th cyclotomic polynomial.",
"Why 15? It's the first interesting case,",
"being the product of two odd primes."],
["Really? The light color scheme?",
"I mean, I added it here to cover",
"my bases, but I didn't expect",
"anyone to actually select it."]
];
var info_rand = [];
var info_text_len = 45;

function clean_info(){
	for (var message = 0; message < infoText.length; message++){
		for (var line = 0; line < infoText[message].length; line++){
			while (infoText[message][line].length < 40){
				infoText[message][line] = infoText[message][line] + " ";
				if (infoText[message][line].length < 40){
					infoText[message][line] = " " + infoText[message][line];
				}
			}
		}
	}
	
	for (var t = 0; t < infoText[0].length; t++){
		textValues[4+t] = infoText[2][t];
		info_rand.push([]);
		for (var char = 0; char < 40; char++){
			info_rand[t].push(random()*PI);
		}
	}
	
}

function update_info(random_limit){
	
	for (var t = 0; t < infoText[0].length; t++){
		for (var char = 0; char < 40; char++){
			if (info_rand[t][char] < random_limit){
				info_rand[t][char] = 20;
				textValues[4+t] =  textValues[4+t].substring(0,char) + infoText[new_color-1][t].substring(char,char+1) + textValues[4+t].substring(char+1,textValues[4+t].length);
			}
		}
	}
	
}