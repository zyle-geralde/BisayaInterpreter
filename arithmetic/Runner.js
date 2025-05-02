const { SymbolTable } = require("./SymbolTable");
const { ArithmeticLexer } = require("./ArithmeticLexer");
const { ArithmeticParser } = require("./ArithmeticParser.js");
const { ArithmeticInterpreter } = require("./ArithmeticInterpreter.js");
const { Context } = require("./Context.js");
const { Number } = require("./Number.js");
class Runner {
    constructor() {
        this.global_symbol_table = new SymbolTable();
        this.global_symbol_table.set("NULL", new Number(0));
        this.global_symbol_table.set("FALSE", new Number(0));
        this.global_symbol_table.set("TRUE", new Number(1));
    }

    run(fn, text) {
        const lexer = new ArithmeticLexer(fn, text);
        const result = lexer.make_tokens();
        if (result.error) {
            return [null, result.error];
        }

        const parser = new ArithmeticParser(result.tokens);
        const ast = parser.parse();
        if (ast.error) {
            return [null, ast.error];
        }

        const interpreter = new ArithmeticInterpreter();
        const context = new Context("<program>");
        context.symbol_table = this.global_symbol_table;

        const resultint = interpreter.visit(ast.node, context);
        console.log(resultint);

        return [resultint.value, resultint.error];
    }
}

module.exports = { Runner };