import { useState, useEffect } from 'react';

const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores/latest';

const useScores = () => {
  const [date, setDate] = useState('');
  const [games, setGames] = useState('');

  useEffect(() => {
    const getScoreData = async () => {
      const res = await fetch(scoreDetailsEndpoint);
      const json = await res.json();
      setDate(json.date.pretty);
      setGames(json.games)
    };
    getScoreData();
    const interval = setInterval(() => {
      getScoreData();
    }, 60000);
    return () => clearInterval(interval);
  }, [setDate, setGames]);



  return {
    date: date,
    games: games,
  }
}

export default useScores;
