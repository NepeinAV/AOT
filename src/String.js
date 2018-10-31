// уничтожает двойные, тройные, ... пробелы
String.prototype.multipleSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.charCodeAt(i) === 32 && this.charCodeAt(i + 1) === 32)
            continue;
        else
            newText += this[i];
    return newText;
}

// уничтожает пробелы перед и после дефиса
String.prototype.hyphenSpaces = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.charCodeAt(i) === 32) {
            if (this.charCodeAt(i + 1) !== 45 && this.charCodeAt(i - 1) !== 45) newText += this[i]
        } else
            newText += this[i];
    return newText;
}

String.prototype.lineWrapping = function () {
    let newText = '';
    for (let i = 0; i < this.length; i++)
        if (this.charCodeAt(i) === 10 || this.charCodeAt(i) === 13)
            newText += ' ';
        else
            newText += this[i];
    return newText;
}

// TODO: f(): уничтожает дефис, если он использован в качестве переноса строки
// String.prototype.hyphenEndString = function () {
//     let newtext = '';
//     for (let i = 0; i < this.length; i++) {
//         if (this.charCodeAt(i) === 45 && this.charCodeAt(i + 1) === 10) {
//             i++;
//         } else {
//             newtext += this[i];
//         }
//     }
//     return newtext;
// }