/* jshint esversion: 6 */

function Letter(letter) {
    this.letter = letter;
    this.mask = "_";
    this.displayLetter = (this.letter === " ");
}

Letter.prototype.getLetter = function () {
    return (this.displayLetter) ? this.letter : this.mask;
};

module.exports = Letter;