import { GARAGE_LIMIT, WINNERS_LIMIT } from '../api/variables';
import { Actions, CarsResponse, Page, WinnersResponse } from '../types/types';

let conterGarage = 1;
let conterWinners = 1;

export const setPageCounter: (page: Page, action: Actions) => number = (page: Page, action: Actions): number => {
  let currentCounter: number;

  if (action === '+') {
    currentCounter = page === 'Garage' ? (conterGarage += 1) : (conterWinners += 1);
  } else {
    currentCounter = page === 'Garage' ? (conterGarage -= 1) : (conterWinners -= 1);
  }

  return currentCounter;
};

export const getCurrentPage: (page: Page) => number = (page: Page): number => {
  const currentCounter: number = page === 'Garage' ? conterGarage : conterWinners;
  return currentCounter;
};

export const getLastPage: (page: Page, value: CarsResponse | WinnersResponse) => number = (
  page: Page,
  value: CarsResponse | WinnersResponse
): number => {
  let lastPage: number;

  if (page === 'Garage') {
    lastPage = Math.ceil(Number(value.count) / GARAGE_LIMIT);
  } else {
    lastPage = Math.ceil(Number(value.count) / WINNERS_LIMIT);
  }

  return lastPage;
};
