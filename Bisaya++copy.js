const fs = require('fs');
const readlineSync = require("readline-sync");

const { run } = require('./Bisaya++');

fs.readFile('checking.txt', 'utf8', (err, data) => {
    if (err) { console.error('Error reading file:', err); return; }
    let interpreter = new Lexer(data)
    let get_tokens = interpreter.make_tokens()
    let parser = new Parser(get_tokens)
    let astTree = parser.parse()
    let executer = new Interpreter(astTree)
    executer.execute()
    
});

TT_SUGOD = "SUGOD"
TT_MUGNA = "MUGNA"
TT_KATAPUSAN = "KATAPUSAN"
TT_NUMERO = "NUMERO"
TT_LETRA = "LETRA"
TT_TINUOD = "TINUOD"
TT_TIPIK = "TIPIK"
TT_IDENTIFIER = "IDENTIFIER"
TT_KEYWORD = "KEYWORD"
TT_NEWLINE = "NEWLINE"
TT_COMMA = "COMMA"
TT_ASSIGN = "ASSIGN"
TT_STRING = "STRING"
TT_DTYPE = "DTYPE"
TT_IPAKITA = "IPAKITA"
TT_CONCAT = "CONCAT"
TT_NEXTLINE = "NEXTLINE"
TT_VAR_DEC = "VAR_DEC"
TT_PRINT = "PRINT"
TT_COLON = "COLON"
TT_COMMENT = "Comment"
TT_DAWATA = "DAWATA"
TT_GREATERTHAN = "GreaterThan"
TT_LESSTHAN = "LessThan"
TT_GREATERTHANOREQUAL = "GreaterThanorEqual"
TT_LESSTHANOREQUAL = "LessThanorEqual"
TT_EQUAL = "Equal"
TT_NOTEQUAL = "NotEqual"
TT_AND = "UG"
TT_OR = "O"
TT_NOT = "DILI"


let keywords = [TT_SUGOD,TT_KATAPUSAN]
let dtype = [TT_NUMERO, TT_LETRA, TT_TINUOD, TT_TIPIK]
let comparisson_operator = [TT_GREATERTHAN, TT_LESSTHAN, TT_GREATERTHANOREQUAL, TT_LESSTHANOREQUAL, TT_EQUAL, TT_NOTEQUAL]
let logical_Operator = [TT_AND,TT_OR,TT_NOT]

let alphbet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let digit = "0123456789"
let alphbetdigit = alphbet + digit + "_" + "."
let alphnodigit = alphbet + "_"
let alphanodot = alphbet+digit+"_"


function formatNumber(num) {
    let floatNum = parseFloat(num); 

    if (isNaN(floatNum)) {
        throw new Error(`ERROR: Invalid number: "${num}"`); 
    }

    let decimalPart = floatNum % 1; 

    if (decimalPart === 0) { 
        return floatNum.toFixed(1); 
    } 

    return floatNum.toString();
}


class Token{
    constructor(value = null,type = null) {
        this.value = value
        this.type = type
    }
}

