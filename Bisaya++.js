
//HELPER FUNCTION
function stringWithArrows(text, posStart, posEnd) {
    let result = '';

    let idxStart = Math.max(text.lastIndexOf('\n', posStart.idx), 0);
    let idxEnd = text.indexOf('\n', idxStart + 1);
    if (idxEnd < 0) idxEnd = text.length;

    let lineCount = posEnd.ln - posStart.ln + 1;
    for (let i = 0; i < lineCount; i++) {
 
        let line = text.slice(idxStart, idxEnd);
        let colStart = i === 0 ? posStart.col : 0;
        let colEnd = i === lineCount - 1 ? posEnd.col : line.length - 1;

        result += line + '\n';
        result += ' '.repeat(colStart) + '^'.repeat(colEnd - colStart) + '\n';

        idxStart = idxEnd;
        idxEnd = text.indexOf('\n', idxStart + 1);
        if (idxEnd < 0) idxEnd = text.length;
    }

    return result.replace(/\t/g, '');
}

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
TT_EOF = "EOF"

//Error
class Error{
    constructor(pos_start, pos_end, error_name, details) {
        this.pos_start = pos_start || {}
        this.pos_end = pos_end || {}
        this.error_name = error_name;
        this.details = details
    }
    as_string() {
        let result = `${this.error_name}: ${this.details}`
        if (this.pos_start.fn) {
            result += ` File ${this.pos_start.fn}, line ${this.pos_start.ln + 1}`;
        }
        result += "\n\n"+stringWithArrows(this.pos_start.ftxt, this.pos_start, this.pos_end)
        return result
    }
}
class IllegalCharError extends Error{
    constructor(pos_start, pos_end,details) {
        super(pos_start, pos_end,"Illegal Character", details)
    }
}
class IllegalSyntaxError extends Error{
    constructor(pos_start, pos_end, details = '') {
        super(pos_start || new Position(0,0,0), pos_end || new Position(0,0,0),"Illegal Syntax", details)
    }
}
//Position
class Position {
    constructor(idx, ln, col, fn = "<unknown>", ftxt = "") {
        this.idx = idx;
        this.ln = ln;
        this.col = col;
        this.fn = fn;
        this.ftxt = ftxt;
    }

    advance(current_char = null) {
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

//TOKEN creation 
class Token{
    constructor(type,value = null,pos_start = null,pos_end = null) {
        this.type =type;
        this.value = value;
        
        if (pos_start) {
            this.pos_start = pos_start.copy()
            this.pos_end = pos_start.copy()
            this.pos_end.advance()
        }

        if (pos_end) {
            this.pos_end = pos_end
        }
    }
    toString() {
        return this.value !== null ? `${this.type}:${this.value}` : `${this.type}`;
    }
}

//LEXER CREATION
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
                tokens.push(new Token(PLUS,this.pos.copy()))
                this.advance()
            }
            else if (this.current_char === "-") {
                tokens.push(new Token(MINUS, this.pos.copy()))
                this.advance()
            }
            else if (this.current_char === "*") {
                tokens.push(new Token(MUL, this.pos.copy()))
                this.advance()
            }
            else if (this.current_char === "/") {
                tokens.push(new Token(DIV, this.pos.copy()))
                this.advance()
            }
            else if (this.current_char === "(") {
                tokens.push(new Token(LPAREN, this.pos.copy()))
                this.advance()
            }
            else if (this.current_char === ")") {
                tokens.push(new Token(RPAREN, this.pos.copy()))
                this.advance()
            }
            else {
                let pos_start = this.pos.copy();
                let char = this.current_char
                this.advance()
                return {tokens: [], error: new IllegalCharError(pos_start,this.pos,"'" + char + "'") }
            }

        }

        tokens.push(new Token(TT_EOF, this.pos.copy()))
        return { tokens, error: null}

    }
    make_number() {
        let num_str = ""
        let dot_count = 0
        let pos_start = this.pos.copy()

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
            return new Token(NUMERO,parseInt(num_str,10),pos_start,this.pos)
        }
        else {
            return new Token(TIPIK,parseFloat(num_str),pos_start,this.pos)
        }
    }
}

//NODE CREATION
class NumberNode {
    constructor(tok) {
        this.tok = tok;
    }

    toString() {
        return `${this.tok}`;
    }
}

class BinOpNode {
    constructor(left_node, op_tok, right_node) {
        this.left_node = left_node;
        this.op_tok = op_tok;
        this.right_node = right_node;
    }

    toString() {
        return `(${this.left_node}, ${this.op_tok}, ${this.right_node})`;
    }
}

class UnaryOpNode{
    constructor(op_tok, node) {
        this.op_tok = op_tok
        this.node = node
    }
    toString() {
        return `${this.op_tok}, ${this.node} `
    }
}

//PARSE RESULT
class ParseResult{
    constructor() {
        this.error = null
        this.node = null
    }
    register(res) {
        if (res instanceof ParseResult) {
            if (res.error) this.error = res.error
            return res.node
        }
        return res
    }
    success(node) {
        this.node = node
        return this
    }
    failure(error) {
        this.error = error
        return this
    }

}

//PASER
class Parser{
    constructor(tokens) {
        this.tokens = tokens
        this.tok_idx = -1
        this.advance()
    }
    advance() {
        this.tok_idx += 1
        if (this.tok_idx < this.tokens.length) {
            this.current_tok = this.tokens[this.tok_idx]
        }
        return this.current_tok
    }
    parse() {
        let res = this.expr()
        if (!res.error && this.current_tok.type != TT_EOF) {
            return res.failure(new IllegalSyntaxError(this.current_tok.pos_start, this.current_tok.pos_end, "Expected + - * or /"))
        }
        return res
    }
    factor() {
        let res = new ParseResult()
        let tok = this.current_tok

        if ([PLUS, MINUS].includes(tok.type)) {
            res.register(this.advance())
            let factor = res.register(this.factor())
            if (res.error) return res
            return res.success(new UnaryOpNode(tok,factor))

        }
        else if ([TIPIK,NUMERO].includes(tok.type)) {
            res.register(this.advance())
            return res.success(new NumberNode(tok))
        }
        else if (tok.type == LPAREN) {
            res.register(this.advance())
            let expr = res.register(this.expr())
            if (res.error) return res
            if (this.current_tok.type == RPAREN) {
                res.register(this.advance())
                return res.success(expr)
            }
            else {
                return res.failure(new IllegalSyntaxError(
					this.current_tok.pos_start, this.current_tok.pos_end,
					"Expected ')'"
				))
            }
        }

        return res.failure(new IllegalSyntaxError(tok.pos_start, tok.pos_end, "Expected int or float"))

    }
    term() {
        return this.bin_op(()=>this.factor(), [MUL,DIV])
    }
    expr() {
        return this.bin_op(()=>this.term(), [PLUS,MINUS])
    }
    bin_op(func, ops) {
        let res = new ParseResult()
        let left = res.register(func())
        if(res.error) return res

        while (ops.includes(this.current_tok.type)) {
            let op_tok = this.current_tok
            res.register(this.advance())
            let right = res.register(func())
            if (res.error) return res
            left = new BinOpNode(left,op_tok,right)
        }
        return res.success(left)
    }
     
}

//RUN
function run(fn,text) {
    let lexer = new Lexer(fn,text); 
    let result = lexer.make_tokens();
    if (result.error) {
        return [null,result.error]
    }

    //Generate abstract syntax tree
    let parser = new Parser(result.tokens)
    let ast = parser.parse()

    return [ast.node,ast.error]
}

module.exports = { run };
