import { useState, useEffect } from "react";

// const date = new Date().toLocaleDateString().split('/');
// const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores?startDate=' + date[2] + '-' + date[0] + '-' + date[1] - 1;
const scoreDetailsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/scores`;
// const scoreDetailsEndpointNHL = 'http://localhost:8080/https://api-web.nhle.com/v1/score/now'
// const scoreDetailsEndpointNHL = 'https://api-web.nhle.comcd/v1/score/now'

const useScores = () => {
  const [date, setDate] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getScoreData = async () => {
      const res = await fetch(scoreDetailsEndpointNHL);
      const json = await res.json();
      if (json.currentDate) {
        setDate(json.currentDate);
        setGames(json.games);
      }
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
  };
};

export default useScores;
