const fs = require('fs');


fs.readFile('checking.txt', 'utf8', (err, data) => {
    if (err) { console.error('Error reading file:', err); return; }
    let interpreter = new Lexer(data)
    let get_tokens = interpreter.make_tokens()
    let parser = new Parser(get_tokens)
    console.log(interpreter)
    parser.parse()
    
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
TT_COLON="COLON"


let keywords = [TT_SUGOD,TT_KATAPUSAN]
let dtype = [TT_NUMERO,TT_LETRA,TT_TINUOD,TT_TIPIK]

let alphbet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let digit = "0123456789"
let alphbetdigit = alphbet + digit + "_" + "."
let alphnodigit = alphbet + "_"
let alphanodot = alphbet+digit+"_"

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
            else if (this.text[this.indx] == ",") {
                let newtoken = new Token(this.text[this.indx], TT_COMMA)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "=") {
                let newtoken = new Token(this.text[this.indx], TT_ASSIGN)
                tokens.push(newtoken)
                this.indx += 1
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

class ASTNODE{
    constructor(type = null, attributes = {}) {
        this.type = type
        this.attributes = attributes
    }
}
class Parser{
    constructor(token) {
        this.token = token
        this.position = 0
    }
    parse() {
        let ast = { type: "Program", body: [] }
        
        if (this.token[0].value == "SUGOD") {
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
                else {
                    throw new Error("Invalid Syntax");
                    this.position+=1
                }
            }
        }
        else {
            throw new Error("ERROR: SUGOD missing");
        }
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
        if (this.token[this.position].type == TT_NEWLINE) {
            throw new Error("ERROR: No identifier");
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
                        if (this.token[this.position].type == vardec["dataType"]) {
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
        holdVariable.push(this.token[this.position].value)

        this.position+=1
        if (this.position < this.token.length) {
            if (this.token[this.position].type == TT_ASSIGN) {
                this.position += 1

                if (this.position < this.token.length) {
                    let active = "equals"
                    while (true) {
                        if (this.position >= this.token.length) {
                            throw new Error("ERROR: Missing KATAPUSAN")
                        }
                        if (this.token[this.position].type == TT_NEWLINE) {
                            for (let n of holdVariable) {
                                let assvarJSON = { "variable": n, "value": holdvalue,"indicator": indicHold }
                                assignmentJSON["assignments"].push(assvarJSON)
                            }
                            this.position+=1
                            break
                        }
                        
                        if (dtype.includes(this.token[this.position].type)) {
                            if (active != "equals") {
                                throw new Error("Invalid value assignment");
                            }
                            holdvalue = this.token[this.position].value
                            indicHold = "value"
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
                    let assvarJSON = { "variable": n, "value": holdvalue,"indicator": "value" }
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
}




