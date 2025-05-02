class Token{
    constructor(value = null, type, pos_start = null, pos_end = null) {
        this.value = value;
        this.type = type;

        if (pos_start) {
            this.pos_start = pos_start.copy()
            this.pos_end = pos_start.copy()
            this.pos_end.advance()
        }

        if (pos_end) {
            this.pos_end = pos_end
        }
    }
    matches(type_, value) {
        return this.type === type_ && this.value === value;
    }
    
    toString() {
        return this.value !== null ? `${this.type}:${this.value}` : `${this.type}`;
    }
}
module.exports = { Token };