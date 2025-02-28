const fs = require('fs');


fs.readFile('checking.txt', 'utf8', (err, data) => {
    if (err) { console.error('Error reading file:', err); return; }
    let interpreter = new Lexer(data)
    interpreter.make_tokens()
    console.log(interpreter)
    
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
TT_IPAKITA_VALUE = "ORDINARY_VALUE"

let keywords = [TT_SUGOD, TT_MUGNA, TT_KATAPUSAN,TT_IPAKITA]
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
        this.text = text
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
    }
}




