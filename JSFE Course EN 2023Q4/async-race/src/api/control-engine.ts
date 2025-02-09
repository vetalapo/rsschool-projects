import { ControlEngineAPIFn, EngineResponse, Status } from '../types/types';
import { ENGINE } from './variables';

const controlEngineAPI: ControlEngineAPIFn = async (id: number, status: Status): Promise<EngineResponse> =>
  (
    await fetch(`${ENGINE}?id=${id}&status=${status}`, {
      method: 'PATCH',
    })
  ).json();

export default controlEngineAPI;
