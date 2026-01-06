import math

one_names = [
    [["nul", 1], ["0", 0]],
    [["een", 1], ["eerst", 1]],
    [["twee", 1], ["tweede", 2]],
    [["drie", 1], ["derde", 2]],
    [["vier", 1], ["vierde", 2]],
    [["vijf", 1], ["vijfde", 2]],
    [["zes", 1], ["zesde", 2]],
    [["zeven", 2], ["zevende", 3]],
    [["acht", 1], ["achtste", 2]],
    [["negen", 2], ["negende", 3]],
    [["tien", 1], ["tiende", 2]],
    [["elf", 1], ["elfde", 2]],
    [["twaalf", 1], ["twaalfde", 2]],
    [["dertien", 2], ["dertiende", 3]],
    [["veertien", 2], ["veertiende", 3]],
    [["vijftien", 2], ["vijftiende", 3]],
    [["zestien", 2], ["zestiende", 3]],
    [["zeventien", 3], ["zeventiende", 4]],
    [["achttien", 2], ["achttiende", 3]],
    [["negentien", 3], ["negentiende", 4]],
]

ten_names = [
    [[]],
    [[]],
    [["twintig", 2], ["twintigste", 3]],
    [["dertig", 2], ["dertigste", 3]],
    [["veertig", 2], ["veertigste", 3]],
    [["vijftig", 2], ["vijftigste", 3]],
    [["zestig", 2], ["zestigste", 3]],
    [["zeventig", 3], ["zeventigste", 4]],
    [["tachtig", 2], ["tachtigste", 3]],
    [["negentig", 3], ["negentigste", 4]],
]

large_names = [
    ["honderd",2,100,2],
    ["duizend",2,1000,3],
    ["miljoen",2,1000000,6],
    ["biljoen",2,1000000000,9],
]

superscripts = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹',
                '¹⁰','¹¹','¹²','¹³','¹⁴','¹⁵','¹⁶','¹⁷','¹⁸','¹⁹',
                '²⁰','²¹','²²','²³']

number_names = []
pemdas_count = 6


def base_syllables(n):
    if n < 20:
        return one_names[n][0][1], one_names[n][0][0], one_names[n][1][1], one_names[n][1][0], 0, 1
    elif n < 100:
        n_mod = n % 10
        n_div = n // 10
        if n % 10 == 0: 
            return ten_names[n_div][0][1], ten_names[n_div][0][0], ten_names[n_div][1][1], ten_names[n_div][1][0], 1, 2

        en_version = "en"
        if n_mod == 2 or n_mod == 3:
            en_version = "ën"
        return (
                number_names[n_mod]["syllables"][1] + 1 + ten_names[n_div][0][1], 
                number_names[n_mod]["names"][1] + en_version + ten_names[n_div][0][0],
                number_names[n_mod]["syllables"][1] + 1 + ten_names[n_div][1][1], 
                number_names[n_mod]["names"][1] + en_version + ten_names[n_div][1][0],
                0,
                2
            )
    
    large_index = 0
    while (large_names[large_index+1][2] <= n):
        large_index += 1

    n_mod = n % large_names[large_index][2]
    n_div = n // large_names[large_index][2]

    prefix_name, prefix_syllables = number_names[n_div]["names"][1], number_names[n_div]["syllables"][1]
    if n_div == 1 and large_index < 2:
        prefix_name, prefix_syllables = "", 0
    elif n_div > 99 or large_index > 1:
        prefix_name += " "

    if n_mod == 0:
        return (
            prefix_syllables + large_names[large_index][1],
            prefix_name + large_names[large_index][0],
            prefix_syllables + large_names[large_index][1] + 1,
            prefix_name + large_names[large_index][0] + "sten",
            large_names[large_index][3] + number_names[n_div]["zeroes"],
            large_names[large_index][3] + number_names[n_div]["digits"]
        )
    
    
    connect_word, connect_syllables = "", 0
    if large_index > 0:
        connect_word = " "

    return (
        prefix_syllables + large_names[large_index][1] + connect_syllables + number_names[n_mod]["syllables"][1],
        prefix_name + large_names[large_index][0] + connect_word + number_names[n_mod]["names"][1],
        prefix_syllables + large_names[large_index][1] + connect_syllables + number_names[n_mod]["syllables"][0],
        prefix_name + large_names[large_index][0] + connect_word + number_names[n_mod]["names"][0],
        number_names[n_mod]["zeroes"],
        large_names[large_index][3] + number_names[n_div]["digits"]
    )
    



