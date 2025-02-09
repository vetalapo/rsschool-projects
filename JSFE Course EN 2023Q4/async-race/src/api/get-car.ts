import { Car, GetCarAPIFn } from '../types/types';
import { GARAGE } from './variables';

const getCarAPI: GetCarAPIFn = async (id: number): Promise<Car> => (await fetch(`${GARAGE}/${id}`)).json();

export default getCarAPI;
