/*class BisayaInterpreter {
    constructor() {
        this.variables = {}; // Store variables
        this.isInsideProgram = false; // Track if inside SUGOD-KATAPUSAN
    }

    // Improved tokenizer: correctly handles operators, commas, and assignments
    tokenize(code) {
        return code.match(/\b\w+\b|[,=+&"$\[\]]/g) || [];
    }

    /*parse(tokens) {
        let index = 0;
        while (index < tokens.length) {
            let token = tokens[index];

            if (token === "SUGOD") {
                if (this.isInsideProgram) throw new Error("Syntax Error: Nested SUGOD is not allowed");
                this.isInsideProgram = true;
            } else if (token === "KATAPUSAN") {
                if (!this.isInsideProgram) throw new Error("Syntax Error: KATAPUSAN without SUGOD");
                this.isInsideProgram = false;
            } else if (token === "MUGNA") {
                // Variable declaration
                if (!this.isInsideProgram) throw new Error("Syntax Error: Variable declaration outside SUGOD-KATAPUSAN block");
                if (index + 2 >= tokens.length) throw new Error("Syntax Error: Incomplete variable declaration");

                let type = tokens[++index]; // NUMERO, LETRA, TINUOD
                let names = [];
                let value = null;
                index++;

                // Collect variable names until we hit `=` or the end
                while (index < tokens.length && tokens[index] !== "=" && tokens[index] !== "KATAPUSAN") {
                    let varName = tokens[index].replace(',', ''); // Remove trailing commas
                    if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(varName)) {
                        throw new Error(`Syntax Error: Invalid variable name '${varName}'`);
                    }
                    names.push(varName);
                    index++;
                }

                // If `=` is found, process assignment
                if (tokens[index] === "=") {
                    index++;
                    if (index >= tokens.length) throw new Error("Syntax Error: Missing value in assignment");
                    value = this.evaluateExpression(tokens[index]);
                }

                // Declare variables with value (or null if not assigned)
                names.forEach(name => {
                    if (this.variables.hasOwnProperty(name)) throw new Error(`Runtime Error: Variable '${name}' is already declared`);
                    this.variables[name] = value;
                });
            } else if (token === "IPAKITA:") {
                // Print statement
                if (!this.isInsideProgram) throw new Error("Syntax Error: IPAKITA outside SUGOD-KATAPUSAN block");
                
                let output = "";
                index++;
                while (index < tokens.length && tokens[index] !== "KATAPUSAN") {
                    if (!tokens[index]) throw new Error("Syntax Error: Unexpected token in print statement");
                    output += this.evaluateExpression(tokens[index]);
                    index++;
                }
                console.log(output);
            } else if (!this.isInsideProgram) {
                throw new Error("Syntax Error: Code outside SUGOD-KATAPUSAN block");
            } else {
                throw new Error(`Syntax Error: Unrecognized token '${token}'`);
            }
            index++;
        }
    }

    evaluateExpression(expression) {
        if (!isNaN(expression)) return Number(expression); // Numeric literals
        if (expression.startsWith('"') && expression.endsWith('"')) return expression.slice(1, -1); // String literals
        if (this.variables.hasOwnProperty(expression)) return this.variables[expression]; // Variables
        throw new Error(`Runtime Error: Undefined variable '${expression}'`);
    }

    run(code) {
        try {
            let tokens = this.tokenize(code);
            console.log(tokens)
        } catch (error) {
            console.error(error.message);
        }
    }
}

// Sample Bisaya++ Code
const code = `
SUGOD
MUGNA NUMERO x, y, z = 5
MUGNA LETRA a_1 = "n"
MUGNA TINUOD t = "OO"
x = y = 4
a_1 = "c"
IPAKITA: x & t & z & "$" & a_1 & [#] & "last"
KATAPUSAN
`;

const interpreter = new BisayaInterpreter();
interpreter.run(code);*/
//DIGIT
const DIGITS = "0123456789"
//TOKENS
const NUMERO = "INT"
const TIPIK = "FLOAT"
const PLUS = "PLUS"
const MINUS = "MINUS"
const MUL = "MUL"
const DIV = "DIV"
const LPAREN = "LPAREN"
const RPAREN = "RPAREN"

//Lexer creation
class Token{
    constructor(type,value = null) {
        this.type =type;
        this.value =value;
    }
    toString() {
        return this.value !== null ? `${this.type}:${this.value}` : `${this.type}`;
    }
}

class Lexer{
    constructor(text) {
        this.text = text
        this.pos = -1
        this.current_char = null
        this.advance() 
    }
    advance() {
        this.pos += 1
        this.current_char = this.pos < this.text.length ? this.text[this.pos]: null
    }
    make_tokens() {
        let tokens = []

        while (this.current_char != null) {
            if (" \t".includes(this.current_char)) {
                this.advance()
            }
            else if (DIGITS.includes(this.current_char)) {
                tokens.push(this.make_number())
            }
            else if (this.current_char === "+") {
                tokens.push(new Token(PLUS))
                this.advance()
            }
            else if (this.current_char === "-") {
                tokens.push(new Token(MINUS))
                this.advance()
            }
            else if (this.current_char === "*") {
                tokens.push(new Token(MUL))
                this.advance()
            }
            else if (this.current_char === "/") {
                tokens.push(new Token(DIV))
                this.advance()
            }
            else if (this.current_char === "(") {
                tokens.push(new Token(LPAREN))
                this.advance()
            }
            else if (this.current_char === ")") {
                tokens.push(new Token(RPAREN))
                this.advance()
            }
        }

    }
    make_number() {
        let num_str = ""
        let dot_count = 0

        while (this.current_char !== null && (DIGITS+".").includes(this.current_char)) {
            if (this.current_char === ".") {
                if (dot_count == 1) break;
                dot_count += 1
                num_str+="."
            }
            else {
                num_str += this.current_char
            }
            this.advance()
        }

        if (dot_count === 0) {
            return new Token(NUMERO,parseInt(num_str,10))
        }
        else {
            return new Token(TIPIK,parseFloat(num_str))
        }
    }
}



