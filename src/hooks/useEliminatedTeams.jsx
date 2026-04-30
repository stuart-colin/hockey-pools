import { useState, useEffect, useMemo } from 'react';

// NHL playoff series are best-of-7; a team needs 4 wins to advance. The
// bracket endpoint doesn't include `neededToWin`, so we hardcode it.
const WINS_TO_ADVANCE = 4;

/**
 * Fetches playoff bracket data for a given season and derives:
 *  - `eliminatedTeams`        — flat list of full team names already out
 *  - `eliminationsByRound`    — { 1: ['Ottawa Senators', ...], 2: [...] }
 *  - `atRiskTeams`            — teams currently one loss from elimination
 *
 * @param {string} season Starting year of the season (e.g. "2024").
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

  const { eliminatedTeams, eliminationsByRound, completedRounds, atRiskTeams } = useMemo(() => {
    const empty = {
      eliminatedTeams: [],
      eliminationsByRound: {},
      completedRounds: [],
      atRiskTeams: [],
    };
    if (!bracketData || !bracketData.series || !Array.isArray(bracketData.series)) {
      return empty;
    }

    const eliminated = new Set();
    const byRound = {};
    const seriesCountByRound = {};
    const atRisk = [];

    const addLoserToRound = (round, team) => {
      if (!team || !team.name || !team.name.default) return;
      eliminated.add(team.name.default);
      if (!byRound[round]) byRound[round] = new Set();
      byRound[round].add(team.name.default);
    };

    bracketData.series.forEach((s) => {
      const top = s.topSeedTeam;
      const bottom = s.bottomSeedTeam;
      const round = s.playoffRound || 1;
      // Count every series we encounter for the round, even ones with TBD
      // placeholders, so we can tell when a round is fully resolved.
      seriesCountByRound[round] = (seriesCountByRound[round] || 0) + 1;
      if (!top || !bottom) return;
      const neededToWin = s.neededToWin || WINS_TO_ADVANCE;
      const topWins = s.topSeedWins || 0;
      const bottomWins = s.bottomSeedWins || 0;

      // Prefer the explicit `losingTeamId`; fall back to the win counts in
      // case that field hasn't been populated yet for a clinched series.
      let loser = null;
      if (s.losingTeamId) {
        loser = top.id === s.losingTeamId ? top : bottom.id === s.losingTeamId ? bottom : null;
      } else if (topWins >= neededToWin) {
        loser = bottom;
      } else if (bottomWins >= neededToWin) {
        loser = top;
      }

      if (loser) {
        addLoserToRound(round, loser);
        return;
      }

      // Series is in progress — flag any team facing elimination on its next
      // loss (opponent has neededToWin - 1 wins). Both teams qualify in a
      // tied series at neededToWin-1 apiece (e.g. 3-3 in a best-of-7), so
      // these are independent checks rather than mutually exclusive.
      const isAtRisk = (ownWins, otherWins) =>
        otherWins === neededToWin - 1 && ownWins < neededToWin;

      if (isAtRisk(topWins, bottomWins)) {
        atRisk.push({
          name: top.name?.default,
          commonName: top.commonName?.default,
          abbrev: top.abbrev,
          round,
          ownWins: topWins,
          otherWins: bottomWins,
          neededToWin,
        });
      }
      if (isAtRisk(bottomWins, topWins)) {
        atRisk.push({
          name: bottom.name?.default,
          commonName: bottom.commonName?.default,
          abbrev: bottom.abbrev,
          round,
          ownWins: bottomWins,
          otherWins: topWins,
          neededToWin,
        });
      }
    });

    const eliminationsByRound = Object.fromEntries(
      Object.entries(byRound).map(([round, set]) => [round, Array.from(set)])
    );

    // A round is "complete" when its elimination count matches the number of
    // series in that round (every series has produced a loser). Partial rounds
    // are excluded from history-style ticks so we don't display a moving
    // "end of Round R" marker mid-round.
    const completedRounds = Object.entries(seriesCountByRound)
      .filter(([round, count]) => (byRound[round]?.size || 0) >= count)
      .map(([round]) => Number(round));

    return {
      eliminatedTeams: Array.from(eliminated),
      eliminationsByRound,
      completedRounds,
      atRiskTeams: atRisk,
    };
  }, [bracketData]);

  return { eliminatedTeams, eliminationsByRound, completedRounds, atRiskTeams, loading, error };
};

export default useEliminatedTeams;