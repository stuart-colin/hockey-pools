import React, { useState, useEffect } from 'react';
import StandingsItem from './StandingsItem';
import '../css/customStyle.css'

const StandingsList = ({ users, onRosterSelect }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState('false');

  useEffect(() => {
    if (!users.loading) {
      setLoading(false);
    }
  }, [users]);

  const loadedStyle = () => {
    if (!loading) {
      return { display: 'none' }
    }
  }

  function setRanks(roster) {
    let currentCount = -1, currentRank = 0, stack = 1;
    for (let i = 0; i < roster.length; i++) {
      const result = roster[i];
      if (currentCount !== result['points']) {
        currentRank += stack;
        stack = 1;
      } else {
        stack++;
      }
      result['rank'] = currentRank;
      currentCount = result['points'];
    }
  }

  const sortedRosters = [].concat(users.rosters)
    .sort((a, b) => a.points > b.points ? -1 : 1);

  setRanks(sortedRosters);

  const renderedList = sortedRosters.map((user, index) => {
    return (
      <StandingsItem
        user={user}
        onRosterSelect={onRosterSelect}
        key={index}
        poolSize={sortedRosters.length}
      />
    )
  })

  return (
    <div className='ui segments' >
      <div className='ui top blue centered attached header'>
        <div className='left aligned column' onClick={() => setVisible(!visible)} style={{ cursor: 'pointer', position: 'absolute' }}>
          <h3>
            {visible &&
              <i className='window minimize outline icon'></i>
            }
            {!visible &&
              <i className='window maximize outline icon'></i>
            }
          </h3>
        </div>
        <div className='middle aligned column'>
          <h2>
            Standings
          </h2>
        </div>
      </div>
      <div className={
        `ui bottom attached segment
        ${!visible ? 'collapsedStyle' : 'expandedStandingsStyle'}`
      }>
        <div className='ui active inverted dimmer' style={loadedStyle()}>
          <div className='ui text loader'>
            Loading Standings...
          </div>
        </div>
        <div className='ui middle aligned selection list' >
          {renderedList}
        </div>
      </div>
    </div>
  )
};

export default StandingsList;