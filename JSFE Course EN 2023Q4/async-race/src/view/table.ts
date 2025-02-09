import { Order, Sort, WinnerAndCar, WinnersResponse } from '../types/types';
import { createCarSVG } from '../utilities/create-SVG';
import { getCurrentPage } from '../utilities/get-set-page-counter';

const createTable: () => HTMLTableElement = (): HTMLTableElement => {
  let table: HTMLElement | null = document.getElementById('table');

  if (!table) {
    table = document.createElement('table');
  } else {
    table.remove();
    table = document.createElement('table');
  }

  table.classList.add('table');
  table.id = 'table';

  return table as HTMLTableElement;
};

const createTBody: () => HTMLTableSectionElement = (): HTMLTableSectionElement => {
  const tbody: HTMLTableSectionElement = document.createElement('tbody');
  tbody.classList.add('t-body');
  return tbody;
};

const createTR: (value: string) => HTMLTableRowElement = (value: string): HTMLTableRowElement => {
  const tr: HTMLTableRowElement = document.createElement('tr');
  tr.classList.add('tr');
  tr.id = value;
  return tr;
};

const createTH: (value: string, cssClass?: string) => HTMLTableCellElement = (
  value: string,
  cssClass?: string
): HTMLTableCellElement => {
  const th: HTMLTableCellElement = document.createElement('th');
  th.classList.add('th');

  if (cssClass !== undefined) {
    th.classList.add(cssClass);
    th.id = cssClass;
  }

  th.innerHTML = value;
  return th;
};

const createTD: (value: string) => HTMLTableCellElement = (value: string): HTMLTableCellElement => {
  const td: HTMLTableCellElement = document.createElement('td');
  td.classList.add('td');
  td.innerText = value;
  return td;
};

const generateTableHead: () => HTMLTableRowElement = (): HTMLTableRowElement => {
  const number: HTMLTableCellElement = createTH('Number');
  const car: HTMLTableCellElement = createTH('Car');
  const name: HTMLTableCellElement = createTH('Name');
  const wins: HTMLTableCellElement = createTH('Wins', 'wins');
  const bestTime: HTMLTableCellElement = createTH('Best time (s)', 'best-time');
  const tr: HTMLTableRowElement = createTR('table-head');

  tr.append(number, car, name, wins, bestTime);

  return tr;
};

const generateTableRow: (value: WinnerAndCar, position: number) => HTMLTableRowElement = (
  value: WinnerAndCar,
  position: number
): HTMLTableRowElement => {
  const number: HTMLTableCellElement = createTD(`${position}`);
  const SVG = createCarSVG(value.car, { width: `${50}px`, height: `${30}px` });
  const car: HTMLTableCellElement = createTD('');
  car.append(SVG);
  const name: HTMLTableCellElement = createTD(`${value.car.name}`);
  const wins: HTMLTableCellElement = createTD(`${value.wins}`);
  const bestTime: HTMLTableCellElement = createTD(`${value.time}`);
  const tr: HTMLTableRowElement = createTR(`table-row-${value.id}`);

  tr.append(number, car, name, wins, bestTime);

  return tr;
};

export const generateTable: (value: WinnersResponse) => HTMLTableElement = (
  value: WinnersResponse
): HTMLTableElement => {
  const position: (currentValue: number) => number = (currentValue: number): number =>
    (getCurrentPage('Winners') - 1) * 10 + currentValue + 1;

  const table: HTMLTableElement = createTable();
  const tbody: HTMLTableSectionElement = createTBody();
  const tableHead: HTMLTableRowElement = generateTableHead();

  table.append(tbody);
  tbody.appendChild(tableHead);

  value.items.forEach((item: WinnerAndCar, index: number): void =>
    tbody.append(generateTableRow(item, position(index)))
  );

  return table;
};

export const updateSortOrderIndicator: (sort: Sort, order: Order) => void = (sort: Sort, order: Order): void => {
  const wins: HTMLTableCellElement = document.getElementById('wins') as HTMLTableCellElement;
  const bestTime: HTMLTableCellElement = document.getElementById('best-time') as HTMLTableCellElement;
  const arrowDown = '&#9660';
  const arrowUp = '&#9650';

  if (sort === 'wins') {
    if (order === 'DESC') {
      wins.innerHTML = `Wins ${arrowDown}`;
    } else {
      wins.innerHTML = `Wins ${arrowUp}`;
    }
  } else if (order === 'DESC') {
    bestTime.innerHTML = `Best time (s) ${arrowDown}`;
  } else {
    bestTime.innerHTML = `Best time (s) ${arrowUp}`;
  }
};
