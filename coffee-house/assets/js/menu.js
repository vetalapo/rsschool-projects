"use strict";

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
    const targetSectionId = path.split('#')[1];
    const sections = document.getElementsByClassName("product-selection");

    for (let section of sections) {
        section.classList.add("no-display");
    }

    document.getElementById(targetSectionId).classList.remove("no-display");
}

// On Load
(() => {
    // TODO: Add what needs to run on load for menu page
})();
