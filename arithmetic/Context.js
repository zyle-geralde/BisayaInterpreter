class Context {
    constructor(display_name, parent = null, parent_entry_pos = null) {
        this.display_name = display_name
        this.parent_entry_pos = parent_entry_pos
        this.parent = parent
    }
}
module.exports = { Context };