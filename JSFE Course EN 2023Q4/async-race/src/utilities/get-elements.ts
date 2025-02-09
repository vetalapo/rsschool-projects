import {
  CarName,
  Color,
  GetButtonPropFn,
  GetCreateElementsPropFn,
  GetPaginationElementsFn,
  GetUpdateElementsFn,
  Page,
} from '../types/types';

export const getButtonProp: GetButtonPropFn = (
  event: Event
): {
  target: HTMLButtonElement;
  carId: number;
} => {
  const target: HTMLButtonElement = event.target as HTMLButtonElement;
  const carId = Number(target.value);
  return { target, carId };
};

export const getElementId: (event: Event) => string = (event: Event): string => {
  return (event.target as HTMLElement).id;
};

export const getCreateElementsProp: GetCreateElementsPropFn = (): {
  name: CarName;
  color: Color;
} => {
  const textInput: HTMLInputElement | null = document.getElementById('create-text') as HTMLInputElement | null;
  const colorInput: HTMLInputElement | null = document.getElementById('create-color') as HTMLInputElement | null;
  if (!textInput || !colorInput) {
    throw new Error("textInput || colorInput doesn't exist");
  }
  const name: CarName = textInput.value as CarName;
  const color: Color = colorInput.value as Color;

  return { name, color };
};

export const getUpdateElementsProp: GetUpdateElementsFn = (): {
  textInput: HTMLInputElement;
  colorInput: HTMLInputElement;
  updateBtn: HTMLButtonElement;
  name: CarName;
  color: Color;
} => {
  const textInput: HTMLInputElement | null = document.getElementById('update-text') as HTMLInputElement | null;
  const colorInput: HTMLInputElement | null = document.getElementById('update-color') as HTMLInputElement | null;
  const updateBtn: HTMLButtonElement | null = document.getElementById('update-btn') as HTMLButtonElement | null;
  if (!textInput || !colorInput || !updateBtn) {
    throw new Error("textInput || colorInput doesn't exist");
  }
  const name: CarName = textInput.value as CarName;
  const color: Color = colorInput.value as Color;

  return { textInput, colorInput, updateBtn, name, color };
};

export const getPaginationElements: GetPaginationElementsFn = (
  page: Page
): {
  paginationNextBtn: HTMLElement;
  paginationPrevBtn: HTMLElement;
} => {
  const paginationNextBtn: HTMLElement | null = document.getElementById(`btn-next-${page.toLowerCase()}`);
  const paginationPrevBtn: HTMLElement | null = document.getElementById(`btn-prev-${page.toLowerCase()}`);
  if (!paginationNextBtn || !paginationPrevBtn) {
    throw new Error("updateCarBtn doesn't exist");
  }

  return { paginationNextBtn, paginationPrevBtn };
};
