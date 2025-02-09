import { UpdateWinnerAPIFn, Winner } from '../types/types';
import { WINNERS } from './variables';

const updateWinnerAPI: UpdateWinnerAPIFn = async (body: Winner): Promise<Winner> =>
  (
    await fetch(`${WINNERS}/${body.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

export default updateWinnerAPI;
