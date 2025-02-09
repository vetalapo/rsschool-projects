import { CarsResponse, Page, WinnersResponse } from '../types/types';
import { getPaginationElements } from './get-elements';
import { getCurrentPage, getLastPage } from './get-set-page-counter';

const disablePagination: (page: Page, value: CarsResponse | WinnersResponse) => void = (
  page: Page,
  value: CarsResponse | WinnersResponse
): void => {
  const { paginationNextBtn, paginationPrevBtn } = getPaginationElements(page);
  const startPage = 1;
  const currentPage = getCurrentPage(page);
  const lastPage = getLastPage(page, value);

  if (currentPage >= lastPage) {
    paginationNextBtn.classList.add('disabled');
  } else {
    paginationNextBtn.classList.remove('disabled');
  }

  if (currentPage <= startPage) {
    paginationPrevBtn.classList.add('disabled');
  } else {
    paginationPrevBtn.classList.remove('disabled');
  }
};

export default disablePagination;
