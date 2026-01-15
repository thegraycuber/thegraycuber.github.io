import math


one_names = [
    [["nought", 1], ["", 0], ["", 0]],
    [["one", 1], ["first", 1], ["one", 1]],
    [["two", 1, 1], ["second", 2], ["two", 1]],
    [["three", 1], ["third", 1],["three", 1]],
    [["four", 1], ["fourth", 1],["four", 1]],
    [["five", 1], ["fifth", 1],["five", 1]],
    [["six", 1], ["sixth", 1],["sixe", 2]],
    [["sven", 1], ["sventh", 1],["sven", 1]],
    # [["seven", 2], ["seventh", 2],["seven", 2]],
    [["eight", 1], ["eighth", 1],["eight", 1]],
    [["nine", 1], ["ninth", 1],["nine", 1]],
    [["ten", 1], ["tenth", 1],["ten", 1]],
    [["elf", 1], ["elfth", 1],["elve", 1]],
    # [["eleven", 3], ["eleventh", 3],["eleven", 3]],
    [["twelve", 1], ["twelfth", 1],["twelve", 1]],
    [["thirteen", 2], ["thirteenth", 2],["thirteen", 2]],
    [["fourteen", 2], ["fourteenth", 2],["fourteen", 2]],
    [["fifteen", 2], ["fifteenth", 2],["fifteen", 2]],
    [["sixteen", 2], ["sixteenth", 2],["sixteen", 2]],
    # [["seventeen", 3], ["seventeenth", 3],["seventeen", 3]],
    [["sventeen", 2], ["sventeenth", 2],["sventeen", 2]],
    [["eighteen", 2], ["eighteenth", 2],["eighteen", 2]],
    [["nineteen", 2], ["nineteenth", 2],["nineteen", 2]],
]

ten_names = [
    [[]],
    [[]],
    [["twenty", 2], ["twentieth", 3],["twentie", 2]],
    [["thirty", 2], ["thirtieth", 3],["thirtie", 2]],
    [["forty", 2], ["fortieth", 3],["fortie", 2]],
    [["fifty", 2], ["fiftieth", 3],["fiftie", 2]],
    [["sixty", 2], ["sixtieth", 3],["sixtie", 2]],
    # [["seventy", 3], ["seventieth", 4],["seventie", 3]],
    [["sventy", 2], ["sventieth", 3],["sventie", 2]],
    [["eighty", 2], ["eightieth", 3],["eightie", 2]],
    [["ninety", 2], ["ninetieth", 3],["ninetie", 2]],
]

large_names = [
    ["hundred",2,100,2,"hundredth",2],
    ["thou",1,1000,3,"thousandth",2],
    ["mil",1,1000000,6,"millionth",2],
    ["bil",1,1000000000,9,"billionth",2],
    # ["tril",1,1,12],
    # ["quadril",2,1,15],
    # ["quintil",2,1,18],
    # ["sextil",2,1,21],
    # ["septil",2,1,24],
    # ["octil",2,1,27],
    # ["nonil",2,1,30],
    # ["decil",2,1,33],
    # ["undecil",3,1,36],
    # ["duodecil",4,1,39],
    # ["tredecil",3,1,42],
    # ["quattuordecil",4,1,45],
    # ["quindecil",3,1,48],
    # ["sexdecil",3,1,51],
    # ["septendecil",4,1,54],
    # ["octodecil",4,1,57],
    # ["novemdecil",4,1,60],
    # ["vigintil",3,1,63],
]

number_names = []
huge_numbers = []

# huge_ops = [
#     { "name": "root", "syllables": 1, "factor": 2},
#     { "name": "cube root", "syllables": 2, "factor": 3},
# ]


pemdas_count = 6


def base_syllables(n):
    if n < 20:
        return one_names[n][0][1], one_names[n][0][0], one_names[n][1][1], one_names[n][1][0]
    elif n < 100:
        n_mod = n % 10
        n_div = n // 10
        if n % 10 == 0: 
            return ten_names[n_div][0][1], ten_names[n_div][0][0], ten_names[n_div][1][1], ten_names[n_div][1][0]

        return (
                ten_names[n_div][0][1] + number_names[n_mod]["syllables"][1], 
                ten_names[n_div][0][0] + "-" + number_names[n_mod]["names"][1],
                ten_names[n_div][0][1] + number_names[n_mod]["syllables"][0], 
                ten_names[n_div][0][0] + "-" + number_names[n_mod]["names"][0]
            )
    else: 
        large_index = 0
        while (large_names[large_index+1][2] <= n):
            large_index += 1

        n_mod = n % large_names[large_index][2]
        n_div = n // large_names[large_index][2]

        n_div_name = number_names[n_div]["names"][1] + " " if n_div != 1 else "a "
        n_div_ord = number_names[n_div]["names"][1] + " " if n_div != 1 else ""
        n_div_ord_syllables = number_names[n_div]["syllables"][1] if n_div != 1 else 0

        if n_mod == 0:
            return (
                number_names[n_div]["syllables"][1] + large_names[large_index][1],
                n_div_name + large_names[large_index][0],
                n_div_ord_syllables + large_names[large_index][5],
                n_div_ord + large_names[large_index][4]
            )
        
        connect_word, connect_syllables = " ", 0

        return (
            number_names[n_div]["syllables"][1] + large_names[large_index][1] + connect_syllables + number_names[n_mod]["syllables"][1],
            n_div_name + large_names[large_index][0] + connect_word + number_names[n_mod]["names"][1],
            number_names[n_div]["syllables"][1] + large_names[large_index][1] + connect_syllables + number_names[n_mod]["syllables"][0],
            number_names[n_div]["names"][1] + " " + large_names[large_index][0] + connect_word + number_names[n_mod]["names"][0]
        )
    
