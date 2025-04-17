// this is currently unused

import { useState, useEffect } from "react";
import countPoints from "../utils/countPoints";
import eliminatedPlayers from "../utils/eliminatedPlayers";

const rosterEndpoint = `${process.env.REACT_APP_BASE_URL}/v1/rosters`;

const useRoster = (users) => {
  const [userList, setUserList] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    users.forEach((user) => {
      const getUserList = async () => {
        const res = await fetch(rosterEndpoint + "/" + user.id);
        const roster = await res.json();
        setUserList([{ ...roster }]);
      };
      setLoading(false);
      getUserList();
    });
  }, [users]);

  // console.log(rosters)
  // console.log(userList)

  useEffect(() => {
    userList.forEach((user) => {
      const points = countPoints(user);
      const playersRemaining = eliminatedPlayers(user);
      setRosters((rosters) => [...rosters, { user, points, playersRemaining }]);
      // setLoading(false);
    });
  }, [userList]);

  return {
    rosters: rosters,
    loading: loading,
  };
};

export default useRoster;
