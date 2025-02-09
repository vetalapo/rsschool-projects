import { GetWinnerAPIFn, Winner } from '../types/types';
import { WINNERS } from './variables';

const getWinnerAPI: GetWinnerAPIFn = async (id: number): Promise<Winner> => (await fetch(`${WINNERS}/${id}`)).json();

export default getWinnerAPI;
