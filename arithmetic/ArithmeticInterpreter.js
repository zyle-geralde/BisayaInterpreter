const { RTResult} = require('./RTResult.js')
const { Number } = require('./Number.js')
const { TokenType } = require('../TokenType.js')
class ArithmeticInterpreter {
    visit(node, context) {
        let method_name = `visit_${node.constructor.name}`
        let method = this[method_name] || this.no_visit_method;
        return method.call(this, node)

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
        if (node.op_tok.type == TokenType.PLUS) {
            [result, error] = left.added_to(right)
        }
        else if (node.op_tok.type == TokenType.MINUS) {
            [result, error] = left.subbed_by(right)
        }
        else if (node.op_tok.type == TokenType.MUL) {
            [result, error] = left.multed_by(right)
        }
        else if (node.op_tok.type == TokenType.DIV) {
            [result, error] = left.divided_by(right)
        }
        else if (node.op_tok.type === TokenType.TT_EE) {
            ({ result, error } = left.get_comparison_eq(right));
        } else if (node.op_tok.type === TokenType.TT_NE) {
            ({ result, error } = left.get_comparison_ne(right));
        } else if (node.op_tok.type === TokenType.TT_LT) {
            ({ result, error } = left.get_comparison_lt(right));
        } else if (node.op_tok.type === TokenType.TT_GT) {
            ({ result, error } = left.get_comparison_gt(right));
        } else if (node.op_tok.type === TokenType.TT_LTE) {
            ({ result, error } = left.get_comparison_lte(right));
        } else if (node.op_tok.type === TokenType.TT_GTE) {
            ({ result, error } = left.get_comparison_gte(right));
        } else if (node.op_tok.matches(TokenType.TT_KEYWORD, 'UG')) {
            ({ result, error } = left.anded_by(right));
        } else if (node.op_tok.matches(TokenType.TT_KEYWORD, 'O')) {
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
        if (node.op_tok.type == TokenType.MINUS) {
            [number, error] = number.multed_by(new Number(-1))
        }
        else if (node.op_tok.matches(TokenType.TT_KEYWORD, 'DILI')) {
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
module.exports = { ArithmeticInterpreter }