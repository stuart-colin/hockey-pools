import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/teams';

const Teams = () => {
  const [teamList, setTeamList] = useState({teams: ['']});

  useEffect(() => {
    const getTeamList = async () => {
      const { data } = await axios.get(URL);
      setTeamList(data);
    }
    
    getTeamList();
  }, []);

  // if (teams.teams) {
    const renderedTeams = teamList.teams.map((team) => {
    return (
      <div>
        <li key={team.id}><a href={team.officialSiteUrl}>{team.name}</a></li>
      </div>
    );    
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