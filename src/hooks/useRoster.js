import { useState, useEffect } from 'react';

const rosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters/';

const useRoster = (id) => {
  const [roster, setRoster] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRoster = async () => {
      const res = await fetch(rosterEndpoint + id);
      const rosters = await res.json();
      setRoster(rosters);
      setLoading(false);
    };
    getRoster();
  }, [id]);

  return {
    roster: roster,
    loading: loading,
  }
}

export default useRoster;