import React, { useState, useEffect } from 'react';
import Stats from '../api/Stats';
// import StatsCard from './StatsCard';
import '../data/TempRosters';

// const URL = 'http://localhost:5001/_api/rosters';

const ParticipantRoster = ({ onRosterChange, selectedRoster }) => {
  const [pointTotal, setPointTotal] = useState(0);
  const [currentRoster, setCurrentRoster] = useState('');

  // useEffect(() => {
  //   if (selectedRoster !== currentRoster) {
  //     setCurrentRoster(selectedRoster);
  //     setPointTotal(0);
  //   }
  // }, [selectedRoster])

  const getPlayerTotal = (points) => {
    if (!isNaN(points)) {
      setPointTotal(pointTotal + points)
    }
  };

  useEffect(() => {
    onRosterChange(pointTotal);
  }, [pointTotal]);

  const calc = () => {
    <Stats id={selectedRoster.season.roster.left.playerId1} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.left.playerId2} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.left.playerId3} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.center.playerId1} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.center.playerId2} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.center.playerId3} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.right.playerId1} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.right.playerId2} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.right.playerId3} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.defense.playerId1} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.defense.playerId2} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.defense.playerId3} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.defense.playerId4} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.goalie.playerId1} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.goalie.playerId2} getPlayerTotal={getPlayerTotal}/>
    <Stats id={selectedRoster.season.roster.utility.playerId1} getPlayerTotal={getPlayerTotal}/>
  }

  return (
    <div>
      {selectedRoster.name}{pointTotal}
    </div>
  )
}

export default ParticipantRoster;