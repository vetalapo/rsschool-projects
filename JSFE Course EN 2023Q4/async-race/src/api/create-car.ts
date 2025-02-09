import { Car, CreateCarAPIFn, Body } from '../types/types';
import { GARAGE } from './variables';

const createCarAPI: CreateCarAPIFn = async (body: Body): Promise<Car> =>
  (
    await fetch(GARAGE, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export default createCarAPI;
