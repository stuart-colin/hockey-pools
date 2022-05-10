import React, { useState, useEffect } from 'react';
import PlayerPoints from './PlayerPoints';
import useRoster from '../hooks/useRoster';

const RosterPoints = ({ activeRoster, getRosterData }) => {
  // const [currentId, setCurrentId] = useState('');
  const [pointTotal, setPointTotal] = useState(0);
  const [playersRemaining, setPlayersRemaining] = useState(-1);
  const rosterList = [];
  const id = activeRoster.id;
  const roster = useRoster(id);

  if (!roster.loading) {
    rosterList.push(
      roster.roster.left[0],
      roster.roster.left[1],
      roster.roster.left[2],
      roster.roster.center[0],
      roster.roster.center[1],
      roster.roster.center[2],
      roster.roster.right[0],
      roster.roster.right[1],
      roster.roster.right[2],
      roster.roster.defense[0],
      roster.roster.defense[1],
      roster.roster.defense[2],
      roster.roster.defense[3],
      roster.roster.goalie[0],
      roster.roster.goalie[1],
      roster.roster.utility,
    )
  }

  const getPlayerTotal = (points) => {
    if (!isNaN(points)) {
      setPointTotal(pointTotal + points);
    }
  };

  const getPlayersRemaining = (players) => {
    setPlayersRemaining(playersRemaining + players)
  }

  useEffect(() => {
    getRosterData(pointTotal, playersRemaining, rosterList, roster.loading);
  }, [pointTotal])

  const players = rosterList.map((playerId, index) => {
    return (
      <PlayerPoints
        playerId={playerId}
        getPlayerTotal={getPlayerTotal}
        getPlayersRemaining={getPlayersRemaining}
        key={index}
      />
    )
  })

  return (
    <div key={id}>
      <div className="left floated content">{playersRemaining}/16</div>
      <div className="right floated content">{pointTotal} Points</div>
      <div style={{ display: "none" }}>
        {players}
      </div>
    </div>
  )
}

export default RosterPoints;