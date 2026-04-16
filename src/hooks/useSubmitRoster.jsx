import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ROSTERS_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/rosters/`;

const useSubmitRoster = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const postData = async (rosterData) => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError("User is not authenticated");
      setLoading(false);
      throw new Error("User is not authenticated");
    }

    // Derive owner from the Auth0 identity so callers can't submit an
    // empty/stale owner (which was producing rosters with owner:null in the DB).
    const ownerId = user?.sub ? user.sub.split('|').pop() : null;
    if (!ownerId) {
      const msg = 'Missing owner id from Auth0 user';
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${process.env.REACT_APP_BASE_URL}/`,
          scope: "roster:create",
        },
      });

      const payload = { ...rosterData, owner: ownerId };

      const res = await fetch(ROSTERS_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
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
