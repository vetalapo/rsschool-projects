"use strict";

class Hangman {
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
            { keyword: "mathematica", hint: "What if Stephen Wolfram invented everything?" },
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
        const randomIndex = Math.floor(Math.random() * (this.hangmanWords.length - 1));
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
}

class Gallows {
    constructor(title, container) {
        this.title = title;
        this.pictureId = "hangman-state";
        this.state = 0;

        this.init(container);
    }

    init(container) {
        // Image
        const image = document.createElement("img");
        image.id = this.pictureId;
        image.src = "assets/image/state/0.png";
        image.alt = "Hangman slide state picture"

        // Game title
        const title = document.createElement("h1");
        title.classList.add("game-title");
        title.textContent = this.title;

        // Appending children to the container
        container.appendChild(image);
        container.appendChild(title);
    }

    setState(state) {
        const image = document.getElementById(this.pictureId);
        image.src = `assets/image/state/${state}.png`;
    }

    cycleState() {
        if (this.state === "win") {
            return;
        }
        
        this.state++;

        if (this.state >= 7) {
            this.state = 6;
        }

        this.setState(this.state);
    }

    gameReset() {
        this.state = 0;
        this.setState(this.state);
    }

    gameOver() {
        this.state = 6;
        this.setState(this.state);
    }

    gameWin() {
        this.state = "win";
        this.setState(this.state);
    }
}

class Printer {
    constructor(container) {
        this.lives = 6;
        this.codeWord = "";
        this.hint = "";
        
        this.init(container);
    }

    init(container) {
        // Code word
        const codeWordContainer = document.createElement("section");
        codeWordContainer.classList.add("code-word-container");
        codeWordContainer.classList.add("no-user-interaction");
        
        const codeWordElement = document.createElement("p");
        codeWordElement.id = "code-word";
        codeWordElement.textContent = this.codeWord;
        codeWordContainer.appendChild(codeWordElement);

        // Hint
        const hintContainer = document.createElement("section");
        hintContainer.classList.add("hint-container");
        hintContainer.classList.add("no-user-interaction");
        const hintElement = document.createElement("p");
        hintElement.id = "hint";
        hintElement.textContent = this.formatHint(this.hint);
        hintContainer.appendChild(hintElement);
        
        // Lives
        const livesStatusContainer = document.createElement("section");
        livesStatusContainer.classList.add("lives-status-container");
        livesStatusContainer.classList.add("no-user-interaction");
        
        const livesElement = document.createElement("p");
        livesElement.textContent = "Incorrect guesses: ";
        
        const score = document.createElement("span");
        score.id = "game-score";
        score.innerText = this.formatScore(this.lives);

        livesElement.appendChild(score);
        livesStatusContainer.appendChild(livesElement);

        // Containers all together
        container.appendChild(codeWordContainer);
        container.appendChild(hintContainer);
        container.appendChild(livesStatusContainer);
    }

    formatHint(hint) {
        return `Hint: ${hint}`;
    }

    formatScore(score) {
        return `${6 - score} / 6`;
    }

    cycleState() {
        this.lives--;

        if (this.lives > 6) {
            this.lives = 6;
        }

        if (this.lives < 0) {
            this.lives = 0;
        }

        const score = document.getElementById("game-score");
        score.textContent = this.formatScore(this.lives);
    }

    cycleReset() {
        this.lives = 6;
        const score = document.getElementById("game-score");
        score.textContent = this.formatScore(this.lives);
    }

    setHint(hint) {
        document.getElementById("hint").textContent = this.formatHint(hint);
    }

    setCodeWord(wordPartial) {
        document.getElementById("code-word").textContent = wordPartial; 
    }
}

class Keyboard {
    constructor(container, callback) {
        this.gameCallback = callback;
        this.keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.availableInputLettersSet = new Set(this.keys);

        this.init(container);
    }

    init(container) {
        const keyboardContainer = document.createElement("section");
        keyboardContainer.classList.add("keyboard-container");

        container.appendChild(keyboardContainer);
        this.generateButtonsAndAddEventListeners(keyboardContainer, this.keys);
    }

