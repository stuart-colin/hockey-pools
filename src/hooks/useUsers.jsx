import { useState, useEffect, useMemo } from "react";
import countPoints from "../utils/countPoints";
import eliminatedPlayers from "../utils/eliminatedPlayers";
import normalizePlayer from "../utils/normalizePlayer";
import { seasons } from "../constants/seasons";
import { POSITION_ARRAYS } from "../constants/positions";

const ROSTERS_API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/rosters`;

const useUsers = (season, eliminatedTeams, eliminatedLoading) => {
  const [rawUserList, setRawUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  useEffect(() => {
    setRawUserList([]); // Clear previous raw data on season change
    const getUserList = async () => {
      switch (season) {
        default:
          const res = await fetch(ROSTERS_API_ENDPOINT + "?limit=1000");
          const users = await res.json();
          // for (let i = 1; i <= users.totalResults; i++) {
          //   const res2 = await fetch(rosterEndpoint + '?limit=1&page=' + i)
          //   const users2 = await res2.json();
          //   setUserList(users2.results);
          // } catch (e) { ... setErrorUsers(e); }
          setRawUserList(users.results || []); // Set raw data, ensure it's an array
          setLoadingUsers(false);
          break;
        case "2023":
          setRawUserList(seasons.season2023.results);
          setLoadingUsers(false);
          break;
        case "2022":
          setRawUserList(seasons.season2022.results);
          setLoadingUsers(false);
          break;
      }
    };
    getUserList();
  }, [season]);

  // Use useMemo to process the raw data only when it or dependencies change
  const processedRosters = useMemo(() => {
    // Don't process until both users and eliminated teams are loaded
    if (loadingUsers || eliminatedLoading || !rawUserList) {
      return [];
    }

    // Map over raw data to calculate points and remaining players
    return rawUserList.map((roster) => {
      // Normalize all players in position arrays
      const normalized = {};
      for (const pos of POSITION_ARRAYS) {
        normalized[pos] = Array.isArray(roster[pos])
          ? roster[pos].map(p => normalizePlayer(p, eliminatedTeams)).filter(Boolean)
          : [];
      }
      // Normalize utility (single object, not array)
      normalized.utility = roster.utility
        ? normalizePlayer(roster.utility, eliminatedTeams)
        : null;

      const rosterWithNormalized = { ...roster, ...normalized };
      const points = countPoints(rosterWithNormalized);
      const playersRemaining = eliminatedPlayers(rosterWithNormalized, eliminatedTeams);
      return { ...rosterWithNormalized, points, playersRemaining };
    });
  }, [rawUserList, eliminatedTeams, loadingUsers, eliminatedLoading]); // Dependencies for the memo


  return {
    rosters: processedRosters,
    loading: loadingUsers || eliminatedLoading,
    error: errorUsers,
  };
};

export default useUsers;
