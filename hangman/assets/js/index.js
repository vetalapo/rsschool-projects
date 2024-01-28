"use strict";

class Hangman {
    constructor() {
        this.gameTitle = "Hangman Game";
        this.gallows = null;
        this.printer = null;
        this.keyboard = null;

        this.inputLettersSet = 
            new Set([
                  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
                  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
                  's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
                ]);

        this.initMainContainerAndComponents();
    }

    initMainContainerAndComponents() {
        // Game container
        const container = document.createElement("div");
        container.classList.add("hangman-game-container");

        // Gallows container
        const gallowsContainer = document.createElement("div");
        gallowsContainer.id = "gallows-container";
        this.gallows = new Gallows(this.gameTitle, gallowsContainer);

        // Quiz container
        const quizContainer = document.createElement("div");
        quizContainer.id = "quiz-container";

        this.printer = new Printer(quizContainer);
        this.keyboard = new Keyboard(quizContainer, this.handleKeyboardEvents.bind(this));

        // Appending children to the main container
        container.appendChild(gallowsContainer);
        container.appendChild(quizContainer);

        // Rendering containers to the document
        document.body.appendChild(container);
    }

    handleKeyboardEvents(event) {
        if (event.type === "keyup") {
            if (this.inputLettersSet.has(event.key)) {
                this.processInput(event.key);
            }
        } else if (event.type === "click") {
            this.processInput(event.target.innerText.toLowerCase());
        }
    }

    processInput(key) {
        console.log(key);
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
        this.codeWord = "_a___a__";
        this.hint = "Test hint for the riddle.";
        
        this.init(container);
    }

    init(container) {
        // Code word
        const codeWordContainer = document.createElement("section");
        codeWordContainer.classList.add("code-word-container");
        
        const codeWordElement = document.createElement("p");
        codeWordElement.id = "code-word";
        codeWordElement.textContent = this.codeWord;
        codeWordContainer.appendChild(codeWordElement);

        // Hint
        const hintContainer = document.createElement("section");
        hintContainer.classList.add("hint-container");
        const hintElement = document.createElement("p");
        hintElement.id = "hint";
        hintElement.textContent = this.formatHint(this.hint);
        hintContainer.appendChild(hintElement);
        
        // Lives
        const livesStatusContainer = document.createElement("section");
        livesStatusContainer.classList.add("lives-status-container");
        
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
}

class Keyboard {
    constructor(container, callback) {
        this.keys = "abcdefghijklmnopqrstuvwxyz";

        this.init(container, callback);
    }

    init(container, callback) {
        const keyboardContainer = document.createElement("section");
        keyboardContainer.classList.add("keyboard-container");

        container.appendChild(keyboardContainer);
        this.generateButtonsAndAddEventListeners(keyboardContainer, this.keys, callback);
    }

    generateButtonsAndAddEventListeners(container, keys, callback) {
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
            key.addEventListener("click", callback);

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
        document.addEventListener("keyup", callback);
    }
}

// On load
(() => {
    const hangman = new Hangman();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
