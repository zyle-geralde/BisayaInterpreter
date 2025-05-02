const { Error } = require('./Error')
class IllegalSyntaxError extends Error{
    constructor(pos_start, pos_end, details = '') {
        super(pos_start || new Position(0,0,0), pos_end || new Position(0,0,0),"Illegal Syntax", details)
    }
}
module.exports = { IllegalSyntaxError }