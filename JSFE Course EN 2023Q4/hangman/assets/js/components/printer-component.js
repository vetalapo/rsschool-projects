"use strict";

export class Printer {
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
