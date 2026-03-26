import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// const submitRosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters/'
const submitRosterEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/rosters/`;

const useSubmitRoster = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;

  const postData = async (rosterData) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError("User is not authenticated");
      setLoading(false);
      throw new Error("User is not authenticated");
    }

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_BASE_URL}/`,
          scope: "roster:create",
        },
      });

      // Decode token to inspect claims
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
        } catch (e) {
          // Token decode failed, continue anyway
        }
      }

      const res = await fetch(submitRosterEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rosterData),
      });

      if (!res.ok) {
        const errorMsg = `API Error: ${res.status}`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const result = await res.json();
      setResponse(result);
    } catch (e) {
      console.error("Error posting roster:", e.message);
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, postData };
};

export default useSubmitRoster;
