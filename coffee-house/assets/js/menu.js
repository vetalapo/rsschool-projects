"use strict";

// Globals
let productList = [];
let currentSectionId = "coffee-menu";
let _currentProductBasePrice = 0;

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

function setCurrentProductTotalInModal(price) {
    document.getElementById("modal-total-price-amount").innerText = `$${price.toFixed(2)}`;
}

function calcProductTotal() {
    const sizeSum = Number([...document.getElementsByClassName("product-size-item")]
        .filter(el => el.classList.contains("active"))[0].dataset.addPrice);

    const additivesSum = [...document.getElementsByClassName("product-additives-item")]
        .filter(el => el.classList.contains("active"))
        .reduce((acc, item) => acc + Number(item.dataset.addPrice), 0);

    const total = _currentProductBasePrice + sizeSum + additivesSum;

    setCurrentProductTotalInModal(total);
}

function productSizeSelection(event) {
    let element;

    if (event.target.classList.contains("product-size-item")) {
        element = event.target;
    } else {
        element = event.target.parentElement;
    }

    for (let tab of element.parentElement.parentElement.children) {
        tab.children[0].classList.remove("active");
    }

    element.classList.add("active");

    calcProductTotal();
}

function productAdditivesSelection(event) {
    let element;

    if (event.target.classList.contains("product-additives-item")) {
        element = event.target;
    } else {
        element = event.target.parentElement;
    }

    if (element.classList.contains("active")) {
        element.classList.remove("active");
    } else {
        element.classList.add("active");
    }

    calcProductTotal();
}

function getProduct(title) {
    return productList.find(el => el.name === title);
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

function getProductSizesList(sizes) {
    let result = "";

    for (let size in sizes) {
        result += `<li><a class="product-size-item" data-add-price="${sizes[size]["add-price"]}" onclick="productSizeSelection(event)"><span>${size.toUpperCase()}</span>${sizes[size].size}</a></li>`;
    }

    return result;
}

function getProductAdditivesList(additives) {
    let result = "";

    for (let i = 0; i < additives.length; i++ ) {
        result += `<li><a class="product-additives-item" data-add-price="${additives[i]["add-price"]}" onclick="productAdditivesSelection(event)"><span>${i + 1}</span>${additives[i].name}</a></li>`;
    }

    return result;
}

function displayProductModal(tileTitle, imageSrc) {    
    const product = getProduct(tileTitle);
    _currentProductBasePrice = Number(product.price);

    // No scroll body
    document.body.classList.add("no-scroll");

    // Set modal properties
    document.getElementById("modal-image").src = imageSrc;
    document.getElementById("modal-header").innerText = tileTitle;
    document.getElementById("modal-product-description").innerText = product.description;
    document.getElementById("modal-product-size-list").innerHTML = getProductSizesList(product.sizes);
    document.getElementsByClassName("product-size-item").item(0).classList.add("active");
    document.getElementById("modal-product-additives-list").innerHTML = getProductAdditivesList(product.additives);
    setCurrentProductTotalInModal(_currentProductBasePrice);

    // Show modal
    const modal = document.getElementById("product-modal");
    modal.style.display = "flex";
}

function closeProductModal() {
    const modal = document.getElementById("product-modal");
    
    modal.style.display = "none";
    document.body.classList.remove("no-scroll");
}

function findTile(element) {
    if (element.classList.contains("tile")) {
        return element;
    }

    return findTile(element.parentElement);
}

function findTileTitle(tile) {
    const textChildren = [...tile.children]
        .filter(el => el.classList.contains("text"))[0]
        .children;

    return [...textChildren]
        .filter(el => el.nodeName === "H2")[0]
        .innerText;
}

function findTileImageSrc(tile) {
    return [...tile.children]
        .filter(el => el.classList.contains("image-container"))[0]
        .children[0]
        .src;
}

function tileDispatch(event) {
    const element = event.target;
    const tile = findTile(element);
    const title = findTileTitle(tile);
    const imageSrc = findTileImageSrc(tile);

    displayProductModal(title, imageSrc);
}

// On Load
(async () => {
    // Getting all tiles, and assigning them onclick event
    const tiles = document.getElementsByClassName("tile");

    [...tiles].forEach(element => element.addEventListener("click", tileDispatch));

    // Load product list
    const productsResponse = await fetch("products.json");
    productList = await productsResponse.json();
})();

// Product modal click off
window.onclick = function(event) {
    const modal = document.getElementById("product-modal");

    if (event.target == modal) {
        closeProductModal();
    }
}
