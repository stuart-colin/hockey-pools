import { useState, useEffect } from 'react';

const date = new Date().toLocaleDateString().split('/');
const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores?startDate=' + date[2] + '-' + date[0] + '-' + date[1];

const useScores = () => {
  const [date, setDate] = useState('');
  const [games, setGames] = useState('');

  useEffect(() => {
    const getScoreData = async () => {
      const res = await fetch(scoreDetailsEndpoint);
      const json = await res.json();
      setDate(json[0].date.pretty);
      setGames(json[0].games)
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
