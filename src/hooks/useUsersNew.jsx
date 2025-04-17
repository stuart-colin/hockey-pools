// this is currently unused

import { useState, useEffect } from "react";
// import useSWR from 'swr';
import countPoints from "../utils/countPoints";
import eliminatedPlayers from "../utils/eliminatedPlayers";
import seasons from "../constants/seasons";

const userEndpoint = "https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/users";
const rosterEndpoint =
  "https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters";
const playerEndpoint =
  "https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/players";

// const userEndpoint = 'http://localhost:5000/v1/users';
// const rosterEndpoint = 'http://localhost:5000/v1/rosters';

const useUsersNew = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserList = async () => {
      const res = await fetch(userEndpoint + "?limit=1000");
      const users = await res.json();
      setUserList(users.results);
    };
    setLoading(false);
    getUserList();
  }, []);
  // console.log(userList)

  return {
    loading: loading,
    userList: userList,
  };
};

export default useUsersNew;
