import { CreateWinnerAPIFn, Winner } from '../types/types';
import { WINNERS } from './variables';

const createWinnerAPI: CreateWinnerAPIFn = async (body: Winner): Promise<Winner> =>
  (
    await fetch(WINNERS, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export default createWinnerAPI;
