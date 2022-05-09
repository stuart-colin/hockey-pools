import { useState, useEffect } from 'react';

const userEndpoint = 'https://nhl-pools-api-efhcx3qyra-uc.a.run.app/v1/users?limit=100';

const useUsers = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserList = async () => {
      const res = await fetch(userEndpoint);
      const users = await res.json();
      setUserList(users.results);
      setLoading(false);
    };
    getUserList();
  }, []);

  return {
    userList: userList,
    loading: loading,
  }
}

export default useUsers;