def unary_name(u,n):
    if u == 1 and n == 2:
        return 1, "halve"
    if n < 20:
        return one_names[n][u][1], one_names[n][u][0]
    elif n < 100:
        n_div = n // 10
        if n % 10 == 0: 
            return ten_names[n_div][u][1], ten_names[n_div][u][0]

        mod_syllables, mod_name = unary_name(u,n%10)
        return ten_names[n_div][0][1] + mod_syllables, ten_names[n_div][0][0] + "-" + mod_name


def number_names_generator(leave_point,max_number):
    max_syllables = 0

    for n in range(0,max_number + 1):
        n_syllables, n_name, frac_syllables, frac_name = base_syllables(n)

        
        number_names.append(
            {
                "value": n,
                "syllables": [frac_syllables] + [n_syllables]*(pemdas_count-1),
                "names": [frac_name] + [n_name]*(pemdas_count-1),
                "equations": [str(n)]*pemdas_count,
                "original": n_syllables,
                "level_out": [4]*pemdas_count,
            }
        )
        max_syllables = max(max_syllables, n_syllables)
    
    u_types = [0,["nths"," / "],["ns"," * "]]
    for x in range(99,1,-1):
        for u in range(1,3):
            u_syllables, u_name = unary_name(u,x)
            unary.insert(0,{
                "id": u_types[u][0], 
                "syllables": u_syllables,
                "text": " " + u_name + "s", 
                "equation": u_types[u][1] + str(x), 
                "pemdas_left": 2,
                "pemdas_result": 2,
                "value": x,
                "level_in": 0,
                "level_out": 1
            })

    # for x in range(4,21):
    #     huge_ops.append({ "name": number_names[x]["names"][0] + " root", "syllables": number_names[x]["syllables"][0] + 1, "factor": x})
    

    # log_10 = math.log(10)
    # for x in range(11):
    #     huge_numbers.append([])
    # for l in range(2,len(large_names)):

    #     for s in range(1,1000):
    #         huge_syllables = large_names[l][1] + number_names[s]["syllables"][1]
    #         if huge_syllables > 10:
    #             continue

    #         huge_numbers[huge_syllables].append({
    #             "name": number_names[s]["names"][1] + " " + large_names[l][0],
    #             "log": math.log(s) + log_10*large_names[l][3],
    #             "equation": str(s) + "E" + str(large_names[l][3]),
    #         })

    sub_units = [["hundred",100,2],["lakh",100000,1]]
    for u in sub_units:
        for left_2 in range(1,int(min(100,max_number/u[1]))):
            for right_2 in range(u[1]):
                new_syllables = number_names[left_2]["syllables"][1] + u[2] + number_names[right_2]["syllables"][1]
                new_value = left_2*u[1] + right_2

                if new_syllables <= number_names[new_value]["syllables"][1]:   
                    new_name = number_names[left_2]["names"][1] + " " + u[0]
                    new_ord_name = new_name
                    new_ord_syllables = number_names[left_2]["syllables"][1] + u[2]

                    if right_2 > 0:
                        new_name += " " + number_names[right_2]["names"][1]
                        new_ord_name += " " + number_names[right_2]["names"][0]
                        new_ord_syllables += number_names[right_2]["syllables"][0]
                    else:
                        new_ord_name += "th"

                    number_names[new_value]["syllables"] = [new_ord_syllables] + [new_syllables]*(pemdas_count-1)
                    number_names[new_value]["names"] = [new_ord_name] + [new_name]*(pemdas_count-1)
                    number_names[new_value]["original"] = new_syllables


    for rep in replacements:
        if rep["value"] <= max_number:
            number_names[rep["value"]]["syllables"] = [rep["ord_syllables"]] + [rep["syllables"]]*(pemdas_count-1)
            number_names[rep["value"]]["names"] = [rep["ord_name"]] + [rep["name"]]*(pemdas_count-1)
            number_names[rep["value"]]["equations"] = [rep["ord_equation"]] + [rep["equation"]]*(pemdas_count-1)
            number_names[rep["value"]]["original"] = rep["syllables"]

    # for n in range(2,100):
    #     root_n = n**0.5
    #     if round(root_n,5) != round(root_n,0):
    #         for a in adjust_types:
    #             unary.append({
    #                 "id": "adj_irrational", 
    #                 "syllables": number_names[n]["syllables"][1] + 1 + a["syllables"],
    #                 "adjust_type": a["type"],
    #                 "text": " root " + number_names[n]["names"][1],
    #                 "equation": "√" + number_names[n]["equations"][1],
    #                 "value": root_n,
    #                 "pemdas_left": 1,
    #                 "pemdas_result": 4
    #             })

    # number_names[2]["syllables"][0] = 1
    # number_names[2]["names"][0] = "halve"

    syllable_key = [[]]
    for u in range(pemdas_count):
        syllable_key[0].append([])

    min_missing = 1
    base_power = 1/math.ceil(math.log(max_number-1)/math.log(10))
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

        for op in unary:
            #print(op)
            if s <= op["syllables"]:
                continue

            min_value, max_value = get_first_extremes(op, min_missing, max_number)
            for input_value in syllable_key[s - op["syllables"]][op["pemdas_left"]]:
                if input_value < min_value:
                    continue
                if input_value > max_value:
                    break

                op_output, valid_output = get_output(op, max_number, input_value)
                if not valid_output:
                    continue

                new_name = get_name(op, input_value)
                new_equation = get_equation(op, input_value)

                for u in range(op["pemdas_result"],pemdas_count):
                    if number_names[op_output]["syllables"][u] >= s:
                        number_names[op_output]["names"][u] = new_name
                        number_names[op_output]["equations"][u] = new_equation
                        number_names[op_output]["level_out"][u] = op["level_out"]

                        if number_names[op_output]["syllables"][u] > s:
                            number_names[op_output]["syllables"][u] = s
                            syllable_key[s][u].append(op_output)
                
        

        for op in binary:
            print(op)

            min_left, max_left = get_first_extremes(op, min_missing, max_number)
            for left_syllables in range(s - op["syllables"]):
                for left_value in syllable_key[left_syllables][op["pemdas_left"]]:
                    if left_value < min_left:
                        continue
                    if left_value > max_left:
                        break

                    min_right, max_right = get_second_extremes(op, min_missing, max_number, base_power, left_value)

                    for right_value in syllable_key[s - op["syllables"] - left_syllables][op["pemdas_right"]]:
                        if right_value < min_right:
                            continue
                        if right_value > max_right:
                            break


                        op_output, valid_output = get_output(op, max_number, left_value, right_value)
                        if not valid_output:
                            continue
                        if op["id"] == "C" and op_output > max_number:
                            break
                        
                        new_name = get_name(op, left_value, right_value)
                        new_equation = get_equation(op, left_value, right_value)
                        
                        
                        for u in range(op["pemdas_result"],pemdas_count):

                            if number_names[op_output]["syllables"][u] >= s:
                                number_names[op_output]["names"][u] = new_name
                                number_names[op_output]["equations"][u] = new_equation
                                number_names[op_output]["level_out"][u] = op["level_out"]

                                if number_names[op_output]["syllables"][u] > s:
                                    number_names[op_output]["syllables"][u] = s
                                    syllable_key[s][u].append(op_output)

        # for op in huge_ops:
        #     for a in adjust_types:
        #         remaining_syllables = s - op["syllables"] - a["syllables"]
        #         if remaining_syllables < 1:
        #             continue

        #         for huge in huge_numbers[remaining_syllables]:
        #             root_log = huge["log"]/op["factor"]
        #             if root_log > max_log:
        #                 break

        #             op_output = adjust(a["type"],math.exp(root_log))
        #             new_name = a["type"] + " " + op["name"] + " " + huge["name"]
        #             root_super = "" if op["factor"] == 2 else n_to_script(op["factor"])
        #             new_equation = adjust_equation(a["type"],root_super + "√" + huge["equation"])

        #             for u in range(4,pemdas_count):
        #                 if number_names[op_output]["syllables"][u] >= s:
        #                     number_names[op_output]["names"][u] = new_name
        #                     number_names[op_output]["equations"][u] = new_equation
        #                     number_names[op_output]["level_out"][u] = op["level_out"]

        #                     if number_names[op_output]["syllables"][u] > s:
        #                         number_names[op_output]["syllables"][u] = s
        #                         syllable_key[s][u].append(op_output)
                

                

        for i in range(pemdas_count):
            syllable_key[s][i].sort()
        while number_names[min_missing]["syllables"][-1] <= s:
            min_missing += 1
            if min_missing > leave_point:
                    break
        if min_missing > leave_point:
                break

    return number_names[0:leave_point+1]


