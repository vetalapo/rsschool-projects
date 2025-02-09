import { EngineResponse } from '../types/types';

export const stoppedAnimationStorage: Map<number, number> = new Map();
export const requestIDStorage: Map<number, number> = new Map();

const getElemPosition: (id: number) => { car: HTMLElement; finish: HTMLImageElement } = (
  id: number
): { car: HTMLElement; finish: HTMLImageElement } => {
  return {
    car: document.getElementById(`car-${id}`) as HTMLElement,
    finish: document.getElementById(`finish-${id}`) as HTMLImageElement,
  };
};

export const animateCar: (id: number, value: EngineResponse) => void = (id: number, value: EngineResponse): void => {
  const { car, finish } = getElemPosition(id);
  const startPoint: number = car.getBoundingClientRect().x + car.getBoundingClientRect().width / 2;
  const endPoint: number = finish.getBoundingClientRect().x + finish.getBoundingClientRect().width / 2 - 50;
  const distance: number = endPoint - startPoint;
  const animationTime: number = value.distance / value.velocity;
  let startTimeStamp: number;
  let previousTimeStamp: number;
  let done = false;

  const getStep: (timestamp: number) => void = (timestamp: number): void => {
    if (!startTimeStamp) {
      startTimeStamp = timestamp;
    }
    const elapsed: number = timestamp - startTimeStamp;
    if (previousTimeStamp !== timestamp) {
      const count: number = Math.min((distance / animationTime) * elapsed, distance);
      (car as HTMLElement).style.transform = `translateX(${count}px)`;
      if (count === distance) done = true;
    }
    if (elapsed < animationTime) {
      previousTimeStamp = timestamp;
      if (!done) {
        if (!Number.isFinite(animationTime)) {
          window.cancelAnimationFrame(requestIDStorage.get(id) as number);
          requestIDStorage.set(id, 0);
          return;
        }
        requestIDStorage.set(id, window.requestAnimationFrame(getStep));
      }
    }
  };

  requestIDStorage.set(id, window.requestAnimationFrame(getStep));
};

// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
