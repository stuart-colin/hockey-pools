import { useState, useEffect, useMemo } from "react";
import countPoints from "../utils/countPoints";
import useEliminatedTeams from './useEliminatedTeams';
import eliminatedPlayers from "../utils/eliminatedPlayers";
import seasons from "../constants/seasons";

// const rosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters';

const rosterEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/rosters`;

const useUsers = (season) => {
  const [rawUserList, setRawUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const { eliminatedTeams, loading: eliminatedLoading, error: eliminatedError } = useEliminatedTeams(season);

  useEffect(() => {
    setRawUserList([]); // Clear previous raw data on season change
    const getUserList = async () => {
      switch (season) {
        default:
          const res = await fetch(rosterEndpoint + "?limit=1000");
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
          setRawUserList(seasons.seasons.season2023.results);
          setLoadingUsers(false);
          break;
        case "2022":
          setRawUserList(seasons.seasons.season2022.results);
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
      const points = countPoints(roster);
      const playersRemaining = eliminatedPlayers(roster, eliminatedTeams);
      return { ...roster, points, playersRemaining }; // Return new object with calculated fields
    });
  }, [rawUserList, eliminatedTeams, loadingUsers, eliminatedLoading]); // Dependencies for the memo


  return {
    rosters: processedRosters, // Return the processed list
    loading: loadingUsers || eliminatedLoading, // Combine loading states
    error: errorUsers || eliminatedError, // Combine errors (simple approach)
  };
};

export default useUsers;
