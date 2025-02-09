"use strict";

// Hamburger menu
function toggleHamburgerButton() {
    const hamButtonOne = document.getElementById("ham-button-line-one");
    const hamButtonTwo = document.getElementById("ham-button-line-two");

    // Line One
    if (hamButtonOne.classList.contains("hamburger-line-one-rotate-in")) {
        hamButtonOne.classList.remove("hamburger-line-one-rotate-in");
        hamButtonOne.classList.add("hamburger-line-one-rotate-out");
    } else {
        hamButtonOne.classList.remove("hamburger-line-one-rotate-out");
        hamButtonOne.classList.add("hamburger-line-one-rotate-in");
    }

    // Line Two
    if (hamButtonTwo.classList.contains("hamburger-line-two-rotate-in")) {
        hamButtonTwo.classList.remove("hamburger-line-two-rotate-in");
        hamButtonTwo.classList.add("hamburger-line-two-rotate-out");
    } else {
        hamButtonTwo.classList.remove("hamburger-line-two-rotate-out");
        hamButtonTwo.classList.add("hamburger-line-two-rotate-in");
    }
}

function toggleMenu() {
    const navigationOptions = document.getElementById("navigation-options");
    const menuNav = document.getElementById("navigation-menu");
    
    menuNav.classList.remove("fixed-underline");

    if(navigationOptions.classList.contains("full-screen-hamburger-menu-expanded")) {
        // Hide menu
        navigationOptions.classList.remove("full-screen-hamburger-menu-expanded");
        navigationOptions.classList.add("full-screen-hamburger-menu-collapsed");

        document.body.classList.remove("no-scroll");
        
        // menu nav element
        menuNav.classList.remove("full-screen-hamburger-menu-expanded");
        menuNav.classList.add("full-screen-hamburger-menu-collapsed");
    } else {
        // Show menu
        navigationOptions.classList.remove("full-screen-hamburger-menu-collapsed");
        navigationOptions.classList.add("full-screen-hamburger-menu-expanded");

        document.body.classList.add("no-scroll")

        // menu nav element
        menuNav.classList.remove("full-screen-hamburger-menu-collapsed");
        menuNav.classList.add("full-screen-hamburger-menu-expanded");
    }
}

function toggleHamburgerMenu() {
    if (window.innerWidth > 768) {
        return;
    }

    toggleHamburgerButton();
    toggleMenu();
}

// On load
(() => {
    // Self evaluation
    console.info(`Coffee House, Week III\n\nSelf assessment:\n\t
        1. Implementation of the burger menu on both pages: +22\n\t
        2. Implementation of the carousel on the home page: +24\n\t
        3. Categories of products on the menu page:         +16\n\t
        4. The Modal on the menu page:                      +20\n\t
        5. Video on the home page:                          +8\n\n\t
        Total: 90/90`);
})();
