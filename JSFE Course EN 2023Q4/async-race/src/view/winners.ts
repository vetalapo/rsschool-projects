import { Page, WinnersResponse } from '../types/types';

import generatePageName from './page-name';
import generatePagination from './pagination';
import { generateTable } from './table';

const createWinners: () => HTMLElement = (): HTMLElement => {
  const winners: HTMLElement = document.createElement('section');
  winners.classList.add('winners');
  winners.id = 'winners';
  return winners;
};

const generateWinners: (page: Page, value: WinnersResponse) => HTMLElement = (
  page: Page,
  value: WinnersResponse
): HTMLElement => {
  const winners: HTMLElement = createWinners();
  const pageName: HTMLSpanElement = generatePageName(page, value);
  const table: HTMLTableElement = generateTable(value);
  const pagination: HTMLDivElement = generatePagination(page, value);
  winners.append(pageName, table, pagination);
  winners.style.display = 'none';

  return winners;
};

export default generateWinners;
