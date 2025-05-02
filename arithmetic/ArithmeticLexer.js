const { Position } = require('../utils/Position.js')
const { Token } = require('../Token.js')
const { TokenType } = require('../TokenType.js')
const { IllegalCharError } = require('../errors/IllegalCharError.js')
const { StaticVariable } = require('../utils/StaticVariable.js')

class ArithmeticLexer {
    constructor(fn, text) {
        this.fn = fn
        this.text = text
        this.pos = new Position(-1, 0, -1, fn, text)
        this.current_char = null
        this.advance()
    }
    advance() {
        this.pos.advance(this.current_char)
        this.current_char = this.pos.idx < this.text.length ? this.text[this.pos.idx] : null
    }
    make_tokens() {
        let tokens = []

        while (this.current_char != null) {
            if (" \t".includes(this.current_char)) {
                this.advance()
            }
            else if (StaticVariable.DIGITS.includes(this.current_char)) {
                tokens.push(this.make_number())
            }
            else if (StaticVariable.LETTERS.includes(this.current_char)) {
                tokens.push(this.make_identifier());
            }
            else if (this.current_char === "+") {
                tokens.push(new Token(this.pos.copy(), TokenType.PLUS))
                this.advance()
            }
            else if (this.current_char === "-") {
                tokens.push(new Token(this.pos.copy(), TokenType.MINUS))
                this.advance()
            }
            else if (this.current_char === "*") {
                tokens.push(new Token(this.pos.copy(), TokenType.MUL))
                this.advance()
            }
            else if (this.current_char === "/") {
                tokens.push(new Token(this.pos.copy(), TokenType.DIV))
                this.advance()
            }
            else if (this.current_char === "(") {
                tokens.push(new Token(this.pos.copy(), TokenType.LPAREN))
                this.advance()
            }
            else if (this.current_char === ")") {
                tokens.push(new Token(this.pos.copy(), TokenType.RPAREN))
                this.advance()
            }
            //recent changes
            /*else if (this.current_char === '!') {
                let { token, error } = this.make_not_equals();
            
                if (error) {
                    return { tokens: [], error }; 
                }
            
                tokens.push(token);
            }*/
            else if (this.current_char === "=") {
                tokens.push(this.make_equals())
            }
            else if (this.current_char === "<") {
                tokens.push(this.make_less_than())
            }
            else if (this.current_char === ">") {
                tokens.push(this.make_greater_than())
            }
            else {
                let pos_start = this.pos.copy();
                let char = this.current_char
                this.advance()
                return { tokens: [], error: new IllegalCharError(pos_start, this.pos, "'" + char + "'") }
            }

        }

        tokens.push(new Token(this.pos.copy(), TokenType.TT_EOF))
        return { tokens, error: null }

    }
    make_number() {
        let num_str = ""
        let dot_count = 0
        let pos_start = this.pos.copy()

        while (this.current_char !== null && (StaticVariable.DIGITS + ".").includes(this.current_char)) {
            if (this.current_char === ".") {
                if (dot_count == 1) break;
                dot_count += 1
                num_str += "."
            }
            else {
                num_str += this.current_char
            }
            this.advance()
        }

        if (dot_count === 0) {
            return new Token(parseInt(num_str, 10), TokenType.NUMERO, pos_start, this.pos)
        }
        else {
            return new Token(parseFloat(num_str), TokenType.TIPIK, pos_start, this.pos)
        }
    }
    make_identifier() {
        let id_str = '';
        let pos_start = this.pos.copy();
    
        while (
            this.current_char !== null &&
            (StaticVariable.LETTERS_DIGITS + '_').includes(this.current_char)
        ) {
            id_str += this.current_char;
            this.advance();
        }
        
        let tok_type = TokenType.KEYWORDS.includes(id_str) ? TokenType.TT_KEYWORD : TokenType.TT_IDENTIFIER;
        return new Token(id_str, tok_type, pos_start, this.pos);
    }
    make_equals() {
        let tok_Type = TokenType.TT_EQ
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TokenType.TT_EE
        }

        return new Token("", tok_Type, posStart, this.pos)
    }

    make_greater_than() {
        let tok_Type = TokenType.TT_GT
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TokenType.TT_GTE
        }

        return new Token("", tok_Type, posStart, this.pos)
    }

    make_less_than() {
        let tok_Type = TokenType.TT_LT
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TokenType.TT_LTE
        }
        else if (this.current_char == ">") {
            this.advance()
            tok_Type = TokenType.TT_NE
        }

        return new Token("", tok_Type, posStart, this.pos)
    }
}

module.exports = { ArithmeticLexer };