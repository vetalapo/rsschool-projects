import { CreateBtnFn } from '../types/types';

const createBtn: CreateBtnFn = (id: string, innerText: string, disabled?: boolean): HTMLButtonElement => {
  const btnWinners: HTMLButtonElement = document.createElement('button');
  btnWinners.classList.add('button');
  if (disabled) {
    btnWinners.classList.add('disabled');
  }
  btnWinners.id = `${id}`;
  btnWinners.innerText = `${innerText}`;
  return btnWinners;
};

export default createBtn;
