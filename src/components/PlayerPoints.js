import { useEffect } from 'react';
import usePlayer from '../hooks/usePlayer';

const PlayerPoints = ({ playerId, getPlayerTotal, getPlayersRemaining }) => {
  // const nhl_id = playerId.nhl_id;
  // const id = playerId.id;
  // const player = usePlayer(nhl_id, id)
  const player = usePlayer(playerId)

  useEffect(() => {
    getPlayerTotal(player.stats[6]);
    getPlayersRemaining(player.eliminated.includes(player.team) ? 0 : 1)
  }, [player.stats[6]])

  return player.stats[6];
}

export default PlayerPoints;