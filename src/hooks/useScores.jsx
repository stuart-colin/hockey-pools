import { useState, useEffect } from "react";

const NHL_WEB_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/nhl/web`;

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
  const currentDate =
    typeof json.currentDate === "string" && !Number.isNaN(new Date(json.currentDate).getTime())
      ? json.currentDate
      : "";
  const prevDate = typeof json.prevDate === "string" ? json.prevDate : "";
  const nextDate = typeof json.nextDate === "string" ? json.nextDate : "";
  const games = Array.isArray(json && json.games) ? json.games : [];
  return { currentDate, prevDate, nextDate, games };
};

const useScores = (dateOverride, { skip = false } = {}) => {
  const [date, setDate] = useState("");
  const [prevDate, setPrevDate] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (skip) return;
    let isMounted = true;

    const getScoreData = async () => {
      try {
        const url = dateOverride
          ? `${NHL_WEB_API_ENDPOINT}/score/${dateOverride}`
          : `${NHL_WEB_API_ENDPOINT}/score/now`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) {
          throw new Error(`Score request failed (${res.status})`);
        }

        const json = await res.json();
        const payload = normalizeScorePayload(json);

        if (isMounted) {
          setDate(payload.currentDate);
          setPrevDate(payload.prevDate);
          setNextDate(payload.nextDate);
          setGames(payload.games);
        }
      } catch (error) {
        // Keep UI stable and avoid unhandled promise rejections during polling.
        if (isMounted) {
          setDate("");
          setPrevDate("");
          setNextDate("");
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
  }, [dateOverride, skip]);

  return {
    date,
    prevDate,
    nextDate,
    games,
  };
};

export default useScores;
