"use strict";

// Hamburger menu
function toggleHamburgerButton() {
    const hamburgerButton = document.getElementById("hamburger-menu");
    const hamburgerCloseButton = document.getElementById("hamburger-menu-close");
    
    if (hamburgerButton.classList.contains("burger-menu-fade")) {
        hamburgerButton.classList.remove("burger-menu-fade");
        hamburgerButton.classList.add("burger-menu-expand");

        hamburgerCloseButton.classList.remove("burger-menu-expand");
        hamburgerCloseButton.classList.add("burger-menu-fade");
    } else {
        hamburgerButton.classList.remove("burger-menu-expand");
        hamburgerButton.classList.add("burger-menu-fade");

        hamburgerCloseButton.classList.remove("burger-menu-fade");
        hamburgerCloseButton.classList.add("burger-menu-expand");
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
    if (screen.width > 768) {
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
        2. Implementation of the carousel on the home page: +0\n\t
        3. Categories of products on the menu page:         +16\n\t
        4. The Modal on the menu page:                      +20\n\t
        5. Video on the home page:                          +8\n\n\t
        Total: 66/90`);
})();
