import { DriveAPIFn, DriveResponse } from '../types/types';
import { ENGINE } from './variables';

const driveAPI: DriveAPIFn = async (id: number): Promise<DriveResponse> => {
  const res: Response = await fetch(`${ENGINE}?id=${id}&status=drive`, {
    method: 'PATCH',
  }).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};

export default driveAPI;
