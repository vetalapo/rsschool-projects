import { Car, CarsResponse } from '../types/types';
import { createCarSVG } from '../utilities/create-SVG';

const createTrackContainer: () => HTMLDivElement = (): HTMLDivElement => {
  let trackContainer: HTMLElement | null = document.getElementById('track-container');
  if (!trackContainer) {
    trackContainer = document.createElement('div');
  } else {
    trackContainer.remove();
    trackContainer = document.createElement('div');
  }

  trackContainer.classList.add('track-container');
  trackContainer.id = 'track-container';
  return trackContainer as HTMLDivElement;
};

const createCarName: (value: Car) => HTMLSpanElement = (value: Car): HTMLSpanElement => {
  const carName: HTMLSpanElement = document.createElement('span');
  carName.classList.add('car-name');
  carName.innerText = `${value.name}`;
  return carName;
};

const createFinish: (value: Car) => HTMLImageElement = (value: Car): HTMLImageElement => {
  const finish: HTMLImageElement = document.createElement('img');
  finish.classList.add('finish');
  finish.src = './assets/finish.jpg';
  finish.alt = 'checkered flag';
  finish.id = `finish-${value.id}`;
  return finish;
};

const createTrackLayout: () => HTMLDivElement = (): HTMLDivElement => {
  const trackLayout: HTMLDivElement = document.createElement('div');
  trackLayout.classList.add('track-layout');
  return trackLayout;
};

const createBtnStop: (value: Car) => HTMLButtonElement = (value: Car): HTMLButtonElement => {
  const btnStop: HTMLButtonElement = document.createElement('button');
  btnStop.classList.add('stop', 'disabled');
  btnStop.innerText = 'STOP';
  btnStop.value = `${value.id}`;
  return btnStop;
};

const createBtnStart: (value: Car) => HTMLButtonElement = (value: Car): HTMLButtonElement => {
  const btnStart: HTMLButtonElement = document.createElement('button');
  btnStart.classList.add('start');
  btnStart.innerText = 'START';
  btnStart.value = `${value.id}`;
  return btnStart;
};

const createEngineControl: () => HTMLDivElement = (): HTMLDivElement => {
  const engineControl: HTMLDivElement = document.createElement('div');
  engineControl.classList.add('engine-control');
  return engineControl;
};

const createBtnRemove: (value: Car) => HTMLButtonElement = (value: Car): HTMLButtonElement => {
  const btnRemove: HTMLButtonElement = document.createElement('button');
  btnRemove.classList.add('button', 'remove');
  btnRemove.innerText = 'Remove';
  btnRemove.value = `${value.id}`;
  return btnRemove;
};

const createBtnSelect: (value: Car) => HTMLButtonElement = (value: Car): HTMLButtonElement => {
  const btnSelect: HTMLButtonElement = document.createElement('button');
  btnSelect.classList.add('button', 'select');
  btnSelect.innerText = 'SELECT';
  btnSelect.value = `${value.id}`;
  return btnSelect;
};

const createCarManipulation: () => HTMLDivElement = (): HTMLDivElement => {
  const carManipulation: HTMLDivElement = document.createElement('div');
  carManipulation.classList.add('car-manipulation');
  return carManipulation;
};

const createControlsContainer: () => HTMLDivElement = (): HTMLDivElement => {
  const controlsContainer: HTMLDivElement = document.createElement('div');
  controlsContainer.classList.add('controls-container');
  return controlsContainer;
};

const createTrack: () => HTMLDivElement = (): HTMLDivElement => {
  const track: HTMLDivElement = document.createElement('div');
  track.classList.add('track');
  return track;
};

const generateTrack: (car: Car) => HTMLDivElement = (car: Car): HTMLDivElement => {
  const track: HTMLDivElement = createTrack();
  const controlsContainer: HTMLDivElement = createControlsContainer();
  const carManipulation: HTMLDivElement = createCarManipulation();
  carManipulation.append(createBtnSelect(car), createBtnRemove(car));
  const engineControl: HTMLDivElement = createEngineControl();
  engineControl.append(createBtnStart(car), createBtnStop(car));
  const carName: HTMLSpanElement = createCarName(car);
  controlsContainer.append(carManipulation, engineControl, carName);
  const trackLayout: HTMLDivElement = createTrackLayout();
  const svg: SVGSVGElement = createCarSVG(car, { width: `${150}px`, height: `${60}px` });
  const finish: HTMLImageElement = createFinish(car);
  trackLayout.append(svg, finish);
  track.append(controlsContainer, trackLayout);

  return track;
};

const generateAllTracks: (value: CarsResponse) => HTMLDivElement = (value: CarsResponse): HTMLDivElement => {
  const cars: CarsResponse = value;
  const allTrackGeneration: HTMLDivElement = createTrackContainer();

  cars.items.forEach((item: Car): void => {
    allTrackGeneration.append(generateTrack(item));
  });

  return allTrackGeneration;
};

export default generateAllTracks;
