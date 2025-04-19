import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';
import Search from './Search';
import StandingsItem from './StandingsItem';
import '../css/customStyle.css'

const StandingsList = ({ users, onRosterSelect, season }) => {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState('false');

  useEffect(() => {
    if (!users.loading) setLoading(false);
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

  const pot = sortedRosters.length * 20;

  // const winnings = [
  //   ' — $' + (pot * 0.65).toFixed(2),
  //   ' — $' + (pot * 0.14).toFixed(2),
  //   ' — $' + (pot * 0.08).toFixed(2),
  //   ' — $' + (pot * 0.05).toFixed(2),
  //   ' — $' + (pot * 0.04).toFixed(2),
  //   ' — $' + (pot * 0.02).toFixed(2),
  //   ' — $' + (pot * 0.02).toFixed(2),
  // ];

  // const winningsDistro = sortedRosters.map((user, index) => {
  //   return (
  //     user.rank <= 7 ? winnings[user.rank - 1] : ''
  //   )
  // })

  const renderedList = sortedRosters.map((user, index) => {
    return (
      <StandingsItem
        user={user}
        onRosterSelect={onRosterSelect}
        key={index}
        index={index}
        poolSize={sortedRosters.length}
      />
    )
  })

  return (
    <div className='ui segments' >
      <div className='ui top blue centered attached header'>
        <div
          className='left aligned column'
          onClick={() => setVisible(!visible)}
          style={{ cursor: 'pointer', position: 'absolute' }}
        >
          <h3>
            {visible &&
              <Icon
                circular
                color='blue'
                name='chevron up'
              />
            }
            {!visible &&
              <Icon
                circular
                color='blue'
                name='chevron down'
              />
            }
          </h3>
        </div>
        <div className='middle aligned column'>
          <h2>
            {season} Standings
          </h2>
          <p>Pot: ${pot}</p>
          <Search
            users={users}
            placeholder={"Search Rosters"}
          />
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