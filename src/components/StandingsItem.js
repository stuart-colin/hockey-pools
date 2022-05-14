import React, { useState, useEffect } from 'react';
import RosterPoints from './RosterPoints';
import '../css/customStyle.css';

const URL = 'https://assets.nhle.com/mugs/nhl/default-skater.png';
const top6 = ['#66b36650', '#7cbe7c50', '#92c99250', '#a7d3a850', '#bddebe50', '#d3e9d350'];
const pot = 84 * 20;
const winnings = [
  '$' + (pot * 0.65).toFixed(2),
  '$' + (pot * 0.15).toFixed(2),
  '$' + (pot * 0.09).toFixed(2),
  '$' + (pot * 0.06).toFixed(2),
  '$' + (pot * 0.03).toFixed(2),
  '$' + (pot * 0.02).toFixed(2),
];

const StandingsItem = ({ activeRoster, onRosterSelect, index }) => {
  const [rosterData, setRosterData] = useState([]);

  const getRosterData = (points, players, roster) => {
    setRosterData([points, players, roster]);
  }

  return (
    <div
      onClick={() => onRosterSelect([activeRoster, rosterData])}
      className='item'
      style={{ backgroundColor: index <= 5 ? top6[index] : '' }}
    >
      <img
        className='ui left floated avatar image'
        src={URL} alt='participant avatar'></img>
      <div className='item'>
        <div className='header'>{activeRoster.name} — {index <= 5 ? winnings[index] : ''}</div>
        <RosterPoints
          activeRoster={activeRoster}
          getRosterData={getRosterData}
          key={activeRoster.id}
        />
        {/* <div className='left floated content'>10/16</div> */}
      </div>
    </div>
  )
}

export default StandingsItem;