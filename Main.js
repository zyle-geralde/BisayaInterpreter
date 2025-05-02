const fs = require('fs');
const readlineSync = require("readline-sync");

const { Lexer } = require('./Lexer.js');
const { Parser } = require('./Parser.js');
const { Interpreter } = require('./Interpreter.js');

fs.readFile('checking.txt', 'utf8', (err, data) => {
    if (err) { console.error('Error reading file:', err); return; }
    let interpreter = new Lexer(data)
    let get_tokens = interpreter.tokenize()
    let parser = new Parser(get_tokens)
    let astTree = parser.parse()
    let executer = new Interpreter(astTree)
    executer.execute()

});