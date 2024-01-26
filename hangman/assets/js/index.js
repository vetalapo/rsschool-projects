"use strict";

class Hangman {
    constructor() {
        this.renderMainContainer();
    }

    renderMainContainer() {
        // Game container
        const container = document.createElement("div");
        container.classList.add("hangman-game-container");

        // Gallows container
        const gallows = document.createElement("div");
        gallows.id = "gallows-container";

        // Quiz container
        const quiz = document.createElement("div");
        quiz.id = "quiz-container";

        container.appendChild(gallows);
        container.appendChild(quiz);

        // Rendering containers
        document.body.appendChild(container);
    }

}

// On load
(() => {
    const hangman = new Hangman();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
