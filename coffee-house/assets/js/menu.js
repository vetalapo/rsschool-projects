"use strict";

let currentSectionId = "coffee-menu";

function menuSelection(event) {
    event.preventDefault();

    // Clearing active classes
    const listItems = document.getElementById("category-switch").childNodes;

    for (let item of listItems) {
        const anchorTag = item.childNodes[0];

        if (anchorTag) {
            if (anchorTag.classList) {
                anchorTag.classList.remove("active");
            }
        }
    }

    // Determine right element to work with, as children might affect behavior
    let path = event.target.href;
    
    // Add active class for current element
    if (path) {
        event.target.classList.add("active");
     } else {
        event.target.parentElement.classList.add("active");
        path = event.target.parentElement.href;
     }
    
    // Switching slides
    currentSectionId = path.split('#')[1];
    const sections = document.getElementsByClassName("product-selection");

    for (let section of sections) {
        section.classList.add("no-display");
    }

    const currentSection = document.getElementById(currentSectionId);

    currentSection.classList.remove("no-display");

    // Remove load button if there's 4 or less products
    // or if every element in section is already displayed
    if (currentSection.children.length <= 4 || [...currentSection.children].every(element => element.checkVisibility())) {
        document.getElementById("fetch-button").style.display = "none";
    } else {
        document.getElementById("fetch-button").style.display = "flex";
    }
}

function fetchCategoryProducts() {
    // Display hidden products for current category
    const currentSectionChildren = document.getElementById(currentSectionId).children;

    [...currentSectionChildren]
        .filter(element => !element.checkVisibility())
        .forEach(element => element.style.display = "block");

    // Hide button
    document.getElementById("fetch-button").style.display = "none";
}

// On Load
(() => {
    // TODO: Add what needs to run on load for menu page
})();
