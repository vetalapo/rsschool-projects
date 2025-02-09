import createCarAPI from '../api/create-car';
import { Car } from '../types/types';
import generateCarBody from './generate-car-body';

const generate100Cars: () => Promise<Car[]> = async (): Promise<Car[]> => {
  const CarsStorage = [];
  for (let i = 0; i < 100; i += 1) {
    CarsStorage.push(createCarAPI(generateCarBody()));
  }
  return Promise.all(CarsStorage);
};

export default generate100Cars;
