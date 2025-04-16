import { useState, useEffect } from 'react';

// const rostersEndpoint = 'https://statsapi.web.nhl.com/api/v1/teams/'
// const rostersEndpoint = 'https://cs-cors-anywhere-b93c6060f143.herokuapp.com/https://api-web.nhle.com/v1/roster/'
const rostersEndpoint = 'http://localhost:5000/v1/rosters/'
const useRosters = ({ playoffTeams }) => {
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playoffTeams.length) {
      const getRosterData = async () => {
        const res = await fetch(rostersEndpoint + playoffTeams[1] + '/current');
        const json = await res.json();
        setRosters(roster => [...roster,
        [
          playoffTeams[0],
          playoffTeams[1],
          json
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
