import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/teams';

const Teams = () => {
  const [teams, setTeams] = useState({teams: ['']});

  useEffect(() => {
    const getTeams = async () => {
      const { data } = await axios.get(URL);
      setTeams(data);
    }
    
    getTeams();
  }, []);

  // if (teams.teams) {
    const renderedTeams = teams.teams.map((team) => {
    return <li key={team.link}>{team.name}</li>
  });
  // }

  return (
      <div>
        <h1>Teams</h1>
        <ul>{renderedTeams}</ul>
      </div>
  );
};

export default Teams;