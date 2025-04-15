import { useState } from 'react';

const submitRosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters/'

const useSubmitRoster = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (rosterData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(submitRosterEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rosterData),
      });
      console.log('Posting data:', rosterData); // Log the data being posted

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, postData }
}

export default useSubmitRoster;
