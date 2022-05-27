import { useState, useEffect } from 'react';
import countPoints from '../utils/countPoints';
import eliminatedPlayers from '../utils/eliminatedPlayers';

// const userEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/users?limit=100';
const rosterEndpoint = 'http://localhost:5000/v1/rosters';

const useUsers = () => {
  const [userList, setUserList] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserList = async () => {
      const res = await fetch(rosterEndpoint + '?limit=100');
      const users = await res.json();
      setUserList(users.results);
    };
    getUserList();
  }, []);

  useEffect(() => {
    userList.forEach((user) => {
      const getRosterList = async () => {
        const res = await fetch(rosterEndpoint + '/' + user.owner.id);
        const roster = await res.json();
        const points = countPoints(roster);
        const playersRemaining = eliminatedPlayers(roster);
        setRosters(rosters => [...rosters, { roster, points, playersRemaining }])
      };
      getRosterList();
      setLoading(false);
    })
  }, [userList])

  return {
    userList: userList,
    rosters: rosters,
    loading: loading,
  }
}

export default useUsers;

