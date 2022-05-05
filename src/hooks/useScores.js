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
    const interval = setInterval(() => {
      getScoreData();
      console.log('refresh')
    }, 60000);
    return () => clearInterval(interval);
  }, [setDate, setGames]);

  const gameList = [];
  for (const [day, game] of Object.entries(games)) {
    gameList.push(game.scores)
  }

  return {
    date: date,
    games: gameList,
  }
}

export default useScores;
