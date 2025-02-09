"use strict";

export class Gallows {
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
        image.alt = "Hangman slide state picture";

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
