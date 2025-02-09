const LOCALSTORAGE_NAME = "rss-ecommerce";

const PRODUCTS_ON_PAGE = 20;
const MAX_PRICE_FILTER = 100000;

const COUNTRIES = [
    {
        title: "Germany (DE)",
        code: "DE"
    },
    {
        title: "United Kingdom (GB)",
        code: "GB"
    },
    {
        title: "United States (US)",
        code: "US"
    }
];

const PROMOCODES = {
    "b5dcb74b-e9f7-405a-93c2-7fed70529e47": {
        code: "TERNION24",
        description: "25% off every cart item"
    }
}

export {
    LOCALSTORAGE_NAME,
    PRODUCTS_ON_PAGE,
    MAX_PRICE_FILTER,
    PROMOCODES,
    COUNTRIES
};
