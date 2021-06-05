import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/teams';

const Rosters = (props) => {
  const [rosterList, setRosterList] = useState({teams: ['']});

  useEffect(() => {
    const getRosterList = async () => {
      const { data } = await axios.get(URL + {props.team});
      setRosterList(data);
    }
    
    getRosterlist();
  }, []);

    const renderedRosters = rosterList.teams.map((team) => {
    return (
      <div>
        <li key={team.id}><a href={team.officialSiteUrl}>{team.name}</a></li>
      </div>
    );    
  });

  return (
      <div>
        <h1>Rosters</h1>
        <ul>{renderedRosters}</ul>
      </div>
  );
};

export default Rosters;