import { useState, useEffect } from "react";

// const standingsEndpointNHL = 'https://statsapi.web.nhl.com/api/v1/standings/regularSeason'
const standingsEndpointNHL = `${process.env.REACT_APP_BASE_URL}/v1/nhl/standings`;

const useStandings = () => {
  const [playoffTeams, setPlayoffTeams] = useState([]);

  useEffect(() => {
    const getStandingsData = async () => {
      const res = await fetch(standingsEndpointNHL);
      const json = await res.json();
      for (let i = 0; i < json.standings.length; i++) {
        if (
          json.standings[i].clinchIndicator &&
          json.standings[i].clinchIndicator !== "e"
        ) {
          setPlayoffTeams([
            json.standings[i].teamName.default,
            json.standings[i].teamAbbrev.default,
          ]);
        }
      }
    };
    getStandingsData();
  }, [setPlayoffTeams]);

  return {
    playoffTeams: playoffTeams,
  };
};

export default useStandings;
