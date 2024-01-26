"use strict";

class Hangman {
    constructor() {
        this.gameTitle = "Hangman Game";
        this.gallows = null;
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
        const quiz = document.createElement("div");
        quiz.id = "quiz-container";

        // Appending children to the main container
        container.appendChild(gallowsContainer);
        container.appendChild(quiz);

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

// On load
(() => {
    const hangman = new Hangman();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
