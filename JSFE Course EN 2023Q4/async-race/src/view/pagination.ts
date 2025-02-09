import { CarsResponse, Page, WinnersResponse } from '../types/types';
import generatePageCounter from './page-counter';

const createPagination: (page: Page) => HTMLDivElement = (page: Page): HTMLDivElement => {
  const pagination: HTMLDivElement = document.createElement('div');
  pagination.classList.add('pagination');
  pagination.id = `pagination-${page.toLocaleLowerCase()}`;
  return pagination;
};

const createBtnPrev: (page: Page) => HTMLButtonElement = (page: Page): HTMLButtonElement => {
  const btnPrev: HTMLButtonElement = document.createElement('button');
  btnPrev.classList.add('button', 'disabled');
  btnPrev.innerText = 'PREV';
  btnPrev.id = `btn-prev-${page.toLocaleLowerCase()}`;
  return btnPrev;
};

const createBtnNext: (page: Page) => HTMLButtonElement = (page: Page): HTMLButtonElement => {
  const btnNext: HTMLButtonElement = document.createElement('button');
  btnNext.classList.add('button');
  btnNext.innerText = 'NEXT';
  btnNext.id = `btn-next-${page.toLocaleLowerCase()}`;
  return btnNext;
};

const generatePagination: (page: Page, value: CarsResponse | WinnersResponse) => HTMLDivElement = (
  page: Page,
  value: CarsResponse | WinnersResponse
): HTMLDivElement => {
  const pagination: HTMLDivElement = createPagination(page);
  pagination.append(createBtnPrev(page), generatePageCounter(page, value), createBtnNext(page));
  return pagination;
};

export default generatePagination;
