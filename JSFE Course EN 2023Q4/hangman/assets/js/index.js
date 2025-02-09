"use strict";

import { Hangman } from "./components/hangman-game.js";

// On DOM load
(() => {
    new Hangman().start();

    console.info("Welcome to the Hangman World!");
    console.info("Make yourself comfortable while you're here. ♥");
})();
