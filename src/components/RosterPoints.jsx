import React, { useState, useEffect } from 'react';
import PlayerPoints from './PlayerPoints';
import useRoster from '../hooks/useRoster';
import '../css/customStyle.css';

const RosterPoints = ({ activeRoster, getRosterData }) => {
  // const [currentId, setCurrentId] = useState('');
  const [pointTotal, setPointTotal] = useState(0);
  const [playersRemaining, setPlayersRemaining] = useState(-1);
  // const rosterList = [];
  const id = activeRoster.id;
  // const roster = useRoster(id);

  // if (!roster.loading) {
  //   rosterList.push(
  //     roster.roster.left[0],
  //     roster.roster.left[1],
  //     roster.roster.left[2],
  //     roster.roster.center[0],
  //     roster.roster.center[1],
  //     roster.roster.center[2],
  //     roster.roster.right[0],
  //     roster.roster.right[1],
  //     roster.roster.right[2],
  //     roster.roster.defense[0],
  //     roster.roster.defense[1],
  //     roster.roster.defense[2],
  //     roster.roster.defense[3],
  //     roster.roster.goalie[0],
  //     roster.roster.goalie[1],
  //     roster.roster.utility,
  //   )
  // }

  const roster = [
    activeRoster.left[0],
    activeRoster.left[1],
    activeRoster.left[2],
    activeRoster.center[0],
    activeRoster.center[1],
    activeRoster.center[2],
    activeRoster.right[0],
    activeRoster.right[1],
    activeRoster.right[2],
    activeRoster.defense[0],
    activeRoster.defense[1],
    activeRoster.defense[2],
    activeRoster.defense[3],
    activeRoster.goalie[0],
    activeRoster.goalie[1],
    activeRoster.utility,
  ];

  // console.log(roster)

  const getPlayerTotal = (points) => {
    if (!isNaN(points)) {
      setPointTotal(pointTotal + points);
    }
  };

  const getPlayersRemaining = (players) => {
    setPlayersRemaining(playersRemaining + players)
  }

  useEffect(() => {
    getRosterData(pointTotal, playersRemaining, roster, roster.loading);
  }, [pointTotal])

  const players = roster.map((playerId, index) => {
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
      <div className={`left floated content playersRemaining${playersRemaining}`}>{playersRemaining}/16</div>
      <div className='right floated content'>{pointTotal} Points</div>
      <div style={{ display: 'none' }}>
        {players}
      </div>
    </div>
  )
}

export default RosterPoints;