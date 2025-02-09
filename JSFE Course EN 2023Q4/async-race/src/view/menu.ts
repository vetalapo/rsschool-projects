import createBtn from '../utilities/create-btn';

const createMenu: () => HTMLDivElement = (): HTMLDivElement => {
  const menu: HTMLDivElement = document.createElement('div');
  menu.classList.add('menu');
  return menu;
};

const createCreateCar: () => HTMLDivElement = (): HTMLDivElement => {
  const createCar: HTMLDivElement = document.createElement('div');
  createCar.classList.add('create-car');
  return createCar;
};

const createUpdateCar: () => HTMLDivElement = (): HTMLDivElement => {
  const updateCar: HTMLDivElement = document.createElement('div');
  updateCar.classList.add('update-car');
  return updateCar;
};

const createRaceControls: () => HTMLDivElement = (): HTMLDivElement => {
  const raceControls: HTMLDivElement = document.createElement('div');
  raceControls.classList.add('race-controls');
  return raceControls;
};

const createInputCreateText: () => HTMLInputElement = (): HTMLInputElement => {
  const inputCreateText: HTMLInputElement = document.createElement('input');
  inputCreateText.classList.add('create-text');
  inputCreateText.id = 'create-text';
  inputCreateText.type = 'text';
  return inputCreateText;
};

const createInputUpdateText: () => HTMLInputElement = (): HTMLInputElement => {
  const inputUpdateText: HTMLInputElement = document.createElement('input');
  inputUpdateText.classList.add('update-text');
  inputUpdateText.id = 'update-text';
  inputUpdateText.type = 'text';
  return inputUpdateText;
};

const createInputCreateColor: () => HTMLInputElement = (): HTMLInputElement => {
  const inputCreateColor: HTMLInputElement = document.createElement('input');
  inputCreateColor.classList.add('create-color');
  inputCreateColor.id = 'create-color';
  inputCreateColor.name = 'create-color';
  inputCreateColor.type = 'color';
  inputCreateColor.value = '#FFFFFF';
  return inputCreateColor;
};

const createInputUpdateColor: () => HTMLInputElement = (): HTMLInputElement => {
  const inputUpdateColor: HTMLInputElement = document.createElement('input');
  inputUpdateColor.classList.add('update-color');
  inputUpdateColor.id = 'update-color';
  inputUpdateColor.name = 'update-color';
  inputUpdateColor.type = 'color';
  inputUpdateColor.value = '#FFFFFF';
  return inputUpdateColor;
};

const generateMenu: () => HTMLDivElement = (): HTMLDivElement => {
  const menu: HTMLDivElement = createMenu();
  const createCar: HTMLDivElement = createCreateCar();
  createCar.append(createInputCreateText(), createInputCreateColor(), createBtn('create-btn', 'CREATE'));
  const updateCar: HTMLDivElement = createUpdateCar();
  updateCar.append(createInputUpdateText(), createInputUpdateColor(), createBtn('update-btn', 'UPDATE', true));
  const raceControls: HTMLDivElement = createRaceControls();
  raceControls.append(
    createBtn('race', 'RACE'),
    createBtn('reset', 'RESET', true),
    createBtn('genererate-cars', 'GENERATE CARS')
  );
  menu.append(createCar, updateCar, raceControls);
  return menu;
};

export default generateMenu;
