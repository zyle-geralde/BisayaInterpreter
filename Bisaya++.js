

const { error } = require("console");


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
LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"';
LETTERS_DIGITS = LETTERS + DIGITS


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
TT_KEYWORD = 'KEYWORD'
TT_PLUS         = 'PLUS'
TT_MINUS        = 'MINUS'
TT_MUL          = 'MUL'
TT_DIV          = 'DIV'
TT_POW = 'POW'
TT_IDENTIFIER   = 'IDENTIFIER'
TT_MOD = 'MOD' // ADDED MODULO TOKEN

//recent changes
TT_EE = 'EE'
TT_NE = 'NE'
TT_LT = 'LT'
TT_GT = 'GT'
TT_LTE = 'LTE'
TT_GTE = 'GTE'
TT_EQ = "EQ"

KEYWORDS = [
    'UG',
    'O',
    'DILI'
]

//Error
class Error {
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
        result += "\n\n" + stringWithArrows(this.pos_start.ftxt, this.pos_start, this.pos_end)
        return result
    }
}
class IllegalCharError extends Error {
    constructor(pos_start, pos_end, details) {
        super(pos_start, pos_end, "Illegal Character", details)
    }
}

class ExpectedCharError extends Error {
    constructor(pos_start, pos_end, details) {
        super(pos_start, pos_end, "Expected Character Error", details)
    }
}

class InvalidSyntaxError extends Error {
    constructor(pos_start, pos_end, details = '') {
        super(pos_start, pos_end, 'Invalid Syntax', details);
        this.name = 'InvalidSyntaxError';
    }
}