class Lexer{
    constructor(text) {
        this.text = text.trim()
        this.indx = 0;
    }
    make_tokens() {
        let tokens = []

        while (this.indx < this.text.length) {
            if (" \t\r".includes(this.text[this.indx])) {
                this.indx += 1
                continue
            }
            else if ("\n".includes(this.text[this.indx])) {
                this.indx += 1
                let newtoken = new Token("\n", TT_NEWLINE)
                tokens.push(newtoken)
            }
            else if (this.text[this.indx] == "-") {
                if (this.indx+1 < this.text.length) {
                    if (this.text[this.indx + 1] == "-") {
                        this.indx+=2
                        while (true) {
                            if (this.indx >= this.text.length) {
                                throw new Error("ERROR: missing Katapusan");
                            }
                            if ("\n".includes(this.text[this.indx])) {
                                this.indx += 1
                                let newtoken = new Token("\n", TT_NEWLINE)
                                tokens.push(newtoken)
                                console.log("Good slach n")
                                break
                            }
                            this.indx+=1
                        }
                        
                        /*let newtoken = new Token(this.text[this.indx]+this.text[this.indx+1], "Comment")
                        tokens.push(newtoken)
                        this.indx+=2*/
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], "Not defined yet")
                        tokens.push(newtoken)
                        this.indx+=1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], "Not defined yet")
                    tokens.push(newtoken)
                    this.indx+=1
                }
            }
            else if (this.text[this.indx] == ",") {
                let newtoken = new Token(this.text[this.indx], TT_COMMA)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "=") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token("==", TT_EQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TT_ASSIGN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TT_ASSIGN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if (this.text[this.indx] == "&") {
                let newtoken = new Token(this.text[this.indx], TT_CONCAT)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "$") {
                let newtoken = new Token(this.text[this.indx], TT_NEXTLINE)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == ":") {
                let newtoken = new Token(this.text[this.indx], TT_COLON)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "<") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token("<=", TT_LESSTHANOREQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else if (this.text[this.indx + 1] == ">") {
                        let newtoken = new Token("<>", TT_NOTEQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TT_LESSTHAN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TT_LESSTHAN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if (this.text[this.indx] == ">") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token(">=", TT_GREATERTHANOREQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TT_GREATERTHAN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TT_GREATERTHAN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if (alphbetdigit.includes(this.text[this.indx])) {
                let start = this.indx
                let end = start
                let value = this.text[this.indx]
                this.indx += 1;
                while (this.indx < this.text.length && alphbetdigit.includes(this.text[this.indx])) {
                    value += this.text[this.indx]
                    end = this.indx
                    this.indx += 1
                }

                if (keywords.includes(value)) {
                    let newtoken = new Token(value, TT_KEYWORD)
                    tokens.push(newtoken)
                }
                else if (dtype.includes(value)) {
                    let newtoken = new Token(value, TT_DTYPE)
                    tokens.push(newtoken)
                }
                else if (value == TT_MUGNA) {
                    let newtoken = new Token(value, TT_VAR_DEC)
                    tokens.push(newtoken)
                }
                else if (value == TT_IPAKITA) {
                    let newtoken = new Token(value, TT_PRINT)
                    tokens.push(newtoken)
                }
                else if (value == TT_DAWATA) {
                    let newtoken = new Token(value, TT_DAWATA)
                    tokens.push(newtoken)
                }
                else if (value == TT_AND) {
                    let newtoken = new Token(value, TT_AND)
                    tokens.push(newtoken)
                }
                else if (value == TT_OR) {
                    let newtoken = new Token(value, TT_OR)
                    tokens.push(newtoken)
                }
                else if (value == TT_NOT) {
                    let newtoken = new Token(value, TT_NOT)
                    tokens.push(newtoken)
                }
                else if (!isNaN(value) || value.trim() === "") {
                    if (/^-?\d+$/.test(value)) {
                        let newtoken = new Token(value, TT_NUMERO)
                        tokens.push(newtoken)
                    }
                    else if(/^-?\d+\.\d+$/.test(value)){
                        let newtoken = new Token(value, TT_TIPIK)
                        tokens.push(newtoken)
                    }
                    else {
                        let newtoken = new Token(value, "Invalid Number of Integer")
                        tokens.push(newtoken)
                    }
                }
                else {
                    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
                        let newtoken = new Token(value, TT_IDENTIFIER)
                        tokens.push(newtoken)
                    }
                    else {
                        let newtoken = new Token(value, "Invalid identifier")
                        tokens.push(newtoken)
                    }
                }
            }
            else if (this.text[this.indx] == "'" || this.text[this.indx] == "\"") {
                let value = this.text[this.indx]
                this.indx += 1

                if (value == "'") {
                    while (this.indx < this.text.length) {
                        if (this.text[this.indx] == "'") {
                            value += this.text[this.indx]
                            this.indx += 1
                            break
                        }
                        value += this.text[this.indx]
                        this.indx+=1
                    }
                }
                else if (value == "\"") {
                    while (this.indx < this.text.length) {
                        if (this.text[this.indx] == "\"") {
                            value += this.text[this.indx]
                            this.indx += 1
                            break
                        }
                        value += this.text[this.indx]
                        this.indx+=1
                    }
                }

                if (/^'.'$/.test(value)) {
                    let newtoken = new Token(value, TT_LETRA)
                    tokens.push(newtoken)
                }
                else if (/^'.*'$/.test(value)) {
                    let newtoken = new Token(value, "Not a Letter")
                    tokens.push(newtoken)
                }
                else if (/^".*"$/.test(value)) { 
                    if (value == "\"DILI\"" || value == "\"OO\"") {
                        let newtoken = new Token(value, TT_TINUOD)
                        tokens.push(newtoken)
                    }
                    else{
                        let newtoken = new Token(value, TT_STRING)
                        tokens.push(newtoken)
                    }
                }
                else {
                    let newtoken = new Token(value, "Invalid Syntax")
                    tokens.push(newtoken)
                }
            }
            else {
                let newtoken = new Token(this.text[this.indx], "Not defined yet")
                tokens.push(newtoken)
                this.indx+=1
            }
        }
        console.log(tokens)
        return tokens
    }
}

class Parser{
    constructor(token) {
        this.token = token
        this.position = 0
        this.variableCheck = []
    }
    parse() {
        let ast = { type: "Program", body: [] }
        
        if (this.token.length == 0) {
            
        }
        else if (this.token[0].value == "SUGOD") {
            this.position += 1
            if (this.position >= this.token.length) {
                throw new Error("ERROR: missing Katapusan");
            }
            if (this.token[this.position].type != TT_NEWLINE) {
                throw new Error("ERROR: new line needed");
            }
            this.position+=1
            while (this.position < this.token.length) {
                if (this.token[this.position].type == TT_NEWLINE) {
                    console.log("ignore")
                    this.position+=1
                }

                else if (dtype.includes(this.token[this.position].type)) {
                    this.position+=1
                }
                else if (this.token[this.position].type == TT_VAR_DEC) {
                    let vardecJson = this.variabelDeclaration()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TT_IDENTIFIER) {
                    let vardecJson = this.variableAssignement()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TT_PRINT) {
                    let vardecJson = this.printFunction()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].value == TT_KATAPUSAN) {
                    if (this.position+1 < this.token.length) {
                        throw new Error("Invalid Syntax");
                    }
                    else {
                        break
                    }
                }
                else if (this.token[this.position].type == TT_DAWATA) { 
                    let handleDAWAT = this.inputFunction()
                    ast.body.push(handleDAWAT)
                    //Implement HERE
                }
                else {
                    throw new Error("Invalid Syntax");
                    this.position+=1
                }
            }
        }
        else {
            throw new Error("ERROR: SUGOD missing");
        }
        return ast
    }
    variabelDeclaration() {
        let vardec = {"type":null,"dataType":null,"variables":[]}
        vardec["type"] = "VariableDeclaration"

        
        this.position += 1
        if (this.position < this.token.length && this.token[this.position].type == TT_DTYPE) {
            vardec["dataType"] = this.token[this.position].value
            this.position+=1
        }
        else {
            throw new Error("ERROR: Not a valid datatype");

        }
        if (this.position < this.token.length) {
            if (this.token[this.position].type != TT_IDENTIFIER) {
                throw new Error("ERROR: No identifier");
            }
        }
        else {
            throw new Error("ERROR: Missing Katpusan");
        }

        while (this.position < this.token.length) {
            console.log(vardec)
            if (this.token[this.position].type == TT_NEWLINE) {
                this.position+=1
                break
            }
            if (this.token[this.position].type == TT_COMMA) {
                console.log("run multicomma if")
                this.position += 1
                if (this.token[this.position].type == TT_COMMA) {
                    throw new Error("ERROR: Multiple comma");
                }
                continue
            }

            if (this.token[this.position].type == TT_IDENTIFIER) {
                let identifier_hold = { "name": null, "value": null }
                identifier_hold["name"] = this.token[this.position].value
                this.position += 1

                if (this.position < this.token.length) {
                    if (this.token[this.position].type == TT_ASSIGN) {
                        this.position += 1
                        if (this.position >= this.token.length) {
                            throw new Error("ERROR: Missing Katapusan");
                        }

                        
                        //checking for arithmetic expression
                        if (vardec["dataType"] == TT_NUMERO || vardec["dataType"] == TT_TIPIK) {
                            var holdString = ""
                            while (true) {
                                if (this.position >= this.token.length) {
                                    throw new Error("ERROR: Missing Katapusan");
                                }

                                if (this.token[this.position].type == TT_COMMA || this.token[this.position].type == TT_NEWLINE) {
                                    //pass to shell

                                    let [output, error] = run("<stdin>", holdString);

                                    if (error) {
                                        throw new Error("ERROR: Invalid number");
                                    } else {
                                        if (vardec["dataType"] == TT_NUMERO) {
                                            identifier_hold["value"] = parseInt(output.value) + ""

                                            let identhold = identifier_hold;
                                            identhold["datatype"] = TT_NUMERO
                                            this.variableCheck.push(identhold)
                                        }
                                        else {
                                            identifier_hold["value"] = formatNumber(output.value + "") 
                                            let identhold = identifier_hold;
                                            identhold["datatype"] = TT_TIPIK
                                            this.variableCheck.push(identhold)
                                        }
                                        

                                        vardec.variables.push(identifier_hold)

                                        console.log("Variable Check")
                                        console.log(this.variableCheck)
                                    }
                                
                                    break
                                }

                                if (this.token[this.position].type == TT_IDENTIFIER) {
                                    let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[this.position].value);
                                    console.log(existingVar)
                                    console.log(this.variableCheck)

                                    if (existingVar) {
                                        holdString += existingVar["value"]
                                    }
                                    else {
                                        throw new Error("ERROR: variable does not exist");
                                    }
                                    this.position += 1
                                }
                                else {
                                    holdString += this.token[this.position].value
                                    this.position += 1
                                }
                                console.log(holdString)


                            }

                            if (this.position < this.token.length) {
                                if (this.token[this.position].type == TT_COMMA) {
                                    if (this.position == this.token.length - 1) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                    else if (this.token[this.position + 1].type == TT_NEWLINE) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                }
                                else if (this.token[this.position].type != TT_COMMA) {
                                    if (this.token[this.position].type != TT_NEWLINE) {
                                        throw new Error("ERROR: comma is needed");
                                    }
                                }
                            }
                        }
                        else if (this.token[this.position].type == vardec["dataType"]) {

                            identifier_hold["value"] = this.token[this.position].value
                            this.position += 1


                            
                            if (this.position < this.token.length) {
                                if (this.token[this.position].type == TT_COMMA) {
                                    if (this.position == this.token.length - 1) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                    else if (this.token[this.position + 1].type == TT_NEWLINE) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                }
                                else if (this.token[this.position].type != TT_COMMA) {
                                    if (this.token[this.position].type != TT_NEWLINE) {
                                        throw new Error("ERROR: comma is needed");
                                    }
                                }
                            }
                            let identhold = identifier_hold;
                            identhold["datatype"] = vardec["dataType"]
                            this.variableCheck.push(identhold)

                            vardec.variables.push(identifier_hold)
                        }
                        else if (this.token[this.position].type == TT_IDENTIFIER) {
                            let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[this.position].value);
                            console.log(existingVar)
                            console.log(this.variableCheck)

                            if (existingVar) {
                                if (existingVar["datatype"] == vardec["dataType"]) {
                                    
                                    identifier_hold["value"] = existingVar["value"]
                                }
                                else {
                                    throw new Error("ERROR: Invalid Value of identifier");
                                }
                                
                            }
                            else {
                                throw new Error("ERROR: variable does not exist");
                            }
                            this.position += 1

                            let identhold = identifier_hold;
                            identhold["datatype"] = vardec["dataType"]
                            this.variableCheck.push(identhold)

                            vardec.variables.push(identifier_hold)
                        }
                        else {
                            throw new Error("ERROR: Invalid value for identifier");
                        }
                    }
                    else {
                        if (this.position < this.token.length) {
                            if (this.token[this.position].type == TT_COMMA) {
                                if (this.position == this.token.length - 1) {
                                    throw new Error("ERROR: Unprecedented comma");
                                }
                                else if (this.token[this.position + 1].type == TT_NEWLINE) {
                                    throw new Error("ERROR: Unprecedented comma");
                                }
                            }
                            else if (this.token[this.position].type != TT_COMMA) {
                                if (this.token[this.position].type != TT_NEWLINE) {
                                    throw new Error("ERROR: comma is needed");
                                }
                            }
                        }

                        let identhold = identifier_hold;
                        identhold["datatype"] = vardec["dataType"]
                        this.variableCheck.push(identhold)

                        vardec.variables.push(identifier_hold)
                    }
                }
            }
            else {
                throw new Error("ERROR: Invalid Identifier");
            }
        }

        if (this.position >= this.token.length) {
            throw new Error("ERROR: Katapusan missing");
        }

        return vardec
    }

    variableAssignement() {
        let assignmentJSON = { "type": "VariableAssignment", "assignments": [] }
        let holdVariable = []
        let holdvalue = null
        let indicHold = null
        let indicdtype = "none"
        holdVariable.push(this.token[this.position].value)
        indicdtype = "none"

        this.position+=1
        if (this.position < this.token.length) {
            if (this.token[this.position].type == TT_ASSIGN) {
                this.position += 1
                /*if (this.position < this.token.length) {
                    if (this.token[this.position].type == TT_NEWLINE) {
                        throw new Error("ERROR: Missing KATAPUSAN")
                    }
                    else if (dtype.includes(this.token[this.position].type)) {
                        
                    }
                }
                else {
                    throw new Error("ERROR: Missing KATAPUSAN")
                }*/

                if (this.position < this.token.length) {
                    let active = "equals"
                    while (true) {
                        if (this.position >= this.token.length) {
                            throw new Error("ERROR: Missing KATAPUSAN")
                        }
                        if (this.token[this.position].type == TT_NEWLINE && active!="equals") {
                            for (let n of holdVariable) {
                                let assvarJSON = { "variable": n, "value": holdvalue,"indicator": indicHold, "dtype":indicdtype }
                                assignmentJSON["assignments"].push(assvarJSON)
                            }
                            this.position+=1
                            break
                        }
                        
                        var copypos = this.position
                        var evalString = ""
                        var skip = false
                        while (true) {
                            if (copypos >= this.token.length) {
                                throw new Error("ERROR: Missing KATAPUSAN")
                            }

                            if (this.token[copypos].value == "=") {
                                console.log("Invalid Equal sign")
                                break;
                            }

                            if (this.token[copypos].type == TT_NEWLINE) {
                                let neweval = ""
                                let [output, error] = run("<stdin>", evalString);
                                
                                if (error) {
                                    console.log("Invalid Expression")
                                    break
                                } else {
                                    holdvalue = output.value+""
                                    indicHold = "value"
                                    active = "ident"
                                    indicdtype = "EXPRESSION"

                                    this.position = copypos

                                    console.log(holdvalue)

                                    skip= true
                                    
                                    break
                                }
                            }

                            if (this.token[copypos].type == TT_IDENTIFIER) {
                                let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[copypos].value);
                                console.log(existingVar)
                                console.log(this.variableCheck)

                                if (existingVar) {
                                    evalString += existingVar["value"]
                                }
                                else {
                                    throw new Error("ERROR: variable does not exist");
                                }
                                copypos+=1
                            }
                            else {
                                evalString += this.token[copypos].value
                                copypos+=1
                            }


                        }

                        if (skip == true) {
                            continue
                        }

                        if (dtype.includes(this.token[this.position].type)) {
                            if (active != "equals") {
                                throw new Error("Invalid value assignment");
                            }
                            holdvalue = this.token[this.position].value
                            indicHold = "value"
                            active = "ident"
                            indicdtype = this.token[this.position].type
                            this.position += 1
                            if (this.position >= this.token.length) {
                                throw new Error("ERROR: Missing KATAPUSAN");
                            }
                            if (this.token[this.position].type != TT_NEWLINE) {
                                throw new Error("Invalid identifier assignment");
                            }
                            
                        }
                        else if (this.token[this.position].type == TT_IDENTIFIER) {
                            if (active != "equals") {
                                throw new Error("Invalid identifier position");
                            }
                            holdvalue = this.token[this.position].value
                            indicHold = "indentifier"
                            indicdtype = "none"
                            holdVariable.push(this.token[this.position].value)
                            active= "ident"
                            this.position +=1
                        }
                        else if (this.token[this.position].type == TT_ASSIGN) {
                            if (active != "ident") {
                                throw new Error("Invalid assignment position");
                            }
                            active= "equals"
                            this.position += 1
                            if (this.position >= this.token.length) {
                                throw new Error("ERROR: Missing KATAPUSAN");
                            }
                            if (this.token[this.position].type == TT_NEWLINE) {
                                throw new Error("Invalid assignment structure");
                            }
                        }
                        else {
                            throw new Error("Invalid Value for identifier");
                        }
                    }
                    active = "equals"
                }
                else {
                    throw new Error("Invalid Value for identifier");
                }
            }
            else if (this.token[this.position].type == TT_NEWLINE) {
                for (let n of holdVariable) {
                    let assvarJSON = { "variable": n, "value": holdvalue,"indicator": "value", "dtype":indicdtype}
                    assignmentJSON["assignments"].push(assvarJSON)
                }
                this.position+=1
            }
            else {
                throw new Error("ERROR: Missing equal sign");
            }
        }
        else {
            throw new Error("ERROR: Missing KATAPUSAN");
        }

        console.log(assignmentJSON)
        return assignmentJSON
    }


    printFunction() {
        let printJSON = {"type":"PrintFunction","expression":[]}
        this.position += 1
        if (this.position < this.token.length) {
            if (this.token[this.position].type != TT_COLON || this.token[this.position].type == TT_NEWLINE) {
                throw new Error("COLON needed");
            }
            this.position += 1
            if (this.position < this.token.length) {
                if (this.token[this.position].type == TT_IDENTIFIER || dtype.includes(this.token[this.position].type) || this.token[this.position].type == TT_STRING || this.token[this.position].type == TT_NEXTLINE) {
                    let printElem = { "type": (this.token[this.position].type == TT_IDENTIFIER ? "Variable" : dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TT_STRING ? "String" : this.token[this.position].type == TT_NEXTLINE? TT_NEXTLINE:"Unknown"), "name": this.token[this.position].value }
                    printJSON["expression"].push(printElem)
                }
                else {
                    throw new Error("Invalid format");
                }
            }
            else {
                throw new Error("ERROR: KATAPUSAN missing");
            }
            this.position += 1
            
            let beforeToken = "indetifier"
            while (true) {
                if (this.position >= this.token.length) {
                    throw new Error("missing Katapusan");
                }
                if (this.token[this.position].type == TT_NEWLINE) {
                    if (beforeToken == "indetifier") {
                        break
                    }
                    else {
                        throw new Error("Concat and Nextline should not be last");
                    }
                }
                if (beforeToken == "indetifier") {
                    if (this.token[this.position].type == TT_CONCAT) {
                        let printElem = { "type": this.token[this.position].type, "name": this.token[this.position].value }
                        printJSON["expression"].push(printElem)
                        this.position += 1
                        beforeToken = "nonindetifier"
                    }
                    else{
                        throw new Error("Invalid Separation of Variables, string, indetifier");
                    }
                }
                else {
                    if (this.token[this.position].type == TT_IDENTIFIER || dtype.includes(this.token[this.position].type) || this.token[this.position].type == TT_STRING || this.token[this.position].type == TT_NEXTLINE) {
                        let printElem = { "type": (this.token[this.position].type == TT_IDENTIFIER ? "Variable" : dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TT_STRING ? "String" : this.token[this.position].type == TT_NEXTLINE? TT_NEXTLINE:"Unknown"), "name": this.token[this.position].value }
                        printJSON["expression"].push(printElem)
                        this.position += 1
                        beforeToken = "indetifier"
                    }
                    else {
                        throw new Error("Invalid format");
                    }
                }
            }

        }
        else {
            throw new Error("ERROR: KATAPUSAN missing");
        }

        console.log(printJSON)
        return printJSON
    }

    inputFunction() {
        console.log("Input here implement")

        //Implement here
        let inputJson = { "type": "InputFunction", "varlist": [] }
        
        this.position += 1

        if (this.position >= this.token.length) {
            throw new Error("Katapusan missing");
        }
        if (this.token[this.position].type != TT_COLON) {
            throw new Error("Colon needed in input function");
        }

        this.position += 1

        if (this.position >= this.token.length) {
            throw new Error("Katapusan missing");
        }
        if (this.token[this.position].type != TT_IDENTIFIER) {
            throw new Error("Identifier needed in input function");
        }
        inputJson["varlist"].push({"dtype":this.token[this.position].type, "value":this.token[this.position].value })

        this.position += 1
        let valid = "identifier"
        while (true) {
            if (this.position >= this.token.length) {
                throw new Error("Katapusan missing");
            }
            if (this.token[this.position].type == TT_NEWLINE) {
                if (valid == "comma") {
                    throw new Error("comma should not be last");
                }
                this.position += 1
                break
            }

            if (this.token[this.position].type == TT_IDENTIFIER) {
                if (valid == "comma") {
                    inputJson["varlist"].push({"dtype":this.token[this.position].type, "value":this.token[this.position].value })
                    valid = "identifier"
                    this.position+=1
                }
                else {
                    throw new Error("Comma before needed");
                }
            }
            else if (this.token[this.position].type == TT_COMMA) {
                if (valid == "identifier") {
                    valid = "comma"
                    this.position+=1
                }
                else {
                    throw new Error("Identifier before needed");
                }
            }
            else {
                throw new Error("Invalid Dawata Syntax");
            }
        }

        console.log("\n\n\n\n\n\n ------INPUT FUNCTION PARSER-----\n",inputJson,"\n\n--------END------")
        return inputJson
    }
}