def numbers_out(number_names, file_name):
    with open(file_name,"w",encoding="utf-8") as f:
        for l in number_names:
            f.write(name_clean(l["names"][-1]) + "," + equation_clean(l["equations"][-1]) + "\n")
        #    f.write(l["names"][-1] + "," + l["equations"][-1] + "\n")


name_cleans = [
    ["-",";"],
    ["one","1"],
    ["two","2"],
    ["three","3"],
    ["four","4"],
    ["five","5"],
    ["six","6"],
    ["sven","7"],
    ["eight","8"],
    ["nine","9"],
    ["ten","~"],
    ["FOUR","4!"],
    ["FIVE","5!"],
    ["SIX","6!"],
    ["SVEN","7!"],
    ["EIGHT","8!"],
    ["NINE","9!"],
    ["TEN","~!"],
    [" elves","?"],
    ["elf","#"],
    ["twelve","@"],
    ["teen","$"],
    ["twenty","&"],
    ["ty","0"],
    ["ties","j"],
    [" hundred","A"],
    [" thou","K"],
    [" mil","M"],
    [" prime","P"],
    [" base ","B"],
    [" fib","Q"],
    [" mod ","D"],
    [" choose ","C"],
    ["its","J"],
    [" times ","*"],
    [" plus ","+"],
    [" take ","-"],
    [" on ","/"],
    [" squared","²"],
    [" cubed","³"],
    ["score","["],
    ["ream","]"],
    ["stack","{"],
    ["large","<"],
    ["chest","}"],
    ["lakh",":"],
    ["gross","."],
    ["doubled ","_"],
    ["tripled","("],
    ["drupled",")"],
    ["th","Z"],
    ["halves",">"],
]
def name_clean(name_string):
    for nc in name_cleans:
        name_string = name_string.replace(nc[0],nc[1])
    return name_string

