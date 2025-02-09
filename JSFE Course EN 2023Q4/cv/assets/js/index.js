"use strict";

const getMonthName = (date) => {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return month[date.getMonth()];
};

const getYear = (date) => {
    return date.getFullYear();
};

const getFormattedMonthAndYearForDate = (date) => {
    return `${getMonthName(date)}, ${getYear(date)}`;
};

const getFormattedAttributeForDate = (date) => {
    return `${getYear(date)}-${date.getMonth() + 1}-${date.getDate()}`;
};

const updateCopyrightInfo = (date) => {
    const copyrightElement = document.getElementById("copyright-date");
    
    copyrightElement.innerText = getFormattedMonthAndYearForDate(date);
    copyrightElement.setAttribute("datetime", getFormattedAttributeForDate(date));
};

// On load
(() => {
    updateCopyrightInfo(new Date());
})();
