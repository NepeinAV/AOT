String.prototype.in = function (symbols = [], position = 0) {
    if (typeof symbols !== 'object') throw new Error('Argument is not an array');
    return symbols.find(val => val === this.charCodeAt(position));
}

// уничтожает двойные, тройные, ... пробелы
String.prototype.multipleSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.in([32, 160, 65279], i) && this.in([32, 160, 65279], i + 1))
            continue;
        else
            newText += this[i];
    return newText;
}

// уничтожает пробелы до и после дефиса
String.prototype.hyphenSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.in([32, 160, 65279], i)) {
            if (this.charCodeAt(i + 1) !== 45 && this.charCodeAt(i - 1) !== 45) newText += this[i]
        } else
            newText += this[i];
    return newText;
}

String.prototype.lineWrapping = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.in([10, 13], i))
            newText += ' ';
        else
            newText += this[i];
    return newText;
}

function breakText(text) {
    let words = [];
    let word = '';
    for (let i = 0; i < text.length; i++) {
        if (text.in([32, 65279], i)) {
            if (word.trim() !== '') {
                words.push(word);
                word = '';
            }
        } else {
            word += text[i];
        }
    }
    if (word.trim() !== '')
        words.push(word);
    return words;
}

onmessage = (e) => {
    let arr = []
    if (e.data.type === 'break') {
        console.time()
        arr = breakText(e.data.text
            .multipleSpaces()
            .hyphenSpaces()
            .lineWrapping());
        console.timeEnd()
    }
    postMessage(arr);
}