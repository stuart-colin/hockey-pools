import { useState, useEffect, useMemo } from 'react';

/**
 * Fetches playoff bracket data for a given season and determines eliminated teams.
 * @param {string} season - The starting year of the season (e.g., "2024").
 * @returns {{eliminatedTeams: string[], loading: boolean, error: Error|null}} An object containing the list of eliminated team names, loading state, and error state.
 */
const useEliminatedTeams = (season) => {
  const [bracketData, setBracketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NHL_WEB_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/nhl/web`;

  useEffect(() => {

    const fetchBracketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${NHL_WEB_API_ENDPOINT}/playoff-bracket/${season}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setBracketData(data);
      } catch (e) {
        console.error("Failed to fetch playoff bracket data:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBracketData();
  }, [NHL_WEB_API_ENDPOINT, season]);

  const eliminatedTeams = useMemo(() => {
    const eliminated = new Set();
    if (!bracketData || !bracketData.series || !Array.isArray(bracketData.series)) {
      return [];
    }

    bracketData.series.forEach(s => {
      if (s.losingTeamId && s.topSeedTeam && s.bottomSeedTeam) {
        const loser = s.topSeedTeam.id === s.losingTeamId ? s.topSeedTeam : (s.bottomSeedTeam.id === s.losingTeamId ? s.bottomSeedTeam : null);
        if (loser && loser.name && loser.name.default) {
          eliminated.add(loser.name.default);
        }
      }
    }
    );
    return Array.from(eliminated);
  }, [bracketData]);

  return { eliminatedTeams, loading, error };
};

export default useEliminatedTeams;