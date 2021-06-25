import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/people/';
const placeholder = {
  stats: [{
    type: '',
    splits: [{
      season: '',
      stat: ''
    }]
  }]
}

const Stats = ({ playerId, playerName }) => {
  const [statList, setStatList] = useState(placeholder);

  useEffect(() => {
    const getStatList = async () => {
      const { data } = await axios.get(URL + playerId + '/stats?stats=statsSingleSeasonPlayoffs');
      setStatList(data);
    }
    
    getStatList();
  });

  const goals = statList.stats[0].splits[0].stat.goals;
  const assists = statList.stats[0].splits[0].stat.assists;
  const overtimeGoals = statList.stats[0].splits[0].stat.overTimeGoals;
  
  const renderedStats = statList.stats.map((stat) => {
    return (
      <div>
        <li key={'1'}>Goals: {goals}</li>
        <li key={'2'}>Assists: {assists}</li>
        <li key={'3'}>Overtime Goals: {overtimeGoals}</li>
        <li key={'4'}>Total Pool Points: {overtimeGoals + assists + goals}</li>
      </div>
    );    
  });

  return (
      <div className="ui card">
        <div className="content">
          <div className="header">{playerName}</div>
          <ul>{renderedStats}</ul>
        </div>
      </div>
  );
};

export default Stats;