# letters used: CFM bdiprst
equation_cleans = [
    ["000000","A"],
    ["00","B"],
    ["20","D"],
    ["64","E"],
    ["500","G"],
    ["1728","H"],
    ["3456","I"],
    ["144",";"],
    [" + ","+"],
    [" - ","-"],
    [" / ","/"],
    [" * ","*"],
    [" ^ ","^"],
    [" % ","^"],
    [" b ","J"],
    [" C ","C"],
    [" ²","L"],
    [" ³","N"],
    ["bits","O"],
    ["trits","P"],
    ["dits","Q"],
    ["11","R"],
    ["12","S"],
    ["*2","T"],
    ["*3","U"],
    ["!)","V"],
    ["!*","W"],
    ["!+","X"],
    ["!/","Y"],
    ["!%","Z"],
    ["!-","a"],
    ["4!","c"],
    ["5!","e"],
    ["6!","f"],
    ["7!","g"],
    ["8!","h"],
    ["9!","j"],
    ["10!","k"],
    ["p₁","l"],
    ["p₂","m"],
    ["p₃","n"],
    ["p₄","o"],
    ["p₅","q"],
    ["p₆","u"],
    ["p₇","v"],
    ["p₈","w"],
    ["p₉","x"],
]


def equation_clean(eq_string):
    for ec in equation_cleans:
        eq_string = eq_string.replace(ec[0],ec[1])
    return eq_string

