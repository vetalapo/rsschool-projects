import { CarsResponse, Page, WinnersResponse } from '../types/types';
import { getCurrentPage, getLastPage } from '../utilities/get-set-page-counter';

const generatePageCounter: (page: Page, value: CarsResponse | WinnersResponse) => HTMLSpanElement = (
  page: Page,
  value: CarsResponse | WinnersResponse
): HTMLSpanElement => {
  let pageCounter: HTMLSpanElement | null = document.getElementById(`page-counter-${page.toLocaleLowerCase()}`);
  const currentPage = getCurrentPage(page);
  const lastPage = getLastPage(page, value);

  if (!pageCounter) {
    pageCounter = document.createElement('span');
    pageCounter.classList.add('page-counter');
    pageCounter.id = `page-counter-${page.toLocaleLowerCase()}`;
    pageCounter.innerText = `${currentPage} / ${lastPage}`;
  } else {
    pageCounter.innerText = `${currentPage} / ${lastPage}`;
  }

  return pageCounter;
};

export default generatePageCounter;
