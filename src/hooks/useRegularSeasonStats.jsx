import { useState, useEffect } from 'react';

const skaterStatsEndpoint = 'https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api.nhle.com/stats/rest/en/skater/summary?limit=-1&sort=points&gameType=2&cayenneExp=seasonId=20242025';
const goalieStatsEndpoint = 'https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api.nhle.com/stats/rest/en/goalie/summary?limit=-1&sort=wins&gameType=2&cayenneExp=seasonId=20242025';

const useRegularSeasonStats = ({ playoffTeams }) => {
  const [skaterStats, setSkaterStats] = useState([]);
  const [goalieStats, setGoalieStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playoffTeams.length) {
      const getSkaterData = async () => {
        const res = await fetch(skaterStatsEndpoint);
        const json = await res.json();
        for (let i = 0; i < json.data.length; i++) {
          if (
            json.data[i].teamAbbrevs.split(/[,]+/).pop().includes(playoffTeams[1])
          ) {
            setSkaterStats(skater => [...skater,
            json.data[i]
            ]
            )
          }
        }
        setLoading(false);
      }
      getSkaterData();
    }
  }, [setSkaterStats, playoffTeams]);

  useEffect(() => {
    if (playoffTeams.length) {
      const getGoalieData = async () => {
        const res = await fetch(goalieStatsEndpoint);
        const json = await res.json();
        for (let i = 0; i < json.data.length; i++) {
          if (
            json.data[i].teamAbbrevs.split(/[,]+/).pop().includes(playoffTeams[1])
          ) {
            json.data[i].positionCode = 'G';
            setGoalieStats(goalie => [...goalie,
            json.data[i]
            ]
            )
          }
        }
        setLoading(false);
      }
      getGoalieData();
    }
  }, [setGoalieStats, playoffTeams]);

  return {
    skaterStats: skaterStats.reverse(),
    goalieStats: goalieStats.reverse(),
    loading: loading,
  }
}

export default useRegularSeasonStats;