def number_names_generator(leave_point,max_number):
    max_syllables = 0

    for n in range(0,max_number + 1):
        n_syllables, n_name, frac_syllables, frac_name, zeroes, digits = base_syllables(n)
        adj_zeroes = zeroes
        if zeroes > 3:
            adj_zeroes = (zeroes // 3)*3

        
        number_names.append(
            {
                "value": n,
                "syllables": [frac_syllables] + [n_syllables]*(pemdas_count-1),
                "names": [frac_name] + [n_name]*(pemdas_count-1),
                "equations": [str(n)]*pemdas_count,
                "original": n_syllables,
                "zeroes": adj_zeroes,
                "digits": digits,
                "nonzero": digits-zeroes,
                "auto pass": (n%100 < 20 and n%100 > 0) or zeroes < 1 or digits < 3,
            }
        )
        max_syllables = max(max_syllables, n_syllables)


    number_names[2]["syllables"][0] = 2
    number_names[2]["names"][0] = "helften"

    syllable_key = [[]]
    for u in range(pemdas_count):
        syllable_key[0].append([])

    # pemdas: ordinal, original, unary, multiplication, division, addition and subtraction
    unary = [
        {"id": "²", "syllables": 2, "text": " kwadraat", "value": 2, "pemdas_input": 2,"pemdas_result": 2},
    ]
    
    binary = [
        { "id": "-", "syllables": 1, "text": " min ", "suffix": "", "pemdas_left": 5,"pemdas_right": 4,"pemdas_result": 5},
        { "id": "+", "syllables": 1, "text": " plus ", "suffix": "", "pemdas_left": 5,"pemdas_right": 5,"pemdas_result": 5},
        { "id": "*", "syllables": 1, "text": " keer ", "suffix": "", "pemdas_left": 3,"pemdas_right": 4,"pemdas_result": 4},
        { "id": "*", "syllables": 1, "text": " keer ", "suffix": "", "pemdas_left": 3,"pemdas_right": 3,"pemdas_result": 3},
        { "id": "/", "syllables": 2, "text": " over ", "suffix": "", "pemdas_left": 3,"pemdas_right": 2,"pemdas_result": 4},
        { "id": "fraction", "syllables": 0, "text": " ", "suffix": "", "pemdas_left": 2,"pemdas_right": 0,"pemdas_result": 2},
        { "id": "^", "syllables": 2, "text": " tot de ", "suffix": "","pemdas_left": 2, "pemdas_right": 0,"pemdas_result": 2},
    ]

    min_missing = 1
    for s in range(1, max_syllables + 1):
        print("searching", s, "syllables, at",min_missing)

        syllable_key.append([])
        for u in range(pemdas_count):
            syllable_key[s].append([])
            
        for n in range(1,max_number+1):
            for u in range(pemdas_count):
                if number_names[n]["syllables"][u] < s:
                    break
                if number_names[n]["syllables"][u] == s:
                    syllable_key[s][u].append(number_names[n]["value"])
                elif u > 0:
                    break



        for op in binary:
            print(op)

            min_left, max_left = get_first_extremes(op, min_missing, max_number)
            for left_syllables in range(s - op["syllables"]):
                for left_value in syllable_key[left_syllables][op["pemdas_left"]]:
                    if left_value < min_left:
                        continue
                    if left_value > max_left:
                        break

                    min_right, max_right = get_second_extremes(op, min_missing, max_number, left_value)

                    for right_value in syllable_key[s - op["syllables"] - left_syllables][op["pemdas_right"]]:
                        if right_value < min_right:
                            continue
                        if right_value > max_right:
                            break
                        if (op["id"] == "fraction"
                            and not number_names[left_value]["auto pass"]
                            and right_value != 2
                            and number_names[left_value]["zeroes"] >= number_names[right_value]["digits"]
                            and (number_names[left_value]["nonzero"] > 1 or number_names[right_value]["nonzero"] > 1)
                            and number_names[left_value]["names"][0] == number_names[left_value]["names"][1]):
                            continue

                        op_output, valid_output = get_output(op, left_value, right_value)
                        if not valid_output:
                            continue
                        
                        new_name = (number_names[left_value]["names"][op["pemdas_left"]] 
                                    + op["text"] 
                                    + number_names[right_value]["names"][op["pemdas_right"]]
                                    + op["suffix"])
                        
                        new_equation = number_names[left_value]["equations"][op["pemdas_left"]] 
                        if op["id"] == "^" and new_equation == number_names[left_value]["equations"][1]:
                            new_equation = new_equation + " " + superscripts[right_value]
                        elif op["id"] == "^":
                            new_equation = "(" + new_equation + ") " + superscripts[right_value]
                        else:
                            if op["id"] == "fraction":
                                new_equation += "/"
                            else:
                                new_equation +=  op["id"]
                            new_equation += number_names[right_value]["equations"][op["pemdas_right"]]

                        for u in range(op["pemdas_result"],pemdas_count):

                            if number_names[op_output]["syllables"][u] >= s:
                                number_names[op_output]["names"][u] = new_name
                                number_names[op_output]["equations"][u] = new_equation

                                if number_names[op_output]["syllables"][u] > s:
                                    number_names[op_output]["syllables"][u] = s
                                    syllable_key[s][u].append(op_output)

        

        for op in unary:
            print(op)
            if s <= op["syllables"]:
                continue

            min_value, max_value = get_first_extremes(op, min_missing, max_number)
            for input_value in syllable_key[s - op["syllables"]][op["pemdas_input"]]:
                if input_value < min_value:
                    continue
                if input_value > max_value:
                    break

                op_output, valid_output = get_output(op, input_value)
                if not valid_output:
                    continue

                new_name = number_names[input_value]["names"][op["pemdas_input"]] + op["text"]
                new_equation = number_names[input_value]["equations"][op["pemdas_input"]]
                if new_equation == number_names[input_value]["equations"][1]:
                    new_equation = new_equation + " " + op["id"]
                else:
                    new_equation = "(" + new_equation + ") " + op["id"]
                for u in range(op["pemdas_result"],pemdas_count):
                    if number_names[op_output]["syllables"][u] >= s:
                        number_names[op_output]["names"][u] = new_name
                        number_names[op_output]["equations"][u] = new_equation

                        if number_names[op_output]["syllables"][u] > s:
                            number_names[op_output]["syllables"][u] = s
                            syllable_key[s][u].append(op_output)


        for i in range(pemdas_count):
            syllable_key[s][i].sort()
        while number_names[min_missing]["syllables"][-1] <= s:
            min_missing += 1
            if min_missing > leave_point:
                    break
        if min_missing > leave_point:
                break

    return number_names[0:leave_point+1]

def get_first_extremes(op,min_missing,max_number):
    if op["id"] == "²":
        return min_missing**(1/2), max_number**(1/2)
    elif op["id"] == "+":
        return 6, max_number-1
    elif op["id"] == "*":
        return 2, max_number**0.5
    elif op["id"] == "-":
        return min_missing+1, max_number
    elif op["id"] == "/" or op["id"] == "fraction":
        return min_missing*2, max_number
    elif op["id"] == "^":
        return 2, max_number**0.34
    
def get_second_extremes(op,min_missing,max_number,left_value):
    if op["id"] == "+":
        return 1, min(left_value,max_number - left_value)
    elif op["id"] == "*":
        return max(left_value,min_missing/left_value), max_number/left_value
    elif op["id"] == "-":
        return 1, left_value-min_missing
    elif op["id"] == "/" or op["id"] == "fraction":
        return 2, left_value/2
    elif op["id"] == "^":
        return 3, math.log(max_number)/math.log(left_value)
    
def get_output(op,left_value,right_value=0):
    if op["id"] == "²":
        return left_value**2, True
    elif op["id"] == "^":
        return left_value**right_value, True
    elif op["id"] == "+":
        return left_value + right_value, True
    elif op["id"] == "*":
        return left_value * right_value, True
    elif op["id"] == "-":
        return left_value - right_value, True
    elif op["id"] == "/" or op["id"] == "fraction":
        if left_value % right_value == 0:
            return left_value // right_value, True
        return 0, False

def numbers_out(number_names, file_name):
    with open(file_name,"w",encoding="utf-8") as f:
        for l in number_names:
           f.write(name_clean(l["names"][-1]) + "," + equation_clean(l["equations"][-1]) + "\n")


name_cleans = [
    ["~",""],
    ["een","1"],
    ["twee","2"],
    ["drie","3"],
    ["vier","4"],
    ["veer","$"],
    ["vijf","5"],
    ["zes","6"],
    ["zeven","7"],
    ["acht","8"],
    ["negen","9"],
    ["tien","T"],
    ["elf","E"],
    ["twaalf","W"],
    ["twin","Y"],
    ["tig","0"],
    [" keer ","*"],
    [" plus ","+"],
    [" min ","-"],
    [" over ","/"],
    [" kwadraat","²"],
    ["honderd","H"],
    ["duizend ","A"],
    ["miljoen ","B"],
    ["duizend","D"],
    ["miljoen","M"],
    ["helften","V"],
    [" tot de ","Z"],
    ["de","R"],
    ["sten","I"],
    ["ste","L"],
    ["en","K"],
    ["ën","J"],
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
    ["2H","#"],
    ["3H","@"],
    ["4H","%"],
    ["5H","|"],
    ["6H","C"],
    ["7H","G"],
    ["8H","Q"],
    ["9H","X"],
]
def name_clean(name_string):
    for nc in name_cleans:
        name_string = name_string.replace(nc[0],nc[1])
    return name_string

equation_cleans = [
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
    [" ²","y"],
    [" ³","z"],
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


def equation_clean(eq_string):
    for ec in equation_cleans:
        eq_string = eq_string.replace(ec[0],ec[1])
    return eq_string

eff_names = number_names_generator(1000000,10000000)
numbers_out(eff_names, 'fastest_numbers002_nl.csv')

