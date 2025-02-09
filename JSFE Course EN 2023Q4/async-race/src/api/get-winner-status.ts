import { GetWinnerStatusAPIFn } from '../types/types';
import { WINNERS } from './variables';

const getWinnerStatusAPI: GetWinnerStatusAPIFn = async (id: number): Promise<number> =>
  (await fetch(`${WINNERS}/${id}`)).status;

export default getWinnerStatusAPI;
