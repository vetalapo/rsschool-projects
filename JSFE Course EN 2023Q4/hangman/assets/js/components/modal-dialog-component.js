"use strict";

export class ModalDialog {
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