    generateButtonsAndAddEventListeners(container, keys) {
        // Create 3 rows for the keyboard
        const row = document.createElement("div");
        row.classList.add("keys-row");

        const row2 = document.createElement("div");
        row2.classList.add("keys-row");

        const row3 = document.createElement("div");
        row3.classList.add("keys-row");

        // Add buttons for each row
        for (let i = 0; i < keys.length; i++) {
            const key = document.createElement("button");

            key.id = `${keys[i]}-key`;
            key.classList.add("key-button");
            key.innerText = keys[i];
            key.addEventListener("click", this.handleKeyboardEvents.bind(this));

            const rowIndex = Math.trunc(i / 9);

            if (rowIndex === 0) {
                row.appendChild(key);
            } else if (rowIndex === 1) {
                row2.appendChild(key);
            } else {
                row3.appendChild(key);
            }
        }

        // Add rows
        container.appendChild(row);
        container.appendChild(row2);
        container.appendChild(row3);

        // Physical keyboard event listener
        document.addEventListener("keyup", this.handleKeyboardEvents.bind(this));
    }

    handleKeyboardEvents(event) {
        if (event.type === "keyup") {
            if (this.availableInputLettersSet.has(event.key)) {
                this.gameCallback(event.key);
            }
        } else if (event.type === "click") {
            this.gameCallback(event.target.innerText.toLowerCase());
        }
    }

    disableKey(key) {
        const keyElement = document.getElementById(`${key}-key`);
        keyElement.disabled = true;
        keyElement.classList.add("key-button-disabled");

        this.availableInputLettersSet.delete(key);
    }

    reset() {
        this.availableInputLettersSet = new Set(this.keys);

        const buttons = document.querySelectorAll(".key-button:disabled");
        
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            button.removeAttribute("disabled");
            button.classList.remove("key-button-disabled");
        }
    }
}

class ModalDialog {
    constructor(callback) {
        this.init(callback);
    }

    init(callback) {
        // Container
        const dialogContainer = document.createElement("dialog");
        dialogContainer.id = "dialog-finale";

        // Header
        const header = document.createElement("h2");
        header.id = "dialog-header";
        header.classList.add("no-user-interaction");

        // Flawless Victory
        const flawlessVictory = document.createElement("p");
        flawlessVictory.id = "dialog-flawless";
        flawlessVictory.innerText = "Flawless Victory";
        flawlessVictory.style.display = "none";
        flawlessVictory.classList.add("no-user-interaction");

        // Answer
        const riddleAnswer = document.createElement("p");
        riddleAnswer.id = "dialog-riddle-answer";
        riddleAnswer.classList.add("no-user-interaction");

        // Answer commentary
        const answerCommentary = document.createElement("p");
        answerCommentary.id = "dialog-answer-commentary";
        answerCommentary.classList.add("no-user-interaction");
        
        // Button
        const button = document.createElement("button");
        button.id = "dialog-close-button";
        button.textContent = "Play Again";
        button.addEventListener("click", callback);

        // Render
        dialogContainer.appendChild(header);
        dialogContainer.appendChild(flawlessVictory);
        dialogContainer.appendChild(riddleAnswer);
        dialogContainer.appendChild(answerCommentary);
        dialogContainer.appendChild(button);

        document.body.appendChild(dialogContainer);
    }

    show(headerText, answerWord, answerComment, isFlawless = false) {
        document.getElementById("dialog-header").textContent = headerText;
        document.getElementById("dialog-riddle-answer").textContent = answerWord;
        document.getElementById("dialog-answer-commentary").textContent = answerComment;
        
        if (isFlawless) {
            document.getElementById("dialog-flawless").style.display = "block";
        }

        document.getElementById("dialog-finale").showModal();
    }

    close() {
        document.getElementById("dialog-finale").close();
        document.getElementById("dialog-flawless").style.display = "none";
    }
}

// On load
(() => {
    new Hangman().start();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
