const { TokenType } = require('./TokenType.js');
const { Token } = require('./Token.js');
const { StaticVariable } = require('./utils/StaticVariable.js');
class Lexer {
    constructor(text) {
        this.text = text.trim()
        this.indx = 0;
    }
    tokenize() {
        let tokens = []

        while (this.indx < this.text.length) {
            if (" \t\r".includes(this.text[this.indx])) {
                this.indx += 1
                continue
            }
            else if ("\n".includes(this.text[this.indx])) {
                this.indx += 1
                let newtoken = new Token("\n", TokenType.TT_NEWLINE)
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
                                let newtoken = new Token("\n", TokenType.TT_NEWLINE)
                                tokens.push(newtoken)
                                // console.log("Good slach n")
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
                let newtoken = new Token(this.text[this.indx], TokenType.TT_COMMA)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "=") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token("==", TokenType.TT_EQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TokenType.TT_ASSIGN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TokenType.TT_ASSIGN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if (this.text[this.indx] == "&") {
                let newtoken = new Token(this.text[this.indx], TokenType.TT_CONCAT)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "$") {
                let newtoken = new Token(this.text[this.indx], TokenType.TT_NEXTLINE)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == ":") {
                let newtoken = new Token(this.text[this.indx], TokenType.TT_COLON)
                tokens.push(newtoken)
                this.indx += 1
            }
            else if (this.text[this.indx] == "<") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token("<=", TokenType.TT_LESSTHANOREQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else if (this.text[this.indx + 1] == ">") {
                        let newtoken = new Token("<>", TokenType.TT_NOTEQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TokenType.TT_LESSTHAN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TokenType.TT_LESSTHAN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if (this.text[this.indx] == ">") {
                if (this.indx + 1 < this.text.length) {
                    if (this.text[this.indx + 1] == "=") {
                        let newtoken = new Token(">=", TokenType.TT_GREATERTHANOREQUAL)
                        tokens.push(newtoken)
                        this.indx += 2
                    }
                    else {
                        let newtoken = new Token(this.text[this.indx], TokenType.TT_GREATERTHAN)
                        tokens.push(newtoken)
                        this.indx += 1
                    }
                }
                else {
                    let newtoken = new Token(this.text[this.indx], TokenType.TT_GREATERTHAN)
                    tokens.push(newtoken)
                    this.indx += 1
                }
            }
            else if ( StaticVariable.ALPHABET_DIGITS.includes(this.text[this.indx])) {
                let start = this.indx
                let end = start
                let value = this.text[this.indx]
                this.indx += 1;
                while (this.indx < this.text.length && StaticVariable.ALPHABET_DIGITS.includes(this.text[this.indx])) {
                    value += this.text[this.indx]
                    end = this.indx
                    this.indx += 1
                }

                if (TokenType.keywords.includes(value)) {
                    let newtoken = new Token(value, TokenType.TT_KEYWORD)
                    tokens.push(newtoken)
                }
                else if (TokenType.dtype.includes(value)) {
                    let newtoken = new Token(value, TokenType.TT_DTYPE)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_MUGNA) {
                    let newtoken = new Token(value, TokenType.TT_VAR_DEC)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_IPAKITA) {
                    let newtoken = new Token(value, TokenType.TT_PRINT)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_DAWATA) {
                    let newtoken = new Token(value, TokenType.TT_DAWATA)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_AND) {
                    let newtoken = new Token(value, TokenType.TT_AND)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_OR) {
                    let newtoken = new Token(value, TokenType.TT_OR)
                    tokens.push(newtoken)
                }
                else if (value == TokenType.TT_NOT) {
                    let newtoken = new Token(value, TokenType.TT_NOT)
                    tokens.push(newtoken)
                }
                else if (!isNaN(value) || value.trim() === "") {
                    if (/^-?\d+$/.test(value)) {
                        let newtoken = new Token(value, TokenType.TT_NUMERO)
                        tokens.push(newtoken)
                    }
                    else if (/^-?\d+\.\d+$/.test(value)) {
                        let newtoken = new Token(value, TokenType.TT_TIPIK)
                        tokens.push(newtoken)
                    }
                    else {
                        let newtoken = new Token(value, "Invalid Number of Integer")
                        tokens.push(newtoken)
                    }
                }
                else {
                    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
                        let newtoken = new Token(value, TokenType.TT_IDENTIFIER)
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
                    let newtoken = new Token(value, TokenType.TT_LETRA)
                    tokens.push(newtoken)
                }
                else if (/^'.*'$/.test(value)) {
                    let newtoken = new Token(value, "Not a Letter")
                    tokens.push(newtoken)
                }
                else if (/^".*"$/.test(value)) {
                    if (value == "\"DILI\"" || value == "\"OO\"") {
                        let newtoken = new Token(value, TokenType.TT_TINUOD)
                        tokens.push(newtoken)
                    }
                    else {
                        let newtoken = new Token(value, TokenType.TT_STRING)
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
        // console.log(tokens)
        return tokens
    }
}
module.exports = { Lexer };