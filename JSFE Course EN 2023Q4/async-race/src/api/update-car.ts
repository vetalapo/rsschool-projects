import { Car, UpdateCarAPIFn, Body } from '../types/types';
import { GARAGE } from './variables';

const updateCarAPI: UpdateCarAPIFn = async (id: number, body: Body): Promise<Car> =>
  (
    await fetch(`${GARAGE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export default updateCarAPI;
