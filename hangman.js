/* jshint esversion: 6 */

const Word = require("./word");
const Wordbank = require("./word-bank");
const inquirer = require("inquirer");

var hangman = {
    currentWord: null,
    wordsCompleted: [],
    wins: 0,
    losses: 0,
    round: 0,
    guessesRemaining: 0,
    lettersGuessed: [],
    initializeGame: function () {
        this.renderIntro();

        inquirer.prompt([
            {
                type: "list",
                choices: ["Yes", "No"],
                name: "playGame",
                message: "Would you like to play?",
                default: 0
            }
        ]).then((answers) => {
            if (answers.playGame.toLowerCase() === "yes") {
                this.newRound();
            }
            else {
                this.renderExit();
            }
        });
    },
    newRound: function () {
        console.log(Wordbank.wordsRemaining());
        this.currentWord = new Word(Wordbank.getRandomWord());
        console.log(Wordbank.wordsRemaining());
        this.currentWord.createLetterArray();
        this.guessesRemaining = 10;
        this.lettersGuessed = [];
        this.round++;
        this.renderNewRound();
        this.promptUser();
    },
    promptUser: function () {
        inquirer.prompt([
            {
                type: "input",
                name: "letterGuessed",
                message: "Guess a letter!",
                validate: (input) => {
                    return this.isLetter(input);
                }
            }
        ]).then((answers) => {
            if (this.lettersGuessed.indexOf(answers.letterGuessed) >= 0) {
                console.log("\n" + answers.letterGuessed + " has already been used!\n");
            }
            else {
                this.lettersGuessed.push(answers.letterGuessed);
                let letterFound = this.currentWord.containsLetter(answers.letterGuessed);
                this.renderCurrentWord();
                if (letterFound) {
                    this.renderCorrectGuess();
                }
                else {
                    this.guessesRemaining--;
                    this.renderIncorrectGuess();
                }
            }

            if (this.currentWord.wordCompleted) {
                this.roundWon();
            }
            else if (this.guessesRemaining > 0 && !this.currentWord.wordCompleted)
                this.promptUser();
            else
                this.roundLost();
        });
    },
    isLetter: function (letterToValidate) {
        let regEx = /^[A-Z]$/i;
        return regEx.test(letterToValidate);
    },
    renderIntro: function () {
        console.log("===========================================");
        console.log("=                 HANGMAN                 =");
        console.log("-------------------------------------------");
        console.log("=              MOVIE EDITION              =");
        console.log("===========================================\n");
    },
    renderExit: function () {
        console.log("\n===========================================");
        console.log("=          COME BACK NEXT TIME!           =");
        console.log("===========================================\n");
    },
    renderNewRound: function () {
        if (this.round == 1) {
            console.log("\nHere is your first word!!!\n");
        }
        this.renderCurrentWord();
    },
    renderCurrentWord: function () {
        console.log("\n" + this.currentWord.printWord() + "\n");
    },
    renderStatistics: function () {
        console.log("\n===========================================");
        console.log("=               STATISTICS                =");
        console.log("-------------------------------------------");
        console.log("Rounds played:", this.round);
        console.log("Wins:", this.wins);
        console.log("Losses:", this.losses);
        console.log("Words completed:", "\n-" + this.wordsCompleted.join("\n-"));
        console.log("===========================================\n");
    },
    renderCorrectGuess: function () {
        console.log("CORRECT!!!\n");
    },
    renderIncorrectGuess: function () {
        console.log("INCORRECT!!!\n");
        console.log(this.guessesRemaining + " guesses remaining!!!\n");
    },
    roundWon: function () {
        this.wins++;
        this.wordsCompleted.push(this.currentWord.word);
        if (Wordbank.wordsRemaining() > 0) {
            console.log("You got it right! Next word!\n");
            this.newRound();
        }
        else {
            console.log("You got all of the words right!!!\n");
            this.renderStatistics();
        }
    },
    roundLost: function () {
        this.losses++;
        console.log("YOU LOST!\n");

        inquirer.prompt([
            {
                type: "list",
                choices: ["Yes", "No"],
                name: "playAgain",
                message: "Play again?",
                default: 0
            }
        ]).then((answers) => {
            if(answers.playAgain.toLowerCase() === "yes"){
                console.log("\nHere is your new word!!!\n");
                this.newRound();
            }
            else
                this.renderStatistics();
        });
    }
};

hangman.initializeGame();