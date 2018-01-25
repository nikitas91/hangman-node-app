/* jshint esversion: 6 */

const Letter = require("./letter");

function Word(word) {
    this.word = word;
    this.letters = [];
    this.lettersRemaining = 0;
    this.wordCompleted = false;
    this.createLetterArray = function () {
        for (let i = 0; i < this.word.length; i++) {
            let newLetter = new Letter(this.word.charAt(i));
            this.letters.push(newLetter);
            if (!newLetter.displayLetter) this.lettersRemaining++;
        }

    };
    this.containsLetter = function (letterToSearch) {
        let letterFound = false;

        this.letters.forEach(letterItem => {
            if (letterItem.letter.toLowerCase() === letterToSearch.toLowerCase()) {
                letterItem.displayLetter = true;
                letterFound = true;
                this.lettersRemaining--;
            }
        });

        if(this.lettersRemaining === 0)
            this.wordCompleted = true;

        return letterFound;
    };
}

Word.prototype.printWord = function () {
    let result = "";
    this.letters.forEach(element => {
        result += element.getLetter() + " ";
    });
    return result.substring(0, result.length - 1);
};

module.exports = Word;