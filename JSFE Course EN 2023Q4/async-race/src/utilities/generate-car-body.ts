import { GenerateCarBodyFn, Body, CarName, Color } from '../types/types';
import getRandomCarName from './get-random-car-name';
import getRandomColor from './get-random-color';

const generateCarBody: GenerateCarBodyFn = (name?: CarName, color?: Color): Body => {
  if (name && color) {
    return {
      name,
      color,
    };
  }
  return {
    name: getRandomCarName(),
    color: getRandomColor(),
  };
};

export default generateCarBody;
