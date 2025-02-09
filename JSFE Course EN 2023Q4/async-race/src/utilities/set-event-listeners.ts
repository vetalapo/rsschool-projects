/* eslint-disable import/no-cycle */
import {
  createCar,
  drive,
  generateCars,
  goToPage,
  race,
  removeCar,
  reset,
  selectCar,
  sortOrder,
  switchPagination,
  updateCar,
} from '../app/app';
import { EmptyReturnFn } from '../types/types';

export const setGenerateCarsBtnListener: EmptyReturnFn = (): void => {
  const generateCarsBtn: HTMLElement | null = document.getElementById('genererate-cars');
  if (!generateCarsBtn) {
    throw new Error("generateCarsBtn doesn't exist");
  } else {
    generateCarsBtn.addEventListener('click', generateCars);
  }
};

export const setCreateCarBtnListener: EmptyReturnFn = (): void => {
  const createCarBtn: HTMLElement | null = document.getElementById('create-btn');
  if (!createCarBtn) {
    throw new Error("createCarBtn doesn't exist");
  } else {
    createCarBtn.addEventListener('click', createCar);
  }
};

export const setSelectCarBtnsListener: EmptyReturnFn = (): void => {
  const selectCarBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.select');
  if (!selectCarBtns.length) {
    throw new Error("selectCarBtns doesn't exist");
  } else {
    Array.from(selectCarBtns).forEach((item: HTMLElement): void => item.addEventListener('click', selectCar));
  }
};

export const setRemoveCarBtnsListener: EmptyReturnFn = (): void => {
  const removeCarBtns: NodeListOf<HTMLElement> = document.querySelectorAll('.remove');
  if (!removeCarBtns.length) {
    throw new Error("selectCarBtns doesn't exist");
  } else {
    Array.from(removeCarBtns).forEach((item: HTMLElement): void => item.addEventListener('click', removeCar));
  }
};

export const setUpdateCarBtnListener: EmptyReturnFn = (): void => {
  const updateCarBtn: HTMLElement | null = document.getElementById('update-btn');
  if (!updateCarBtn) {
    throw new Error("updateCarBtn doesn't exist");
  } else {
    updateCarBtn.addEventListener('click', updateCar);
  }
};

export const setPaginationListener: EmptyReturnFn = (): void => {
  const nextBtnGarage: HTMLElement | null = document.getElementById('btn-next-garage');
  const nextBtnWinners: HTMLElement | null = document.getElementById('btn-next-winners');
  const prevBtnGarage: HTMLElement | null = document.getElementById('btn-prev-garage');
  const prevBtnWinners: HTMLElement | null = document.getElementById('btn-prev-winners');
  if (!nextBtnGarage || !nextBtnWinners || !prevBtnGarage || !prevBtnWinners) {
    throw new Error("nextBtnGarage || nextBtnWinners || prevBtnGarage || prevBtnWinners doesn't exist");
  } else {
    nextBtnGarage.addEventListener('click', switchPagination);
    nextBtnWinners.addEventListener('click', switchPagination);
    prevBtnGarage.addEventListener('click', switchPagination);
    prevBtnWinners.addEventListener('click', switchPagination);
  }
};

export const setStartStopBtnsListener: EmptyReturnFn = (): void => {
  const startBtn: NodeListOf<HTMLElement> = document.querySelectorAll('.start');
  const stopBtn: NodeListOf<HTMLElement> = document.querySelectorAll('.stop');
  if (!startBtn.length || !stopBtn.length) {
    throw new Error("startBtn || stopBtn doesn't exist");
  } else {
    Array.from(startBtn).forEach((item: HTMLElement): void => item.addEventListener('click', drive));
    Array.from(stopBtn).forEach((item: HTMLElement): void => item.addEventListener('click', drive));
  }
};

export const setRaceBtnListener: EmptyReturnFn = (): void => {
  const raceBtn: HTMLElement | null = document.getElementById('race');
  if (!raceBtn) {
    throw new Error("raceBtn doesn't exist");
  } else {
    raceBtn.addEventListener('click', race);
  }
};

export const setResetBtnListener: EmptyReturnFn = (): void => {
  const resetBtn: HTMLElement | null = document.getElementById('reset');
  if (!resetBtn) {
    throw new Error("resetBtn doesn't exist");
  } else {
    resetBtn.addEventListener('click', reset);
  }
};

export const setSortOrderListener: EmptyReturnFn = (): void => {
  const winBtn: HTMLElement | null = document.getElementById('wins');
  const bestTimeBtn: HTMLElement | null = document.getElementById('best-time');
  if (!winBtn || !bestTimeBtn) {
    throw new Error("winBtn || bestTimeBtn doesn't exist");
  } else {
    winBtn.addEventListener('click', sortOrder);
    bestTimeBtn.addEventListener('click', sortOrder);
  }
};

export const setToPageBtn: EmptyReturnFn = (): void => {
  const toWinnersBtn: HTMLElement | null = document.getElementById('to-winners');
  const toGarageBtn: HTMLElement | null = document.getElementById('to-garage');
  if (!toWinnersBtn || !toGarageBtn) {
    throw new Error("toWinnersBtn || toGarageBtn doesn't exist");
  } else {
    toWinnersBtn.addEventListener('click', goToPage);
    toGarageBtn.addEventListener('click', goToPage);
  }
};

export const setAllEventListeners: EmptyReturnFn = (): void => {
  try {
    setToPageBtn();
    setGenerateCarsBtnListener();
    setCreateCarBtnListener();
    setUpdateCarBtnListener();
    setRaceBtnListener();
    setResetBtnListener();
    setPaginationListener();
    setSelectCarBtnsListener();
    setRemoveCarBtnsListener();
    setStartStopBtnsListener();
    setSortOrderListener();
  } catch (error) {
    console.log('json data is empty');
    console.log(error);
  }
};
