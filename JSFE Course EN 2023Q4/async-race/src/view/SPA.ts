import getCarsAPI from '../api/get-cars';
import getWinnersAPI from '../api/get-winners';
import { CarsResponse, Page, WinnersResponse } from '../types/types';
import disablePagination from '../utilities/disable-pagination';
import { generateErrorModalWindow } from '../utilities/generate-modal-window';
import { getOrder, getSort } from '../utilities/get-set-sort-order';
import { setAllEventListeners } from '../utilities/set-event-listeners';
import generateGarage from './garage';
import generateHeader from './header';
import { turnOffLoadingAnimation, turnOnLoadingAnimation } from './loading';
import generateWinners from './winners';

const generateSPA: () => Promise<HTMLElement> = async (): Promise<HTMLElement> => {
  const body: HTMLElement | null = document.getElementById('body');
  turnOnLoadingAnimation();

  if (!body) {
    throw new Error("body doesn't exist");
  }

  const startPage = 1;
  const garagePage: Page = 'Garage';
  const winnersPage: Page = 'Winners';
  let carResponse: CarsResponse;
  let winnersResponse: WinnersResponse;

  try {
    carResponse = await getCarsAPI(startPage);
    winnersResponse = await getWinnersAPI({
      pageNumber: startPage,
      sort: getSort(),
      order: getOrder(),
    });
    body.append(
      generateHeader(),
      generateGarage(garagePage, carResponse),
      generateWinners(winnersPage, winnersResponse)
    );
    setAllEventListeners();
    disablePagination(garagePage, carResponse);
    disablePagination(winnersPage, winnersResponse);
  } catch (error) {
    generateErrorModalWindow();
  }

  turnOffLoadingAnimation();
  return body;
};

document.addEventListener('DOMContentLoaded', generateSPA);
