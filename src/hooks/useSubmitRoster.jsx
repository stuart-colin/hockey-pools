import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ROSTERS_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/rosters/`;
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;

// Pulls the user's Auth0 user_metadata so the API can persist their
// real name/region/country (the /userinfo endpoint only returns OIDC
// standard claims, which for DB users falls back to the email).
const fetchAuth0Profile = async (getAccessTokenSilently, userSub) => {
  try {
    const mgmtToken = await getAccessTokenSilently({
      authorizationParams: {
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
        scope: 'read:current_user',
      },
    });
    const res = await fetch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(userSub)}`,
      { headers: { Authorization: `Bearer ${mgmtToken}` } }
    );
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn('Unable to fetch Auth0 user_metadata:', e.message);
    return null;
  }
};

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

      const auth0Profile = await fetchAuth0Profile(getAccessTokenSilently, user.sub);
      const md = auth0Profile?.user_metadata || {};
      const profile = {
        name: md.name || user?.name || '',
        region: md.region || '',
        country: md.country || '',
      };

      const payload = { ...rosterData, owner: ownerId, profile };

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
