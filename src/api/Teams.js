import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/teams';

const Teams = () => {
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const getTeams = async () => {
      const { data } = await axios.get(URL);
      setTeams(data);
    }
    
    getTeams();
  }, []);

  // const renderedTeams = teams.map((teams) => {
  //   return <li key={teams.id}>{teams.name}</li>
  // });
    
  console.log(teams.teams);

  return (
    <div>Teams</div>
    // <ul>{renderedTeams}</ul>
  );
};

export default Teams;