class IllegalSyntaxError extends Error {
    constructor(pos_start, pos_end, details = '') {
        super(pos_start || new Position(0, 0, 0), pos_end || new Position(0, 0, 0), "Illegal Syntax", details)
    }
}
class RTError extends Error {
    constructor(pos_start, pos_end, details = '', context) {
        super(pos_start || new Position(0, 0, 0), pos_end || new Position(0, 0, 0), "Runtime Error", details)
        this.context = context
    }
    as_string() {
        let result = this.generate_traceback()
        result += `${this.error_name}: ${this.details}\n`
        result += "\n\n" + stringWithArrows(this.pos_start.ftxt, this.pos_start, this.pos_end)
        return result
    }
    generate_traceback() {
        let result = ''
        let pos = this.pos_start
        let ctx = this.context

        while (ctx) {
            result = `File ${pos.fn}, line ${(pos.ln + 1).toString()}, in ${ctx.display_name}\n` + result
            pos = ctx.parent_entry_pos
            ctx = ctx.parent
        }
        return `Traceback (most recent call last): \n` + result
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
class Token {
    constructor(type, value = null, pos_start = null, pos_end = null) {
        this.type = type;
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
    matches(type_, value) {
        return this.type === type_ && this.value === value;
    }

    toString() {
        return this.value !== null ? `<span class="math-inline">\{this\.type\}\:</span>{this.value}` : `${this.type}`;
    }
}

//LEXER CREATION
class Lexer {
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
            else if (DIGITS.includes(this.current_char)) {
                tokens.push(this.make_number())
            }
            else if (LETTERS.includes(this.current_char)) {
                tokens.push(this.make_identifier());
            }
            else if (this.current_char === "+") {
                tokens.push(new Token(PLUS, this.pos.copy()))
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
            // ADDED MODULO HANDLING
            else if (this.current_char === "%") {
                tokens.push(new Token(TT_MOD, this.pos.copy()))
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
            //recent changes
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

        tokens.push(new Token(TT_EOF, this.pos.copy()))
        return { tokens, error: null }

    }
    make_number() {
        let num_str = ""
        let dot_count = 0
        let pos_start = this.pos.copy()

        while (this.current_char !== null && (DIGITS + ".").includes(this.current_char)) {
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
            return new Token(NUMERO, parseInt(num_str, 10), pos_start, this.pos)
        }
        else {
            return new Token(TIPIK, parseFloat(num_str), pos_start, this.pos)
        }
    }
    make_identifier() {
        let id_str = '';
        let pos_start = this.pos.copy();

        while (
            this.current_char !== null &&
            (LETTERS_DIGITS + '_').includes(this.current_char)
        ) {
            id_str += this.current_char;
            this.advance();
        }

        let tok_type = KEYWORDS.includes(id_str) ? TT_KEYWORD : TT_IDENTIFIER;
        return new Token(tok_type, id_str, pos_start, this.pos);

    }
    make_equals() {
        let tok_Type = TT_EQ
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TT_EE
        }

        return new Token(tok_Type, "", posStart, this.pos)
    }

    make_greater_than() {
        let tok_Type = TT_GT
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TT_GTE
        }

        return new Token(tok_Type, "", posStart, this.pos)
    }

    make_less_than() {
        let tok_Type = TT_LT
        let posStart = this.pos.copy()
        this.advance()

        if (this.current_char == "=") {
            this.advance()
            tok_Type = TT_LTE
        }
        else if (this.current_char == ">") {
            this.advance()
            tok_Type = TT_NE
        }

        return new Token(tok_Type, "", posStart, this.pos)
    }
}

//NODE CREATION
class NumberNode {
    constructor(tok) {
        this.tok = tok;
        this.pos_start = this.tok.pos_start
        this.pos_end = this.tok.pos_end
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
        this.pos_start = this.left_node.pos_start
        this.pos_end = this.right_node.pos_end
    }

    toString() {
        return `(${this.left_node}, ${this.op_tok}, ${this.right_node})`;
    }
}

class UnaryOpNode {
    constructor(op_tok, node) {
        this.op_tok = op_tok
        this.node = node
        this.pos_start = this.op_tok.pos_start
        this.pos_end = node.pos_end
    }
    toString() {
        return `${this.op_tok}, ${this.node} `
    }
}

//PARSE RESULT
class ParseResult {
    constructor() {
        this.error = null
        this.node = null
        this.advance_count = 0
    }
    register_advancement() {
        this.advance_count += 1
    }
    register(res) {
        if (res instanceof ParseResult) {
            this.advance_count += res.advance_count
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
        if (!this.error || this.advance_count == 0) {
            this.error = error
        }

        return this
    }

}

//PASER
class Parser {
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
            return res.failure(new IllegalSyntaxError(this.current_tok.pos_start, this.current_tok.pos_end, "Expected + - * / or %"))
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
            return res.success(new UnaryOpNode(tok, factor))

        }
        else if ([TIPIK, NUMERO].includes(tok.type)) {
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
        return this.bin_op(() => this.factor(), [MUL, DIV, TT_MOD]) // ADDED MOD TO TERM OPERATORS
    }
    arith_expr() {
        return this.bin_op(() => this.term(), [TT_PLUS, TT_MINUS]);
    }
    comp_expr() {
        let res = new ParseResult();
    
        if (this.current_tok.matches(TT_KEYWORD, 'DILI')) {
            let op_tok = this.current_tok;
            res.register_advancement();
            this.advance();
    
            let node = res.register(this.comp_expr());
            if (res.error) {
    
                return res;
            }
    
            return res.success(new UnaryOpNode(op_tok, node));
        }
        //delete this if ever
        
    
        let node = res.register(this.bin_op(
            () => this.arith_expr(),
            [TT_EE, TT_NE, TT_LT, TT_GT, TT_LTE, TT_GTE]
        ));
        if (res.error) {
    
            return res.failure(new InvalidSyntaxError(
                this.current_tok.pos_start, this.current_tok.pos_end,
                "Expected int, float, identifier, '+', '-', '(' or 'NOT'"
            ));
        }
    
        return res.success(node);
    }
    expr() {
        let res = new ParseResult();
        //change today May 1
        //return this.bin_op(() => this.comp_expr(), [(TT_KEYWORD, "UG"), (TT_KEYWORD, "O")])
        let node = res.register(this.bin_op(
            () => this.comp_expr(),
            [[TT_KEYWORD, 'UG'], [TT_KEYWORD, 'O']]
        ));
    
        if (res.error) {
    
            return res.failure(new InvalidSyntaxError(
                this.current_tok.pos_start,
                this.current_tok.pos_end,
                "Expected 'VAR', int, float, identifier, '+', '-', '(' or 'NOT'"
            ));
        }
    
        return res.success(node);
    }

    
        bin_op(func_a, ops, func_b = null) {
            if (func_b === null) {
                func_b = func_a;
            }
    
            const res = new ParseResult();
            let left = res.register(func_a());
    
            if (res.error) return res;
    
            while (
                ops.includes(this.current_tok.type) ||
                ops.some(op => Array.isArray(op) && this.current_tok.type === op[0] && this.current_tok.value === op[1])
            ) {
                const op_tok = this.current_tok;
                res.register_advancement();
                this.advance();
    
                const right = res.register(func_b());
                if (res.error) return res;
    
                left = new BinOpNode(left, op_tok, right);
            }
    
            return res.success(left);
        }
    
    }
    
    class RTResult {
        constructor() {
            this.value = null
            this.error = null
        }
        register(res) {
            if (res.error) {
                this.error = res.error
            }
            return res.value
        }
        success(value) {
            this.value = value
            return this
        }
        failure(error) {
            this.error = error
            return this
        }
    }
    //Value
    class Number {
        constructor(value, isBool = false) {
            this.value = value
            this.isBool = isBool
            this.set_pos()
            this.set_context()
    
        }
        set_pos(pos_start = null, pos_end = null) {
            this.pos_start = pos_start
            this.pos_end = pos_end
            return this
        }
        set_context(context = null) {
            this.context = context
            return this
        }
        added_to(other) {
            if (other instanceof Number) {
                return [new Number(this.value + other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
            }
            return null
        }
        subbed_by(other) {
            if (other instanceof Number) {
                return [new Number(this.value - other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
            }
            return null
        }
        multed_by(other) {
            if (other instanceof Number) {
                return [new Number(this.value * other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
            }
            return null
        }
        divided_by(other) {
            if (other instanceof Number) {
                if (other.value == 0) {
                    return [null, new RTError(other.pos_start, other.pos_end, "Division by zero", this.context)]
                }
                return [new Number(this.value / other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
            }
            return null
        }
        // ADDED modulo_by METHOD
        modulo_by(other) {
            if (other instanceof Number) {
                if (other.value == 0) {
                    return [null, new RTError(other.pos_start, other.pos_end, "Modulo by zero", this.context)]
                }
                return [new Number(this.value % other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
            }
            return null
        }
        get_comparison_eq(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value === other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        get_comparison_ne(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value !== other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        get_comparison_lt(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value < other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        get_comparison_gt(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value > other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        get_comparison_lte(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value <= other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        get_comparison_gte(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value >= other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        anded_by(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value && other.value ? 1 : 0, true).set_context(this.context),
                    error: null
                };
            }
        }
    
        ored_by(other) {
            if (other instanceof Number) {
                return {
                    result: new Number(this.value || other.value ? 1 : 0,true).set_context(this.context),
                    error: null
                };
            }
        }
    
        notted() {
            return {
                result: new Number(this.value === 0 ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    
        copy() {
            const copy = new Number(this.value);
            copy.set_pos(this.pos_start, this.pos_end);
            copy.set_context(this.context);
            return copy;
        }
        toString() {
            return this.value.toString()
        }
    
    }
    //Context
    class Context {
        constructor(display_name, parent = null, parent_entry_pos = null) {
            this.display_name = display_name
            this.parent_entry_pos = parent_entry_pos
            this.parent = parent
        }
    }
    
    class SymbolTable {
        constructor() {
          this.symbols = {};
          this.parent = null;
        }
    
        get(name) {
          const value = this.symbols[name];
          if (value === undefined && this.parent) {
            return this.parent.get(name);
          }
          return value;
        }
    
        set(name, value) {
          this.symbols[name] = value;
        }
    
        remove(name) {
          delete this.symbols[name];
        }
      }
    
    //INTERPRETER
    class Interpreter {
        visit(node, context) {
            let method_name = `visit_${node.constructor.name}`
            let method = this[method_name] || this.no_visit_method;
            return method.call(this, node, context) // Pass context here
    
        }
        no_visit_method(node, context) {
            throw new Error(`No visit_${node.constructor.name} method defined`);
        }
    
        visit_NumberNode(node, context) {
            return new RTResult().success(new Number(node.tok.value).set_context(context).set_pos(node.pos_start, node.pos_end))
            //console.log("Found number node!")
        }
        visit_BinOpNode(node, context) {
            let res = new RTResult()
            let left = res.register(this.visit(node.left_node, context))
            if (res.error) return res
            let right = res.register(this.visit(node.right_node, context))
            if (res.error) return res
    
            if (!left || !right) {
                throw new Error(`Invalid operands for operation: ${node.op_tok.value}`);
            }
    
            let result = null
            let error = null
            if (node.op_tok.type == PLUS) {
                [result, error] = left.added_to(right)
            }
            else if (node.op_tok.type == MINUS) {
                [result, error] = left.subbed_by(right)
            }
            else if (node.op_tok.type == MUL) {
                [result, error] = left.multed_by(right)
            }
            else if (node.op_tok.type == DIV) {
                [result, error] = left.divided_by(right)
            }
            // ADDED MODULO INTERPRETATION
            else if (node.op_tok.type == TT_MOD) {
                [result, error] = left.modulo_by(right)
            }
            else if (node.op_tok.type === TT_EE) {
                ({ result, error } = left.get_comparison_eq(right));
            } else if (node.op_tok.type === TT_NE) {
                ({ result, error } = left.get_comparison_ne(right));
            } else if (node.op_tok.type === TT_LT) {
                ({ result, error } = left.get_comparison_lt(right));
            } else if (node.op_tok.type === TT_GT) {
                ({ result, error } = left.get_comparison_gt(right));
            } else if (node.op_tok.type === TT_LTE) {
                ({ result, error } = left.get_comparison_lte(right));
            } else if (node.op_tok.type === TT_GTE) {
                ({ result, error } = left.get_comparison_gte(right));
            } else if (node.op_tok.matches(TT_KEYWORD, 'UG')) {
                ({ result, error } = left.anded_by(right));
            } else if (node.op_tok.matches(TT_KEYWORD, 'O')) {
                ({ result, error } = left.ored_by(right));
            }
            if (error) {
                return res.failure(error)
            }
            else {
                return res.success(result.set_pos(node.pos_start, node.pos_end))
            }
        }
        visit_UnaryOpNode(node, context) {
            let res = new RTResult()
            let number = res.register(this.visit(node.node, context))
            if (res.error) {
                return res
            }
    
            let error = null
            if (node.op_tok.type == MINUS) {
                [number, error] = number.multed_by(new Number(-1))
            }
            else if (node.op_tok.matches(TT_KEYWORD, 'DILI')) {
                ({ result: number, error } = number.notted());
            }
            if (error) {
                return res.failure(error)
            }
            else {
                return res.success(number.set_pos(node.pos_start, node.pos_end))
            }
    
        }
    
    }
    
    const global_symbol_table = new SymbolTable();
    global_symbol_table.set("NULL", new Number(0));
    global_symbol_table.set("FALSE", new Number(0));
    global_symbol_table.set("TRUE", new Number(1));
    
    //RUN
    function run(fn, text) {
        let lexer = new Lexer(fn, text);
        let result = lexer.make_tokens();
        if (result.error) {
            return [null, result.error]
        }
    
        //Generate abstract syntax tree
        let parser = new Parser(result.tokens)
        let ast = parser.parse()
        if (ast.error) {
            return [null, ast.error]
        }
    
        let interpreter = new Interpreter()
        let context = new Context("<program>")
        context.symbol_table = global_symbol_table
        let resultint = interpreter.visit(ast.node, context)
    
    
        return [resultint.value, resultint.error]
    }
    
    module.exports = { run };




