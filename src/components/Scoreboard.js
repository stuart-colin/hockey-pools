import { useEffect } from 'react';
import useScores from '../hooks/useScores';

const Scoreboard = ({ }) => {
  const scores = useScores()

  return scores.date;
}

export default Scoreboard;