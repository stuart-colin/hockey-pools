import { useState, useEffect } from "react";

// const standingsEndpointNHL = 'https://statsapi.web.nhl.com/api/v1/standings/regularSeason'
const standingsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/standings`;

const useStandings = () => {
  const [playoffTeams, setPlayoffTeams] = useState([]);

  useEffect(() => {
    const getStandingsData = async () => {
      const res = await fetch(standingsEndpointNHL);
      const data = await res.json();
      const teams = [];
      if (data && data.standings && Array.isArray(data.standings)) {
        data.standings.forEach(team => {
          if (team.clinchIndicator && ['x', 'y', 'z', 'p'].includes(team.clinchIndicator.toLowerCase())) {
            if (team.teamAbbrev && team.teamAbbrev.default) {
              teams.push(team.teamAbbrev.default);
            }
          }
        }
        )
      }
      setPlayoffTeams(teams);
    };
    getStandingsData();
  }, []);

  return playoffTeams;
};

export default useStandings;
