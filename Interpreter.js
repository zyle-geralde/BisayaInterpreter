const { TokenType } = require("./TokenType.js")

class Interpreter {
    constructor(ast) {
        this.ast = ast
        this.memory = []
        this.executeString = ""
    }
    execute() {
        for (let nodes of this.ast["body"]) {
            if (nodes["type"] == 'VariableDeclaration') {
                this.executeVariableDeclaration(nodes)
            }
            else if (nodes["type"] == "VariableAssignment") {
                this.executeVariableAssignment(nodes)
            }
            else if (nodes["type"] == "PrintFunction") {
                let stringexec = this.executePrintFunction(nodes)
                const result = stringexec.replaceAll('"', '').replaceAll("'", '');


                console.log(result)
            }
            else if (nodes["type"] == "InputFunction") {
                this.executeInputFunction(nodes)
            }
            else {


            }
        }
    }
    executeVariableDeclaration(nodes) {
        let datatypehold = nodes["dataType"]
        for (let varhold of nodes["variables"]) {
            if (this.memory.length != 0) {
                let existingVar = this.memory.find(variable => variable["name"] === varhold["name"]);
                if (existingVar) {
                    throw new Error("ERROR: Variable already exist");
                }
                else {
                    varhold["datatype"] = datatypehold
                    this.memory.push(varhold)
                }
            }
            else {
                varhold["datatype"] = datatypehold
                this.memory.push(varhold)
            }
        }

        console.log(this.memory)
    }
    executeVariableAssignment(nodes) {
        for (let nodeassign of nodes["assignments"]) {
            console.log(nodeassign)
            console.log(this.memory)
            let existingVar = this.memory.find(variable => variable["name"] === nodeassign["variable"]);


            if (existingVar) {
                if (nodeassign["indicator"] == "value") {
                    if (nodeassign["value"] != null) {
                        if (nodeassign["dtype"] == "EXPRESSION") {
                            let existingVarIndex = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            if (existingVar["datatype"] == TokenType.TT_NUMERO) {
                                this.memory[existingVarIndex].value = parseInt(nodeassign["value"]) + ""
                            }
                            else if (existingVar["datatype"] == TokenType.TT_TIPIK) {
                                this.memory[existingVarIndex].value = formatNumber(nodeassign["value"] + "")
                            }
                            else if (existingVar["datatype"] == TokenType.TT_TINUOD) {
                                this.memory[existingVarIndex].value = nodeassign["value"]+""
                            }
                            else {
                                throw new Error("ERROR: Not valid value for type");
                            }
                        }
                        else if (existingVar["datatype"] == nodeassign["dtype"]) {
                            let existingVarIndex = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            this.memory[existingVarIndex].value = nodeassign["value"]
                        }
                        else {
                            throw new Error("ERROR: Not valid value for type");
                        }
                    }
                }
                else {
                    let existingVarVal = this.memory.find(variable => variable["name"] === nodeassign["value"]);
                    if (existingVarVal) {
                        if ((existingVar["datatype"] == TokenType.TT_NUMERO || existingVar["datatype"] == TokenType.TT_TIPIK) && (existingVarVal["datatype"] == TokenType.TT_NUMERO || existingVarVal["datatype"] == TokenType.TT_TIPIK)) {
                            let change = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            let valchange = this.memory.findIndex(variable => variable["name"] === nodeassign["value"]);

                            if (this.memory[change].datatype == TokenType.TT_NUMERO) {
                                this.memory[change].value = parseInt(this.memory[valchange].value) + ""
                            }
                            else if (this.memory[change].datatype == TokenType.TT_TIPIK) {
                                this.memory[change].value = formatNumber(this.memory[valchange].value + "")
                            }
                            else {
                                throw new Error("ERROR: Not valid value for type");
                            }
                        }
                        else if (existingVar["datatype"] == existingVarVal["datatype"]) {
                            let change = this.memory.findIndex(variable => variable["name"] === nodeassign["variable"]);
                            let valchange = this.memory.findIndex(variable => variable["name"] === nodeassign["value"]);


                            this.memory[change].value = this.memory[valchange].value
                        }
                        else {
                            throw new Error("ERROR: Not valid value for type");
                        }
                    }
                    else {
                        throw new Error("ERROR: Variable not found");
                    }
                }
            }
            else {
                throw new Error("ERROR: Variable not found");
            }
        }
        console.log(this.memory)
    }


    executePrintFunction(nodes) {
        this.executeString = ""
        for (let expr of nodes["expression"]) {
            if (expr["type"] == "Value") {
                this.executeString += expr["name"]
            }
            else if (expr["type"] == "Variable") {
                let existingVarExpr = this.memory.find(variable => variable["name"] === expr["name"]);
                if (existingVarExpr) {
                    if (existingVarExpr["value"] != null) {
                        this.executeString += existingVarExpr["value"]
                    }
                }
                else {
                    throw new Error("ERROR: Variable not found");
                }
            }
            else if (expr["type"] == "String") {
                this.executeString += expr["name"]
            }
            else if (expr["type"] == "NEXTLINE") {
                this.executeString += "\n"
            }
            else {


            }
        }


        return this.executeString
    }
    executeInputFunction(nodes) {
        let values = [];
        let goodList = [];


        for (let nn of nodes["varlist"]) {
            let existingVarExprInput = this.memory.find(variable => variable["name"] === nn["value"]);
            if (existingVarExprInput) {
                goodList.push(existingVarExprInput);
            } else {
                throw new Error("ERROR: Variable does not exist on Input");
            }
        }


        let input = readlineSync.question("");
        values = input.split(",");


        if (values.length !== goodList.length) {
            throw new Error("ERROR: Invalid number of arguments in Input");
        }


        for (let val = 0; val < values.length; val++) {
            if (goodList[val].datatype === "NUMERO") {
                if (isNaN(values[val]) || values[val].trim() === "") {
                    throw new Error(`ERROR: Invalid number: "${values[val]}"`);
                } else {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = parseInt(values[val]) + "";
                }
            }
            else if (goodList[val].datatype === "TIPIK") {
                if (isNaN(values[val]) || values[val].trim() === "") {
                    throw new Error(`ERROR: Invalid Decimal: "${values[val]}"`);
                } else {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = formatNumber(values[val]);
                }
            }
            //LETRA should be like this "'h'"
            else if (goodList[val].datatype === "LETRA") {
                if (values[val].trim().length == 1) {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = `\'${values[val].trim()}\'`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
            else if (goodList[val].datatype === "TINUOD") {
                if (values[val].trim() == "OO" || values[val].trim() == "DILI") {
                    let changeInp = this.memory.findIndex(variable => variable["name"] === goodList[val].name);
                    this.memory[changeInp].value = `\"${values[val].trim()}\"`;
                }
                else {
                    throw new Error(`ERROR: Invalid Character: "'${values[val].trim()}'"`);
                }
            }
        }
        console.log(this.memory)
    }
}
module.exports = { Interpreter };