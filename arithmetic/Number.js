class Number {
    constructor(value, isBool = false) {
        this.value = value
        this.isBool = isBool
        this.set_pos()
        this.set_context()

    }
    set_pos(pos_start = null, pos_end = null) {
        this.pos_start = pos_start
        this.pos_end = pos_end
        return this
    }
    set_context(context = null) {
        this.context = context
        return this
    }
    added_to(other) {
        if (other instanceof Number) {
            return [new Number(this.value + other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
        }
        return null
    }
    subbed_by(other) {
        if (other instanceof Number) {
            return [new Number(this.value - other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
        }
        return null
    }
    multed_by(other) {
        if (other instanceof Number) {
            return [new Number(this.value * other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
        }
        return null
    }
    divided_by(other) {
        if (other instanceof Number) {
            if (other.value == 0) {
                return [null, new RTError(other.pos_start, other.pos_end, "Division by zero", this.context)]
            }
            return [new Number(this.value / other.value).set_context(this.context).set_pos(this.pos_start, other.pos_end), null]
        }
        return null
    }
    get_comparison_eq(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value === other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    get_comparison_ne(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value !== other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    get_comparison_lt(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value < other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    get_comparison_gt(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value > other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    get_comparison_lte(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value <= other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    get_comparison_gte(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value >= other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    anded_by(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value && other.value ? 1 : 0, true).set_context(this.context),
                error: null
            };
        }
    }
    ored_by(other) {
        if (other instanceof Number) {
            return {
                result: new Number(this.value || other.value ? 1 : 0,true).set_context(this.context),
                error: null
            };
        }
    }
    notted() {
        return {
            result: new Number(this.value === 0 ? 1 : 0,true).set_context(this.context),
            error: null
        };
    }
    copy() {
        const copy = new Number(this.value);
        copy.set_pos(this.pos_start, this.pos_end);
        copy.set_context(this.context);
        return copy;
    }
    toString() {
        return this.value.toString()
    }
}

module.exports = { Number }