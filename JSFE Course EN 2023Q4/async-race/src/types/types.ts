import carMake from '../components/car-makes';
import carModel from '../components/car-models';

// color type
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX;

// car name type
export type CarName = `${typeof carMake[number]} ${typeof carModel[number]}`;

// response interface
export interface CarsResponse {
  items: Car[];
  count: string;
}

export interface WinnersResponse {
  items: WinnerAndCar[];
  count: string;
}
export interface DriveResponse {
  success: true | false;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

// data interface
export interface Body {
  name: CarName;
  color: Color;
}

export interface Car {
  name: CarName;
  color: Color;
  id: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerAndCar extends Winner {
  car: Car;
}

export interface WinnerParam {
  pageNumber: number;
  sort: Sort;
  order: Order;
}

export interface DrivingResult {
  success: boolean;
  carId: number;
  time: number;
}

// param types
export type Status = 'started' | 'stopped';
export type Sort = 'id' | 'wins' | 'time';
export type Order = 'ASC' | 'DESC';
export type Page = 'Garage' | 'Winners';
export type SVGSizes = { width: `${number}px`; height: `${number}px` };
export type Actions = '+' | '-';

// function interface
export interface GetCarAPIFn {
  (id: number): Promise<Car>;
}

export interface GetCarsAPIFn {
  (page: number): Promise<CarsResponse>;
}

export interface CreateCarAPIFn {
  (body: Body): Promise<Car>;
}

export interface DeleteCarAPIFn {
  (id: number): Promise<void>;
}

export interface UpdateCarAPIFn {
  (id: number, body: Body): Promise<Car>;
}

export interface ControlEngineAPIFn {
  (id: number, status: Status): Promise<EngineResponse>;
}

export interface DriveAPIFn {
  (id: number): Promise<DriveResponse>;
}

export interface GetSortOrderAPIFn {
  (sort: Sort, order: Order): string;
}

export interface GetWinnersAPIFn {
  (WinnerParam: WinnerParam): Promise<WinnersResponse>;
}

export interface GetWinnerAPIFn {
  (id: number): Promise<Winner>;
}

export interface GetWinnerStatusAPIFn {
  (id: number): Promise<number>;
}

export interface DeleteWinnerAPIFn {
  (id: number): Promise<void>;
}

export interface CreateWinnerAPIFn {
  (body: Winner): Promise<Winner>;
}

export interface UpdateWinnerAPIFn {
  (body: Winner): Promise<Winner>;
}

export interface GetRandomColorFn {
  (): Color;
}

export interface GetRandomCarNameFn {
  (): CarName;
}

export interface GenerateCarBodyFn {
  (name?: CarName, color?: Color): Body;
}

export interface GetButtonPropFn {
  (event: Event): {
    target: HTMLButtonElement;
    carId: number;
  };
}

export interface GetCreateElementsPropFn {
  (): {
    name: CarName;
    color: Color;
  };
}

export interface GetUpdateElementsFn {
  (): {
    textInput: HTMLInputElement;
    colorInput: HTMLInputElement;
    updateBtn: HTMLButtonElement;
    name: CarName;
    color: Color;
  };
}

export interface GetPaginationElementsFn {
  (page: Page): {
    paginationNextBtn: HTMLElement;
    paginationPrevBtn: HTMLElement;
  };
}

export interface EmptyReturnFn {
  (): void;
}

export interface EmptyPromiseReturnFn {
  (): Promise<void>;
}

export interface CreateBtnFn {
  (id: string, innerText: string, disabled?: boolean): HTMLButtonElement;
}
