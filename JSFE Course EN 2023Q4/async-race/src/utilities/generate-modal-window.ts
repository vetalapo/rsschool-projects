import getCarAPI from '../api/get-car';
import { EmptyReturnFn } from '../types/types';
import createLink from './create-link';

export const generateModalWindow: ({ id, time }: { id: number; time: number }) => Promise<void> = async ({
  id,
  time,
}: {
  id: number;
  time: number;
}): Promise<void> => {
  const modalWindow: HTMLDivElement = document.createElement('div');
  const body: HTMLBodyElement = document.getElementById('body') as HTMLBodyElement;
  const car = await getCarAPI(id);

  modalWindow.classList.add('modal');
  modalWindow.id = 'modal';
  modalWindow.innerText = `Winner: ${car.name}
  Time: ${time} (s)`;

  body.prepend(modalWindow);
};

export const deleteModalWindow: EmptyReturnFn = (): void => {
  const modalWindow: HTMLElement | null = document.getElementById('modal');
  if (modalWindow) {
    modalWindow.remove();
  }
};

export const generateErrorModalWindow: EmptyReturnFn = (): void => {
  const modalWindow: HTMLDivElement = document.createElement('div');
  const body: HTMLBodyElement = document.getElementById('body') as HTMLBodyElement;
  const link: HTMLAnchorElement = createLink('https://github.com/mikhama/async-race-api');

  link.innerText = 'https://github.com/mikhama/async-race-api';
  modalWindow.classList.add('modal');
  modalWindow.id = 'modal';
  modalWindow.innerText = `Server not found. Please, follow the instruction: `;
  modalWindow.append(link);

  body.prepend(modalWindow);
};
