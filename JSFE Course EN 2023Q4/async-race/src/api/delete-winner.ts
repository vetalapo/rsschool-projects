import { DeleteWinnerAPIFn } from '../types/types';
import { WINNERS } from './variables';

const deleteWinnerAPI: DeleteWinnerAPIFn = async (id: number): Promise<void> =>
  (await fetch(`${WINNERS}/${id}`, { method: 'DELETE' })).json();

export default deleteWinnerAPI;
