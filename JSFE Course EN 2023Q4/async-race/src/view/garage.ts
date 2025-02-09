import { CarsResponse, Page } from '../types/types';
import generateMenu from './menu';
import generatePageName from './page-name';
import generatePagination from './pagination';
import generateAllTracks from './tracks';

const createGarage: () => HTMLElement = (): HTMLElement => {
  const garage: HTMLElement = document.createElement('section');
  garage.classList.add('garage');
  garage.id = 'garage';
  return garage;
};

const generateGarage: (page: Page, value: CarsResponse) => HTMLElement = (
  page: Page,
  value: CarsResponse
): HTMLElement => {
  const garage: HTMLElement = createGarage();
  const menu: HTMLDivElement = generateMenu();
  const pageName: HTMLSpanElement = generatePageName(page, value);
  const tracks: HTMLDivElement = generateAllTracks(value);
  const pagination: HTMLDivElement = generatePagination(page, value);
  garage.append(menu, pageName, tracks, pagination);

  return garage;
};

export default generateGarage;
