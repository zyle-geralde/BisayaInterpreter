class InvalidSyntaxError extends Error {
    constructor(pos_start, pos_end, details = '') {
        super(pos_start, pos_end, 'Invalid Syntax', details);
        this.name = 'InvalidSyntaxError';
    }
}