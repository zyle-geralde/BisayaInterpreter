class ParseResult {
    constructor() {
        this.error = null
        this.node = null
        this.advance_count = 0
    }
    register_advancement() {
        this.advance_count += 1
    }
    register(res) {
        if (res instanceof ParseResult) {
            this.advance_count += res.advance_count
            if (res.error) this.error = res.error
            return res.node
        }
        return res
    }
    success(node) {
        this.node = node
        return this
    }
    failure(error) {
        if (!this.error || this.advance_count == 0) {
            this.error = error
        }

        return this
    }

}
module.exports = { ParseResult }