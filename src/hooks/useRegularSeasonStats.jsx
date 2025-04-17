import { useState, useEffect } from "react";

const skaterStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/playerStats`;
const goalieStatsEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/nhl/goalieStats`;

const useRegularSeasonStats = ({ playoffTeams }) => {
  const [skaterStats, setSkaterStats] = useState([]);
  const [goalieStats, setGoalieStats] = useState([]);
  const [skaterLoading, setSkaterLoading] = useState(false);
  const [goalieLoading, setGoalieLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSkaterData = async () => {
      if (playoffTeams.length) {
        setSkaterLoading(true); // Set skater loading to true
        const res = await fetch(skaterStatsEndpoint);
        const json = await res.json();
        for (let i = 0; i < json.data.length; i++) {
          if (
            json.data[i].teamAbbrevs
              .split(/[,]+/)
              .pop()
              .includes(playoffTeams[1])
          ) {
            setSkaterStats((skater) => [...skater, json.data[i]]);
          }
        }
        setSkaterLoading(false); // Set skater loading to false when done
      }
    };
    getSkaterData();
  }, [playoffTeams]);

  useEffect(() => {
    const getGoalieData = async () => {
      if (playoffTeams.length) {
        setGoalieLoading(true); // Set goalie loading to true
        const res = await fetch(goalieStatsEndpoint);
        const json = await res.json();
        for (let i = 0; i < json.data.length; i++) {
          if (
            json.data[i].teamAbbrevs
              .split(/[,]+/)
              .pop()
              .includes(playoffTeams[1])
          ) {
            json.data[i].positionCode = "G";
            setGoalieStats((goalie) => [...goalie, json.data[i]]);
          }
        }
        setGoalieLoading(false); // Set goalie loading to false when done
      }
    };
    getGoalieData();
  }, [playoffTeams]);

  // Update the overall loading state based on individual loading states
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
