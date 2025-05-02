class StaticVariable{
    static DIGITS = "0123456789"
    static LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"';
    static LETTERS_DIGITS = StaticVariable.LETTERS + StaticVariable.DIGITS

        
    static ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    static ALPHABET_DIGITS = StaticVariable.ALPHABET + StaticVariable.DIGITS + "_" + "."
    static ALPHABET_NO_DIGITS = StaticVariable.ALPHABET + "_"
    static ALPHABET_NO_DOT = StaticVariable.ALPHABET + StaticVariable.DIGITS + "_"
}
module.exports = { StaticVariable }