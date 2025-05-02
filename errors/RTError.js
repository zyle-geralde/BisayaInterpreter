const {Error} = require('./Error')
const {stringWithArrows} = require('../utils/utils.js')
class RTError extends Error{
    constructor(pos_start, pos_end, details = '',context) {
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
        return `Traceback (most recent call last): \n`+result
    }
}
module.exports = { RTError }