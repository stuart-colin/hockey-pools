import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = 'https://statsapi.web.nhl.com/api/v1/people/';
const statsPlaceholder = {
  stats: [{
    type: '',
    splits: [{
      season: '',
      stat: ''
    }]
  }]
}

const playerPlaceholder = {
  people: [{
    id: '',
    fullName: '',
    primaryPosition: ''
  }]
}

const Stats = ({ id, getPlayerTotal }) => {
  const [statList, setStatList] = useState(statsPlaceholder);
  const [playerList, setPlayerList] = useState(playerPlaceholder);

  useEffect(() => {
    const getPlayerName = async () => {
      const { data } = await axios.get(URL + id);

      setPlayerList(data);
    };

    getPlayerName();
  }, []);

  useEffect(() => {
    const getStatList = async () => {
      const { data } = await axios.get(URL + id + '/stats?stats=statsSingleSeasonPlayoffs');
      setStatList(data);
    }
    
    getStatList();
  }, []);

  useEffect(() => {
    getPlayerTotal(playerStats()[6]);
  }, [statList]);

  const playerName = playerList.people[0].fullName;
  const playerPosition = playerList.people[0].primaryPosition.abbreviation;
  const playerStats = () => {
    if (playerPosition === 'G') {
      const W = statList.stats[0].splits[0].stat.wins;
      const WLabel = 'Wins';
      const S = statList.stats[0].splits[0].stat.shutouts;
      const SLabel = 'Shutouts';
      const OTL = statList.stats[0].splits[0].stat.ot;
      const OTLLabel = 'OT Losses';
      const totalPoolPoints = W*2 + S*2 + OTL;
      return [W, WLabel, S, SLabel, OTL, OTLLabel, totalPoolPoints];
    } else {
      const G = statList.stats[0].splits[0].stat.goals;
      const GLabel = 'Goals';
      const A = statList.stats[0].splits[0].stat.assists;
      const ALabel = 'Assists';
      const OTG = statList.stats[0].splits[0].stat.overTimeGoals;
      const OTGLabel = 'OT Goals';
      const totalPoolPoints = G + A + OTG;
      return [G, GLabel, A, ALabel, OTG, OTGLabel, totalPoolPoints];
    };
  };
  
  const renderedStats = statList.stats.map(() => {
    return (
      <div key={id} className="ui card">
        <div className="content">
          <div className="right floated meta">{playerPosition}</div>
          <div className="header">{playerName}</div>
        </div>
        <div className="content">
        <div className="ui two column relaxed stackable grid">
          <div className="middle aligned column">
            <div className="ui divided items">
              <div className="item">
                <div className="middle aligned content">
                  <b>{playerStats()[0]}</b> {playerStats()[1]}
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <b>{playerStats()[2]}</b> {playerStats()[3]}
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <b></b>{playerStats()[4]} {playerStats()[5]}
                </div>
              </div>
            </div>
          </div>
          <div className="middle aligned column">
            <div className="ui small teal statistic">
              <div className="value">
                {playerStats()[6].toString()}
              </div>
              <div className="label">
                Pool Points
              </div>
            </div>  
          </div> 
        </div>
          
           
        
      </div>
    </div>
      
    );    
  });

  return (
    <div>{renderedStats}</div>
  );
};

export default Stats;