class Interpreter{
    constructor(ast) {
        this.ast = ast
        this.memory = []
        this.executeString = ""
    }

    execute() {
        for (let nodes of this.ast["body"]) {
            if (nodes["type"] == 'VariableDeclaration') {
                this.executeVariableDeclaration(nodes)
            }
            else if (nodes["type"] == "VariableAssignment") {
                this.executeVariableAssignment(nodes)
            }
            else if (nodes["type"] == "PrintFunction") {
                let stringexec = this.executePrintFunction(nodes)
                const result = stringexec.replaceAll('"', '').replaceAll("'", '');

                console.log(result)
            }
            else if (nodes["type"] == "InputFunction") {
                this.executeInputFunction(nodes)
            }
            else {
                
            }
        }
    }

    executeVariableDeclaration(nodes) {
        let datatypehold = nodes["dataType"]
        for (let varhold of nodes["variables"]) {
            if (this.memory.length != 0) {
                let existingVar = this.memory.find(variable => variable["name"] === varhold["name"]);
                if (existingVar) {
                    throw new Error("ERROR: Variable already exist");
                }
                else {
                    varhold["datatype"] = datatypehold
                    this.memory.push(varhold)
                }
            }
            else {
                varhold["datatype"] = datatypehold
                this.memory.push(varhold)
            }
        }

        console.log(this.memory)
    }
    executeVariableAssignment(nodes) {
        for (let nodeassign of nodes["assignments"]) {
            console.log(nodeassign)
            console.log(this.memory)
            let existingVar = this.memory.find(variable => variable["name"] === nodeassign["variable"]);

            if (existingVar) {
                if (nodeassign["indicator"] == "value") {
                    if (nodeassign["value"] != null) {
                        if (nodeassign["dtype"] == "EXPRESSION") {
                            let existingVarIndex = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            if (existingVar["datatype"] == TT_NUMERO) {
                                this.memory[existingVarIndex].value = parseInt(nodeassign["value"])+""
                            }
                            else if (existingVar["datatype"] == TT_TIPIK) {
                                this.memory[existingVarIndex].value = formatNumber(nodeassign["value"]+"")
                            }
                            else {
                                throw new Error("ERROR: Not valid value for type");
                            }
                        }
                        else if (existingVar["datatype"] == nodeassign["dtype"]) {
                            let existingVarIndex = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            this.memory[existingVarIndex].value = nodeassign["value"]
                        }
                        else {
                            throw new Error("ERROR: Not valid value for type");
                        }
                    }
                }
                else {
                    let existingVarVal = this.memory.find(variable => variable["name"] === nodeassign["value"]);
                    if (existingVarVal) {
                        if ((existingVar["datatype"] == TT_NUMERO || existingVar["datatype"] == TT_TIPIK) && (existingVarVal["datatype"] == TT_NUMERO || existingVarVal["datatype"] == TT_TIPIK)) {
                            let change = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            let valchange = this.memory.findIndex(variable => variable["name"] === nodeassign["value"]);

                            
                            if (this.memory[change].datatype == TT_NUMERO) {
                                this.memory[change].value = parseInt(this.memory[valchange].value)+""
                            }
                            else if (this.memory[change].datatype == TT_TIPIK) {
                                this.memory[change].value = formatNumber(this.memory[valchange].value+"")
                            }
                            else {
                                throw new Error("ERROR: Not valid value for type");
                            }
                        }
                        else if (existingVar["datatype"] == existingVarVal["datatype"]) {
                            let change = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            let valchange = this.memory.findIndex(variable => variable["name"] === nodeassign["value"]);

                            this.memory[change].value = this.memory[valchange].value
                        }
                        else {
                            throw new Error("ERROR: Not valid value for type");
                        }
                    }
                    else {
                        throw new Error("ERROR: Variable not found");
                    }
                }
            }
            else {
                throw new Error("ERROR: Variable not found");
            }
        }
        console.log(this.memory)
    }

