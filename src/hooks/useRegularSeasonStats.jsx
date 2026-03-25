import { useState, useEffect } from "react";

const skaterStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/playerStats`;
const goalieStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/goalieStats`;

const useRegularSeasonStats = (playoffTeams) => {
  const [skaterStats, setSkaterStats] = useState([]);
  const [goalieStats, setGoalieStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      if (playoffTeams && playoffTeams.length > 0) {
        try {
          setLoading(true);
          // Fetch both in parallel using Promise.all()
          const [skaterRes, goalieRes] = await Promise.all([
            fetch(skaterStatsEndpoint),
            fetch(goalieStatsEndpoint)
          ]);

          const skaterJson = await skaterRes.json();
          const goalieJson = await goalieRes.json();

          // Process skaters
          const filteredSkaters = skaterJson.data.filter(player => {
            const teamAbbrevsArray = player.teamAbbrevs && player.teamAbbrevs.split(/[,]+/);
            const currentTeam = teamAbbrevsArray && teamAbbrevsArray.pop();
            return currentTeam && playoffTeams.includes(currentTeam);
          });
          filteredSkaters.sort((a, b) => b.points - a.points);
          setSkaterStats(filteredSkaters.reverse());

          // Process goalies
          const filteredGoalies = goalieJson.data.filter(player => {
            const teamAbbrevsArray = player.teamAbbrevs && player.teamAbbrevs.split(/[,]+/);
            const currentTeam = teamAbbrevsArray && teamAbbrevsArray.pop();
            return currentTeam && playoffTeams.includes(currentTeam);
          }).map(goalie => ({ ...goalie, positionCode: "G" }));
          filteredGoalies.sort((a, b) => b.wins - a.wins);
          setGoalieStats(filteredGoalies.reverse());
        } catch (error) {
          console.error('Error fetching regular season stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    getStats();
  }, [playoffTeams]);

  return {
    skaterStats: skaterStats,
    goalieStats: goalieStats,
    loading: loading,
  };
};

export default useRegularSeasonStats;
