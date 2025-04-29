import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useMyTeam = (rosterDataEndpoint) => {
  const { user, isAuthenticated } = useAuth0();
  const [roster, setRoster] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchRoster = async () => {
        try {
          const response = await fetch(`${rosterDataEndpoint}/${user.sub.split('|').pop()}`);
          if (!response.ok) {
            throw new Error('Failed to fetch roster');
          }
          const data = await response.json();
          setRoster(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRoster();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, rosterDataEndpoint]);

  return { roster, error, isLoading };
};

export default useMyTeam;