import React from 'react';
import usePlayer from '../hooks/usePlayer';
import '../css/customStyle.css';

const StatsCard = ({ id }) => {
  const player = usePlayer(id)

  return (
    <div className="ui items">
      <div key={id} className={`item ${player.eliminated.includes(player.team) ? 'eliminated' : ''}`} alt={`${player.team} logo`}>

        <div className='logoBox'>
          <img className='teamLogo' src={player.logo} alt={`${player.team} Logo`} />
        </div>

        <div className="ui tiny circular image">
          <img src={player.photo} alt={`${player.name} Headshot`} />
        </div>
        <div className="content">
          <div className="header">{player.name}</div>
          <div className="meta">{player.position} || {player.team}</div>
          <div className="description">
            <b>{player.stats[0]}</b> {player.stats[1]} - <b>{player.stats[2]}</b> {player.stats[3]} - <b>{player.stats[4]}</b> {player.stats[5]} - {player.stats[6].toString()} Pool Points
          </div>


        </div>
      </div>
    </div>
  );
}

export default StatsCard;