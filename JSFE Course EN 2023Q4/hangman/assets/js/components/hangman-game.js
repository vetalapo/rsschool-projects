"use strict";

import { Gallows } from "./gallows-component.js";
import { Printer } from "./printer-component.js";
import { Keyboard } from "./keyboard-component.js";
import { ModalDialog } from "./modal-dialog-component.js";

export class Hangman {
    constructor() {
        this.gameTitle = "Hangman Game";

        // Components
        this.gallows = null;
        this.printer = null;
        this.keyboard = null;
        this.modal = null;

        // Game vars
        this.lives = 6;
        this.correctGuesses = 0;
        this.processingBlock = false;
        this.answerSet = new Set();
        this.answerPlain = "";
        this.answerMasked = "";
        this.questionId = 0;

        this.hangmanWords = [
            { keyword: "python", hint: "What if everything was a dict?" },
            { keyword: "java", hint: "What if everything was an object?" },
            { keyword: "javascript", hint: "What if everything was a dict *and* an object?" },
            { keyword: "clanguage", hint: "What if everything was a pointer?" },
            { keyword: "apl", hint: "What if everything was an array?" },
            { keyword: "tickle", hint: "What if everything was a string?" },
            { keyword: "prolog", hint: "What if everything was a term?" },
            { keyword: "lisp", hint: "What if everything was a pair?" },
            { keyword: "scheme", hint: "What if everything was a function?" },
            { keyword: "haskell", hint: "What if everything was a monad?" },
            { keyword: "assembly", hint: "What if everything was a register?" },
            { keyword: "coq", hint: "What if everything was a type/proposition?" },
            { keyword: "cobol", hint: "WHAT IF EVERYTHING WAS UPPERCASE?" },
            { keyword: "csharp", hint: "What if everything was like Java, but different?" },
            { keyword: "ruby", hint: "What if everything was monkey patched?" },
            { keyword: "pascal", hint: "BEGIN What if everything was structured? END" },
            { keyword: "cplusplus", hint: "What if we added everything to the language?" },
            { keyword: "rust", hint: "What if garbage collection didn't exist?" },
            { keyword: "golang", hint: "What if we tried designing C a second time?" },
            { keyword: "perl", hint: "What if shell, sed, and awk were one language?" },
            { keyword: "php", hint: "What if we wanted to make SQL injection easier?" },
            { keyword: "visualbasic", hint: "What if we wanted to allow anyone to program?" },
            { keyword: "forth", hint: "What if everything was a stack?" },
            { keyword: "colorforth", hint: "What if the stack was green?" },
            { keyword: "postscript", hint: "What if everything was printed at 600dpi?" },
            { keyword: "xslt", hint: "What if everything was an XML element?" },
            { keyword: "scala", hint: "What if Haskell ran on the JVM?" },
            { keyword: "clojure", hint: "What if LISP ran on the JVM?" },
            { keyword: "lua", hint: "What if game developers got tired of C++?" },
            { keyword: "malbolge", hint: "What if there is no god? 😈" }
        ];
    }

    start() {
        this.initMainContainerAndComponents();
        this.resetGame();
    }

    initMainContainerAndComponents() {
        // Game container
        const container = document.createElement("main");
        container.classList.add("hangman-game-container");

        // Gallows container
        const gallowsContainer = document.createElement("div");
        gallowsContainer.id = "gallows-container";
        gallowsContainer.classList.add("no-user-interaction");
        this.gallows = new Gallows(this.gameTitle, gallowsContainer);

        // Quiz container
        const quizContainer = document.createElement("div");
        quizContainer.id = "quiz-container";

        this.printer = new Printer(quizContainer);
        this.keyboard = new Keyboard(quizContainer, this.processInput.bind(this));

        // Appending children to the main container
        container.appendChild(gallowsContainer);
        container.appendChild(quizContainer);

        // Rendering containers to the document
        document.body.appendChild(container);

        // Modal
        this.modal = new ModalDialog(this.onModalClose.bind(this));
    }

    processInput(key) {
        if (this.processingBlock) {
            return;
        }

        this.keyboard.disableKey(key);

        if (this.isMatch(key)) {
            this.cycleCorrect(key);
        } else {
            this.cycleWrong();
        }
    }

    isMatch(key) {
        return this.answerSet.has(key);
    }

    isWin() {
        return this.correctGuesses === this.answerSet.size;
    }

    isLose() {
        return this.lives <= 0;
    }

    isFlawless() {
        return this.lives === 6;
    }

    cycleCorrect(key) {
        this.correctGuesses++;
        this.printer.setCodeWord(this.unmaskLetter(key));

        if (this.isWin()) {
            this.processingBlock = true;
            this.gallows.gameWin();

            const headerText = "You have won!";
            const answerComment = "was indeed the answer";

            this.modal.show(headerText, this.answerPlain, answerComment, this.isFlawless());
        }
    }

    cycleWrong() {
        this.lives--;
        this.gallows.cycleState();
        this.printer.cycleState();

        if (this.isLose()) {
            this.processingBlock = true;

            const headerText = "All hope is lost...";
            const answerComment = "was the answer";

            this.modal.show(headerText, this.answerPlain, answerComment, this.isFlawless());
        }
    }

    unmaskLetter(letter) {
        let result = this.answerMasked.split('');

        for (let i = 0; i < this.answerPlain.length; i++) {
            const answerChar = this.answerPlain[i];

            if (answerChar === letter) {
                result[i] = answerChar;
            }
        }

        this.answerMasked = result.join('');

        return this.answerMasked;
    }

    onModalClose() {
        this.resetGame();
        this.modal.close();
    }

    resetGame() {
        this.lives = 6;
        this.correctGuesses = 0;
        this.processingBlock = false;

        // Get quiz, Set answer
        // Randomizing
        let randomIndex = this.getRandomIndex(this.hangmanWords.length);

        while (randomIndex === this.questionId) {
            randomIndex = this.getRandomIndex(this.hangmanWords.length);
        }

        this.questionId = randomIndex;

        // Getting quiz;
        const randomQuiz = this.hangmanWords[randomIndex];

        this.answerSet = new Set(randomQuiz.keyword);
        this.answerPlain = randomQuiz.keyword;
        this.answerMasked = '_'.repeat(randomQuiz.keyword.length);

        // Gallows
        this.gallows.gameReset();

        // Printer
        this.printer.cycleReset();
        this.printer.setHint(randomQuiz.hint);
        this.printer.setCodeWord(this.answerMasked);

        // Keyboard
        this.keyboard.reset();
    }

    getRandomIndex(upperLimit) {
        return Math.floor(Math.random() * upperLimit);
    }
}
