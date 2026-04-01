import { POSITION_ARRAYS } from '../constants/positions';

function countPoints(roster) {
  if (!roster) return 0;

  let total = 0;

  for (const pos of POSITION_ARRAYS) {
    const players = roster[pos];
    if (!Array.isArray(players)) continue;
    for (const player of players) {
      total += player?.points || 0;
    }
  }

  if (roster.utility) {
    total += roster.utility.points || 0;
  }

  return total;
}

export default countPoints;