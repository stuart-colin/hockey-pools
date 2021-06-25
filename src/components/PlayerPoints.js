import { useEffect } from 'react';
import usePlayer from '../hooks/usePlayer';

const PlayerPoints = ({ id, getPlayerTotal, getPlayersRemaining }) => {
  const player = usePlayer(id)

  useEffect(() => {
    getPlayerTotal(player.stats[6]);
    getPlayersRemaining(player.eliminated.includes(player.team) ? 0 : 1)
  }, [player.stats[6]])

  return player.stats[6];
}

export default PlayerPoints;