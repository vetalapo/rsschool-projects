/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import getCarsAPI from '../api/get-cars';
import getWinnersAPI from '../api/get-winners';
import { CarsResponse, Page, WinnersResponse } from '../types/types';
import generatePageCounter from '../view/page-counter';
import generatePageName from '../view/page-name';
import { generateTable, updateSortOrderIndicator } from '../view/table';
import generateAllTracks from '../view/tracks';
import disablePagination from './disable-pagination';
import { getCurrentPage } from './get-set-page-counter';
import { getOrder, getSort } from './get-set-sort-order';
import {
  setRemoveCarBtnsListener,
  setSelectCarBtnsListener,
  setSortOrderListener,
  setStartStopBtnsListener,
} from './set-event-listeners';

const updatePage: (page: Page) => Promise<CarsResponse | WinnersResponse> = async (
  page: Page
): Promise<CarsResponse | WinnersResponse> => {
  let response: CarsResponse | WinnersResponse;

  if (page === 'Garage') {
    response = await getCarsAPI(getCurrentPage(page));
  } else {
    response = await getWinnersAPI({
      pageNumber: getCurrentPage(page),
      sort: getSort(),
      order: getOrder(),
    });
  }

  try {
    generatePageName(page, response);
    generatePageCounter(page, response);
    disablePagination(page, response);
    const placeForElement: HTMLElement | null = document.getElementById(`page-name-${page.toLocaleLowerCase()}`);
    if (page === 'Garage') {
      placeForElement?.after(generateAllTracks(response as CarsResponse));
      setSelectCarBtnsListener();
      setRemoveCarBtnsListener();
      setStartStopBtnsListener();
    } else {
      placeForElement?.after(generateTable(response as WinnersResponse));
      setSortOrderListener();
      updateSortOrderIndicator(getSort(), getOrder());
    }
    return response;
  } catch (error) {
    console.log('json data is empty');
    return response;
  }
};

export default updatePage;
