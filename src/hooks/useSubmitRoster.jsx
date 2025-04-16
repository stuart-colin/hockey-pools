import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// const submitRosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters/'
const submitRosterEndpoint = 'http://localhost:5000/v1/rosters/'

const useSubmitRoster = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;

  const postData = async (rosterData) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        },

      });

      const res = await fetch(submitRosterEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rosterData),
      });
      console.log('Posting data:', rosterData); // Log the data being posted

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const result = await res.json();
      setResponse(result);
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, postData }
}

export default useSubmitRoster;
