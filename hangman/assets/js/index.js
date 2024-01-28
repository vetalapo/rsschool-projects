"use strict";

class Hangman {
    constructor() {
        this.gameTitle = "Hangman Game";
        this.gallows = null;
        this.printer = null;
        this.keyboard = null;

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
        this.keyboard = new Keyboard(quizContainer);

        // Appending children to the main container
        container.appendChild(gallowsContainer);
        container.appendChild(quizContainer);

        // Rendering containers to the document
        document.body.appendChild(container);
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
        const codeWordContainer = document.createElement("div");
        codeWordContainer.classList.add("code-word-container");
        
        const codeWordElement = document.createElement("p");
        codeWordElement.id = "code-word";
        codeWordElement.textContent = this.codeWord;
        codeWordContainer.appendChild(codeWordElement);

        // Hint
        const hintContainer = document.createElement("div");
        hintContainer.classList.add("hint-container");
        const hintElement = document.createElement("p");
        hintElement.id = "hint";
        hintElement.textContent = this.formatHint(this.hint);
        codeWordContainer.appendChild(hintElement);
        
        // Lives
        const livesStatusContainer = document.createElement("div");
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
}

class Keyboard {
    constructor(container) {
        this.init(container);
    }

    init(container) {
        const keyboardContainer = document.createElement("div");
        keyboardContainer.classList.add("keyboard-container");

        container.appendChild(keyboardContainer);
    }
}

// On load
(() => {
    const hangman = new Hangman();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
