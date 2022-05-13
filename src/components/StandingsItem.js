import React, { useState, useEffect } from 'react';
import RosterPoints from './RosterPoints';
import '../css/customStyle.css';

const URL = "https://assets.nhle.com/mugs/nhl/default-skater.png";

const StandingsItem = ({ activeRoster, onRosterSelect, index }) => {
  const [rosterData, setRosterData] = useState([]);

  const getRosterData = (points, players, roster) => {
    setRosterData([points, players, roster]);
  }

  const top3 = ['#ffd90077', '#c0c0c077', '#cd803279'];

  return (
    <div
      onClick={() => onRosterSelect([activeRoster, rosterData])}
      className='item'
      style={{ backgroundColor: index <= 2 ? top3[index] : '' }}
    >
      <img
        className="ui left floated avatar image"
        src={URL} alt="participant avatar"></img>
      <div className="item">
        <div className="header">{activeRoster.name}</div>
        <RosterPoints
          activeRoster={activeRoster}
          getRosterData={getRosterData}
          key={activeRoster.id}
        />
        {/* <div className="left floated content">10/16</div> */}
      </div>
    </div>
  )
}

export default StandingsItem;