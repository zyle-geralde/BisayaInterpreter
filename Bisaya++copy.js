const fs = require('fs');
const readlineSync = require("readline-sync");

const { run } = require('./Bisaya++');

fs.readFile('checking.txt', 'utf8', (err, data) => {
    try {
        if (err) { console.error('Error reading file:', err); return; }
        let interpreter = new Lexer(data)
        let get_tokens = interpreter.make_tokens()
        let parser = new Parser(get_tokens)
        let astTree = parser.parse()
        let executer = new Interpreter(astTree)
        executer.execute()
    }
    catch (e) {
        console.log(e.message)
    }


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
TT_KUNG = "KUNG"
TT_KUNGDILI = "KUNG DILI"
TT_KUNGWALA = "KUNG WALA"
TT_PUNDOK = "PUNDOK"
TT_LEFT_BRAC = "LEFT BRAC"
TT_RIGHT_BRAC = "RIGHT BRAC"
TT_GLOBAL_EXECUTE = false
TT_MODULO = "MODULO"
TT_OPEN_BRAK = "OPEN BRAK"
TT_CLOSE_BRAK = "CLOSE BRAK"
TT_ALANG_SA = "ALANG SA"
TT_LEFT_PAREN = "("
TT_RIGHT_PAREN = ")"


let keywords = [TT_SUGOD, TT_KATAPUSAN]
let dtype = [TT_NUMERO, TT_LETRA, TT_TINUOD, TT_TIPIK]
let comparisson_operator = [TT_GREATERTHAN, TT_LESSTHAN, TT_GREATERTHANOREQUAL, TT_LESSTHANOREQUAL, TT_EQUAL, TT_NOTEQUAL]
let logical_Operator = [TT_AND, TT_OR, TT_NOT]

let alphbet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let digit = "0123456789"
let alphbetdigit = alphbet + digit + "_" + "."
let alphnodigit = alphbet + "_"
let alphanodot = alphbet + digit + "_"


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


class Token {
    constructor(value = null, type = null) {
        this.value = value
        this.type = type
    }
}

class Lexer {
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
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "-") {
                        this.indx += 2
                        while (true) {
                            if (this.indx >= this.text.length) {
                                throw new Error("ERROR: missing Katapusan");
                            }
                            if ("\n".includes(this.text[this.indx])) {
                                this.indx += 1
                                let newtoken = new Token("\n", TT_NEWLINE)
                                tokens.push(newtoken)
                                
                                break
                            }
                            this.indx += 1
                        }

                        /*let newtoken = new Token(this.text[this.indx]+this.text[this.indx+1], "Comment")
                        tokens.push(newtoken)
                        this.indx+=2*/
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], "Not defined yet")
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], "Not defined yet")
                    tokens.push(newtoken)
                    this.indx += 1
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
            else if (this.text[this.indx] == "%") {
                let newtoken = new Token(this.text[this.indx], TT_MODULO)
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
            else if (this.text[this.indx] == "{") {
                let newtoken = new Token(this.text[this.indx], TT_LEFT_BRAC)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "}") {
                let newtoken = new Token(this.text[this.indx], TT_RIGHT_BRAC)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "(") {
                let newtoken = new Token(this.text[this.indx], TT_LEFT_PAREN)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == ")") {
                let newtoken = new Token(this.text[this.indx], TT_RIGHT_PAREN)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "[") {
                let newtoken = new Token(this.text[this.indx], TT_OPEN_BRAK)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "]") {
                let newtoken = new Token(this.text[this.indx], TT_CLOSE_BRAK)
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
                else if (value == "ALANG") {
                    let newtoken = new Token(value, TT_IDENTIFIER)
                    tokens.push(newtoken)
                }
                else if (value == "SA") {
                    if (tokens[tokens.length - 1].value = "ALANG") {
                        tokens[tokens.length - 1].value = "ALANG SA"
                        tokens[tokens.length - 1].type = TT_ALANG_SA
                    }
                    else {
                        let newtoken = new Token(value, TT_IDENTIFIER)
                        tokens.push(newtoken)
                    }

                }
                else if (value == TT_NOT) {
                    if (tokens[tokens.length - 1].value == TT_KUNG) {
                        tokens[tokens.length - 1].value = TT_KUNGDILI
                        tokens[tokens.length - 1].type = TT_KUNGDILI
                    }
                    else {
                        let newtoken = new Token(value, TT_NOT)
                        tokens.push(newtoken)
                    }

                }
                else if (value == TT_KUNG) {
                    let newtoken = new Token(value, TT_KUNG)
                    tokens.push(newtoken)
                }
                else if (value == "WALA") {
                    if (tokens[tokens.length - 1].value == TT_KUNG) {
                        tokens[tokens.length - 1].value = TT_KUNGWALA
                        tokens[tokens.length - 1].type = TT_KUNGWALA
                    }
                    else {
                        let newtoken = new Token(value, TT_IDENTIFIER)
                        tokens.push(newtoken)
                    }
                }
                else if (value == TT_PUNDOK) {
                    let newtoken = new Token(value, TT_PUNDOK)
                    tokens.push(newtoken)
                }
                else if (!isNaN(value) || value.trim() === "") {
                    if (/^-?\d+$/.test(value)) {
                        let newtoken = new Token(value, TT_NUMERO)
                        tokens.push(newtoken)
                    }
                    else if (/^-?\d+\.\d+$/.test(value)) {
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
                        this.indx += 1
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
                        this.indx += 1
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
                    else {
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
                this.indx += 1
            }
        }
        
        return tokens
    }
}

class Parser {
    constructor(token) {
        this.token = token
        this.position = 0
        this.variableCheck = []
        this.ast = { type: "Program", body: [] }
    }
    parse() {

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
            this.position += 1
            while (this.position < this.token.length) {
                if (this.token[this.position].type == TT_NEWLINE) {
                    
                    this.position += 1
                }

                else if (dtype.includes(this.token[this.position].type)) {
                    this.position += 1
                }
                else if (this.token[this.position].type == TT_VAR_DEC) {
                    let vardecJson = this.variabelDeclaration()
                    this.ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TT_IDENTIFIER) {
                    let vardecJson = this.variableAssignement()
                    this.ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TT_PRINT) {
                    let vardecJson = this.printFunction()
                    this.ast.body.push(vardecJson)
                }
                else if (this.token[this.position].type == TT_KUNG) {
                    this.ifStatement()
                }
                else if (this.token[this.position].type == TT_ALANG_SA) {
                    this.ast.body.push(this.forLoopStatement());
                    continue;
                }
                else if (this.token[this.position].value == TT_KATAPUSAN) {
                    if (this.position + 1 < this.token.length) {
                        throw new Error("Invalid Syntax");
                    }
                    else {
                        break
                    }
                }
                else if (this.token[this.position].type == TT_DAWATA) {
                    let handleDAWAT = this.inputFunction()
                    this.ast.body.push(handleDAWAT)
                    //Implement HERE
                }
                else {
                    throw new Error("Invalid Syntax " + this.token[this.position].value);
                    this.position += 1
                }
            }
        }
        else {
            throw new Error("ERROR: SUGOD missing");
        }
        return this.ast
    }
    forLoopStatement() {
        this.position++;
        this.expect(TT_LEFT_PAREN, "ERROR: Gipaabot ang '(' human sa ALANG SA.");
    
        
        const initialization = this.parseForLoopAssignment();
        this.expect(TT_COMMA, "ERROR: Gipaabot ang ',' human sa inisyalisasyon sa ALANG SA.");
    
        
        const condition = this.parseForLoopCondition();
        this.expect(TT_COMMA, "ERROR: Gipaabot ang ',' human sa kondisyon sa ALANG SA.");
    
        
        const update = this.parseForLoopAssignment();
        this.expect(TT_RIGHT_PAREN, "ERROR: Gipaabot ang ')' human sa pag-update sa ALANG SA.");
        this.expect(TT_NEWLINE, "ERROR: Gipaabot ang bag-ong linya human sa ')' sa ALANG SA.");
        this.expect(TT_PUNDOK, "ERROR: Gipaabot ang PUNDOK human sa ALANG SA.");
        this.expect(TT_LEFT_BRAC, "ERROR: Gipaabot ang '{' human sa PUNDOK sa ALANG SA.");
    
        const body = [];
        while (this.position < this.token.length && this.token[this.position].type !== TT_RIGHT_BRAC) {
            body.push(this.parseStatement()); 
        }
        this.expect(TT_RIGHT_BRAC, "ERROR: Gipaabot ang '}' aron tapuson ang PUNDOK sa ALANG SA.");
    
        return {
            "type": "ForLoop",
            "initialization": initialization,
            "condition": condition,
            "update": update,
            "body": body
        };
    }
    parseForLoopAssignment() {
        if (this.position >= this.token.length) {
            throw new Error("ERROR: Wala gipaabot nga katapusan sa token sa ALANG SA inisyalisasyon/update.");
        }
        if (this.token[this.position].type !== TT_IDENTIFIER) {
            throw new Error("ERROR: Gipaabot ang identifier sa inisyalisasyon/update sa ALANG SA.");
        }
        const variable = this.token[this.position].value;
        this.position++;
        this.expect("=", "ERROR: Gipaabot ang '=' human sa identifier sa inisyalisasyon/update sa ALANG SA.");
        this.position++; 
        const valueToken = this.token[this.position];
        let value;
        let valueType;

        if (valueToken.type === TT_NUMERO) {
            value = valueToken.value;
            valueType = TT_NUMERO;
        } else if (valueToken.type === TT_IDENTIFIER) {
            value = valueToken.value;
            valueType = TT_IDENTIFIER; // Could be a variable
        } else {
            throw new Error(`ERROR: Dili balido nga bili sa inisyalisasyon/update sa ALANG SA: ${valueToken.value}`);
        }
        this.position++;
        return {
            "type": "AssignmentExpression",
            "variable": variable,
            "value": value,
            "valueType": valueType // Store the type for later evaluation
        };
    }
    parseForLoopCondition() {
        // This is a simplified condition parser. You might need a more robust expression parser here
        if (this.position >= this.token.length) {
            throw new Error("ERROR: Wala gipaabot nga katapusan sa token sa ALANG SA kondisyon.");
        }
        const left = this.parseForLoopConditionPart();
        if (this.position >= this.token.length) {
            return left; // Could be a simple variable as a condition
        }
        const operatorToken = this.token[this.position];
        if (![TT_LESS_THAN, TT_LESS_THAN_OR_EQUAL, TT_GREATER_THAN, TT_GREATER_THAN_OR_EQUAL, TT_EQUAL_TO, TT_NOT_EQUAL].includes(operatorToken.type)) {
            return left; // No operator, just a variable
        }
        this.position++; // Consume operator
        const right = this.parseForLoopConditionPart();
        return {
            "type": "BinaryExpression",
            "left": left,
            "operator": operatorToken.value,
            "right": right
        };
    }
    parseForLoopConditionPart() {
        if (this.position >= this.token.length) {
            throw new Error("ERROR: Wala gipaabot nga katapusan sa token sa ALANG SA kondisyon nga bahin.");
        }
        const token = this.token[this.position];
        this.position++;
        if (token.type === TT_IDENTIFIER) {
            return { "type": "Variable", "name": token.value };
        } else if (token.type === TT_NUMERO_LITERAL) {
            return { "type": "NumberLiteral", "value": token.value };
        } else {
            throw new Error(`ERROR: Dili balido nga bahin sa kondisyon sa ALANG SA: ${token.value}`);
        }
    }
    parseStatement() {
        const currentToken = this.token[this.position];
        if (currentToken.type == TT_VAR_DEC) {
            return this.variabelDeclaration();
        } else if (currentToken.type == TT_IDENTIFIER) {
            return this.variableAssignement();
        } else if (currentToken.type == TT_PRINT) {
            return this.printFunction();
        } else if (currentToken.type == TT_DAWATA) {
            return this.inputFunction();
        } else if (currentToken.type == TT_KUNG) {
            this.ifStatement(); // Note: ifStatement might need to return an AST node later
            return null; // Or handle this differently based on your AST structure
        } else if (currentToken.type == TT_ALANG_SA) {
            return this.forLoopStatement();
        }
        // ... (other statement types) ...
        else {
            throw new Error(`ERROR: Dili mailhang sinugdanan sa pahayag: ${currentToken.value}`);
        }
    }   
    expect(typeOrValue, message) {
        if (this.position >= this.token.length) {
            throw new Error("ERROR: Wala gipaabot nga katapusan sa token. " + message);
        }
        const currentToken = this.token[this.position];
        if (typeof typeOrValue === 'string') {
            if (currentToken.value !== typeOrValue) {
                throw new Error(`${message} Nakit-an: '${currentToken.value}' (${currentToken.type}) sa posisyon ${this.position}.`);
            }
        } else {
            if (currentToken.type !== typeOrValue) {
                throw new Error(`${message} Nakit-an: '${currentToken.value}' (${currentToken.type}) sa posisyon ${this.position}.`);
            }
        }
        this.position++;
        return currentToken;
    }
    variabelDeclaration() {
        let vardec = { "type": null, "dataType": null, "variables": [] }
        vardec["type"] = "VariableDeclaration"


        this.position += 1
        if (this.position < this.token.length && this.token[this.position].type == TT_DTYPE) {
            vardec["dataType"] = this.token[this.position].value
            this.position += 1
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
            
            if (this.token[this.position].type == TT_NEWLINE) {
                this.position += 1
                break
            }
            if (this.token[this.position].type == TT_COMMA) {
                
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
                        if (vardec["dataType"] == TT_NUMERO || vardec["dataType"] == TT_TIPIK || vardec["dataType"] == TT_TINUOD) {
                            var holdString = ""
                            while (true) {
                                if (this.position >= this.token.length) {
                                    throw new Error("ERROR: Missing Katapusan");
                                }

                                if (this.token[this.position].type == TT_COMMA || this.token[this.position].type == TT_NEWLINE) {
                                    //pass to shell

                                    if ((holdString == '"OO"' || holdString == '"DILI"') && vardec["dataType"] == TT_TINUOD) {

                                        identifier_hold["value"] = holdString
                                        let identhold = identifier_hold;
                                        identhold["datatype"] = TT_TINUOD
                                        this.variableCheck.push(identhold)

                                        vardec.variables.push(identifier_hold)

                                        
                                    }
                                    else {
                                        let [output, error] = run("<stdin>", holdString);

                                        if (error) {
                                            throw new Error("ERROR: Invalid number");
                                        } else {
                                            if (vardec["dataType"] == TT_NUMERO || vardec["dataType"] == TT_TINUOD) {
                                                if (vardec["dataType"] == TT_NUMERO && output.isBool == false) {
                                                    identifier_hold["value"] = parseInt(output.value) + ""
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TT_NUMERO
                                                    this.variableCheck.push(identhold)
                                                }
                                                else if (vardec["dataType"] == TT_TINUOD && output.isBool == true) {
                                                    identifier_hold["value"] = parseInt(output.value) == 1 ? "OO" : "DILI"
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TT_TINUOD
                                                    this.variableCheck.push(identhold)
                                                }
                                                else if (vardec["dataType"] == TT_TINUOD && output.isBool == false) {
                                                    identifier_hold["value"] = parseInt(output.value) == 1 ? "OO" : "DILI"
                                                    let identhold = identifier_hold;
                                                    identhold["datatype"] = TT_TINUOD
                                                    this.variableCheck.push(identhold)
                                                }
                                                else {
                                                    throw new Error("ERROR:Invalid Integer or Boolean");
                                                }


                                            }
                                            else {
                                                identifier_hold["value"] = formatNumber(output.value + "")
                                                let identhold = identifier_hold;
                                                identhold["datatype"] = TT_TIPIK
                                                this.variableCheck.push(identhold)
                                            }


                                            vardec.variables.push(identifier_hold)

                                            
                                        }


                                    }
                                    break
                                }

                                if (this.token[this.position].type == TT_IDENTIFIER) {
                                    let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[this.position].value);
                                    

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

        this.position += 1
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
                        if (this.token[this.position].type == TT_NEWLINE && active != "equals") {
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
                                
                                break;
                            }

                            if (this.token[copypos].type == TT_NEWLINE) {
                                let neweval = ""
                                
                                if (evalString == '"OO"' || evalString == '"DILI"') {
                                    
                                    holdvalue = evalString[0]
                                    break
                                }
                                else {
                                    let [output, error] = run("<stdin>", evalString);

                                    if (error) {
                                        
                                        break
                                    } else {
                                        if (output.isBool == true) {
                                            holdvalue = parseInt(output.value) == 1 ? "OO" : "DILI"
                                        }
                                        else {
                                            holdvalue = output.value + ""
                                        }

                                        indicHold = "value"
                                        active = "ident"
                                        indicdtype = "EXPRESSION"

                                        this.position = copypos

                                        

                                        skip = true

                                        break
                                    }
                                }
                            }

                            if (this.token[copypos].type == TT_IDENTIFIER) {
                                let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[copypos].value);
                                

                                if (existingVar) {
                                    
                                    if ((existingVar["value"] == "OO" || existingVar["value"] == "DILI") && (this.token[copypos + 1].type == TT_NEWLINE || this.token[copypos + 1].type == TT_ASSIGN) && evalString == "") {

                                        evalString += existingVar["value"]
                                    }
                                    else if (existingVar["value"] == "DILI") {
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
                                if ((this.token[copypos].value == '"OO"' || this.token[copypos].value == '"DILI"') && this.token[copypos + 1].type == TT_NEWLINE && evalString == "") {

                                    evalString += this.token[copypos].value
                                }
                                else if (this.token[copypos].value == '"OO"') {
                                    
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
                            active = "ident"
                            this.position += 1
                        }
                        else if (this.token[this.position].type == TT_ASSIGN) {
                            if (active != "ident") {
                                throw new Error("Invalid assignment position");
                            }
                            active = "equals"
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

        
        return assignmentJSON
    }


    printFunction() {
        let printJSON = { "type": "PrintFunction", "expression": [] }
        this.position += 1
        if (this.position < this.token.length) {
            if (this.token[this.position].type != TT_COLON || this.token[this.position].type == TT_NEWLINE) {
                throw new Error("COLON needed");
            }
            this.position += 1
            if (this.position < this.token.length) {
                if (this.token[this.position].type == TT_IDENTIFIER || dtype.includes(this.token[this.position].type) || this.token[this.position].type == TT_STRING || this.token[this.position].type == TT_NEXTLINE) {
                    let printElem = { "type": (this.token[this.position].type == TT_IDENTIFIER ? "Variable" : dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TT_STRING ? "String" : this.token[this.position].type == TT_NEXTLINE ? TT_NEXTLINE : "Unknown"), "name": this.token[this.position].value }
                    printJSON["expression"].push(printElem)
                }
                else if (this.token[this.position].type == TT_OPEN_BRAK) {
                    if (this.position + 2 >= this.token.length) {
                        throw new Error("ERROR: Invalid closing Brackets");
                    }
                    if (this.token[this.position + 2].type == TT_CLOSE_BRAK) {
                        let printElem = { "type": "String", "name": this.token[this.position+1].value+"" }
                        printJSON["expression"].push(printElem)
                        this.position += 2
                    }
                    else {
                        throw new Error("ERROR: Should have opening Brackets");
                    }
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
                    else {
                        throw new Error("Invalid Separation of Variables, string, indetifier");
                    }
                }
                else {
                    if (this.token[this.position].type == TT_IDENTIFIER || dtype.includes(this.token[this.position].type) || this.token[this.position].type == TT_STRING || this.token[this.position].type == TT_NEXTLINE) {
                        let printElem = { "type": (this.token[this.position].type == TT_IDENTIFIER ? "Variable" : dtype.includes(this.token[this.position].type) ? "Value" : this.token[this.position].type == TT_STRING ? "String" : this.token[this.position].type == TT_NEXTLINE ? TT_NEXTLINE : "Unknown"), "name": this.token[this.position].value }
                        printJSON["expression"].push(printElem)
                        this.position += 1
                        beforeToken = "indetifier"
                    }
                    else if (this.token[this.position].type == TT_OPEN_BRAK) {
                        if (this.position + 2 >= this.token.length) {
                            throw new Error("ERROR: Invalid closing Brackets");
                        }
                        if (this.token[this.position + 2].type == TT_CLOSE_BRAK) {
                            let printElem = { "type": "String", "name": this.token[this.position+1].value+"" }
                            printJSON["expression"].push(printElem)
                            this.position += 3
                            beforeToken = "indetifier"
                        }
                        else {
                            throw new Error("ERROR: Should have opening Brackets");
                        }
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

        
        return printJSON
    }

    inputFunction() {
        

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
        inputJson["varlist"].push({ "dtype": this.token[this.position].type, "value": this.token[this.position].value })

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
                    inputJson["varlist"].push({ "dtype": this.token[this.position].type, "value": this.token[this.position].value })
                    valid = "identifier"
                    this.position += 1
                }
                else {
                    throw new Error("Comma before needed");
                }
            }
            else if (this.token[this.position].type == TT_COMMA) {
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

        
        return inputJson
    }

    ifStatement() {
        this.position += 1

        /*0 means if
1 means else if
2 means the next else if
...*/
        let ifIndic = 0
        //means that the expression in the if or else if is "OO"
        let ifStay = false
        //check if the last elem is Pundok
        let isPundok = false

        //check if the if or any else if statemen is already executed or not
        let execute = false

        //Check if Kung is parsed
        let isKungExecuted = false

        //Check if KungWala is parsed
        let isKungWalaExecuted = false

        while (true) {


            if (this.position >= this.token.length) {
                throw new Error("ERROR: Missing Katapusan");
            }
            /*if (isKungWalaExecuted == true) {
                this.position+=1
                return
            }*/
            if (isPundok == true) {
                if (this.position >= this.token.length) {
                    throw new Error("ERROR: Missing Katapusan");
                }

                while (true) {
                    if (this.position >= this.token.length) {
                        throw new Error("ERROR: Missing Katapusan");
                    }
                    if (this.token[this.position].type == TT_NEWLINE) {

                    }
                    else if (this.token[this.position].type == TT_LEFT_BRAC) {
                        break
                    }
                    else {
                        throw new Error("ERROR: Missing Bracket");
                    }
                    this.position += 1
                }

                if (this.token[this.position].type == TT_LEFT_BRAC) {
                    

                    while (true) {
                        
                        if (this.position >= this.token.length) {
                            throw new Error("ERROR: Missing Katapusan");
                        }

                        if (this.token[this.position].type == TT_RIGHT_BRAC) {
                            if (ifStay == true) {
                                execute = true
                            }
                            TT_GLOBAL_EXECUTE = false
                            
                            isPundok = false
                            isKungExecuted = true

                            this.position += 1
                            //remove newlines
                            while (true) {
                                
                                if (this.position >= this.token.length) {
                                    throw new Error("ERROR: Missing Katapusan");
                                }
                                if (this.token[this.position].type == TT_NEWLINE) {

                                }
                                else if (this.token[this.position].type == TT_KUNGDILI || this.token[this.position].type == TT_KUNGWALA) {
                                    //this.position+=1
                                    
                                    this.position -= 1
                                    

                                    break
                                }
                                else {
                                    if (isKungWalaExecuted == true) {
                                        
                                        this.position -= 1
                                        
                                        return
                                        
                                    }
                                    if (isKungExecuted == true) {
                                        
                                        this.position -= 1
                                        
                                        break
                                    } 
                                    else {
                                        throw new Error("ERROR: Invalid If Execution");
                                    }
                                }
                                this.position += 1
                            }
                            break
                        }
                        else if (this.token[this.position].type == TT_KUNG) {
                            this.ifStatement()
                            
                            this.position-=1
                        }
                        else if (TT_GLOBAL_EXECUTE == true) {

                        }
                        /*else if (execute === true) {

                            console.log("Run exec")
                        }*/
                        else if (this.token[this.position].type == TT_VAR_DEC && ifStay == true && execute == false) {
                            
                            let vardecJson = this.variabelDeclaration()
                            this.ast.body.push(vardecJson)
                            this.position-=1
                        }
                        else if (this.token[this.position].type ==TT_IDENTIFIER && ifStay == true && execute == false) {
                            
                            let vardecJson = this.variableAssignement()
                            
                            this.ast.body.push(vardecJson)
                            this.position-=1
                        }
                        else if (this.token[this.position].type ==TT_PRINT && ifStay == true && execute == false) {
                            
                            let vardecJson = this.printFunction()
                            
                            this.ast.body.push(vardecJson)
                            this.position-=1
                        }
                        else if (this.token[this.position].type ==TT_DAWATA && ifStay == true && execute == false) {
                            
                            let vardecJson = this.inputFunction()
                            
                            this.ast.body.push(vardecJson)
                            this.position-=1
                        }
                        else {

                        }
                        this.position += 1
                    }
                }
                else {
                    throw new Error("ERROR: Missing Bracket");
                }
            }
            else if (this.token[this.position].value == "(") {
                this.position += 1

                let holdString = ""
                while (true) {
                    if (this.position >= this.token.length) {
                        throw new Error("ERROR: Missing Katapusan");
                    }

                    if (this.token[this.position].value == ")") {

                        if (holdString == " 1 ") {
                            
                            ifIndic += 1
                            ifStay = true
                        }
                        else if (holdString == " 0 ") {
                            TT_GLOBAL_EXECUTE = true
                            ifIndic += 1
                            ifStay = false
                        }
                        else {
                            let [output, error] = run("<stdin>", holdString);

                            if (error) {
                                throw new Error("ERROR: Should be TINUOD Datatype");
                            } else {
                                if (output.isBool == true) {
                                    if (output.value == 1) {
                                        ifIndic += 1
                                        ifStay = true

                                    }
                                    else {
                                        TT_GLOBAL_EXECUTE = true
                                        ifIndic += 1
                                        ifStay = false

                                    }
                                }
                                else {
                                    throw new Error("ERROR: Should be TINUOD Datatype");
                                }
                            }
                        }

                        //check if the next token is Pundok
                        this.position += 1

                        while (true) {
                            if (this.position >= this.token.length) {
                                throw new Error("ERROR: Missing Katapusan");
                            }
                            if (this.token[this.position].type == TT_NEWLINE) {

                            }


                            else if (this.token[this.position].type == TT_PUNDOK) {
                                isPundok = true
                                break
                            }
                            else {
                                throw new Error("ERROR: Invalid Data: Should be PUNDOK");
                            }
                            this.position += 1
                        }
                        break
                    }

                    if (this.token[this.position].type == TT_IDENTIFIER) {
                        let existingVar = this.variableCheck.find(variable => variable["name"] === this.token[this.position].value);
                        

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
                    


                }

            }
            else if (this.token[this.position].type == TT_KUNGDILI) {
               
                if (isKungExecuted == false) {
                    throw new Error("Invalid KUNGDILI Position");
                }
                if (isKungWalaExecuted == true) {
                    throw new Error("Invalid KUNGDILI Position");
                }

                if (this.position + 1 >= this.token.length) {
                    throw new Error("ERROR: Missing Katapusan");
                }

                if (this.token[this.position + 1].value != "(") {
                    throw new Error("ERROR: Lack '('");
                }

            }
            else if (this.token[this.position].type == TT_KUNGWALA) {
                if (isKungExecuted == false) {
                    throw new Error("Invalid KUNGWALA Position");
                }
                if (this.position + 1 >= this.token.length) {
                    throw new Error("ERROR: Missing Katapusan");
                }

                //Remove all new lines
                //check if the next token is Pundok
                this.position += 1

                while (true) {
                    if (this.position >= this.token.length) {
                        throw new Error("ERROR: Missing Katapusan");
                    }
                    if (this.token[this.position].type == TT_NEWLINE) {

                    }


                    else if (this.token[this.position].type == TT_PUNDOK) {
                        isPundok = true
                        ifIndic += 1
                        ifStay = true
                        isKungWalaExecuted = true
                        break
                    }
                    else {
                        throw new Error("ERROR: Invalid Data: Should be PUNDOK");
                    }
                    this.position += 1
                }


            }
            else {
                if (isKungExecuted == true) {
                    TT_GLOBAL_EXECUTE = false
                    
                    break
                }
                else if (isKungWalaExecuted == true) {
                    TT_GLOBAL_EXECUTE = false
                    
                    this.position += 1
                    break
                }
                throw new Error("ERROR: Missing (");
            }

            this.position += 1
            
        }
    }
}


class Interpreter {
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
            else if (nodes["type"] == "ForLoop") {
                this.executeForLoop(nodes);
            }
            else {

            }
        }
    }
    executeForLoop(node) {
        // Execute initialization
        this.executeForLoopAssignment(node.initialization);
    
        while (this.evaluateForLoopCondition(node.condition)) {
            // Execute the body of the loop
            for (let bodyNode of node.body) {
                this.executeStatement(bodyNode); // Create a general executeStatement method
            }
            // Execute the update
            this.executeForLoopAssignment(node.update);
        }
    }
    executeForLoopAssignment(assignmentNode) {
        const variableName = assignmentNode.variable;
        const value = assignmentNode.value;
        const valueType = assignmentNode.valueType;
    
        let existingVarIndex = this.memory.findIndex(variable => variable["name"] === variableName);
        if (existingVarIndex !== -1) {
            let newValue;
            if (valueType === TT_NUMERO) {
                newValue = parseInt(value);
            } else if (valueType === TT_IDENTIFIER) {
                const sourceVar = this.memory.find(variable => variable["name"] === value);
                if (!sourceVar || (sourceVar.datatype !== TT_NUMERO && sourceVar.datatype !== TT_TIPIK)) {
                    throw new Error(`ERROR: Ang bili sa '${value}' kinahanglanon nga numero sa ALANG SA loop.`);
                }
                newValue = parseInt(sourceVar.value);
            } else {
                throw new Error(`ERROR: Dili balido nga bili sa pag-update sa ALANG SA loop.`);
            }
    
            if (this.memory[existingVarIndex].datatype === TT_NUMERO) {
                this.memory[existingVarIndex].value = newValue + "";
            } else if (this.memory[existingVarIndex].datatype === TT_TIPIK) {
                this.memory[existingVarIndex].value = formatNumber(newValue + "");
            } else {
                throw new Error(`ERROR: Ang variable '${variableName}' kinahanglanon nga numero sa ALANG SA loop.`);
            }
        } else {
            throw new Error(`ERROR: Wala mailhang variable '${variableName}' sa ALANG SA loop.`);
        }
    }
    
    evaluateForLoopCondition(conditionNode) {
        if (!conditionNode) {
            return true; // If no condition, loop indefinitely (be careful!)
        }
        if (conditionNode.type === "Variable") {
            const variable = this.memory.find(v => v.name === conditionNode.name);
            return variable && (variable.value == "OO" || parseInt(variable.value) !== 0); // Treat variable existence or non-zero number as true
        } else if (conditionNode.type === "NumberLiteral") {
            return parseInt(conditionNode.value) !== 0;
        } else if (conditionNode.type === "BinaryExpression") {
            const leftValue = this.getConditionValue(conditionNode.left);
            const rightValue = this.getConditionValue(conditionNode.right);
            const operator = conditionNode.operator;
    
            if (typeof leftValue !== 'number' || typeof rightValue !== 'number') {
                throw new Error("ERROR: Ang mga operasyon sa pagtandi sa ALANG SA loop kinahanglanon nga numero.");
            }
    
            switch (operator) {
                case "<": return leftValue < rightValue;
                case "<=": return leftValue <= rightValue;
                case ">": return leftValue > rightValue;
                case ">=": return leftValue >= rightValue;
                case "==": return leftValue == rightValue;
                case "!=": return leftValue != rightValue;
                default: throw new Error(`ERROR: Dili mailhang operator sa pagtandi: ${operator}`);
            }
        }
        return false;
    }
    
    getConditionValue(node) {
        if (node.type === "Variable") {
            const variable = this.memory.find(v => v.name === node.name);
            if (!variable || (variable.datatype !== TT_NUMERO && variable.datatype !== TT_TIPIK)) {
                throw new Error(`ERROR: Ang variable '${node.name}' kinahanglanon nga numero sa kondisyon sa ALANG SA loop.`);
            }
            return parseInt(variable.value);
        } else if (node.type === "NumberLiteral") {
            return parseInt(node.value);
        } else {
            throw new Error(`ERROR: Dili balido nga bahin sa kondisyon: ${JSON.stringify(node)}`);
        }
    }
    executeStatement(node) {
        if (node["type"] == 'VariableDeclaration') {
            this.executeVariableDeclaration(node);
        } else if (node["type"] == "VariableAssignment") {
            this.executeVariableAssignment(node);
        } else if (node["type"] == "PrintFunction") {
            let stringexec = this.executePrintFunction(node);
            const result = stringexec.replaceAll('"', '').replaceAll("'", '');
            console.log(result);
        } else if (node["type"] == "InputFunction") {
            this.executeInputFunction(node);
        } else if (node["type"] == "IfStatement") {
            // Implement this later
        } else if (node["type"] == "ForLoop") {
            this.executeForLoop(node);
        }
        // ... (other statement types) ...
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

        
    }
    executeVariableAssignment(nodes) {
        for (let nodeassign of nodes["assignments"]) {
            
            let existingVar = this.memory.find(variable => variable["name"] === nodeassign["variable"]);

            if (existingVar) {
                if (nodeassign["indicator"] == "value") {
                    if (nodeassign["value"] != null) {
                        if (nodeassign["dtype"] == "EXPRESSION") {
                            let existingVarIndex = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            if (existingVar["datatype"] == TT_NUMERO) {
                                this.memory[existingVarIndex].value = parseInt(nodeassign["value"]) + ""
                            }
                            else if (existingVar["datatype"] == TT_TIPIK) {
                                this.memory[existingVarIndex].value = formatNumber(nodeassign["value"] + "")
                            }
                            else if (existingVar["datatype"] == TT_TINUOD) {
                                this.memory[existingVarIndex].value = nodeassign["value"] + ""
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
                                this.memory[change].value = parseInt(this.memory[valchange].value) + ""
                            }
                            else if (this.memory[change].datatype == TT_TIPIK) {
                                this.memory[change].value = formatNumber(this.memory[valchange].value + "")
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
        
    }

    executePrintFunction(nodes) {
        this.executeString = ""
        for (let expr of nodes["expression"]) {
            if (expr["type"] == "Value") {
                this.executeString += expr["name"]
            }
            else if (expr["type"] == "Variable") {
                let existingVarExpr = this.memory.find(variable => variable["name"] === expr["name"]);
                if (existingVarExpr) {
                    if (existingVarExpr["value"] != null) {
                        this.executeString += existingVarExpr["value"]
                    }
                }
                else {
                    throw new Error("ERROR: Variable not found");
                }
            }
            else if (expr["type"] == "String") {
                this.executeString += expr["name"]
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
                    this.memory[changeInp].value = `\'${values[val].trim()}\'`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
            else if (goodList[val].datatype === "TINUOD") {
                if (values[val].trim() == "OO" || values[val].trim() == "DILI") {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = `\"${values[val].trim()}\"`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
        }

        

    }
}




