import { useState, useEffect } from "react";

// const date = new Date().toLocaleDateString().split('/');
// const scoreDetailsEndpoint = 'https://nhl-score-api.herokuapp.com/api/scores?startDate=' + date[2] + '-' + date[0] + '-' + date[1] - 1;
const scoreDetailsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/scores`;
const fallbackScoreEndpointNHL = "https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api-web.nhle.com/v1/score/now";
// const scoreDetailsEndpointNHL = 'http://localhost:8080/https://api-web.nhle.com/v1/score/now'
// const scoreDetailsEndpointNHL = 'https://api-web.nhle.comcd/v1/score/now'

const fetchWithTimeout = async (url, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const normalizeScorePayload = (json) => {
  const nextDate =
    typeof json?.currentDate === "string" && !Number.isNaN(new Date(json.currentDate).getTime())
      ? json.currentDate
      : "";
  const nextGames = Array.isArray(json?.games) ? json.games : [];
  return { nextDate, nextGames };
};

const useScores = () => {
  const [date, setDate] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getScoreData = async () => {
      try {
        const endpoints = [scoreDetailsEndpointNHL, fallbackScoreEndpointNHL];
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            const res = await fetchWithTimeout(endpoint);
            if (!res.ok) {
              throw new Error(`Score request failed (${res.status})`);
            }

            const json = await res.json();
            const { nextDate, nextGames } = normalizeScorePayload(json);

            if (isMounted) {
              setDate(nextDate);
              setGames(nextGames);
            }
            return;
          } catch (error) {
            lastError = error;
          }
        }

        throw lastError || new Error("Unable to fetch scores");
      } catch (error) {
        // Keep UI stable and avoid unhandled promise rejections during polling.
        if (isMounted) {
          setDate("");
          setGames([]);
        }
        console.error("Unable to fetch NHL scores", error);
      }
    };

    getScoreData();
    const interval = setInterval(() => {
      getScoreData();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    date: date,
    games: games,
  };
};

export default useScores;
