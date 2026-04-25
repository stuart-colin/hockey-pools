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

    // NHL playoff series are best-of-7; a team needs 4 wins to advance.
    // Prefer the explicit `losingTeamId` from the bracket; fall back to the
    // win counts in case that field hasn't been populated yet for a clinched
    // series.
    const WINS_TO_ADVANCE = 4;

    const addLoserName = (team) => {
      if (team && team.name && team.name.default) {
        eliminated.add(team.name.default);
      }
    };

    bracketData.series.forEach(s => {
      const top = s.topSeedTeam;
      const bottom = s.bottomSeedTeam;
      if (!top || !bottom) return;

      if (s.losingTeamId) {
        const loser = top.id === s.losingTeamId ? top : (bottom.id === s.losingTeamId ? bottom : null);
        addLoserName(loser);
        return;
      }

      const neededToWin = s.neededToWin || WINS_TO_ADVANCE;
      const topWins = s.topSeedWins || 0;
      const bottomWins = s.bottomSeedWins || 0;

      if (topWins >= neededToWin) {
        addLoserName(bottom);
      } else if (bottomWins >= neededToWin) {
        addLoserName(top);
      }
    });
    return Array.from(eliminated);
  }, [bracketData]);

  return { eliminatedTeams, loading, error };
};

export default useEliminatedTeams;