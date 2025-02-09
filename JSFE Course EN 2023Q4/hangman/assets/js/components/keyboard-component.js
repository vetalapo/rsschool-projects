"use strict";

export class Keyboard {
    constructor(container, callback) {
        this.gameCallback = callback;
        
        this.keys = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
            'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
            's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ];
        
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
