"use strict";

class Hangman {
    constructor() {
        this.gallows = null;
        this.renderMainContainer();
    }

    renderMainContainer() {
        // Game container
        const container = document.createElement("div");
        container.classList.add("hangman-game-container");

        // Gallows container
        const gallowsContainer = document.createElement("div");
        gallowsContainer.id = "gallows-container";
        this.gallows = new Gallows(gallowsContainer);

        // Quiz container
        const quiz = document.createElement("div");
        quiz.id = "quiz-container";

        container.appendChild(gallowsContainer);
        container.appendChild(quiz);

        // Rendering containers
        document.body.appendChild(container);
    }
}

class Gallows {
    constructor(container) {
        this.pictureId = "hangman-state";
        this.state = 0;

        this.init(container);
    }

    init(container) {
        const image = document.createElement("img");
        image.id = this.pictureId;
        image.src = "assets/image/state/0.png";
        image.alt = "Hangman slide state picture"

        container.appendChild(image);
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

// On load
(() => {
    const hangman = new Hangman();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
