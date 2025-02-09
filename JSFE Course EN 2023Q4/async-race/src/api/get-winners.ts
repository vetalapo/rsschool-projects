import { WinnerAndCar, GetWinnersAPIFn, Winner, WinnerParam, WinnersResponse } from '../types/types';
import getCar from './get-car';
import getSortOrder from './get-sort-order';
import { WINNERS, WINNERS_LIMIT } from './variables';

const getWinnersAPI: GetWinnersAPIFn = async ({ pageNumber, sort, order }: WinnerParam): Promise<WinnersResponse> => {
  const response: Response = await fetch(
    `${WINNERS}?_page=${pageNumber}&_limit=${WINNERS_LIMIT}${getSortOrder(sort, order)}`
  );
  const items: Winner[] = await response.json();
  const count: string | null = response.headers.get('X-Total-Count');

  if (!count) {
    throw new Error('X-Total-Count is null');
  }

  return {
    items: await Promise.all(
      items.map(async (winner: Winner): Promise<WinnerAndCar> => ({ ...winner, car: await getCar(winner.id) }))
    ),
    count,
  };
};

export default getWinnersAPI;
