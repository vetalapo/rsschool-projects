import { Winner } from '../types/types';
import createWinner from './create-winner';
import getWinner from './get-winner';
import getWinnerStatus from './get-winner-status';
import updateWinner from './update-winner';

const saveWinnerAPI: ({ id, time }: { id: number; time: number }) => Promise<void> = async ({
  id,
  time,
}: {
  id: number;
  time: number;
}): Promise<void> => {
  const winnerStatus: number = await getWinnerStatus(id);

  if (winnerStatus === 404) {
    await createWinner({
      id,
      wins: 1,
      time,
    });
  } else {
    const winner: Winner = await getWinner(id);
    await updateWinner({ id, wins: winner.wins + 1, time: time < winner.time ? time : winner.time });
  }
};

export default saveWinnerAPI;
