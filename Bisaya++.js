
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
    constructor(pos_start, pos_end, error_name, details) {
        this.pos_start = pos_start
        this.pos_end = pos_end
        this.error_name = error_name;
        this.details = details
    }
    as_string() {
        let result = `${this.error_name}: ${this.details}`
        result += `File ${this.pos_start.fn}, line ${this.pos_start.ln + 1}`
        return result
    }
}
class IllegalCharError extends Error{
    constructor(pos_start, pos_end,details) {
        super(pos_start, pos_end,"Illegal Character", details)
    }
}
//Position
class Position {
    constructor(idx, ln, col, fn, ftxt) {
        this.idx = idx;
        this.ln = ln;
        this.col = col;
        this.fn = fn;
        this.ftxt = ftxt;
    }

    advance(current_char) {
        this.idx += 1;
        this.col += 1;

        if (current_char === '\n') {
            this.ln += 1;
            this.col = 0;
        }

        return this;
    }

    copy() {
        return new Position(this.idx, this.ln, this.col, this.fn, this.ftxt);
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
    constructor(fn, text) {
        this.fn = fn
        this.text = text
        this.pos = new Position(-1,0,-1,fn,text)
        this.current_char = null
        this.advance() 
    }
    advance() {
        this.pos.advance(this.current_char)
        this.current_char = this.pos.idx < this.text.length ? this.text[this.pos.idx]: null
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
                let pos_start = this.pos.copy();
                let char = this.current_char
                this.advance()
                return {tokens: [], error: new IllegalCharError(pos_start,this.pos,"'" + char + "'") }
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
function run(fn,text) {
    let lexer = new Lexer(fn,text); 
    let result = lexer.make_tokens();

    return [result.tokens,result.error]
}

module.exports = { run };
