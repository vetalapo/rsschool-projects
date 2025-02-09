import { CarsResponse, GetCarsAPIFn } from '../types/types';
import { GARAGE, GARAGE_LIMIT } from './variables';

const getCarsAPI: GetCarsAPIFn = async (pageNumber: number): Promise<CarsResponse> => {
  const response: Response = await fetch(`${GARAGE}?_page=${pageNumber}&_limit=${GARAGE_LIMIT}`);
  const count: string | null = response.headers.get('X-Total-Count');

  if (!count) {
    throw new Error('X-Total-Count is null');
  }

  return {
    items: await response.json(),
    count,
  };
};

export default getCarsAPI;
