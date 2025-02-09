import { Page } from '../types/types';

const getPage: (value: Page) => HTMLDivElement = (value: Page): HTMLDivElement => {
  const page: HTMLElement | null = document.getElementById(`${value.toLocaleLowerCase()}`);
  if (!page) {
    throw new Error("page doesn't exist");
  }
  return page as HTMLDivElement;
};

export default getPage;
