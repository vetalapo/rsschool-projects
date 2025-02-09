import { CarName, GetRandomCarNameFn } from '../types/types';
import carMake from '../components/car-makes';
import carModel from '../components/car-models';

const getRandomCarName: GetRandomCarNameFn = (): CarName => {
  const makesLength: number = carMake.length - 1;
  const modelsLength: number = carModel.length - 1;
  const randomizer: (arrLength: number) => number = (arrLength: number): number => Math.ceil(Math.random() * arrLength);
  const make: string = carMake[randomizer(makesLength)];
  const model: string = carModel[randomizer(modelsLength)];
  const randomCarName: CarName = `${make} ${model}`;

  return randomCarName;
};

export default getRandomCarName;
