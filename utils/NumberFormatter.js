class NumberFormatter {
    static format(num) {
        let floatNum = parseFloat(num);

        if (isNaN(floatNum)) {
            throw new Error(`ERROR: Invalid number: "${num}"`);
        }

        let decimalPart = floatNum % 1;

        if (decimalPart === 0) {
            return floatNum.toFixed(1);
        }

        return floatNum.toString();
    }
}

module.exports = { NumberFormatter };