import { useState, useEffect } from 'react';

// const date = new Date().toLocaleDateString().split('/');
// const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores?startDate=' + date[2] + '-' + date[0] + '-' + date[1] - 1;
const scoreDetailsEndpointNHL = 'https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.linescore'
const useScores = () => {
  const [date, setDate] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getScoreData = async () => {
      const res = await fetch(scoreDetailsEndpointNHL);
      const json = await res.json();
      setDate(json.dates[0].date);
      setGames(json.dates[0].games);
    };
    getScoreData();
    const interval = setInterval(() => {
      getScoreData();
    }, 60000);
    return () => clearInterval(interval);
  }, [setDate, setGames]);

  // console.log(date)


  return {
    date: date,
    games: games,
  }
}

export default useScores;
