import React from 'react';
import StatsSlim from './StatsSlim';
import '../css/customStyle.css';

const ParticipantRoster = ({ selectedRoster, rosterData }) => {

  const rosterPlayers = rosterData[0].map((player, index) => {
    return (
      <div key={index} style={{ padding: '3px' }} >
        <StatsSlim player={player} />
      </div>
    )
  })

  return (
    <div>
      {rosterPlayers}
    </div>
  )
}

export default ParticipantRoster;