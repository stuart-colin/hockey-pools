import { useState, useEffect } from 'react';

const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores/latest';

const useScores = () => {
  const [date, setDate] = useState('');
  const [games, setGames] = useState('');

  useEffect(() => {
    const getScoreData = async () => {
      const res1 = await fetch(scoreDetailsEndpoint);
      const json1 = await res1.json();
      setDate(json1.date.pretty);
      setGames(json1.games)
    };
    getScoreData();
  }, []);


  return {
    date: date,
    games: games,
  }
}

export default useScores;
