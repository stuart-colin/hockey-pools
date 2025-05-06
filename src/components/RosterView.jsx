import React from 'react';
import StatsSlim from './StatsSlim';
import '../css/customStyle.css';

const RosterView = ({ user }) => {

  const roster = [
    ...(user.left || []),
    ...(user.center || []),
    ...(user.right || []),
    ...(user.defense || []),
    ...(user.goalie || []),
    ...(user.utility ? [user.utility] : []),
  ].filter(Boolean); // Ensure null/undefined players are filtered out

  const rosterPlayers = roster.map((player, index) => {
    return (
      <div key={index} style={{ padding: '3px' }}>
        <StatsSlim player={player} />
      </div>
    )
  })

  return (
    <div style={{ padding: '5px' }}>
      {rosterPlayers}
    </div>
  )
}

export default RosterView;