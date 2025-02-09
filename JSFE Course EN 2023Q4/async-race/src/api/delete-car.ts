import { DeleteCarAPIFn } from '../types/types';
import { GARAGE } from './variables';

const deletetCarAPI: DeleteCarAPIFn = async (id: number): Promise<void> =>
  (await fetch(`${GARAGE}/${id}`, { method: 'DELETE' })).json();

export default deletetCarAPI;