    executePrintFunction(nodes) {
        this.executeString=""
        for (let expr of nodes["expression"]) {
            if (expr["type"] == "Value") {
                this.executeString += expr["name"]
            }
            else if (expr["type"] == "Variable") {
                let existingVarExpr = this.memory.find(variable => variable["name"] === expr["name"]);
                if (existingVarExpr) {
                    if (existingVarExpr["value"] != null) {
                        this.executeString+=existingVarExpr["value"]
                    }
                }
                else {
                    throw new Error("ERROR: Variable not found");
                }
            }
            else if (expr["type"] == "String") {
                this.executeString+=expr["name"]
            }
            else if (expr["type"] == "NEXTLINE") {
                this.executeString += "\n"
            }
            else {
                
            }
        }

        return this.executeString
    }
    executeInputFunction(nodes) {
        let values = [];
        let goodList = [];
    
        for (let nn of nodes["varlist"]) {
            let existingVarExprInput = this.memory.find(variable => variable["name"] === nn["value"]);
            if (existingVarExprInput) {
                goodList.push(existingVarExprInput);
            } else {
                throw new Error("ERROR: Variable does not exist on Input");
            }
        }
    
        let input = readlineSync.question("");
        values = input.split(",");
    
        if (values.length !== goodList.length) {
            throw new Error("ERROR: Invalid number of arguments in Input");
        }
    
        for (let val = 0; val < values.length; val++) {
            if (goodList[val].datatype === "NUMERO") {
                if (isNaN(values[val]) || values[val].trim() === "") {
                    throw new Error(`ERROR: Invalid number: "${values[val]}"`);
                } else {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = parseInt(values[val]) + "";
                }
            }
            else if (goodList[val].datatype === "TIPIK") {
                if (isNaN(values[val]) || values[val].trim() === "") {
                    throw new Error(`ERROR: Invalid Decimal: "${values[val]}"`);
                } else {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = formatNumber(values[val]);
                }
            }
            //LETRA should be like this "'h'"
            else if (goodList[val].datatype === "LETRA") {
                if (values[val].trim().length == 1) {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value =  `\'${values[val].trim()}\'`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
            else if (goodList[val].datatype === "TINUOD") {
                if (values[val].trim() == "OO"||values[val].trim() == "DILI") {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value =  `\"${values[val].trim()}\"`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
        }

        console.log(this.memory)

    }
}




