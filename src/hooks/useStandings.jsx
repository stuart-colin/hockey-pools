import { useState, useEffect } from "react";

// const standingsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/standings`;
const standingsEndpointNHL = 'https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api-web.nhle.com/v1/standings/now'

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
