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
    console.info(`Coffee House, Week II\n\nSelf assessment:\n\t
        1. The layout of the pages matches the design at a screen width of 1440px: +14\n\t
        2. The layout of the pages matches the design at a screen width of 768px: +14\n\t
        3. The layout of the pages matches the design at a screen width of 380px: +14\n\t
        4. There is no horizontal scroll bar at all screen width up to 380px inclusive. All page content remains as per the design: it is not cropped, removed, or shifted to the side: +20\n\t
        5. During smooth resizing of the screen from 1440px to 380px, the layout takes up the full width of the window (including the margins specified in the layout), elements change their sizes and positions (but without full scaling), elements do not overlap, and images maintain their correct proportions: +8\n\t
        6. At screen widths of 768px and below on both pages, the menu and navigation buttons in the header are hidden, and a burger menu icon appears: +4\n\t
        7. Hover effects are enable on desktop devices (Desktop device type in DevTools) and disabled for mobile devices on both pages (Mobile device type in DevTools): +4\n\t
        8. The layout of both pages is valid: to check the validity of the layout, use the service https://validator.w3.org/ : +12\n\n\t
        Total: 90`);
})();
