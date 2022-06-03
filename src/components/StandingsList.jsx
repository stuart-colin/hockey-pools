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

  const sortedRosters = [].concat(users.rosters)
    .sort((a, b) => a.points > b.points ? -1 : 1);

  const renderedList = sortedRosters.map((user, index) => {
    return (
      <StandingsItem
        index={index}
        user={user}
        onRosterSelect={onRosterSelect}
        key={index}
      />
    )
  })

  return (
    <div className='ui segments'>
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
        ${!visible ? 'collapsedStandingsStyle' : 'expandedStandingsStyle'}`
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