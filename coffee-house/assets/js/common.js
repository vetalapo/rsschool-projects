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
    // TODO: Move common functions which should be firing on load for both home and menu pages
})();
