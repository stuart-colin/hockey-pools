import { useState, useEffect } from 'react';

const standingsEndpointNHL = 'https://statsapi.web.nhl.com/api/v1/standings/regularSeason'

const useStandings = () => {
  const [playoffTeams, setPlayoffTeams] = useState([]);

  useEffect(() => {
    const getStandingsData = async () => {
      const res = await fetch(standingsEndpointNHL);
      const json = await res.json();
      for (let i = 0; i < json.records.length; i++) {
        for (let j = 0; j < json.records[i].teamRecords.length; j++) {
          if (json.records[i].teamRecords[j].clinchIndicator) {
            setPlayoffTeams([
              json.records[i].teamRecords[j].team.name,
              json.records[i].teamRecords[j].team.id,
            ])
          }
        }
      }
    }
    getStandingsData();
  }, [setPlayoffTeams]);

  return {
    playoffTeams: playoffTeams,
  }
}

export default useStandings;