def n_to_script(n_value,sub=False):
    if n_value == 0:
        return '⁰'

    scripts = (['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'] if sub == False 
                    else ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'])
    result = ''
    while n_value > 0:
        result = scripts[n_value%10] + result
        n_value = n_value // 10
    return result


primes = [2,3,5,7]
def generate_primes(prime_limit):

    test_number = 9
    
    while test_number <= prime_limit:
        p = 0
        is_prime = True
        while primes[p] ** 2 <= test_number:
            if test_number % primes[p] == 0:
                is_prime = False
                break
            p += 1

        if is_prime:
            primes.append(test_number)
        test_number += 2

fibonaccis = [0,1,1]
def generate_fibs(fib_limit):

    new_fib = 2
    while new_fib <= fib_limit:
        fibonaccis.append(new_fib)
        new_fib = new_fib + fibonaccis[-2]


def get_first_extremes(op,min_missing,max_number):
    if op["id"] == "²":
        return min_missing**(1/2), max_number**(1/2)
    elif op["id"] == "³":
        return min_missing**(1/3), max_number**(1/3)
    elif op["id"] == "bits":
        return 4, math.log(max_number)/math.log(2)
    elif op["id"] == "trits":
        return 3, math.log(max_number)/math.log(3)
    elif op["id"] == "dits":
        return 2, math.log(max_number)/math.log(10)
    elif op["id"] == "copies":
        return 1, max_number/op["value"]
    elif op["id"] == "* 2":
        return 12, max_number/2
    elif op["id"] == "* 3":
        return 8, max_number/3
    elif op["id"] == "* 4":
        return 8, max_number/4
    elif op["id"] == "+":
        return 6, max_number-1
    elif op["id"] == "*":
        return 2, max_number**0.5
    elif op["id"] == "ns":
        return 2, max_number/op["value"]
    elif op["id"] == "-":
        return min_missing+1, max_number
    elif op["id"] in ["/","nths","adj_fraction","adj_division"]:
        return min_missing*2, max_number
    elif op["id"] == "adj_irrational":
        return min_missing/op["value"], max_number/op["value"]
    elif op["id"] == "adj_tan":
        return 1, max_number
    elif op["id"] == "adj_root":
        return 289, max_number
    elif op["id"] == "^":
        return 2, max_number**0.2
    elif op["id"] == "C":
        return 2, (max_number*2)**0.51+1
    elif op["id"] == "b":
        return 3, max_number
    elif op["id"] == "%":
        return 23, max_number
    elif op["id"] == "prime":
        return 4, len(primes)
    elif op["id"] == "fibonacci":
        return 4, len(fibonaccis)-1
    
def get_second_extremes(op,min_missing,max_number,base_power,left_value):
    if op["id"] == "+":
        return 1, min(left_value,max_number - left_value)
    elif op["id"] == "*":
        return max(left_value,min_missing/left_value), max_number/left_value
    elif op["id"] == "-":
        return 1, left_value-min_missing
    elif op["id"] == "/":
        return 2, left_value/7
    elif op["id"] == "adj_division" or op["id"] == "adj_fraction":
        return 2, left_value/11
    elif op["id"] == "^":
        return 5, math.log(max_number)/math.log(left_value)
    elif op["id"] == "C":
        return 2, left_value/2
    elif op["id"] == "b":
        return max(2,math.ceil(left_value**base_power)), 9
    elif op["id"] == "%":
        return 12, left_value-11
    
def get_output(op,max_number,left_value,right_value=0):
    if op["id"] == "²":
        return left_value**2, True
    if op["id"] == "³":
        return left_value**3, True
    elif op["id"] == "bits":
        return 2**left_value, True
    elif op["id"] == "trits":
        return 3**left_value, True
    elif op["id"] == "dits":
        return 10**left_value, True
    elif op["id"] == "copies":
        return left_value*op["value"], True
    elif op["id"] == "* 2":
        return left_value*2, True
    elif op["id"] == "* 3":
        return left_value*3, True
    elif op["id"] == "* 4":
        return left_value*4, True
    elif op["id"] == "^":
        return left_value**right_value, True
    elif op["id"] == "+":
        return left_value + right_value, True
    elif op["id"] == "*":
        return left_value * right_value, True
    elif op["id"] == "ns":
        if op["value"] % 10 != 0 and op["value"] > 20 and left_value % 100 == 0:
            return 0, False
        return left_value * op["value"], True
    elif op["id"] == "-":
        return left_value - right_value, True
    elif op["id"] == "/":
        if left_value % right_value == 0:
            return left_value // right_value, True
        return 0, False
    elif op["id"] == "nths":
        if op["value"] % 10 != 0 and op["value"] > 20 and left_value % 100 == 0:
            return 0, False
        if left_value % op["value"] == 0:
            return left_value // op["value"], True
        return 0, False
    elif op["id"] == "adj_division" or op["id"] == "adj_fraction":
        return adjust(op["adjust_type"],left_value / right_value), True
    elif op["id"] == "adj_irrational":
        return adjust(op["adjust_type"],left_value*op["value"]), True
    elif op["id"] == "adj_tan":
        tan_value = adjust(op["adjust_type"],math.tan(left_value))
        return tan_value, (tan_value > 0 and tan_value <= max_number)
    elif op["id"] == "adj_root":
        return adjust(op["adjust_type"],left_value**0.5), True
    
    elif op["id"] == "C":
        op_result = 1
        for ch in range(left_value - right_value + 1, left_value + 1):
            op_result = op_result * ch
        return op_result // math.factorial(right_value), True
    elif op["id"] == "b":
        op_result = 0
        magnitude = 1
        while left_value > 0:
            op_result += magnitude * (left_value % right_value)
            magnitude *= 10 
            left_value = left_value//right_value
        return op_result, True
    elif op["id"] == "%":
        return left_value % right_value, True
    elif op["id"] == "prime":
        return primes[left_value-1], True
    elif op["id"] == "fibonacci":
        return fibonaccis[left_value], True
    
def get_name(op,left_value,right_value=-1):
    if right_value == -1:
        if op["id"] == "copies" and left_value == 1:
            return "a" + op["text"]
        elif op["id"] == "copies":
            return  number_names[left_value]["names"][op["pemdas_left"]] + op["text"] + op["plural"]
        elif op["id"] == "adj_irrational":
            return op["adjust_type"] + " " + number_names[left_value]["names"][op["pemdas_left"]] + op["text"]
        elif op["id"] == "adj_tan":
            return op["adjust_type"] + " tan " + number_names[left_value]["names"][op["pemdas_left"]]
        elif op["id"] == "adj_root":
            return op["adjust_type"] + " root " + number_names[left_value]["names"][op["pemdas_left"]]
        return number_names[left_value]["names"][op["pemdas_left"]] + op["text"]
    
    else:
        new_name = (number_names[left_value]["names"][op["pemdas_left"]] 
            + op["text"] + number_names[right_value]["names"][op["pemdas_right"]])
        if op["id"] == "adj_fraction":
            return op["adjust_type"] + " " + new_name + "s"
        elif op["id"] == "adj_division":
            return op["adjust_type"] + " " + new_name
        
        return new_name

def get_equation(op,left_value,right_value=-1):
    if right_value == -1:
        if op["id"] == "prime":
            return "p" + n_to_script(left_value,True)
        elif op["id"] == "fibonacci":
            return "F" + n_to_script(left_value,True)
        
        input_name = parenthesize(number_names[left_value]["equations"][op["pemdas_left"]],number_names[left_value]["level_out"][op["pemdas_left"]],op["level_in"])
        if op["id"] == "adj_irrational":
            return adjust_equation(op["adjust_type"],input_name + op["equation"])
        elif op["id"] == "adj_tan":
            return adjust_equation(op["adjust_type"],"tan(" + input_name + ")")
        elif op["id"] == "adj_root":
            return adjust_equation(op["adjust_type"],"√" + input_name)
        elif op["id"] == "copies" and left_value == 1:
            return str(op["value"])
        elif op["id"] == "copies":
            return input_name + " * " + str(op["value"])
        elif op["id"] in ["ns","nths"]:
            return input_name + op["equation"]
        elif op["id"] in ["²","³"] and input_name[-1] in ["²","³"]:
            return "(" + input_name + ")" + " " + op["id"]
        
        return input_name + " " + op["id"]

    else:
        input_name = parenthesize(number_names[left_value]["equations"][op["pemdas_left"]] ,number_names[left_value]["level_out"][op["pemdas_left"]],op["level_in"])

        if op["id"] == "^" and input_name == number_names[right_value]["equations"][1]:
           return input_name + " " + n_to_script(right_value)
        elif op["id"] == "adj_division" or op["id"] == "adj_fraction":
            return adjust_equation(op["adjust_type"],input_name + "/" + number_names[right_value]["equations"][op["pemdas_right"]])
        else:
            if op["id"] == "fraction":
                input_name += " / "
            elif op["id"] == "multiples":
                input_name += " * "
            else:
                input_name +=  " " + op["id"] + " "
            return input_name + parenthesize(number_names[right_value]["equations"][op["pemdas_right"]],number_names[right_value]["level_out"][op["pemdas_left"]],op["level_in"])
                        

def parenthesize(p_text,p_level,p_limit):
    if p_level <= p_limit:
        return "(" + p_text + ")"
    return p_text


adjust_types = [
    {"type":"round", "syllables":1},
    {"type":"floor", "syllables":1},
    {"type":"ceiling", "syllables":2},
]

def adjust(adjust_type, val_to_adjust):
    if adjust_type == "floor":
        return math.floor(val_to_adjust)
    elif adjust_type == "ceiling":
        return math.ceil(val_to_adjust)
    return round(val_to_adjust)

def adjust_equation(adjust_type, val_to_adjust):
    if adjust_type == "floor":
        return "⌊" + val_to_adjust + "⌋"
    elif adjust_type == "ceiling":
        return "⌈" + val_to_adjust + "⌉"
    return "⌊" + val_to_adjust + "⌉"

# pemdas: ordinal, original, unary, multiplication, division, addition and subtraction
# (): 1 - non exponent unary into exp unary, 2 - non exponent unary into binary, 3 - nonexp and binary into md
unary = [
    {"id": "fibonacci", "syllables": 1, "text": " fib",  "pemdas_left": 0, "pemdas_result": 2, "level_in": 0, "level_out": 4},
    {"id": "prime", "syllables": 1, "text": " prime",  "pemdas_left": 0, "pemdas_result": 2, "level_in": 0, "level_out": 4},
    # {"id": "fibonacci", "syllables": 6, "text": " fibonacci number",  "pemdas_left": 0,"pemdas_result": 2, "level_in": 0, "level_out": 4},
    # { "id": "adj_tan", "syllables": 1, "adjust_type": "round", "pemdas_left": 1,"pemdas_result": 4},
    # { "id": "adj_tan", "syllables": 1, "adjust_type": "floor", "pemdas_left": 1,"pemdas_result": 4},
    # { "id": "adj_tan", "syllables": 2, "adjust_type": "ceiling", "pemdas_left": 1,"pemdas_result": 4},
    # { "id": "adj_root", "syllables": 1, "adjust_type": "round", "pemdas_left": 1,"pemdas_result": 4},
    # { "id": "adj_root", "syllables": 1, "adjust_type": "floor", "pemdas_left": 1,"pemdas_result": 4},
    # { "id": "adj_root", "syllables": 2, "adjust_type": "ceiling", "pemdas_left": 1,"pemdas_result": 4},

    {"id": "copies", "syllables": 1, "text": " ream", "plural": "s", "value": 500,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "copies", "syllables": 1, "text": " gross", "plural": "", "value": 144,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "copies", "syllables": 1, "text": " score", "plural": "", "value": 20,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "copies", "syllables": 1, "text": " stack", "plural": "s", "value": 64,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "copies", "syllables": 1, "text": " chest", "plural": "s", "value": 1728,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "copies", "syllables": 2, "text": " large chest", "plural": "s", "value": 3456,  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},

    {"id": "bits", "syllables": 1, "text": " bits", "pemdas_left": 2,"pemdas_result": 2, "level_in": 1, "level_out": 4},
    {"id": "trits", "syllables": 1, "text": " trits", "pemdas_left": 2,"pemdas_result": 2, "level_in": 1, "level_out": 4},
    {"id": "dits", "syllables": 1, "text": " dits",  "pemdas_left": 2,"pemdas_result": 2, "level_in": 1, "level_out": 4},

    {"id": "* 2", "syllables": 2, "text": " doubled",  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "* 3", "syllables": 2, "text": " tripled",  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "* 4", "syllables": 2, "text": " drupled",  "pemdas_left": 2,"pemdas_result": 2, "level_in": 0, "level_out": 1},
    {"id": "²", "syllables": 1, "text": " squared", "pemdas_left": 2,"pemdas_result": 2, "level_in": 1, "level_out": 4},
    {"id": "³", "syllables": 1, "text": " cubed",  "pemdas_left": 2,"pemdas_result": 2, "level_in": 1, "level_out": 4},
]


# irrationals = [
#     {"syllables": 1, "text": " pi", "equation": "π", "value": 3.1415926536},
#     {"syllables": 2, "text": " pi squared", "equation": "π²", "value": 9.8696044011},
#     {"syllables": 2, "text": " pi cubed", "equation": "π³", "value": 31.0062766803},
#     {"syllables": 1, "text": " tau", "equation": "τ", "value": 6.2831853072},
#     {"syllables": 2, "text": " tau squared", "equation": "τ²", "value": 39.4784176044},
#     {"syllables": 2, "text": " tau cubed", "equation": "τ³", "value": 248.0502134424},
#     {"syllables": 1, "text": " e", "equation": "e", "value": 2.7182818285},
#     {"syllables": 2, "text": " e squared", "equation": "e²", "value": 7.3890560989},
#     {"syllables": 2, "text": " e cubed", "equation": "e³", "value": 20.0855369232},
#     {"syllables": 1, "text": " phi", "equation": "ϕ", "value": 1.6180339887},
#     {"syllables": 2, "text": " phi squared", "equation": "ϕ²", "value": 2.6180339887},
#     {"syllables": 3, "text": " phi cubed", "equation": "ϕ³", "value": 4.2360679775},
# ]

# for i in irrationals:
#     for a in adjust_types:
#         unary.append({
#             "id": "adj_irrational", 
#             "syllables": i["syllables"] + a["syllables"],
#             "adjust_type": a["type"],
#             "text": i["text"],
#             "equation": i["equation"],
#             "value": i["value"], 
#             "pemdas_left": 1,
#             "pemdas_result": 4
#         })

binary = [
    { "id": "+", "syllables": 1, "text": " plus ", "pemdas_left": 5,"pemdas_right": 4,"pemdas_result": 5, "level_in": 0, "level_out": 4},
    { "id": "*", "syllables": 1, "text": " times ", "pemdas_left": 4,"pemdas_right": 3,"pemdas_result": 4, "level_in": 3, "level_out": 4},
    { "id": "-", "syllables": 1, "text": " take ", "pemdas_left": 5,"pemdas_right": 4,"pemdas_result": 5, "level_in": 0, "level_out": 4},
    { "id": "/", "syllables": 1, "text": " on ", "pemdas_left": 4,"pemdas_right": 3,"pemdas_result": 5, "level_in": 3, "level_out": 4},
    { "id": "^", "syllables": 2, "text": " to the ", "pemdas_left": 2, "pemdas_right": 1,"pemdas_result": 3, "level_in": 2, "level_out": 3},
    # { "id": "^", "syllables": 1, "text": " pow ", "pemdas_left": 3, "pemdas_right": 2,"pemdas_result": 3, "level_in": 2, "level_out": 3},
    { "id": "C", "syllables": 1, "text": " choose ", "pemdas_left": 3, "pemdas_right": 2,"pemdas_result": 3, "level_in": 2, "level_out": 3},
    { "id": "%", "syllables": 1, "text": " mod ", "pemdas_left": 3, "pemdas_right": 2,"pemdas_result": 3, "level_in": 2, "level_out": 3},
    # { "id": "adj_fraction", "syllables": 1, "adjust_type": "round", "text": " ", "pemdas_left": 1,"pemdas_right": 0,"pemdas_result": 4},
    # { "id": "adj_fraction", "syllables": 1, "adjust_type": "floor", "text": " ", "pemdas_left": 1,"pemdas_right": 0,"pemdas_result": 4},
    # { "id": "adj_fraction", "syllables": 2, "adjust_type": "ceiling", "text": " ", "pemdas_left": 1,"pemdas_right": 0,"pemdas_result": 4},
    # { "id": "adj_division", "syllables": 2, "adjust_type": "round", "text": " on ", "pemdas_left": 1,"pemdas_right": 1,"pemdas_result": 4},
    # { "id": "adj_division", "syllables": 2, "adjust_type": "floor", "text": " on ", "pemdas_left": 1,"pemdas_right": 1,"pemdas_result": 4},
    # { "id": "adj_division", "syllables": 3, "adjust_type": "ceiling", "text": " on ", "pemdas_left": 1,"pemdas_right": 1,"pemdas_result": 4},
    { "id": "b", "syllables": 1, "text": " base ", "suffix": "","pemdas_left": 3, "pemdas_right": 2,"pemdas_result": 3, "level_in": 2, "level_out": 3},
]

replacements = [
    # { "value": 40320, "name": "eight factorial", "syllables": 5, "equation": "8!", 
    #     "ord_name": "forty thousand three hundred twentieth", "ord_syllables": 10, "ord_equation": "40320"},
    # { "value": 362880, "name": "nine factorial", "syllables": 5, "equation": "9!", 
    #     "ord_name": "three hundred sixty-two thousand eight hundred eightieth", "ord_syllables": 14, "ord_equation": "362880"},
    # { "value": 3628800, "name": "ten factorial", "syllables": 5, "equation": "10!", 
    #     "ord_name": "three million six hundred twenty-eight thousand eight hundredth", "ord_syllables": 14, "ord_equation": "3628800"},
    
    # { "value": 127, "name": "fourth mersenne prime", "syllables": 4, "equation": "M₄", 
    #     "ord_name": "one hundred twenty-seventh", "ord_syllables": 7, "ord_equation": "127"},
    # { "value": 8191, "name": "fifth mersenne prime", "syllables": 4, "equation": "M₅", 
    #     "ord_name": "eight thousand ninety-first", "ord_syllables": 6, "ord_equation": "8191"},
    # { "value": 131071, "name": "sixth mersenne prime", "syllables": 4, "equation": "M₆", 
    #     "ord_name": "one hundred thirty-one thousand seventy-first", "ord_syllables": 12, "ord_equation": "131071"},
    # { "value": 524287, "name": "seventh mersenne prime", "syllables": 5, "equation": "M₇", 
    #     "ord_name": "five hundred twenty-four thousand two hundred eighty-seventh", "ord_syllables": 15, "ord_equation": "524287"},
    # { "value": 257, "name": "third fermat prime", "syllables": 4, "equation": "F₃", 
    #     "ord_name": "two hundred fifty-seventh", "ord_syllables": 7, "ord_equation": "257"},
    # { "value": 65537, "name": "fourth fermat prime", "syllables": 4, "equation": "F₄", 
    #     "ord_name": "sixty-five thousand five hundred thirty-seventh", "ord_syllables": 12, "ord_equation": "65537"},

    { "value": 24, "name": "FOUR", "syllables": 1, "equation": "4!", 
        "ord_name": "FOURTH", "ord_syllables": 1, "ord_equation": "4!"},
    { "value": 120, "name": "FIVE", "syllables": 1, "equation": "5!", 
        "ord_name": "FIFTH", "ord_syllables": 1, "ord_equation": "5!"},
    { "value": 720, "name": "SIX", "syllables": 1, "equation": "6!", 
        "ord_name": "SIXTH", "ord_syllables": 1, "ord_equation": "6!"},
    { "value": 5040, "name": "SVEN", "syllables": 1, "equation": "7!", 
        "ord_name": "SVENTH", "ord_syllables": 1, "ord_equation": "7!"},
    { "value": 40320, "name": "EIGHT", "syllables": 1, "equation": "8!", 
        "ord_name": "EIGHTH", "ord_syllables": 1, "ord_equation": "8!"},
    { "value": 362880, "name": "NINE", "syllables": 1, "equation": "9!", 
        "ord_name": "NINTH", "ord_syllables": 1, "ord_equation": "9!"},
    { "value": 3628800, "name": "TEN", "syllables": 1, "equation": "10!", 
        "ord_name": "TENTH", "ord_syllables": 1, "ord_equation": "10!"},
]

upper_limit = 10000000
generate_fibs(upper_limit)
generate_primes(upper_limit)
print('primes generated')
eff_names = number_names_generator(1000000,upper_limit)
# numbers_out(eff_names, 'fastest_numbers_test.csv')
numbers_out(eff_names, 'fastest_numbers_ance.csv')

#print(eff_names)
print("average syllables: ", sum([x["syllables"][-1] for x in eff_names]) / len(eff_names))
print("minimum syllables: ", min([x["syllables"][-1] for x in eff_names]))
max_syl =  max([x["syllables"][-1] for x in eff_names])
print("maximum syllables: ", max_syl)
print([x for x in eff_names if x["syllables"][-1] == max_syl][0])


search_terms = (['plus','times','take','on','squared','cubed','choose','factorial','triangle',
                 'base','mod','bits','prime','doubled','tripled','pow','fib',
                #  'mersenne','fermat','floor','round','ceiling','pi','phi',' e ','tan','root'
                 ]
)

for term in search_terms:
    improved_term_count = len([x for x in eff_names if x["syllables"][-1] < x["original"] and  x["names"][-1].find(term) != -1])
    general_term_count = len([x for x in eff_names if x["names"][-1].find(term) != -1])
    print(term,':  ',improved_term_count,general_term_count)

#print([x for x in eff_names if x["syllables"] < x["original"]])

best_improvment = max([x["original"] - x["syllables"][-1] for x in eff_names])
print(best_improvment)
print([x for x in eff_names if x["original"] - x["syllables"][-1] == best_improvment][-1])

"""
TODO

get parentheses
"""