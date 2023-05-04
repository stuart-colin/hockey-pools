import { useState, useEffect } from 'react';

const rostersEndpoint = 'https://statsapi.web.nhl.com/api/v1/teams/'

const useRosters = ({ playoffTeams }) => {
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playoffTeams.length) {
      const getRosterData = async () => {
        const res = await fetch(rostersEndpoint + playoffTeams[1] + '/roster');
        const json = await res.json();
        setRosters(roster => [...roster,
        [
          playoffTeams[0],
          playoffTeams[1],
          json.roster
        ]
        ])
        setLoading(false);
      }
      getRosterData();
    }
  }, [setRosters, playoffTeams]);

  return {
    rosters: rosters,
    loading: loading,
  }
}

export default useRosters;
