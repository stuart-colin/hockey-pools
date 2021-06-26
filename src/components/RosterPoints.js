import React, { useState, useEffect } from 'react';
import PlayerPoints from './PlayerPoints';

const RosterPoints = ({ activeRoster, getRosterData }) => {
  // const [currentId, setCurrentId] = useState('');
  const [pointTotal, setPointTotal] = useState(0);
  const [playersRemaining, setPlayersRemaining] = useState(-1);

  const idList = [
    activeRoster.season.roster.left.playerId1,
    activeRoster.season.roster.left.playerId2,
    activeRoster.season.roster.left.playerId3,
    activeRoster.season.roster.center.playerId1,
    activeRoster.season.roster.center.playerId2,
    activeRoster.season.roster.center.playerId3,
    activeRoster.season.roster.right.playerId1,
    activeRoster.season.roster.right.playerId2,
    activeRoster.season.roster.right.playerId3,
    activeRoster.season.roster.defense.playerId1,
    activeRoster.season.roster.defense.playerId2,
    activeRoster.season.roster.defense.playerId3,
    activeRoster.season.roster.defense.playerId4,
    activeRoster.season.roster.goalie.playerId1,
    activeRoster.season.roster.goalie.playerId2,
    activeRoster.season.roster.utility.playerId1
  ];

  const getPlayerTotal = (points) => {
    if (!isNaN(points)) {
      setPointTotal(pointTotal + points);
    }
  };

  const getPlayersRemaining = (players) => {
    setPlayersRemaining(playersRemaining + players)
  }

  useEffect(() => {
    getRosterData(pointTotal, playersRemaining);
  }, [pointTotal])

  const ids = idList.map((id) => {
    return (
      <PlayerPoints
        id={id}
        getPlayerTotal={getPlayerTotal}
        getPlayersRemaining={getPlayersRemaining}
        key={id}
      />
    )
  })

  return (
    <div>
      <div className="left floated content">{playersRemaining}/16</div>
      <div className="right floated content">{pointTotal} Points</div>
      <div style={{ display: "none" }}>
        {ids}
      </div>
    </div>
  )
}

export default RosterPoints;