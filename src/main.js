import './String';
import WordsClass from './WordsClass';
import '../build/style.css';

const Words = new WordsClass();

const badSymbols = [
    [33, 47],
    [58, 63],
    [95, 95],
    [123, 126],
    [171, 171],
    [187, 187],
    [8211, 8211],
    [8722, 8722]
];

console.log(Words.clearWord('––––––––––––––––––––––––––––––––––––––––––––––––––––––––––', badSymbols));