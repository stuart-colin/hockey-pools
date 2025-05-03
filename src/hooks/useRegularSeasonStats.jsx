import { useState, useEffect } from "react";

const skaterStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/playerStats`;
const goalieStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/goalieStats`;

const useRegularSeasonStats = (playoffTeams) => { // Accept playoffTeams array directly
  const [skaterStats, setSkaterStats] = useState([]);
  const [goalieStats, setGoalieStats] = useState([]);
  const [skaterLoading, setSkaterLoading] = useState(false);
  const [goalieLoading, setGoalieLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSkaterData = async () => {
      if (playoffTeams && playoffTeams.length > 0) {
        setSkaterLoading(true);
        const res = await fetch(skaterStatsEndpoint);
        const json = await res.json();
        const filteredSkaters = json.data.filter(player => {
          const teamAbbrevsArray = player.teamAbbrevs && player.teamAbbrevs.split(/[,]+/);
          const currentTeam = teamAbbrevsArray && teamAbbrevsArray.pop();
          return currentTeam && playoffTeams.includes(currentTeam);
        });
        filteredSkaters.sort((a, b) => b.points - a.points);
        setSkaterStats(filteredSkaters);
        setSkaterLoading(false);
      }
    };
    getSkaterData();
  }, [playoffTeams]);

  useEffect(() => {
    const getGoalieData = async () => {
      if (playoffTeams && playoffTeams.length > 0) {
        setGoalieLoading(true);
        const res = await fetch(goalieStatsEndpoint);
        const json = await res.json();
        const filteredGoalies = json.data.filter(player => {
          const teamAbbrevsArray = player.teamAbbrevs && player.teamAbbrevs.split(/[,]+/);
          const currentTeam = teamAbbrevsArray && teamAbbrevsArray.pop();
          return currentTeam && playoffTeams.includes(currentTeam);
        }).map(goalie => ({ ...goalie, positionCode: "G" }));
        filteredGoalies.sort((a, b) => b.wins - a.wins);
        setGoalieStats(filteredGoalies);
        setGoalieLoading(false);
      }
    };
    getGoalieData();
  }, [playoffTeams]);
  useEffect(() => {
    setLoading(skaterLoading || goalieLoading);
  }, [skaterLoading, goalieLoading]);

  return {
    skaterStats: skaterStats.reverse(),
    goalieStats: goalieStats.reverse(),
    loading: loading,
  };
};

export default useRegularSeasonStats;
