const { TokenType } = require("./TokenType.js")
const { Runner } = require("./arithmetic/Runner.js")
const { NumberFormatter } = require("./utils/NumberFormatter.js")
class Parser {
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
            if (this.token[this.position].type != TokenType.TT_NEWLINE) {
                throw new Error("ERROR: new line needed");
            }
            this.position += 1
            while (this.position < this.token.length) {
                if (this.token[this.position].type == TokenType.TT_NEWLINE) {
                    console.log("ignore")
                    this.position += 1
                }
                else if (TokenType.dtype.includes(this.token[this.position].type)) {
                    this.position += 1
                }
                else if (this.token[this.position].type == TokenType.TT_VAR_DEC) {
                    let vardecJson = this.variabelDeclaration()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
                    let vardecJson = this.variableAssignement()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TokenType.TT_PRINT) {
                    let vardecJson = this.printFunction()
                    ast.body.push(vardecJson)
                }
                else if (this.token[this.position].value == TokenType.TT_KATAPUSAN) {
                    if (this.position + 1 < this.token.length) {
                        throw new Error("Invalid Syntax");
                    }
                    else {
                        break
                    }
                }
                else if (this.token[this.position].type == TokenType.TT_DAWATA) {
                    let handleDAWAT = this.inputFunction()
                    ast.body.push(handleDAWAT)
                    //Implement HERE
                }
                else {
                    throw new Error("Invalid Syntax");
                    this.position += 1
                }
            }
        }
        else {
            throw new Error("ERROR: SUGOD missing");
        }
        return ast
    }
    variabelDeclaration() {
        let vardec = { "type": null, "dataType": null, "variables": [] }
        vardec["type"] = "VariableDeclaration"

        this.position += 1
        if (this.position < this.token.length && this.token[this.position].type == TokenType.TT_DTYPE) {
            vardec["dataType"] = this.token[this.position].value
            this.position += 1
        }
        else {
            // console.log("Token: ", this.token[this.position])
            // console.log("The Data Type: ", this.token[this.position].type)

            throw new Error("ERROR: Not a valid datatype");


        }
        if (this.position < this.token.length) {
            if (this.token[this.position].type != TokenType.TT_IDENTIFIER) {
                throw new Error("ERROR: No identifier");
            }
        }
        else {
            throw new Error("ERROR: Missing Katpusan");
        }


        while (this.position < this.token.length) {
            console.log(vardec)
            if (this.token[this.position].type == TokenType.TT_NEWLINE) {
                this.position += 1
                break
            }
            if (this.token[this.position].type == TokenType.TT_COMMA) {
                console.log("run multicomma if")
                this.position += 1
                if (this.token[this.position].type == TokenType.TT_COMMA) {
                    throw new Error("ERROR: Multiple comma");
                }
                continue
            }


            if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
                let identifier_hold = { "name": null, "value": null }
                identifier_hold["name"] = this.token[this.position].value
                this.position += 1


                if (this.position < this.token.length) {
                    if (this.token[this.position].type == TokenType.TT_ASSIGN) {
                        this.position += 1
                        if (this.position >= this.token.length) {
                            throw new Error("ERROR: Missing Katapusan");
                        }




                        //checking for arithmetic expression
                        if (vardec["dataType"] == TokenType.TT_NUMERO || vardec["dataType"] == TokenType.TT_TIPIK || vardec["dataType"] == TokenType.TT_TINUOD) {
                            var holdString = ""
                            while (true) {
                                if (this.position >= this.token.length) {
                                    throw new Error("ERROR: Missing Katapusan");
                                }


                                if (this.token[this.position].type == TokenType.TT_COMMA || this.token[this.position].type == TokenType.TT_NEWLINE) {
                                    //pass to shell
                                    
                                    if ((holdString == '"OO"' || holdString == '"DILI"') && vardec["dataType"] == TokenType.TT_TINUOD) {
                                        
                                        identifier_hold["value"] = holdString
                                        let identhold = identifier_hold;
                                        identhold["datatype"] = TokenType.TT_TINUOD
                                        this.variableCheck.push(identhold)


                                        vardec.variables.push(identifier_hold)


                                        console.log("Variable Check")
                                        console.log(this.variableCheck)
                                        console.log("HoldString: "+holdString)
                                    }
                                    else {
                                        let [output, error] = new Runner().run("<stdin>", holdString);


                                        if (error) {
                                            throw new Error("ERROR: Invalid number");
                                        } else {
                                            if (vardec["dataType"] == TokenType.TT_NUMERO || vardec["dataType"] == TokenType.TT_TINUOD) {
                                                if (vardec["dataType"] == TokenType.TT_NUMERO && output.isBool == false) {
                                                    identifier_hold["value"] = parseInt(output.value) + ""
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TokenType.TT_NUMERO
                                                    this.variableCheck.push(identhold)
                                                }
                                                else if (vardec["dataType"] == TokenType.TT_TINUOD && output.isBool == true) {
                                                    identifier_hold["value"] = parseInt(output.value) == 1 ? "OO" : "DILI"
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TokenType.TT_TINUOD
                                                    this.variableCheck.push(identhold)
                                                }
                                                else if (vardec["dataType"] == TokenType.TT_TINUOD && output.isBool == false){
                                                    identifier_hold["value"] = parseInt(output.value) == 1 ? "OO" : "DILI"
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TokenType.TT_TINUOD
                                                    this.variableCheck.push(identhold)
                                                }
                                                else {
                                                    throw new Error("ERROR:Invalid Integer or Boolean");
                                                }




                                            }
                                            else {
                                                identifier_hold["value"] = NumberFormatter.format(output.value + "")
                                                let identhold = identifier_hold;
                                                identhold["datatype"] = TokenType.TT_TIPIK
                                                this.variableCheck.push(identhold)
                                            }




                                            vardec.variables.push(identifier_hold)


                                            console.log("Variable Check")
                                            console.log(this.variableCheck)
                                        }




                                    }
                                    break
                                }


                                if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
                                    let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[this.position].value);
                                    console.log(existingVar)
                                    console.log(this.variableCheck)


                                    if (existingVar) {
                                        if (existingVar["value"] == "DILI") {
                                            holdString += " 0 "
                                        }
                                        else if (existingVar["value"] == "OO") {
                                            holdString += " 1 "
                                        }
                                        else {
                                            holdString += existingVar["value"]
                                        }
                                        
                                    }
                                    else {
                                        throw new Error("ERROR: variable does not exist");
                                    }
                                    this.position += 1
                                }
                                else {
                                    if (this.token[this.position].value == '"OO"') {
                                        console.log("OO run")
                                        holdString += " 1 "
                                    }
                                    else if (this.token[this.position].value == '"DILI"') {
                                        holdString += " 0 "
                                    }
                                    else if (this.token[this.position].value == "DILI") {
                                        holdString += " DILI "
                                    }
                                    else if (this.token[this.position].value == "UG") {
                                        holdString += " UG "
                                    }
                                    else if (this.token[this.position].value == "O") {
                                        holdString += " O "
                                    }
                                    else {
                                        holdString += this.token[this.position].value
                                    }
                                    this.position += 1
                                }
                                console.log(holdString)




                            }


                            if (this.position < this.token.length) {
                                if (this.token[this.position].type == TokenType.TT_COMMA) {
                                    if (this.position == this.token.length - 1) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                    else if (this.token[this.position + 1].type == TokenType.TT_NEWLINE) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                }
                                else if (this.token[this.position].type != TokenType.TT_COMMA) {
                                    if (this.token[this.position].type != TokenType.TT_NEWLINE) {
                                        throw new Error("ERROR: comma is needed");
                                    }
                                }
                            }
                        }
                        else if (this.token[this.position].type == vardec["dataType"]) {


                            identifier_hold["value"] = this.token[this.position].value
                            this.position += 1






                            if (this.position < this.token.length) {
                                if (this.token[this.position].type == TokenType.TT_COMMA) {
                                    if (this.position == this.token.length - 1) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                    else if (this.token[this.position + 1].type == TokenType.TT_NEWLINE) {
                                        throw new Error("ERROR: Unprecedented comma");
                                    }
                                }
                                else if (this.token[this.position].type != TokenType.TT_COMMA) {
                                    if (this.token[this.position].type != TokenType.TT_NEWLINE) {
                                        throw new Error("ERROR: comma is needed");
                                    }
                                }
                            }
                            let identhold = identifier_hold;
                            identhold["datatype"] = vardec["dataType"]
                            this.variableCheck.push(identhold)


                            vardec.variables.push(identifier_hold)
                        }
                        else if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
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
                            if (this.token[this.position].type == TokenType.TT_COMMA) {
                                if (this.position == this.token.length - 1) {
                                    throw new Error("ERROR: Unprecedented comma");
                                }
                                else if (this.token[this.position + 1].type == TokenType.TT_NEWLINE) {
                                    throw new Error("ERROR: Unprecedented comma");
                                }
                            }
                            else if (this.token[this.position].type != TokenType.TT_COMMA) {
                                if (this.token[this.position].type != TokenType.TT_NEWLINE) {
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


        this.position += 1
        if (this.position < this.token.length) {
            if (this.token[this.position].type == TokenType.TT_ASSIGN) {
                this.position += 1
                /*if (this.position < this.token.length) {
                    if (this.token[this.position].type == TokenType.TT_NEWLINE) {
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
                        if (this.token[this.position].type == TokenType.TT_NEWLINE && active != "equals") {
                            for (let n of holdVariable) {
                                let assvarJSON = { "variable": n, "value": holdvalue, "indicator": indicHold, "dtype": indicdtype }
                                assignmentJSON["assignments"].push(assvarJSON)
                            }
                            this.position += 1
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


                            if (this.token[copypos].type == TokenType.TT_NEWLINE) {
                                let neweval = ""
                                if (evalString == '"OO"' || evalString == '"DILI"') {
                                    holdvalue = evalString[0]
                                    break
                                }
                                else {
                                    let [output, error] = new Runner().run("<stdin>", evalString);


                                    if (error) {
                                        console.log("Invalid Expression")
                                        break
                                    } else {
                                        if (output.isBool == true) {
                                            holdvalue = parseInt(output.value)  == 1 ? "OO":"DILI"
                                        }
                                        else{
                                            holdvalue = output.value + ""
                                        }
                                        
                                        indicHold = "value"
                                        active = "ident"
                                        indicdtype = "EXPRESSION"
    
                                        this.position = copypos
    
                                        console.log(holdvalue)
    
                                        skip = true
    
                                        break
                                    }
                                }
                            }


                            if (this.token[copypos].type == TokenType.TT_IDENTIFIER) {
                                let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[copypos].value);
                                console.log(existingVar)
                                console.log(this.variableCheck)


                                if (existingVar) {
                                    if (existingVar["value"] == "DILI") {
                                        evalString += " 0 "
                                    }
                                    else if (existingVar["value"] == "OO") {
                                        evalString += " 1 "
                                    }
                                    else {
                                        evalString += existingVar["value"]
                                    }
                                    
                                }
                                else {
                                    throw new Error("ERROR: variable does not exist");
                                }
                                copypos += 1
                            }
                            else {
                                if ((this.token[copypos].value == '"OO"' || this.token[copypos].value == '"DILI"') && this.token[copypos + 1].type == TokenType.TT_NEWLINE) {
                                    
                                    evalString += this.token[copypos].value
                                }
                                else if (this.token[copypos].value == '"OO"') {
                                    console.log("OO run")
                                    evalString += " 1 "
                                }
                                else if (this.token[copypos].value == '"DILI"') {
                                    evalString += " 0 "
                                }
                                else if (this.token[copypos].value == "DILI") {
                                    evalString += " DILI "
                                }
                                else if (this.token[copypos].value == "UG") {
                                    evalString += " UG "
                                }
                                else if (this.token[copypos].value == "O") {
                                    evalString += " O "
                                }
                                else {
                                    evalString += this.token[copypos].value
                                }
                                
                                copypos += 1
                            }




                        }


                        if (skip == true) {
                            continue
                        }


                        if (TokenType.dtype.includes(this.token[this.position].type)) {
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
                            if (this.token[this.position].type != TokenType.TT_NEWLINE) {
                                throw new Error("Invalid identifier assignment");
                            }


                        }
                        else if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
                            if (active != "equals") {
                                throw new Error("Invalid identifier position");
                            }
                            holdvalue = this.token[this.position].value
                            indicHold = "indentifier"
                            indicdtype = "none"
                            holdVariable.push(this.token[this.position].value)
                            active = "ident"
                            this.position += 1
                        }
                        else if (this.token[this.position].type == TokenType.TT_ASSIGN) {
                            if (active != "ident") {
                                throw new Error("Invalid assignment position");
                            }
                            active = "equals"
                            this.position += 1
                            if (this.position >= this.token.length) {
                                throw new Error("ERROR: Missing KATAPUSAN");
                            }
                            if (this.token[this.position].type == TokenType.TT_NEWLINE) {
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
            else if (this.token[this.position].type == TokenType.TT_NEWLINE) {
                for (let n of holdVariable) {
                    let assvarJSON = { "variable": n, "value": holdvalue, "indicator": "value", "dtype": indicdtype }
                    assignmentJSON["assignments"].push(assvarJSON)
                }
                this.position += 1
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
        let printJSON = { "type": "PrintFunction", "expression": [] }
        this.position += 1
        if (this.position < this.token.length) {
            if (this.token[this.position].type != TokenType.TT_COLON || this.token[this.position].type == TokenType.TT_NEWLINE) {
                throw new Error("COLON needed");
            }
            this.position += 1
            if (this.position < this.token.length) {
                if (this.token[this.position].type == TokenType.TT_IDENTIFIER || TokenType.dtype.includes(this.token[this.position].type) || this.token[this.position].type == TokenType.TT_STRING || this.token[this.position].type == TokenType.TT_NEXTLINE) {
                    let printElem = { "type": (this.token[this.position].type == TokenType.TT_IDENTIFIER ? "Variable" : TokenType.dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TokenType.TT_STRING ? "String" : this.token[this.position].type == TokenType.TT_NEXTLINE ? TokenType.TT_NEXTLINE : "Unknown"), "name": this.token[this.position].value }
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
                if (this.token[this.position].type == TokenType.TT_NEWLINE) {
                    if (beforeToken == "indetifier") {
                        break
                    }
                    else {
                        throw new Error("Concat and Nextline should not be last");
                    }
                }
                if (beforeToken == "indetifier") {
                    if (this.token[this.position].type == TokenType.TT_CONCAT) {
                        let printElem = { "type": this.token[this.position].type, "name": this.token[this.position].value }
                        printJSON["expression"].push(printElem)
                        this.position += 1
                        beforeToken = "nonindetifier"
                    }
                    else {
                        throw new Error("Invalid Separation of Variables, string, indetifier");
                    }
                }
                else {
                    if (this.token[this.position].type == TokenType.TT_IDENTIFIER || TokenType.dtype.includes(this.token[this.position].type) || this.token[this.position].type == TokenType.TT_STRING || this.token[this.position].type == TokenType.TT_NEXTLINE) {
                        let printElem = { "type": (this.token[this.position].type == TokenType.TT_IDENTIFIER ? "Variable" : TokenType.dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TokenType.TT_STRING ? "String" : this.token[this.position].type == TokenType.TT_NEXTLINE ? TokenType.TT_NEXTLINE : "Unknown"), "name": this.token[this.position].value }
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
        if (this.token[this.position].type != TokenType.TT_COLON) {
            throw new Error("Colon needed in input function");
        }


        this.position += 1


        if (this.position >= this.token.length) {
            throw new Error("Katapusan missing");
        }
        if (this.token[this.position].type != TokenType.TT_IDENTIFIER) {
            throw new Error("Identifier needed in input function");
        }
        inputJson["varlist"].push({ "dtype": this.token[this.position].type, "value": this.token[this.position].value })


        this.position += 1
        let valid = "identifier"
        while (true) {
            if (this.position >= this.token.length) {
                throw new Error("Katapusan missing");
            }
            if (this.token[this.position].type == TokenType.TT_NEWLINE) {
                if (valid == "comma") {
                    throw new Error("comma should not be last");
                }
                this.position += 1
                break
            }


            if (this.token[this.position].type == TokenType.TT_IDENTIFIER) {
                if (valid == "comma") {
                    inputJson["varlist"].push({ "dtype": this.token[this.position].type, "value": this.token[this.position].value })
                    valid = "identifier"
                    this.position += 1
                }
                else {
                    throw new Error("Comma before needed");
                }
            }
            else if (this.token[this.position].type == TokenType.TT_COMMA) {
                if (valid == "identifier") {
                    valid = "comma"
                    this.position += 1
                }
                else {
                    throw new Error("Identifier before needed");
                }
            }
            else {
                throw new Error("Invalid Dawata Syntax");
            }
        }


        console.log("\n\n\n\n\n\n ------INPUT FUNCTION PARSER-----\n", inputJson, "\n\n--------END------")
        return inputJson
    }
}
module.exports = { Parser };