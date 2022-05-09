import React, { useState, useEffect } from 'react';
import RosterPoints from './RosterPoints';

const URL = "https://assets.nhle.com/mugs/nhl/default-skater.png";

const StandingsItem = ({ activeRoster, onRosterSelect, loading }) => {
  const [rosterData, setRosterData] = useState();

  const getRosterData = (points, players, roster) => {
    setRosterData([points, players, roster]);
  }

  console.log(rosterData)

  return (
    <div
      onClick={() => onRosterSelect([activeRoster, rosterData])}
      className="item">
      <img
        className="ui left floated avatar image"
        src={URL} alt="participant avatar"></img>
      <div className="item">
        <div className="header">{activeRoster.name}</div>
        <RosterPoints
          activeRoster={activeRoster}
          getRosterData={getRosterData}
        />
        {/* <div className="left floated content">10/16</div> */}
      </div>
    </div>
  )
}

export default StandingsItem;