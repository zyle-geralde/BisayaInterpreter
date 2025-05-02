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
module.exports = { UnaryOpNode }