class StringWithArrows {
    constructor(text, posStart, posEnd) {
        this.text = text;
        this.posStart = posStart;
        this.posEnd = posEnd;
    }

    stringWithArrows() {
        let result = '';
        
        let idxStart = Math.max(this.text.lastIndexOf('\n', this.posStart.idx), 0);
        let idxEnd = this.text.indexOf('\n', idxStart + 1);
        if (idxEnd < 0) idxEnd = this.text.length;

        let lineCount = this.posEnd.ln - this.posStart.ln + 1;
        for (let i = 0; i < lineCount; i++) {
            let line = this.text.slice(idxStart, idxEnd);
            let colStart = i === 0 ? this.posStart.col : 0;
            let colEnd = i === lineCount - 1 ? this.posEnd.col : line.length - 1;

            result += line + '\n';
            result += ' '.repeat(colStart) + '^'.repeat(colEnd - colStart) + '\n';

            idxStart = idxEnd;
            idxEnd = this.text.indexOf('\n', idxStart + 1);
            if (idxEnd < 0) idxEnd = this.text.length;
        }
        
        return result.replace(/\t/g, '');
    }
}
module.exports = { StringWithArrows }