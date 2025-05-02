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
module.exports = { BinOpNode };