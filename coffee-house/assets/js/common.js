"use strict";

// Hamburger menu
function toggleHamburgerButton() {
    const hamburgerButton = document.getElementById("hamburger-menu");
    const hamburgerCloseButton = document.getElementById("hamburger-menu-close");
    
    if (hamburgerButton.style.display === "none") {
        hamburgerButton.style.display = "flex";
        hamburgerCloseButton.style.display = "none";
    } else {
        hamburgerButton.style.display = "none";
        hamburgerCloseButton.style.display = "flex";
    }
}

function toggleMenu() {
    const navigationOptions = document.getElementById("navigation-options");
    const menuNav = document.getElementById("navigation-menu");

    if(navigationOptions.classList.contains("full-screen-hamburger-menu")) {
        // Hide
        navigationOptions.classList.remove("full-screen-hamburger-menu");
        document.body.classList.remove("no-scroll");
        
        // menu nav element
        menuNav.classList.add("fixed-underline");
        menuNav.style.display = "none";
    } else {
        // Show
        navigationOptions.classList.add("full-screen-hamburger-menu");
        document.body.classList.add("no-scroll")

        // menu nav element
        menuNav.classList.remove("fixed-underline");
        menuNav.style.display = "flex";
    }
}

function toggleHamburgerMenu() {
    if (screen.width > 768) {
        return;
    }

    toggleHamburgerButton();
    toggleMenu();
}

// On load
(() => {
    // TODO: Move common functions which should be firing on load for both home and menu pages
})();
