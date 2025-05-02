const { ParseResult } = require('./ParseResult')
const { IllegalSyntaxError} = require('../errors/IllegalSyntaxError.js')
const { InvalidSyntaxError } = require('../errors/InvalidSyntaxError.js')
const { NumberNode} = require('./NumberNode.js')
const { UnaryOpNode } = require('./UnaryOpNode.js')
const { BinOpNode } = require('./BinOpNode.js')
const { TokenType } = require('../TokenType.js');

class ArithmeticParser {
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
        if (!res.error && this.current_tok.type != TokenType.TT_EOF) {
            return res.failure(new IllegalSyntaxError(this.current_tok.pos_start, this.current_tok.pos_end, "Expected + - * or /"))
        }
        return res
    }
    factor() {
        let res = new ParseResult()
        let tok = this.current_tok

        if ([TokenType.PLUS, TokenType.MINUS].includes(tok.type)) {
            res.register(this.advance())
            let factor = res.register(this.factor())
            if (res.error) return res
            return res.success(new UnaryOpNode(tok, factor))

        }
        else if ([TokenType.TIPIK, TokenType.NUMERO].includes(tok.type)) {
            res.register(this.advance())
            return res.success(new NumberNode(tok))
        }
        else if (tok.type == TokenType.LPAREN) {
            res.register(this.advance())
            let expr = res.register(this.expr())
            
            if (res.error) return res
            if (this.current_tok.type == TokenType.RPAREN) {
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
        return this.bin_op(() => this.factor(), [TokenType.MUL, TokenType.DIV])
    }
    arith_expr() {
        return this.bin_op(() => this.term(), [TokenType.TT_PLUS, TokenType.TT_MINUS]);
    }
    comp_expr() {
        let res = new ParseResult();

        if (this.current_tok.matches(TokenType.TT_KEYWORD, 'DILI')) {
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
        /*if (this.current_tok.matches(TokenType.TT_IDENTIFIER, '"DILI"')) {
            let node = res.register(this.advance())
            this.current_tok.value = 0
            return res.success(new NumberNode(this.current_tok,node))
        }
        if (this.current_tok.matches(TokenType.TT_IDENTIFIER, '"OO"')) {
            let node = res.register(this.advance())
            this.current_tok.value = 1
            return res.success(new NumberNode(this.current_tok,node))
        }*/

        let node = res.register(this.bin_op(
            () => this.arith_expr(),
            [TokenType.TT_EE, TokenType.TT_NE, TokenType.TT_LT, TokenType.TT_GT, TokenType.TT_LTE, TokenType.TT_GTE]
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
        //return this.bin_op(() => this.comp_expr(), [(TokenType.TT_KEYWORD, "UG"), (TokenType.TT_KEYWORD, "O")])
        let node = res.register(this.bin_op(
            () => this.comp_expr(), 
            [[TokenType.TT_KEYWORD, 'UG'], [TokenType.TT_KEYWORD, 'O']]
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
    /*bin_op(func, ops) {
        let res = new ParseResult()
        let left = res.register(func())
        console.log(res.error)
        if (res.error) return res

        while (ops.includes(this.current_tok.type) || (this.current_tok.type, this.current_tok.value) in ops) {
            let op_tok = this.current_tok
            res.register(this.advance())
            let right = res.register(func())
            console.log(res.error)
            if (res.error) return res
            left = new BinOpNode(left, op_tok, right)
        }
        return res.success(left)
    }*/
    
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
module.exports = { ArithmeticParser }