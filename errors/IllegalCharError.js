const { Error } = require('./Error.js')
class IllegalCharError extends Error{
    constructor(pos_start, pos_end,details) {
        super(pos_start, pos_end,"Illegal Character", details)
    }
}
module.exports = { IllegalCharError }