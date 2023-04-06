import { useState, useEffect } from 'react';
// import useSWR from 'swr';
import countPoints from '../utils/countPoints';
import eliminatedPlayers from '../utils/eliminatedPlayers';

// const userEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/users?limit=100';
const rosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters';
// const rosterEndpoint = 'http://localhost:5000/v1/rosters';

const useUsers = () => {
  const [userList, setUserList] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserList = async () => {
      const res = await fetch(rosterEndpoint + '?limit=1');
      // const res = await fetch(rosterEndpoint + '?limit=10');
      const users = await res.json();
      const userCount = users.totalResults
      for (let i = 0; i < userCount; i++) {
        const res2 = await fetch(rosterEndpoint + '?limit=1&page=' + i)
        const users2 = await res2.json();
        setUserList(users2.results);
      }
    };
    getUserList();
  }, []);

  useEffect(() => {
    userList.forEach((user) => {
      const points = countPoints(user);
      const playersRemaining = eliminatedPlayers(user);
      setRosters(rosters => [...rosters, { user, points, playersRemaining }])
      setLoading(false);
    })
  }, [userList])

  return {
    rosters: rosters,
    loading: loading,
  }
}

export default useUsers;

