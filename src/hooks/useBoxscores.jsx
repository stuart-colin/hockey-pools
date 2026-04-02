import { useState, useEffect, useRef } from 'react';

const NHL_WEB_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/nhl/web`;
const ACTIVE_STATES = new Set(['LIVE', 'OFF', 'FINAL']);

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

/**
 * Fetches boxscore data for all active (LIVE/FINAL/OFF) games.
 * Re-fetches when the games array changes (every 60s poll from useScores).
 * Only fetches boxscores for games not already cached as FINAL.
 *
 * @param {Array} games - Games array from useScores
 * @param {object} options - { skip: boolean }
 * @returns {{ boxscores: Array }}
 */
const useBoxscores = (games, { skip = false } = {}) => {
  const [boxscores, setBoxscores] = useState([]);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (skip || !games || games.length === 0) {
      setBoxscores([]);
      return;
    }

    let isMounted = true;

    const fetchBoxscores = async () => {
      const activeGames = games.filter(g => ACTIVE_STATES.has(g.gameState));
      if (activeGames.length === 0) {
        if (isMounted) setBoxscores([]);
        return;
      }

      const results = [];

      // Fetch in parallel, but skip games already cached as FINAL
      const fetches = activeGames.map(async (game) => {
        const gameId = game.id;
        const cached = cacheRef.current.get(gameId);

        // If we have a cached FINAL boxscore, reuse it (game is done, won't change)
        if (cached && cached.gameState === 'FINAL') {
          return cached;
        }

        try {
          const url = `${NHL_WEB_API_ENDPOINT}/gamecenter/${gameId}/boxscore`;
          const res = await fetchWithTimeout(url);
          if (!res.ok) return null;
          const data = await res.json();
          // Cache the result
          cacheRef.current.set(gameId, data);
          return data;
        } catch (error) {
          console.error(`Failed to fetch boxscore for game ${gameId}`, error);
          return cached || null;
        }
      });

      const settled = await Promise.all(fetches);
      for (const result of settled) {
        if (result) results.push(result);
      }

      if (isMounted) {
        setBoxscores(results);
      }
    };

    fetchBoxscores();

    return () => {
      isMounted = false;
    };
  }, [games?.length, skip]);

  return { boxscores };
};

export default useBoxscores;
