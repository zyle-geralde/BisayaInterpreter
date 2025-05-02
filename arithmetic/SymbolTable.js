class SymbolTable {
    constructor() {
      this.symbols = {};
      this.parent = null;
    }
  
    get(name) {
      const value = this.symbols[name];
      if (value === undefined && this.parent) {
        return this.parent.get(name);
      }
      return value;
    }
  
    set(name, value) {
      this.symbols[name] = value;
    }
  
    remove(name) {
      delete this.symbols[name];
    }
}
module.exports = { SymbolTable };