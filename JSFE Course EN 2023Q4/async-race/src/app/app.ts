/* eslint-disable import/no-cycle */
import controlEngineAPI from '../api/control-engine';
import createCarAPI from '../api/create-car';
import deletetCarAPI from '../api/delete-car';
import deleteWinnerAPI from '../api/delete-winner';
import driveAPI from '../api/drive';
import getCarAPI from '../api/get-car';
import saveWinnerAPI from '../api/save-winner';
import updateCarAPI from '../api/update-car';
import { Actions, Car, DrivingResult, EmptyPromiseReturnFn, EngineResponse, Page, Status } from '../types/types';
import generate100Cars from '../utilities/generate-100cars';
import generateCarBody from '../utilities/generate-car-body';
import { deleteModalWindow, generateModalWindow } from '../utilities/generate-modal-window';
import { getButtonProp, getCreateElementsProp, getElementId, getUpdateElementsProp } from '../utilities/get-elements';
import getPage from '../utilities/get-page';
import { setPageCounter } from '../utilities/get-set-page-counter';
import { getOrder, setOrder, setSort } from '../utilities/get-set-sort-order';
import updatePage from '../utilities/update-page';
import { animateCar, requestIDStorage, stoppedAnimationStorage } from '../view/animation';

const deleteWinner: (id: number) => Promise<void> = async (id: number): Promise<void> => {
  await deleteWinnerAPI(id);
};

export const generateCars: EmptyPromiseReturnFn = async (): Promise<void> => {
  await generate100Cars();
  await updatePage('Garage');
};

export const createCar: EmptyPromiseReturnFn = async (): Promise<void> => {
  const { name, color } = getCreateElementsProp();
  await createCarAPI(generateCarBody(name, color));
  await updatePage('Garage');
};

export const selectCar: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const { carId } = getButtonProp(event);
  const car: Car = await getCarAPI(carId);
  const { textInput, colorInput, updateBtn } = getUpdateElementsProp();

  updateBtn.classList.remove('disabled');
  textInput.value = car.name;
  colorInput.value = car.color;
  updateBtn.value = `${carId}`;

  window.scrollTo(0, 0);
};

export const updateCar: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const { carId } = getButtonProp(event);
  const { textInput, colorInput, updateBtn, name, color } = getUpdateElementsProp();

  await updateCarAPI(carId, generateCarBody(name, color));

  textInput.value = '';
  colorInput.value = '#FFFFFF';
  updateBtn.value = '';
  updateBtn.classList.add('disabled');

  await updatePage('Garage');
};

export const removeCar: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const { carId } = getButtonProp(event);
  await deletetCarAPI(carId);
  await deleteWinner(carId);
  await updatePage('Garage');
  await updatePage('Winners');
};

export const switchPagination: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const { target } = getButtonProp(event);
  let page: Page;
  let action: Actions;

  if (target.id.includes('garage')) {
    page = 'Garage';
  } else {
    page = 'Winners';
  }

  if (target.id.includes('next')) {
    action = '+';
  } else {
    action = '-';
  }

  setPageCounter(page, action);
  await updatePage(page);
};

export const controlEngine: (
  target: HTMLButtonElement,
  carId: number
) => Promise<{ responseEngine: EngineResponse; status: Status }> = async (
  target: HTMLButtonElement,
  carId: number
): Promise<{ responseEngine: EngineResponse; status: Status }> => {
  let status: Status;

  if (target.classList.contains('start')) {
    status = 'started';
    target.classList.toggle('disabled');
    target.nextElementSibling?.classList.toggle('disabled');
  } else {
    status = 'stopped';
    target.classList.toggle('disabled');
    target.previousElementSibling?.classList.toggle('disabled');
  }

  const responseEngine: EngineResponse = await controlEngineAPI(carId, status);
  return { responseEngine, status };
};

export const drive: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const { target, carId } = getButtonProp(event);
  const { responseEngine, status } = await controlEngine(target, carId);

  if (status === 'started') {
    animateCar(carId, responseEngine);
    stoppedAnimationStorage.delete(carId);
    const { success } = await driveAPI(carId);

    if (!success && !stoppedAnimationStorage.has(carId)) {
      window.cancelAnimationFrame(requestIDStorage.get(carId) as number);
    }
  } else {
    animateCar(carId, responseEngine);
    stoppedAnimationStorage.set(carId, carId);
  }
};

export const race: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  await updatePage('Garage');
  const target: HTMLButtonElement = event.target as HTMLButtonElement;
  target.classList.add('disabled');

  const members: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.start');
  const promises: Promise<DrivingResult | undefined>[] = Array.from(members).map(
    async (member: HTMLButtonElement): Promise<DrivingResult | undefined> => {
      const carId = Number(member.value);
      const { responseEngine } = await controlEngine(member, carId);
      const time: number = Math.round(responseEngine.distance / responseEngine.velocity) / 1000;
      animateCar(carId, responseEngine);
      stoppedAnimationStorage.delete(carId);
      const { success } = await driveAPI(carId);
      if (!success && !stoppedAnimationStorage.has(carId)) {
        window.cancelAnimationFrame(requestIDStorage.get(carId) as number);
      }
      if (success) {
        return { success, carId, time };
      }
      return Promise.reject(new Error(`car starts: #${carId}`));
    }
  );
  Promise.any(promises)
    .then(
      async (value: DrivingResult | undefined): Promise<void> => {
        target.nextElementSibling?.classList.toggle('disabled');
        const { carId, time } = value as DrivingResult;
        await saveWinnerAPI({ id: carId, time });
        await generateModalWindow({ id: carId, time });
        setTimeout(deleteModalWindow, 2000);
        await updatePage('Winners');
      }
    )
    .catch((): void => {
      target.nextElementSibling?.classList.toggle('disabled');
      console.log(`All cars broken`);
    });
};

export const reset: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const target: HTMLButtonElement = event.target as HTMLButtonElement;
  target.classList.add('disabled');
  target.previousElementSibling?.classList.toggle('disabled');

  await updatePage('Garage');
};

export const sortOrder: (event: Event) => Promise<void> = async (event: Event): Promise<void> => {
  const id: string = getElementId(event);

  if (id.includes('wins')) {
    setSort('wins');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getOrder() === 'ASC' ? setOrder('DESC') : setOrder('ASC');
  } else {
    setSort('time');
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getOrder() === 'ASC' ? setOrder('DESC') : setOrder('ASC');
  }

  await updatePage('Winners');
};

export const goToPage: (event: Event) => void = (event: Event): void => {
  const id: string = getElementId(event);
  const pageGarage: HTMLDivElement = getPage('Garage');
  const pageWinners: HTMLDivElement = getPage('Winners');

  if (id.includes('garage')) {
    pageGarage.style.display = 'block';
    pageWinners.style.display = 'none';
  } else {
    pageGarage.style.display = 'none';
    pageWinners.style.display = 'block';
  }
};
