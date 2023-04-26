import { useState, useEffect } from 'react';
// import useSWR from 'swr';
import countPoints from '../utils/countPoints';
import eliminatedPlayers from '../utils/eliminatedPlayers';
import seasons from '../constants/seasons';

const rosterEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/rosters';
// const rosterEndpoint = 'http://localhost:5000/v1/rosters';


const useUsers = (season) => {
  const [userList, setUserList] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRosters([]);
    const getUserList = async () => {
      setLoading(true);
      switch (season) {
        default:
          const res = await fetch(rosterEndpoint + '?limit=1000');
          const users = await res.json();
          // for (let i = 1; i <= users.totalResults; i++) {
          //   const res2 = await fetch(rosterEndpoint + '?limit=1&page=' + i)
          //   const users2 = await res2.json();
          //   setUserList(users2.results);
          // }
          setUserList(users.results);
          setLoading(false);
          break;
        case '2022':
          setUserList(seasons.seasons.season2022.results);
          setLoading(false);
          break;
        case '2021':
          setUserList((seasons.seasons.season2021.results))
          setLoading(false);
          break;
      }
      return () => { setUserList([]) };
    };
    getUserList();
  }, [season]);

  useEffect(() => {
    userList.forEach((user) => {
      const points = countPoints(user);
      const playersRemaining = eliminatedPlayers(user);
      setRosters(rosters => [...rosters, { user, points, playersRemaining }])
      // setLoading(false);
    })
  }, [userList])

  return {
    rosters: rosters,
    loading: loading,
  }
}

export default useUsers;

