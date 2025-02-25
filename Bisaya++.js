
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

//Error
class Error{
    constructor(error_name, details) {
        this.error_name = error_name;
        this.details = details
    }
    as_string() {
        let result = `${this.error_name}: ${this.details}`
        return result
    }
}
class IllegalCharError extends Error{
    constructor(details) {
        super("Illegal Character", details)
    }
}
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
            else {
                let char = this.current_char
                this.advance()
                return {tokens: [], error: new IllegalCharError("'" + char + "'") }
            }

        }

        return { tokens, error: null}

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

//RUN
function run(text) {
    let lexer = new Lexer(text); 
    let result = lexer.make_tokens();

    return [result.tokens,result.error]
}

module.exports = { run };
