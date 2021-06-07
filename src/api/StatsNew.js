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

const Stats = ({ id }) => {
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

  const playerName = playerList.people[0].fullName;
  const playerPosition = playerList.people[0].primaryPosition.code;
  const playerStats = () => {
    if (playerPosition === 'G') {
      const W = statList.stats[0].splits[0].stat.wins;
      const WLabel = 'Wins';
      const S = statList.stats[0].splits[0].stat.shutouts;
      const SLabel = 'Shutouts';
      const OTL = statList.stats[0].splits[0].stat.ot;
      const OTLLabel = 'OT Losses';
      const totalPoolPoints = W*2 + S*2 + OTL;
      return [W, WLabel, S, SLabel, OTL, OTLLabel, totalPoolPoints.toString()];
    } else {
      const G = statList.stats[0].splits[0].stat.goals;
      const GLabel = 'Goals';
      const A = statList.stats[0].splits[0].stat.assists;
      const ALabel = 'Assists';
      const OTG = statList.stats[0].splits[0].stat.overTimeGoals;
      const OTGLabel = 'OT Goals';
      const totalPoolPoints = G + A + OTG;
      return [G, GLabel, A, ALabel, OTG, OTGLabel, totalPoolPoints.toString()];
    };
  };
  
  const renderedStats = statList.stats.map(() => {
    return (
      <div className="ui card">
        <div className="content">
          <div className="header">{playerPosition} : {playerName}</div>
          <div className="ui two column relaxed stackable grid">
            <div className="middle aligned column">
              <div className="ui mini horizontal statistics">
                <div className="statistic">
                  <div className="value">
                    {playerStats()[0]}
                  </div>
                  <div className="label">
                    {playerStats()[1]}
                  </div>
                </div>
                <div className="statistic">
                  <div className="value">
                    {playerStats()[2]}
                  </div>
                  <div className="label">
                    {playerStats()[3]}
                  </div>
                </div>
                <div className="statistic">
                  <div className="value">
                    {playerStats()[4]}
                  </div>
                  <div className="label">
                    {playerStats()[5]}
                  </div>
                </div>
              </div>
            </div>
          <div className="middle aligned column">
            <div className="ui small statistic">
              <div className="value">
                {playerStats()[6]}
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