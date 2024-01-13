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

function setBannerVideoSize() {
    const screenWidth = screen.width;
    const bannerVideo = document.getElementById("banner-video");

    if (bannerVideo) {
        if (screenWidth > 768) {
            bannerVideo.src = "assets/video/coffee-pour-1080p.mp4";
        } else if (screenWidth <= 768 && screenWidth > 380) {
            bannerVideo.src = "assets/video/coffee-pour-720p.mp4";
        } else if (screenWidth <= 380) {
            bannerVideo.src = "assets/video/coffee-pour-360p.mp4";
        }

        bannerVideo.load();
    }
}

// On Load
(() => {
    setBannerVideoSize();
})();

// On Window resize
onresize = () => {
    setBannerVideoSize();
}
