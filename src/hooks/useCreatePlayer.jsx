import { useState } from "react";

const createPlayerEndpoint = "https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/players/cache";

const useCreatePlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (playerData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(createPlayerEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData), // Ensure playerData is passed here
      });

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

  return { loading, error, response, postData };
};

export default useCreatePlayer;