import { useState, useEffect } from "react";

const scoreDetailsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/scores`;

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
    typeof json.currentDate === "string" && !Number.isNaN(new Date(json.currentDate).getTime())
      ? json.currentDate
      : "";
  const nextGames = Array.isArray(json && json.games) ? json.games : [];
  return { nextDate, nextGames };
};

const useScores = (dateOverride) => {
  const [date, setDate] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getScoreData = async () => {
      try {
        const url = dateOverride
          ? `${scoreDetailsEndpointNHL}/${dateOverride}`
          : scoreDetailsEndpointNHL;
        const res = await fetchWithTimeout(url);
        if (!res.ok) {
          throw new Error(`Score request failed (${res.status})`);
        }

        const json = await res.json();
        const { nextDate, nextGames } = normalizeScorePayload(json);

        if (isMounted) {
          setDate(nextDate);
          setGames(nextGames);
        }
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
  }, [dateOverride]);

  return {
    date: date,
    games: games,
  };
};

export default useScores;
