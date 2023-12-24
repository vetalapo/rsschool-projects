"use strict";

let slideIndex = 0;

function activateSliderDash(index) {
    const sliderDashElements = [...document.getElementById("slide-indicators").children];

    sliderDashElements.forEach( elem => {
        elem.classList.remove("slider-dash-dark");
        elem.classList.add("slider-dash");
    });

    sliderDashElements[index].classList.remove("slider-dash");
    sliderDashElements[index].classList.add("slider-dash-dark");
}

function slideRight() {
    slideIndex++;

    if (slideIndex > 2) {
        slideIndex = 2;
    }

    activateSliderDash(slideIndex);

    document.getElementById("slides").scrollLeft += 1000;
};

function slideLeft() {
    slideIndex--;

    if (slideIndex < 0) {
        slideIndex = 0;
    }

    activateSliderDash(slideIndex);

    document.getElementById("slides").scrollLeft -= 1000;
};

// On Load
(() => {
    // Self evaluation
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
